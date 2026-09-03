# Layout Engine

Reusable layout primitives for Remotion video templates.

## Location

**Canonical path:** `design/layout/` (per ARCHITECTURE.md)

**Current (transitional) path:** `src/design/layout/`

```
src/design/layout/
  index.ts              Public API (barrel export)
  types.ts              Type contracts + alignment helpers
  Container.tsx         Centered content with padding + maxWidth
  Stack.tsx             Vertical/horizontal flex with gap
  Row.tsx               Horizontal flex with gap
  __tests__/            Standalone unit tests
```

## Architecture Layer

This lives in the **DESIGN** layer:

```
COMPOSITIONS → TEMPLATES → COMPONENTS → DESIGN → CORE → REMOTION
                                         ▲
                                         │
                                    layout/
```

**Rules:**
- No template-specific knowledge (no NQ57, no editorial, no tech)
- No hardcoded visual values (colors, fonts come from props)
- Layout describes STRUCTURE, not STYLE
- Content stays in templates, structure stays here

## Primitives

### Container

Root layout primitive. Wraps content with alignment, padding, and max-width.

```tsx
import { Container } from "../design/layout";

<Container padding="0 8% 12%" maxWidth={960}>
  <Title text="Hello" />
  <Subtitle text="World" />
</Container>
```

**Props:**
- `padding` — horizontal/vertical padding (CSS value, default: `"0 8% 12%"`)
- `maxWidth` — maximum content width (CSS value)
- `align` — horizontal alignment: "start" | "center" | "end" | "stretch" (default: "center")
- `justify` — vertical alignment: "start" | "center" | "end" | "between" (default: "center")
- `direction` — flex direction: "row" | "column" (default: "column")

### Stack

Vertical/horizontal flex with consistent gap.

```tsx
import { Stack } from "../design/layout";

<Stack gap={12} align="center">
  <Item />
  <Item />
  <Item />
</Stack>
```

**Props:**
- `gap` — spacing between items in px (default: 0)
- `align` — cross-axis alignment (default: "stretch")
- `justify` — main-axis alignment (default: "start")
- `direction` — flex direction (default: "column")

### Row

Horizontal flex with consistent gap.

```tsx
import { Row } from "../design/layout";

<Row gap={24} align="center">
  <Card />
  <Card />
  <Card />
</Row>
```

**Props:**
- `gap` — spacing between items in px (default: 0)
- `align` — cross-axis alignment (default: "center")
- `justify` — main-axis alignment (default: "start")
- `wrap` — allow items to wrap (default: false)

## Pure Functions

```typescript
mapAlign(align) → CSSProperties["alignItems"]
mapJustify(justify) → CSSProperties["justifyContent"]
```

## Layout Structure (not Style)

Layout primitives describe STRUCTURE, not STYLE:

```
Bad:
  <Card background="#123456" goldBorder ... />

Good:
  <Stack gap={12} align="center">
    <Content />
  </Stack>
```

Style belongs to theme/design/components.
Layout belongs to layout primitives.

## Composition Patterns

```
Container (root)
  └── Stack (vertical flow)
       ├── Row (horizontal items)
       │    ├── Item 1
       │    ├── Item 2
       │    └── Item 3
       └── Stack (sub-section)
            ├── Label
            └── Value
```

## Deterministic Rendering

Layout calculations are pure CSS flexbox. No:
- Browser-dependent measurement
- Random values
- Runtime DOM measurement
- Viewport APIs

Remotion renders the same geometry for the same inputs.

## What Belongs Where

**Layout Engine (this):**
- Where things are positioned
- How things are aligned
- How space is distributed
- How containers constrain content

**Components:**
- What things look like (cards, badges, labels)
- How things animate (fade, slide, reveal)

**Theme/Tokens:**
- Colors, fonts, sizes
- Visual design decisions

**Templates:**
- Which layout to use
- What content to display
- Scene-specific composition

## Boundaries

**This layer DOES:**
- Describe structure (alignment, spacing, constraints)
- Accept layout configuration (gap, padding, maxWidth)
- Return React components with CSS flexbox

**This layer does NOT:**
- Know what content to display (that's the template's job)
- Know what colors/fonts to use (that's the theme's job)
- Know about specific video topics (NQ57, editorial, etc.)
- Import from `templates/`, `components/`, or `compositions/`
