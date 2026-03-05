import { z } from 'zod';

// ==========================================
// 1. Universal Base Props for Remotion
// ==========================================
// Every extracted Remotion element needs positional data based 
// off what the Figma bounding box said.

const RectBaseSchema = z.object({
    width: z.number(),
    height: z.number(),
    left: z.number(),
    top: z.number(),
});

// A mapped CSS color string (`rgba(r,g,b,a)`) instead of raw Figma floats
const VisualElementSchema = RectBaseSchema.extend({
    fillFormatCss: z.string().optional(),
});

const TextElementSchema = RectBaseSchema.extend({
    text: z.string(),
    fontSize: z.number(),
    fontFamily: z.string().optional(),
    fontColorCss: z.string().optional(),
    fontWeight: z.number().optional(),
});

// ==========================================
// 2. Specific Scene Component Props
// ==========================================

// The parser must morph raw Figma JSON into this valid structure for a Remotion HookScene 
export const HookScenePropsSchema = z.object({
    sceneId: z.literal('HookScene'),
    durationInFrames: z.number().default(90),

    elements: z.object({
        titleText: TextElementSchema,
        subtitleText: TextElementSchema.optional(),
        backgroundShape: VisualElementSchema.optional(),
        ctaButton: VisualElementSchema.optional(),
    }),
});

export const ExplanationScenePropsSchema = z.object({
    sceneId: z.literal('ExplanationScene'),
    durationInFrames: z.number().default(120),

    elements: z.object({
        bodyText: TextElementSchema,
        backgroundShape: VisualElementSchema.optional(),
    })
});

// A union of all supported scene configurations our factory can produce.
export const FactorySceneUnionProps = z.union([
    HookScenePropsSchema,
    ExplanationScenePropsSchema
]);

export type AnyFactorySceneProps = z.infer<typeof FactorySceneUnionProps>;
