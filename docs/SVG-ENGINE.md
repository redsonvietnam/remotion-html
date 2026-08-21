# SVG Engine

Reusable SVG drawing primitives for Remotion video templates.

## Location

**Canonical path:** `design/svg/` (per ARCHITECTURE.md)

**Current (transitional) path:** `src/design/svg/`

```
src/design/svg/
  index.ts              Public API (barrel export)
  types.ts              Type contracts and pure math functions
  PathDraw.tsx          Generic SVG path stroke draw
  RingDraw.tsx          Circle arc + tick marks
  LineDraw.tsx          Straight line stroke draw
  FlowLine.tsx          Animated dots along a line
  __tests__/            Standalone unit tests
```

## Architecture Layer

This lives in the **DESIGN** layer:

```
COMPOSITIONS → TEMPLATES → COMPONENTS → DESIGN → CORE → REMOTION
                                         ▲
                                         │
                                    svg/
```

**Rules:**
- No template-specific knowledge (no NQ57, no editorial, no tech)
- No hardcoded visual values (colors, sizes come from props)
- Deterministic: all driven by `progress` prop (0→1)
- Content stays in templates, drawing stays here

## Primitives

### PathDraw

The core primitive. Draws any SVG path using the `strokeDashoffset` technique.

```tsx
import { PathDraw } from "../design/svg";

<PathDraw
  d="M 0 50 Q 50 0 100 50 T 200 50"
  progress={0.8}
  width={200}
  height={100}
  stroke="#f3c969"
  strokeWidth={2}
/>
```

**Props:**
- `d` — SVG path d attribute (any valid path string)
- `progress` — 0→1 (0 = hidden, 1 = fully drawn)
- `width`, `height` — SVG viewport
- `stroke`, `strokeWidth`, `strokeLinecap` — stroke style
- `fill`, `fillOpacity` — fill style
- `viewBox`, `transform`, `style` — layout

### CircleDraw

Circle arc that reveals from 0 to full.

```tsx
import { CircleDraw } from "../design/svg";

<CircleDraw
  progress={0.7}
  size={200}
  r={90}
  stroke="#f3c969"
  strokeWidth={4}
  backgroundStroke="rgba(255,255,255,0.08)"
/>
```

### RingDraw

Circle arc with tick marks — replaces NQ57's RingDraw.

```tsx
import { RingDraw } from "../design/svg";

<RingDraw
  progress={ring}
  size={520}
  color="#f3c969"
  strokeWidth={2}
  tickCount={8}
/>
```

**Props:**
- `progress` — 0→1
- `size` — rendered size in px
- `color` — stroke + tick color
- `strokeWidth` — ring stroke width
- `tickCount` — number of tick marks (default: 8)
- `tickColor` — tick color (default: same as color)
- `tickLength` — tick mark length (default: 4)

### LineDraw

Straight line that reveals from start to end — replaces NQ57's UnderlineDraw.

```tsx
import { LineDraw } from "../design/svg";

<LineDraw
  progress={ul}
  width={460}
  stroke="#f3c969"
  strokeWidth={3}
/>
```

### FlowLine

Animated dots flowing along a horizontal line — replaces NQ57's DataFlow.

```tsx
import { FlowLine } from "../design/svg";

<FlowLine
  progress={flowProgress}
  width={1100}
  dotColor="#2bbcb3"
  lineColor="rgba(255,255,255,0.15)"
  dotCount={5}
/>
```

**Props:**
- `width` — line length in px
- `progress` — drives dot movement (0→1 cycles dots across)
- `dotColor`, `lineColor` — colors
- `dotCount`, `dotRadius`, `dotOpacity` — dot style
- `direction` — "ltr" (default) or "rtl"

## Pure Functions

```typescript
computeTickMarks(count, cx, cy, innerR, outerR, startAngle?) → TickMark[]
clampProgress(p) → number
```

## Design Principle: Composable Primitives

SVG primitives are designed to compose:

```
PathDraw
  + CircleDraw
  + Typography (Counter)
  ────────────────
  = Gauge (template-specific)

PathDraw + FlowLine + Typography
  ────────────────
  = StatBlock (template-specific)

LineDraw + WordReveal
  ────────────────
  = TimelineBlock (template-specific)
```

Don't build one-off "NQ57 widgets". Build composable primitives.

## API Pattern

All SVG primitives follow the same pattern:

```tsx
<PrimitiveName
  progress={0-1}        // driven by template
  width={...}           // layout
  stroke="..."          // visual config
  style={{ ... }}       // override
/>
```

The template controls:
- **Which** primitive to use
- **When** to show it (via progress)
- **What** colors/sizes to use

The primitive controls:
- **How** to draw the shape
- **How** to animate it (strokeDashoffset, dot movement, etc.)

## Boundaries

**This layer DOES:**
- Know how to draw SVG shapes (path, circle, line, dots)
- Know how to animate them (stroke draw, flow)
- Accept style props (stroke, color, size)

**This layer does NOT:**
- Know what shapes to draw (that's the template's job)
- Know what colors to use (that's the theme's job)
- Know about specific video topics (NQ57, editorial, etc.)
- Import from `templates/`, `components/`, or `compositions/`
