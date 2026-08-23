# Transition System

Reusable scene-to-scene transition configuration for Remotion video templates.

## Location

**Canonical path:** `design/transition/` (per ARCHITECTURE.md)

**Current (transitional) path:** `src/design/transition/`

```
src/design/transition/
  index.ts              Public API (barrel export)
  types.ts              Type contracts + presets
  helpers.ts            Config resolution + timing helpers
  __tests__/            Standalone unit tests
```

## Architecture Layer

This lives in the **DESIGN** layer:

```
COMPOSITIONS → TEMPLATES → COMPONENTS → DESIGN → CORE → REMOTION
                                         ▲
                                         │
                                    transition/
```

**Rules:**
- No template-specific knowledge (no NQ57, no editorial, no tech)
- Wraps Remotion's @remotion/transitions with a clean API
- Template owns scene ordering and duration
- Transition owns visual interpolation between scenes

## Transition Vocabulary

### Built-in Types

| Type | Description | Duration |
|------|-------------|----------|
| `"fade"` | Cross-fade between scenes | 16 frames default |
| `"slide"` | Slide transition (directional) | 20 frames default |
| `"wipe"` | Wipe transition (directional) | 20 frames default |
| `"none"` | Cut (instant, no transition) | 0 frames |

### Presets

| Preset | Type | Duration | Direction |
|--------|------|----------|-----------|
| `cut` | none | 0 | — |
| `fade` | fade | 16 | — |
| `fadeSlow` | fade | 30 | — |
| `slideLeft` | slide | 20 | left |
| `slideRight` | slide | 20 | right |
| `slideUp` | slide | 20 | up |
| `slideDown` | slide | 20 | down |
| `wipeLeft` | wipe | 20 | left |
| `wipeRight` | wipe | 20 | right |

## Usage

### With TransitionSeries (Remotion)

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { getPreset, sceneFrames } from "../design/transition";

const FPS = 30;

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={sceneFrames(3, FPS)}>
    <Scene1 />
  </TransitionSeries.Sequence>

  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 16 })}
  />

  <TransitionSeries.Sequence durationInFrames={sceneFrames(3, FPS)}>
    <Scene2 />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

### Using Presets

```tsx
import { getPreset, resolveConfig } from "../design/transition";

const config = getPreset("slideLeft");
// { type: "slide", durationInFrames: 20, slideDirection: "left" }

const resolved = resolveConfig(config);
// { type: "slide", durationInFrames: 20, slideDirection: "left",
//   wipeDirection: "left", enteringDirection: "from-left" }
```

### Calculating Total Duration

```tsx
import { totalFrames, sceneFrames } from "../design/transition";

const sceneDurations = [3, 3, 3, 3, 3]; // 5 scenes, 3 seconds each
const transitionDuration = 16; // frames

const total = totalFrames(sceneDurations, transitionDuration, 30);
// 5 × 90 + 4 × 16 = 450 + 64 = 514 frames
```

## Helpers

```typescript
getpreset(name) → TransitionConfig
resolveConfig(config) → Required<TransitionConfig>
totalFrames(sceneDurationsSec, transitionFrames, fps) → number
sceneFrames(durSec, fps) → number
```

## Timing Model

**Template owns:**
- Scene ordering
- Scene duration (in seconds)
- Transition duration (in frames)

**Transition owns:**
- Visual interpolation between scenes
- Presentation (fade, slide, wipe)
- Timing (linear, spring)

**Do not hide scene timing inside transition primitives.**

## Relationship to Motion

Motion (WS6) animates elements WITHIN a scene.
Transition (WS7) animates BETWEEN scenes.

```
Motion:    element → animation (opacity, transform)
Transition: scene A → scene B (cross-fade, slide, wipe)
```

They don't overlap. A transition may internally use motion concepts,
but scene-to-scene composition belongs to WS7.

## Deterministic Rendering

Transitions must be frame-driven. No:
- CSS transitions or animations
- Browser clocks
- requestAnimationFrame
- Random values

Same inputs must always produce identical output.

## When to Use Cut

Use `"none"` (cut) when:
- You want a hard cut between scenes
- The visual style doesn't benefit from transition
- You're cutting between unrelated content
- Transition duration would be too short to perceive

## What Belongs Where

**Transition (this):**
- Scene-to-scene visual interpolation
- Transition type/duration configuration
- Preset definitions

**Motion (WS6):**
- Element entrance/exit animations
- Stagger timing
- Fade/slide within a scene

**Template:**
- Scene ordering
- Scene duration
- Which transition to use between which scenes

**Component:**
- Visual appearance of elements
- Animation state within a scene

## Boundaries

**This layer DOES:**
- Configure transition type and duration
- Provide presets for common transitions
- Calculate total frame counts for sequences

**This layer does NOT:**
- Know what scenes to transition between (that's the template's job)
- Know what colors/fonts to use (that's the theme's job)
- Know about specific video topics (NQ57, editorial, etc.)
- Import from `templates/`, `components/`, or `compositions/`
