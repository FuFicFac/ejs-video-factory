import * as dotenv from 'dotenv';
import { FigmaRestAdapter } from '../parser/FigmaRestAdapter.js';
import { extractSpecificScene } from '../parser/figma-node-parser.js';

// Load variables from .env
dotenv.config();

console.log("Starting Live Figma Fetch Test...\n");

async function run() {
    try {
        const adapter = new FigmaRestAdapter();

        // Replace this with your actual Figma File ID (the string in the URL after figma.com/file/)
        const FILE_ID = 'YOUR_FIGMA_FILE_ID';
        // Replace this with the Node ID of your HookScene frame if known, or leave empty to fetch the whole file
        const NODE_IDS = [];

        if (FILE_ID === 'YOUR_FIGMA_FILE_ID') {
            console.error("⚠️ Please update FILE_ID in test_live_adapter.ts with an actual Figma file ID.");
            process.exit(1);
        }

        const liveData = await adapter.getFigmaData({
            fileId: FILE_ID,
            nodeIds: NODE_IDS,
            useCache: true // Will download it once, then use local .figma-cache/
        });

        console.log("✅ Successfully Fetched & Normalized Figma Data.");

        // Attempt to extract the HookScene from the live data
        console.log("\nAttempting to parse HookScene from live data...");
        const parsedData = extractSpecificScene(liveData, 'HookScene');

        console.log("✅ HookScene Parsed Successfully:");
        console.log(JSON.stringify(parsedData, null, 2));

    } catch (error) {
        console.error("❌ Live Test Failed:", error);
    }
}

run();
