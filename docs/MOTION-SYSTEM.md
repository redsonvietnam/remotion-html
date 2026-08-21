# Motion System

Reusable motion primitives for Remotion video templates.

## Location

**Canonical path:** `design/motion/` (per ARCHITECTURE.md)

**Current (transitional) path:** `src/design/motion/`

```
src/design/motion/
  index.ts              Public API (barrel export)
  types.ts              Type contracts + clampProgress
  fadeSlide.ts          Pure fade + slide animation
  stagger.ts            Stagger animation for indexed items
  timing.ts             Frame-based timing helpers
  __tests__/            Standalone unit tests
```

## Architecture Layer

This lives in the **DESIGN** layer:

```
COMPOSITIONS → TEMPLATES → COMPONENTS → DESIGN → CORE → REMOTION
                                         ▲
                                         │
                                    motion/
```

**Rules:**
- No template-specific knowledge (no NQ57, no editorial, no tech)
- Pure functions — no React hooks, no browser timing
- Frame-driven — uses Remotion's `spring()` and `interpolate()`
- Deterministic: same frame + same inputs = same output

## Motion Vocabulary

### fadeSlide

Pure function: fade + slide animation. Returns `{ opacity, transform }`.

```tsx
import { fadeSlide } from "../design/motion";

const style = fadeSlide({ frame, delay: 10, direction: "up" });
return <div style={style}>Hello</div>;
```

**Config:**
- `frame` — current frame (from `useCurrentFrame()` or any source)
- `delay` — frame delay before animation starts (default: 0)
- `direction` — "up" | "down" | "left" | "right" | "none" (default: "up")
- `distance` — translate distance in px (default: 40)
- `spring` — `{ damping, mass, stiffness }` (default: `{ damping: 18, mass: 0.6 }`)

### stagger

Pure function: stagger animation for indexed items.

```tsx
import { stagger } from "../design/motion";

items.map((item, i) => {
  const style = stagger({ frame, index: i, stagger: 14 });
  return <div style={style}>{item}</div>;
});
```

**Config:**
- `frame` — current frame
- `index` — item index in the sequence
- `stagger` — frames between each item's start (default: 4)
- `delay` — extra delay before first item (default: 0)
- `direction` — slide direction (default: "up")
- `distance` — translate distance in px (default: 30)
- `spring` — spring config

### Timing Helpers

```typescript
linearProgress({ frame, startFrame, endFrame }) → 0-1
delayedProgress(frame, { delay, duration }) → 0-1
staggerProgress(frame, { index, stagger, duration, delay? }) → 0-1
secondsToFrames(seconds, fps) → number
framesToSeconds(frames, fps) → number
clampProgress(value) → 0-1
```

## Pure Functions (no React)

All motion primitives are pure functions. They take frame values as input
and return animation state as output. No hooks, no side effects.

```tsx
// This works anywhere — React components, Node scripts, tests
const style = fadeSlide({
  frame: 15,
  delay: 10,
  direction: "up",
  distance: 40,
});
// style = { opacity: 0.8, transform: "translateY(8px)" }
```

## Relationship to Typography

WS3's `useFadeIn` hook is a React hook that wraps spring-based animation
for typography. It stays in typography — it's a hook, not a pure function.

WS6's `fadeSlide` is a pure function that does the same thing but without
React dependencies. It can be used anywhere.

**Rule:** Don't duplicate. If typography needs fadeSlide, it can import
from motion. But don't create competing APIs.

## Relationship to SVG

SVG primitives (WS4) take `progress` (0-1) as input. WS6 provides helpers
for converting frame/time to progress:

```tsx
import { linearProgress } from "../design/motion";

// Drive SVG progress from frame
const progress = linearProgress({ frame, startFrame: 10, endFrame: 60 });
<RingDraw progress={progress} size={200} />
```

## Relationship to Layout

Layout (WS5) defines structure. Motion defines how things enter/exit.
They don't overlap — motion returns `{ opacity, transform }`, layout
returns CSS positioning.

## Deterministic Rendering

Motion must use Remotion's frame model. No:
- CSS transitions or animations
- requestAnimationFrame
- Browser clocks
- Random values
- Date.now()

Same frame + same inputs must always produce the same result.

## What Belongs in Motion

**Motion DOES:**
- Calculate animation state (opacity, transform)
- Provide timing helpers (progress, stagger)
- Convert between frame/time units

**Motion does NOT:**
- Know what elements to animate (that's the component's job)
- Know what colors/fonts to use (that's the theme's job)
- Know about specific video topics (NQ57, editorial, etc.)
- Import from `templates/`, `components/`, or `compositions/`

## Boundaries

**This layer DOES:**
- Compute fade/slide/scale animations
- Provide stagger timing for indexed items
- Convert frame/time to progress values

**This layer does NOT:**
- Know what content to animate (that's the template's job)
- Know what colors/fonts to use (that's the theme's job)
- Know about specific video topics (NQ57, editorial, etc.)
- Import from `templates/`, `components/`, or `compositions/`
