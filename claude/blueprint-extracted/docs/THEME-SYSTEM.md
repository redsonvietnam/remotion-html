# Theme / Design Token System

Reusable theme contracts for Remotion video templates.

## Location

**Canonical path:** `design/theme/` (per ARCHITECTURE.md)

**Current (transitional) path:** `src/design/theme/`

```
src/design/theme/
  index.ts              Public API (barrel export)
  types.ts              Theme contract (colors, fonts, spacing, radii, typography)
  helpers.ts            createTheme, mergeTheme, getColor, defaults
  __tests__/            Standalone unit tests
```

## Architecture Layer

This lives in the **DESIGN** layer:

```
COMPOSITIONS → TEMPLATES → COMPONENTS → DESIGN → CORE → REMOTION
                                         ▲
                                         │
                                    theme/
```

**Rules:**
- Theme is HOW IT LOOKS, not WHAT it shows or HOW it's structured
- Theme is not content. Theme is not template structure.
- One template can use many themes. One theme can serve many templates.

## Theme Contract

```typescript
interface Theme {
  name: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  spacing: ThemeSpacing;
  radii: ThemeRadii;
  typography: ThemeTypography;
}
```

### Colors

Semantic color tokens:

| Token | Purpose | NQ57 Value |
|-------|---------|------------|
| `bg` | Primary background | `#0a0e1a` |
| `bg2` | Secondary background | `#0f1525` |
| `card` | Card/panel background | `rgba(255,255,255,0.045)` |
| `line` | Border/divider color | `rgba(245,245,255,0.12)` |
| `accent1` | Primary accent (strong) | `#e23b3b` |
| `accent1Soft` | Primary accent (soft) | `#ff6b5e` |
| `accent2` | Secondary accent (strong) | `#f3c969` |
| `accent2Soft` | Secondary accent (soft) | `#ffe6a3` |
| `accent3` | Tertiary accent | `#5eead4` |
| `ink` | Primary text | `#f7f5ef` |
| `muted` | Secondary text | `#9aa0b5` |

### Fonts

| Token | Purpose |
|-------|---------|
| `display` | Heading/display font |
| `body` | Body text font |
| `mono` | Monospace font (optional) |

### Spacing

| Token | NQ57 Value |
|-------|------------|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `xxl` | 48px |

### Radii

| Token | NQ57 Value |
|-------|------------|
| `sm` | 6px |
| `md` | 12px |
| `lg` | 20px |
| `xl` | 28px |
| `full` | 999px |

### Typography

| Token | NQ57 Value |
|-------|------------|
| `caption` | 16px |
| `body` | 20px |
| `subtitle` | 26px |
| `title` | 42px |
| `titleLg` | 64px |
| `hero` | 120px |

## Usage

### Create a Theme

```tsx
import { createTheme } from "../design/theme";

const minimalTheme = createTheme({
  name: "minimal",
  colors: {
    bg: "#ffffff",
    bg2: "#f5f5f5",
    card: "#f0f0f0",
    line: "#e0e0e0",
    accent1: "#0066ff",
    accent1Soft: "#3388ff",
    accent2: "#00cc88",
    accent2Soft: "#33ddaa",
    accent3: "#ff6600",
    ink: "#111111",
    muted: "#666666",
  },
  fonts: {
    display: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
});
```

### Merge Themes

```tsx
import { createTheme, mergeTheme } from "../design/theme";

const base = createTheme({ name: "base" });
const dark = mergeTheme(base, {
  name: "dark",
  colors: { bg: "#000", ink: "#fff" },
});
// dark has base's spacing, radii, typography
// but custom colors
```

### Use Colors

```tsx
import { getColor } from "../design/theme";

const bg = getColor(theme.colors, "bg");
const text = getColor(theme.colors, "ink");
```

## Theme Switching

One template can use many themes:

```
Template: Editorial
    │
    ├── Theme: NQ57 / Government (dark navy + red/gold)
    ├── Theme: Minimal Mono (white + black)
    ├── Theme: Modern Tech (dark + blue/cyan)
    └── Theme: Bold Editorial (dark + warm accents)
```

The template defines structure. The theme defines appearance.

## Relationship to Other Layers

```
Theme        → HOW IT LOOKS (colors, fonts, spacing)
Template     → HOW EVERYTHING IS COMPOSED (scene order, content)
Layout       → WHERE things are positioned
Typography   → WHAT TEXT looks like
SVG          → WHAT SHAPES look like
Motion       → HOW IT MOVES
Component    → WHAT individual elements look like
```

Theme does NOT:
- Know what scenes exist (template's job)
- Know what text to show (content's job)
- Know how things are positioned (layout's job)
- Know how things animate (motion's job)

## Deterministic Rendering

Theme tokens are static values. No:
- Runtime color computation
- Dynamic font loading
- Browser-dependent rendering

Same theme = same visual output.

## What Belongs in Theme

**Theme DOES:**
- Define color palette (semantic tokens)
- Define font families
- Define spacing scale
- Define border radii
- Define typography sizes

**Theme does NOT:**
- Know what content to display
- Know what scenes exist
- Know how things are positioned
- Know how things animate
- Import from `templates/`, `components/`, or `compositions/`

## Boundaries

**This layer DOES:**
- Define the visual design language
- Provide tokens for colors, fonts, spacing, radii
- Allow theme switching for the same template

**This layer does NOT:**
- Know about specific video topics (NQ57, editorial, etc.)
- Import from `templates/`, `components/`, or `compositions/`
- Contain React context (that's the template's responsibility)
