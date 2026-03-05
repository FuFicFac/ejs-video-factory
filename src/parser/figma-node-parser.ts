import { FigmaNode, FigmaFileResponseSchema } from './figma-schema.js';
import { FactorySceneUnionProps, AnyFactorySceneProps } from './remotion-schema.js';

/**
 * Searches the whole Figma document tree to find the `FrameName` node specifically.
 * Once found, it guarantees the frame exists before attempting sub-layer extraction.
 */
function findFrameByName(node: FigmaNode, frameName: string): FigmaNode | undefined {
    if (node.name === frameName && (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE')) {
        return node;
    }

    if (node.children) {
        for (const child of node.children) {
            const found = findFrameByName(child, frameName);
            if (found) return found;
        }
    }

    return undefined;
}

/**
 * Searches the `FrameNode` specifically for a named layer (e.g. `title_text`).
 * Enforces strict 1:1 collision rules. If multiples are found, it errors.
 */
function findLayerInFrame(frameNode: FigmaNode, layerName: string, allowCollision: boolean = false): FigmaNode | undefined {
    let foundNodes: FigmaNode[] = [];

    function traverse(node: FigmaNode) {
        if (node.name === layerName) {
            foundNodes.push(node);
        }
        if (node.children) {
            for (const child of node.children) traverse(child);
        }
    }

    // Kick off traversal skipping the frame root itself
    if (frameNode.children) {
        for (const child of frameNode.children) traverse(child);
    }

    if (foundNodes.length === 0) {
        return undefined;
    }

    if (foundNodes.length > 1 && !allowCollision) {
        throw new Error(`[Collision Error] Found ${foundNodes.length} nodes named "${layerName}" in Frame "${frameNode.name}". Use deterministic names or enable collision override.`);
    }

    // Return the first found, or highest z-index if override is true
    return foundNodes[foundNodes.length - 1]; // Figma arrays are often bottom-to-top z-index
}

/**
 * Validates a schema exists inside the API response.
 * Then maps the data manually down to Remotion props.
 */
export function extractSpecificScene(
    apiResultJson: unknown,
    sceneId: 'HookScene' | 'ExplanationScene',
    options?: { allowCollision?: boolean }
): AnyFactorySceneProps {

    // 1. Zod Parse the entire massive API JSON first. 
    // It throws the `InvalidSourceError` immediately if malformed.
    const figmaData = FigmaFileResponseSchema.parse(apiResultJson);

    // 2. Find the root Frame (e.g., 'HookScene')
    const rootFrame = findFrameByName(figmaData.document, sceneId);

    if (!rootFrame) {
        throw new Error(`[Missing Frame] The requested scene frame "${sceneId}" was nowhere to be found in the Figma File.`);
    }

    // 3. Mapping based on the Scene
    if (sceneId === 'HookScene') {
        const titleTextNode = findLayerInFrame(rootFrame, 'title_text', options?.allowCollision);

        if (!titleTextNode || titleTextNode.type !== 'TEXT' || !titleTextNode.characters) {
            throw new Error(`[Strict Parse Error] "#HookScene/title_text" is a required node for this scene template, and must be of type TEXT.`);
        }

        if (!titleTextNode.absoluteBoundingBox) {
            throw new Error(`[Strict Parse Error] Bounding box is missing from "#HookScene/title_text"`);
        }

        // Example logic mapping a color
        const rgba = titleTextNode.fills?.[0]?.color
            ? `rgba(${titleTextNode.fills[0].color.r * 255}, ${titleTextNode.fills[0].color.g * 255}, ${titleTextNode.fills[0].color.b * 255}, ${titleTextNode.fills[0].color.a})`
            : 'rgba(0,0,0,1)';

        return FactorySceneUnionProps.parse({
            sceneId: 'HookScene',
            durationInFrames: 90,
            elements: {
                titleText: {
                    text: titleTextNode.characters,
                    left: titleTextNode.absoluteBoundingBox.x,
                    top: titleTextNode.absoluteBoundingBox.y,
                    width: titleTextNode.absoluteBoundingBox.width,
                    height: titleTextNode.absoluteBoundingBox.height,
                    fontSize: titleTextNode.style?.fontSize || 42,
                    fontFamily: titleTextNode.style?.fontFamily || 'Inter',
                    fontWeight: titleTextNode.style?.fontWeight || 400,
                    fontColorCss: rgba
                }
            }
        });

    } else {
        throw new Error("ExplanationScene mapping not implemented yet.");
    }
}
