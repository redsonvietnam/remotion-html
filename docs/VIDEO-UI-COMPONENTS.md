# Video UI Components

Reusable video UI components built on Design primitives.

## Location

**Current path:** `src/components/`

```
src/components/
  index.ts              Public API (barrel export)
  types.ts              Component type contracts
  SectionLabel.tsx      Uppercase label above content
  GradientText.tsx      Gradient background clip text
  CardBlock.tsx         Card with badge, title, subtitle
```

## Architecture Layer

This sits between Design and Templates:

```
COMPOSITIONS
    ↓
TEMPLATES
    ↓
COMPONENTS    ← WS10
    ↓
DESIGN
    ↓
CORE
    ↓
REMOTION
```

**Rules:**
- No template-specific knowledge (no NQ57, no editorial, no tech)
- Built on Design primitives (typography, svg, layout, motion, theme)
- Template decides WHICH components to use and WHAT content to show
- Component decides HOW to render the structure

## Components

### SectionLabel

Uppercase label above content sections.

```tsx
import { SectionLabel } from "../components";

<SectionLabel text="BA CHỦ THỂ" fontFamily={BV} color={theme.colors.muted} />
```

**Props:**
- `text` — label text
- `fontFamily` — font family
- `fontSize` — font size in px (default: 26)
- `fontWeight` — font weight (default: 700)
- `color` — text color (default: muted)
- `letterSpacing` — letter spacing in px (default: 4)
- `marginBottom` — bottom margin in px (default: 30)

### GradientText

Text with gradient background clip effect.

```tsx
import { GradientText } from "../components";

<GradientText
  text="NGHỊ QUYẾT 57"
  gradient="linear-gradient(90deg, #e23b3b, #f3c969)"
  fontFamily={BV}
  fontSize={150}
/>
```

**Props:**
- `text` — text content
- `gradient` — CSS gradient value (default: red to gold)
- `fontFamily` — font family
- `fontSize` — font size in px (default: 120)
- `fontWeight` — font weight (default: 800)
- `lineHeight` — line height (default: 1)

### CardBlock

Card with optional number badge, title, and subtitle.

```tsx
import { CardBlock } from "../components";

<CardBlock
  number={1}
  accentColor={theme.colors.accent2}
  title="Người dân & Doanh nghiệp"
  subtitle="Trung tâm · Chủ thể · Động lực chính"
  fontFamily={BV}
  width={420}
/>
```

**Props:**
- `number` — number in badge (null = no badge)
- `accentColor` — badge border/accent color
- `title` — card title
- `subtitle` — card subtitle
- `width` — card width in px (default: 420)
- `background` — card background
- `border` — card border
- `borderRadius` — border radius (default: 24)
- `padding` — card padding (default: "40px 34px")
- `fontFamily` — font family
- `titleFontSize` — title size (default: 34)
- `titleColor` — title color
- `subtitleFontSize` — subtitle size (default: 22)
- `subtitleColor` — subtitle color
- `badgeSize` — badge diameter (default: 86)
- `badgeFontSize` — badge number size (default: 40)
- `boxShadow` — card shadow

## Extraction Evidence

| Component | NQ57 Uses | Reuse Potential |
|-----------|-----------|-----------------|
| SectionLabel | 4+ scenes | High — any video with sections |
| GradientText | 3 scenes | High — titles, metrics, emphasis |
| CardBlock | 1 scene | Medium — common video pattern |

## What Was NOT Extracted

- **Backdrop** — template-specific (gradient, radial patterns)
- **EmblemBox** — template-specific (NQ57 emblem)
- **DataFlow** — already in SVG engine
- **RingDraw** — already in SVG engine
- **UnderlineDraw** — already in SVG engine
- **Gauge** — template-specific composition (SVG + typography)

## Relationship to Design

Components use Design primitives:

```
SectionLabel → typography (fontFamily, color)
GradientText → typography (fontFamily, fontSize)
CardBlock → layout (flexbox), typography (fontFamily)
```

Components do NOT import from other components.
Components do NOT import from templates.

## Deterministic Rendering

Components render static structure. Animation is the template's job.

```tsx
// Template controls animation
const style = stagger({ frame, index: i, stagger: 14 });
<div style={style}>
  <CardBlock number={i + 1} title="..." subtitle="..." />
</div>
```

## What Belongs in Components

**Components DOES:**
- Define reusable video UI patterns
- Accept content via props
- Use Design primitives for rendering

**Components does NOT:**
- Know what content to display (template's job)
- Know what colors/fonts to use (theme's job)
- Know how things animate (motion's job)
- Import from `templates/`, `scenes/`, `compositions/`
