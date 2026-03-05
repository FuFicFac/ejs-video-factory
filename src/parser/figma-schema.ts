import { z } from 'zod';

// Figma's API can fail for reasons unrelated to our parsing logic.
// We distinctively wrap these to avoid confusing a 404 with "bad schema".
export class FigmaApiError extends Error {
    public status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'FigmaApiError';
        this.status = status;
    }
}

// Raised when the Figma JSON structure (either from API or plugin) 
// is fundamentally missing required nodes (e.g. missing absoluteBoundingBox).
export class InvalidSourceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidSourceError';
    }
}

// ==========================================
// 1. Core Structural Data (Bounding Boxes)
// ==========================================
// The consulting bot correctly noted these are x, y, width, height natively in REST API v1
const AbsoluteBoundingBoxSchema = z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
}).optional(); // Some empty frames or groups might temporarily lack this

// ==========================================
// 2. Styling (Fills vs Text Styles)
// ==========================================
// The consulting bot correctly pointed out style and fills are distinct top-level properties

const ColorSchema = z.object({
    r: z.number(),
    g: z.number(),
    b: z.number(),
    a: z.number(),
});

const FillSchema = z.object({
    type: z.string(), // e.g. 'SOLID', 'GRADIENT_LINEAR'
    color: ColorSchema.optional(),
    opacity: z.number().optional().default(1),
});

const TextStyleSchema = z.object({
    fontFamily: z.string().optional(),
    fontPostScriptName: z.string().optional(),
    fontSize: z.number().optional(),
    fontWeight: z.number().optional(),
    letterSpacing: z.number().optional(),
    lineHeightPx: z.number().optional(),
    textAlignHorizontal: z.string().optional(),
    textAlignVertical: z.string().optional(),
});

// ==========================================
// 3. The Node Model (Recursive)
// ==========================================
// We define a base node, and then recursively allow children

const BaseNodeSchema = z.object({
    id: z.string(),
    name: z.string(), // The semantic layer name we parse against (e.g. "title_text")
    type: z.string(), // 'FRAME', 'TEXT', 'RECTANGLE', 'INSTANCE', etc
    visible: z.boolean().optional().default(true),

    // Geometrics
    absoluteBoundingBox: AbsoluteBoundingBoxSchema,

    // Styling
    fills: z.array(FillSchema).optional(),
});

// We must lazy-evaluate the recursive type for `children` array
export type FigmaNode = z.infer<typeof BaseNodeSchema> & {
    children?: FigmaNode[];
    characters?: string; // Only present on TEXT modes
    style?: z.infer<typeof TextStyleSchema>; // Only present on TEXT modes
};

export const FigmaNodeSchema: z.ZodType<FigmaNode> = BaseNodeSchema.extend({
    children: z.lazy(() => z.array(FigmaNodeSchema)).optional(),
    characters: z.string().optional(),
    style: TextStyleSchema.optional()
});

// ==========================================
// 4. The API File Response Root
// ==========================================
export const FigmaFileResponseSchema = z.object({
    document: FigmaNodeSchema, // The root canvas node
    name: z.string(),
    lastModified: z.string(),
    version: z.string(),
});
