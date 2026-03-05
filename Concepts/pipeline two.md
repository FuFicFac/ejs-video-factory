:AI VIDEO FACTORY ARCHITECTURE
Figma + Remotion + AI Orchestration + Timeline Generation

====================================================
SYSTEM PURPOSE
====================================================

Create a fully automated system that converts an idea or prompt into a finished video.

The system separates responsibilities into layers:

1. AI Layer — generates scripts, scene structures, and animation timelines
2. Design Layer — Figma templates define visual layout and structure
3. Logic Layer — Remotion (React) controls animation and video composition
4. Render Layer — Remotion renders the final video output
5. Automation Layer — pipelines orchestrate the entire process

This architecture enables rapid production of videos such as:

• YouTube explainers
• YouTube shorts
• marketing videos
• AI news videos
• story animations
• product demos
• social media clips

====================================================
HIGH LEVEL PIPELINE
====================================================

Prompt
↓
AI generates script
↓
AI converts script into scenes
↓
AI chooses visual templates
↓
Figma templates define layout
↓
Figma design exported as structured data
↓
AI converts design data into Remotion components
↓
AI generates animation timeline
↓
Remotion renders video
↓
MP4 output

====================================================
STEP 1 — SCRIPT GENERATION
====================================================

The pipeline begins with a prompt.

Example prompt:

"Explain why AI matters to creators."

AI generates a structured script.

Example:

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

====================================================
STEP 2 — SCENE BREAKDOWN
====================================================

The script is converted into scene objects.

Example scene list:

Scene 1 — Hook
Scene 2 — Headline
Scene 3 — Explanation
Scene 4 — Example
Scene 5 — Call To Action

Example structured scene object:

{
  "scene_type": "hook",
  "duration": 90,
  "text": "AI is changing everything faster than most people realize."
}

====================================================
STEP 3 — FIGMA TEMPLATE SYSTEM
====================================================

Figma acts as the visual scene builder.

Each scene type corresponds to a frame template.

Examples:

HookScene
HeadlineScene
ExplanationScene
ExampleScene
CTAScene

Each Figma frame contains semantic layer names.

Example Figma structure:

Frame: HookScene

Layers:
title_text
subtitle_text
background_gradient
accent_shape
icon_element

Semantic naming is important because it allows automation.

====================================================
STEP 4 — FIGMA DESIGN EXPORT
====================================================

The Figma layout must be exported as structured data.

Possible methods:

• Figma API
• Figma plugin export
• SVG export
• JSON design export

Example exported layout:

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

This design structure becomes input for animation.

====================================================
STEP 5 — REMOTION COMPONENT SYSTEM
====================================================

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

====================================================
STEP 6 — VIDEO COMPOSITION
====================================================

Remotion assembles scenes sequentially.

Example composition:

<Composition
  id="AIExplainer"
  component={MainVideo}
  durationInFrames={450}
  fps={30}
  width={1920}
  height={1080}
/>

Example scene list:

const scenes = [
  {type:"hook", duration:90},
  {type:"headline", duration:60},
  {type:"explanation", duration:120},
  {type:"example", duration:120},
  {type:"cta", duration:60}
];

====================================================
STEP 7 — AI TIMELINE GENERATION
====================================================

Instead of hardcoding animations, AI generates a timeline.

Example timeline JSON:

{
  "scenes": [
    {
      "type": "hook",
      "duration": 90,
      "animation": "fade_up",
      "text": "AI is changing everything."
    },
    {
      "type": "headline",
      "duration": 60,
      "animation": "slide_left",
      "text": "The Real Power of AI"
    }
  ]
}

Remotion interprets animation instructions.

Example animation mapping:

fade_up = opacity + translateY
slide_left = translateX
zoom_in = scale animation
blur_in = blur filter animation

====================================================
STEP 8 — AUTOMATION PIPELINE
====================================================

The entire system can be orchestrated by AI.

Example pipeline pseudocode:

script = generate_script(prompt)

scenes = split_into_scenes(script)

figma_templates = match_templates(scenes)

layout_data = export_figma_layout(figma_templates)

remotion_components = generate_remotion_components(layout_data)

timeline = generate_animation_timeline(script)

render_video(remotion_components, timeline)

====================================================
STEP 9 — REMOTION RENDER ENGINE
====================================================

Remotion renders the final video.

Output formats:

MP4
WebM
GIF
PNG sequence

Example render command:

npx remotion render src/index.tsx AIExplainer out/video.mp4

====================================================
STEP 10 — FULL AUTOMATED VIDEO FACTORY
====================================================

Full pipeline:

Prompt
↓
AI writes script
↓
AI generates scene structure
↓
AI selects Figma templates
↓
Figma exports layout data
↓
Remotion components generated
↓
AI generates animation timeline
↓
Remotion renders video
↓
Finished video

====================================================
KEY DESIGN PRINCIPLES
====================================================

1. Use semantic layer naming in Figma
2. Maintain reusable scene templates
3. Separate design from animation logic
4. Let AI orchestrate the pipeline
5. Let Remotion control motion logic
6. Treat Figma as a visual IDE for video scenes
7. Generate animation timelines dynamically

====================================================
ADVANCED CAPABILITY — AI CONTROLLED TIMELINES
====================================================

Traditional workflow:

Developer writes animation code
Developer controls durations
Developer builds each scene manually

AI timeline workflow:

Prompt
↓
AI generates script
↓
AI generates scene structure
↓
AI generates animation timeline
↓
Remotion interprets timeline
↓
Video renders automatically

Example timeline:

{
  "timeline": [
    {
      "scene": "hook",
      "duration": 90,
      "animation": "fade_up"
    },
    {
      "scene": "headline",
      "duration": 60,
      "animation": "slide_left"
    }
  ]
}

====================================================
END RESULT
====================================================

A programmable AI video studio where:

Prompt → Script → Scene Layout → Animation Timeline → Rendered Video

This system enables large scale video production with minimal manual design or coding.

END ARCHITECTURE
