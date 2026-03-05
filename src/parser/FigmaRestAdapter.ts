import * as fs from 'fs';
import * as path from 'path';
import { FigmaApiError } from './figma-schema.js';

const CACHE_DIR = path.join(process.cwd(), '.figma-cache');

export interface FigmaAdapterOptions {
    fileId: string;
    nodeIds?: string[]; // E.g., ['1:2'] for specific frames
    useCache?: boolean;
}

export class FigmaRestAdapter {
    private token: string;

    constructor() {
        const token = process.env.FIGMA_PERSONAL_ACCESS_TOKEN;
        if (!token) {
            throw new Error("Missing FIGMA_PERSONAL_ACCESS_TOKEN in environment variables.");
        }
        this.token = token;

        if (!fs.existsSync(CACHE_DIR)) {
            fs.mkdirSync(CACHE_DIR, { recursive: true });
        }
    }

    public async getFigmaData(options: FigmaAdapterOptions): Promise<unknown> {
        const { fileId, nodeIds, useCache = true } = options;

        // Construct a safe Cache Key
        const nodeSuffix = nodeIds && nodeIds.length > 0 ? `_${nodeIds.join('-').replace(/:/g, '-')}` : '';
        const cacheFileName = `${fileId}${nodeSuffix}.json`;
        const cachePath = path.join(CACHE_DIR, cacheFileName);

        // 1. Check Local Cache
        if (useCache && fs.existsSync(cachePath)) {
            console.log(`[FigmaRestAdapter] Loading from local cache: ${cacheFileName}`);
            return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        }

        // 2. Build Figma API URL
        let url = `https://api.figma.com/v1/files/${fileId}`;
        if (nodeIds && nodeIds.length > 0) {
            url = `https://api.figma.com/v1/files/${fileId}/nodes?ids=${nodeIds.join(',')}`;
        }

        console.log(`[FigmaRestAdapter] Fetching live data from Figma API: ${url}`);

        // 3. Fetch from API
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Figma-Token': this.token
            }
        });

        if (!response.ok) {
            let errorMessage = `Figma API HTTP Error ${response.status}: ${response.statusText}`;
            try {
                const errorBody = await response.json();
                if (errorBody.err) {
                    errorMessage += ` - ${errorBody.err}`;
                }
            } catch (e) {
                // Body isn't JSON
            }
            throw new FigmaApiError(errorMessage, response.status);
        }

        const data = await response.json();

        // 4. Normalize API differences
        // When using the "?ids=" query parameter, Figma wraps the output in a "nodes" dictionary.
        // Our InputAdapter normalizes this so our downstream parser receives a consistent document tree.
        let normalizedData = data;

        if (nodeIds && nodeIds.length > 0) {
            const firstNodeId = nodeIds[0]; // We assume the first ID is the root scene requested
            const nodeData = data.nodes[firstNodeId];

            if (!nodeData) {
                throw new FigmaApiError(`Node ${firstNodeId} not found in Figma file`, 404);
            }

            normalizedData = {
                name: data.name,
                lastModified: data.lastModified,
                version: data.version,
                document: nodeData.document
            };
        }

        // 5. Save to Cache to protect Rate Limits
        fs.writeFileSync(cachePath, JSON.stringify(normalizedData, null, 2));

        return normalizedData;
    }
}
