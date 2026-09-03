# GLOSSARY — remotion-html

Shared vocabulary for the project. All participants (human, R1, C1) must use these terms consistently.

---

## Core Terms

| Term | Definition |
|---|---|
| **Engine** | The core + design + component layers. Template-agnostic video generation system. |
| **Template** | A complete video recipe: scenes + data + theme + transitions. One template = one video type. |
| **Composition** | A Remotion `Composition` entry point. Maps a template to renderable output (dimensions, FPS, duration). |
| **Scene** | A contiguous segment of a video with its own visual content, audio, and caption. |
| **Primitive** | A lowest-level building block (e.g., `fadeUp()`, `RingDraw`, `Text`). Cannot be decomposed further within the system. |
| **Design Language** | The visual identity of a template: colors, typography, motion style, icon style, density. |

## Layer Terms

| Term | Definition |
|---|---|
| **Core** | Layer containing reusable behavior, types, utilities, framework adapters. Zero visual knowledge. |
| **Design** | Layer containing visual language: theme, motion, typography, SVG, transitions. |
| **Components** | Layer containing composable video UI blocks (TitleBlock, StatBlock, etc.). |
| **Template** | Layer containing specific video structures and their configurations. |
| **Composition** | Layer containing Remotion entry points that wire templates to renderable output. |

## Visual Terms

| Term | Definition |
|---|---|
| **Theme** | A set of design tokens (colors, fonts, spacing, motion) that defines a visual identity. |
| **Token** | A named design value (e.g., `color.primary`, `font.display`, `motion.fast`). |
| **Motion Preset** | A named animation configuration (e.g., `enter.fadeUp`, `emphasis.pulse`). |
| **Transition** | An animation between scenes (fade, slide, wipe, morph, etc.). |
| **Backdrop** | A full-bleed background layer with gradients, glows, or patterns. |
| **Glassmorphism** | Semi-transparent card with `backdrop-filter: blur`, used for surfaces and captions. |

## Typography Terms

| Term | Definition |
|---|---|
| **Kinetic Text** | Text that animates (fades, slides, scales, splits) as part of the visual narrative. |
| **Word Reveal** | Text that appears word-by-word with individual spring animations. |
| **Karaoke Caption** | A caption bar that highlights the currently spoken word and scrolls for long text. |
| **Counter** | An animated number that counts up from 0 to a target value. |

## SVG Terms

| Term | Definition |
|---|---|
| **Ring Draw** | An SVG circle animated via `strokeDashoffset` to appear as if being drawn. |
| **Underline Draw** | An SVG line animated via `strokeDashoffset` for emphasis. |
| **Data Flow** | An SVG indicator with animated dots flowing along a line, suggesting data movement. |
| **Gauge** | A radial SVG meter showing a value as a proportion of a maximum. |

## Data Terms

| Term | Definition |
|---|---|
| **SceneDef** | TypeScript interface defining a scene's data: `id`, `audio`, `caption`, `dur`. |
| **FPS** | Frames per second. Global constant (30 for all current templates). |
| **TAIL** | Buffer time (0.5s) appended to each scene to prevent audio clipping at boundaries. |
| **sceneFrames()** | Utility function converting duration in seconds to Remotion frames: `ceil((dur + TAIL) * FPS)`. |

## Rendering Terms

| Term | Definition |
|---|---|
| **Deterministic** | Same input produces identical output. No randomness, no wall-clock dependency. |
| **Still Render** | Rendering a single frame as an image (PNG/JPEG). Used for validation. |
| **Short Render** | Rendering first N seconds of a video. Used for quick validation. |
| **Full Render** | Rendering the complete video to MP4/ProRes. |
| **ANGLE** | Chromium OpenGL renderer required for Three.js WebGL in headless mode. |

## Pipeline Terms

| Term | Definition |
|---|---|
| **TTS** | Text-to-Speech. Generates audio from dialogue text. |
| **TTS Backend** | A specific TTS provider: edge (Microsoft), omni (OmniVoice), gemini (Google), proxy (OpenAI-compatible). |
| **Caption Pipeline** | The flow from dialogue script → TTS audio → timing metadata → scene duration → rendered caption. |
| **Content** | Text, data, and dialogue that a template renders. Distinct from visual presentation. |

## Workflow Terms

| Term | Definition |
|---|---|
| **PAIRFLOW** | The human-AI collaboration protocol. R1 (reviewer) directs C1 (implementer). |
| **Work Order** | A specific task assignment from R1 to C1 with scope, constraints, and validation criteria. |
| **Workstream** | A logical grouping of related work orders (e.g., WS-ARCHITECTURE, WS-CLEANUP). |
| **Handoff** | The structured output from C1 to R1 documenting what was done, validated, and remaining. |
| **SOP** | Standard Operating Procedure. A repeatable workflow for creating new templates. |
