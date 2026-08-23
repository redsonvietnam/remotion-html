# Design System Contract

This document defines the contract for the Design layer in the
video-template architecture.

## Architecture

```
COMPOSITIONS
    ↓
TEMPLATES
    ↓
COMPONENTS
    ↓
DESIGN
    ├── typography/   WS3 — text rendering + word animation
    ├── svg/          WS4 — SVG drawing primitives
    ├── layout/       WS5 — spatial structure
    ├── motion/       WS6 — frame → animation state
    ├── transition/   WS7 — scene-to-scene transitions
    └── theme/        WS8 — visual design language
    ↓
CORE
    ↓
REMOTION
```

## Dependency Rules

### Allowed Dependencies

| Module | May Import From |
|--------|----------------|
| typography | react, remotion, ./types, ./useFadeIn, ./useWordTimings |
| svg | react, ./types |
| layout | react, ./types |
| motion | remotion, ./types |
| transition | ./types |
| theme | ./types |

### Forbidden Dependencies

- **No cross-module imports** (typography cannot import from svg, etc.)
- **No template imports** (cannot import from templates/, scenes/, compositions/)
- **No theme imports** (design modules don't know about themes)
- **No NQ57 imports** (cannot import from theme/nq57, fonts/nq57, data/nq57)

### Dependency Direction

```
COMPOSITIONS → TEMPLATES → COMPONENTS → DESIGN → CORE → REMOTION
```

Design modules import ONLY from:
- `react` (for JSX, CSSProperties)
- `remotion` (for spring, interpolate, useCurrentFrame, etc.)
- Internal `./types` (within the same module)

## Module Contracts

### typography/

**Purpose:** Text rendering and word-level animation.

**Provides:**
- Components: Text, WordReveal, KaraokeReveal, Counter
- Hooks: useFadeIn, useWordTimings
- Pure functions: computeWordTimings, parseTextLines, countWords, getActiveWordIndex, getWordProgress

**Does NOT:**
- Know what text to display (template's job)
- Know what colors/fonts to use (theme's job)
- Import from other design modules

### svg/

**Purpose:** SVG drawing primitives.

**Provides:**
- Components: PathDraw, CircleDraw, RingDraw, LineDraw, FlowLine
- Pure functions: computeTickMarks, clampProgress

**Does NOT:**
- Know what shapes to draw (template's job)
- Know what colors to use (theme's job)
- Import from other design modules

### layout/

**Purpose:** Spatial structure.

**Provides:**
- Components: Container, Stack, Row
- Pure functions: mapAlign, mapJustify

**Does NOT:**
- Know what content to display (template's job)
- Know what colors/fonts to use (theme's job)
- Import from other design modules

### motion/

**Purpose:** Frame → animation state.

**Provides:**
- Pure functions: fadeSlide, stagger, linearProgress, delayedProgress, staggerProgress, secondsToFrames, framesToSeconds, clampProgress

**Does NOT:**
- Know what elements to animate (template's job)
- Know what colors/fonts to use (theme's job)
- Import from other design modules

### transition/

**Purpose:** Scene-to-scene transition configuration.

**Provides:**
- Pure functions: getPreset, resolveConfig, totalFrames, sceneFrames
- Constants: DEFAULT_TRANSITION, PRESETS

**Does NOT:**
- Know what scenes to transition between (template's job)
- Know what colors/fonts to use (theme's job)
- Import from other design modules

### theme/

**Purpose:** Visual design language.

**Provides:**
- Types: Theme, ThemeInput, ThemeColors, ThemeFonts, ThemeSpacing, ThemeRadii, ThemeTypography
- Pure functions: createTheme, mergeTheme, getColor
- Constants: DEFAULT_COLORS, DEFAULT_FONTS, DEFAULT_SPACING, DEFAULT_RADII, DEFAULT_TYPOGRAPHY

**Does NOT:**
- Know what content to display (template's job)
- Know what scenes exist (template's job)
- Import from other design modules
- Provide React context (template's responsibility)

## Intentional Parallel Evolution

Some types/functions are defined in multiple modules:

- **SpringConfig** — typography/types.ts and motion/types.ts (identical)
- **clampProgress** — svg/types.ts and motion/types.ts (identical)
- **Direction** — layout/types.ts (row/column) vs motion/types.ts (up/down/left/right/none)

This is intentional. Design modules are independent and don't import from
each other. The duplication is acceptable to maintain module independence.

## Default Values

Design modules provide defaults that are:
- **Technically correct** (animations work with defaults)
- **Template-agnostic** (no NQ57-specific values)
- **Overridable** (templates provide theme-specific values)

Known NQ57-colored defaults (templates MUST override):
- typography defaults: gold (#f3c969), light (#f7f5ef)
- These are documented with "// template should override" comments

## Validation Checklist

Before merging any design module change:

- [ ] `npx tsc --noEmit` passes
- [ ] No imports from templates/, scenes/, compositions/
- [ ] No imports from theme/nq57, fonts/nq57, data/nq57
- [ ] No cross-module imports within design/
- [ ] All defaults are template-agnostic (or documented as "template should override")
- [ ] Existing NQ57 render still works
