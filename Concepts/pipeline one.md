SYSTEM OVERVIEW: FIGMA → REMOTION → AI VIDEO FACTORY WORKFLOW

Goal:
Create a production pipeline where visual scenes are designed in Figma, interpreted by an AI system, and rendered into animated video using Remotion. The system separates responsibilities into three layers: visual layout (Figma), logic and animation (Remotion + React), and orchestration (AI automation).

This allows rapid generation of videos from scripts while maintaining strong visual design.

----------------------------------------
CORE CONCEPT
----------------------------------------

Figma is used as the VISUAL SCENE EDITOR.
Remotion is used as the PROGRAMMATIC ANIMATION ENGINE.
AI is used as the PIPELINE ORCHESTRATOR.

The flow becomes:

Prompt
↓
Script generation
↓
Scene breakdown
↓
Figma layout generation or template selection
↓
Remotion component mapping
↓
Programmatic animation
↓
Rendered video output

----------------------------------------
STEP 1 — SCRIPT GENERATION
----------------------------------------

The pipeline begins with a script or outline.

Example structure:

Hook
Key Idea
Explanation
Example
Call To Action

Example script JSON:

{
  "title": "Why AI Matters",
  "scenes": [
    {
      "type": "hook",
      "text": "AI is changing everything faster than most people realize."
    },
    {
      "type": "headline",
      "text": "The Real Power of AI"
    },
    {
      "type": "explanation",
      "text": "Artificial intelligence isn't replacing creativity. It's amplifying it."
    },
    {
      "type": "example",
      "text": "One person can now build tools that previously required entire teams."
    },
    {
      "type": "cta",
      "text": "Welcome to the studio, and I'll see you in the next video."
    }
  ]
}

----------------------------------------
STEP 2 — SCENE DESIGN IN FIGMA
----------------------------------------

Each scene type has a matching Figma frame template.

Example Figma frames:

Frame: HookScene
Frame: HeadlineScene
Frame: ExplanationScene
Frame: ExampleScene
Frame: CTAScene

Inside each frame, layers are named semantically:

title_text
subtitle_text
background_shape
icon_element
cta_button

These names act as identifiers that the AI pipeline can read.

The goal is to make the Figma document structured so it can be interpreted programmatically.

Example:

Frame: HookScene
Layers:
  title_text
  background_gradient
  accent_shape

----------------------------------------
STEP 3 — FIGMA EXPORT
----------------------------------------

Figma data can be accessed via:

Figma API
Figma plugin export
SVG export
JSON design export

Typical approach:

Export layout structure from Figma:

{
  "frame": "HookScene",
  "elements": [
    {
      "type": "text",
      "name": "title_text",
      "x": 120,
      "y": 240,
      "fontSize": 72
    },
    {
      "type": "shape",
      "name": "accent_shape",
      "x": 50,
      "y": 100
    }
  ]
}

This becomes input for Remotion components.

----------------------------------------
STEP 4 — REMOTION COMPONENT MAPPING
----------------------------------------

Each Figma scene type maps to a React component.

Example mapping:

HookScene → HookScene.tsx
HeadlineScene → HeadlineScene.tsx
ExplanationScene → ExplanationScene.tsx
ExampleScene → ExampleScene.tsx
CTAScene → CTAScene.tsx

Example Remotion component:

import {interpolate, spring, useCurrentFrame} from "remotion";

export const HookScene = ({title}) => {
  const frame = useCurrentFrame();

  const opacity = spring({
    frame,
    from: 0,
    to: 1,
    fps: 30
  });

  const translateY = interpolate(frame,[0,30],[80,0]);

  return (
    <div style={{
      opacity,
      transform: `translateY(${translateY}px)`
    }}>
      {title}
    </div>
  );
};

----------------------------------------
STEP 5 — SCENE COMPOSITION
----------------------------------------

Remotion assembles scenes in sequence.

Example composition:

<Composition
  id="AIExplainer"
  component={MainVideo}
  durationInFrames={450}
  fps={30}
  width={1920}
  height={1080}
/>

MainVideo:

const scenes = [
  {type:"hook", duration:90},
  {type:"headline", duration:60},
  {type:"explanation", duration:120},
  {type:"example", duration:120},
  {type:"cta", duration:60}
];

The script drives which component loads.

----------------------------------------
STEP 6 — AI PIPELINE ORCHESTRATION
----------------------------------------

AI agents can automate the process:

1 Generate script
2 Break script into scenes
3 Choose Figma templates
4 Inject text into templates
5 Export layout JSON
6 Generate Remotion component data
7 Render video

Example orchestration pseudocode:

script = generate_script(prompt)

scenes = split_into_scenes(script)

figma_templates = match_templates(scenes)

layout_data = export_figma_layout(figma_templates)

remotion_data = transform_layout(layout_data)

render_video(remotion_data)

----------------------------------------
STEP 7 — AUTOMATED VIDEO FACTORY
----------------------------------------

Full pipeline:

Prompt
↓
LLM writes script
↓
Scene parser
↓
Figma template system
↓
Design export
↓
Remotion animation engine
↓
Rendered MP4

This allows scalable content generation.

Use cases:

YouTube shorts
Educational videos
Marketing explainers
Product demos
News explainers
AI generated story content

----------------------------------------
KEY DESIGN PRINCIPLES
----------------------------------------

1 Use semantic layer names in Figma
2 Maintain scene templates
3 Separate design from animation
4 Use AI to orchestrate the workflow
5 Let Remotion control motion logic
6 Treat Figma as a visual IDE for video scenes

----------------------------------------
FINAL ARCHITECTURE

Design Layer
Figma scene templates

Logic Layer
Remotion React animation components

Automation Layer
AI orchestration and content generation

Output Layer
Programmatic video rendering

----------------------------------------
END SYSTEM
