# ARCHITECTURE — remotion-html

> Single engine. One method. Many design languages. Many templates.

---

## 1. Layer Model

```
┌─────────────────────────────────────────────────────┐
│                   COMPOSITIONS                       │
│  Remotion entry points. One per deliverable video.  │
│  Imports: templates, data.                          │
├─────────────────────────────────────────────────────┤
│                    TEMPLATES                         │
│  Video structures. Scene sequences + data bindings. │
│  Imports: components, design, core.                 │
├─────────────────────────────────────────────────────┤
│                   COMPONENTS                         │
│  Video UI blocks. Composable visual units.          │
│  Imports: design, core.                             │
├─────────────────────────────────────────────────────┤
│                    DESIGN                            │
│  Visual language. Theme, motion, typography, SVG.   │
│  Imports: core.                                     │
├─────────────────────────────────────────────────────┤
│                     CORE                             │
│  Reusable behavior. Framework adapters, utilities,  │
│  types. Zero visual knowledge.                      │
│  Imports: remotion only.                            │
└─────────────────────────────────────────────────────┘
```

### Dependency Rule

```
COMPOSITIONS → TEMPLATES → COMPONENTS → DESIGN → CORE → REMOTION
```

**No upward imports. No cross-layer imports. No circular dependencies.**

A layer may only import from the layer directly below it.

---

## 2. Layer Definitions

### 2.1 CORE — Reusable Behavior

**Purpose:** Framework-level utilities, type contracts, and adapter code that works across any template.

**Contains:**

```
core/
  types/          SceneDef, Theme, MotionConfig, TransitionConfig
  utils/          sceneFrames(), buildTransitionSeries(), clamp()
  adapters/       RechartsAdapter, ThreeAdapter, LottieAdapter
  constants/      FPS, TAIL, DEFAULT_TRANSITION
```

**Rules:**
- Zero visual knowledge (no colors, no fonts, no layout values)
- Zero template knowledge (no NQ57, no editorial, no tech)
- Imports only from `remotion` and `@remotion/*` packages
- Every export must be usable by any template without modification

**Current extractables from NQ57:**

| Source | Target |
|---|---|
| `SceneDef` interface (data/nq57.ts) | `core/types/SceneDef.ts` |
| `sceneFrames()` (data/nq57.ts) | `core/utils/sceneFrames.ts` |
| `buildTransitionSeries()` (inferred from composition) | `core/utils/buildTransitionSeries.ts` |
| `FPS`, `TAIL` constants | `core/constants/render.ts` |
| Three.js rules (useCurrentFrame, angle renderer) | `core/adapters/ThreeAdapter.ts` |
| Recharts rules (isAnimationActive=false) | `core/adapters/RechartsAdapter.ts` |

### 2.2 DESIGN — Visual Language

**Purpose:** Theme system, motion vocabulary, typography primitives, SVG primitives. Defines *how things look and move*, not *what content they show*.

**Contains:**

```
design/
  theme/          ThemeProvider, token definitions, theme registry
  tokens/         color, typography, spacing, radius, shadow, motion
  motion/         MotionPreset, easing, spring configs, entrance/exit/emphasis
  typography/     Text, Headline, KineticText, WordReveal, Counter, Label
  svg/            RingDraw, UnderlineDraw, DataFlow, Gauge, Icon, Path, Shape
  transitions/    Fade, Slide, Push, Scale, Wipe, Morph
```

**Rules:**
- Every design primitive accepts tokens/theme via props or context
- No hardcoded visual values (colors, sizes, durations come from tokens)
- Motion primitives return style objects or animation configs, never `<div>`
- SVG primitives are pure functions of `progress` + config

**Current extractables from NQ57:**

| Source | Target |
|---|---|
| `fadeUp()` | `design/motion/fadeUp.ts` |
| `Backdrop` | `design/svg/Backdrop.tsx` (theme-driven) |
| `RingDraw` | `design/svg/RingDraw.tsx` |
| `UnderlineDraw` | `design/svg/UnderlineDraw.tsx` |
| `DataFlow` | `design/svg/DataFlow.tsx` |
| `Gauge` | `design/svg/Gauge.tsx` |
| `KaraokeCaption` | `design/typography/KaraokeCaption.tsx` |
| `Word` (legacy) | `design/typography/WordReveal.tsx` |
| `Caption` (legacy) | `design/typography/Caption.tsx` |
| `nq57` theme | `design/theme/themes/nq57.ts` |
| `Theme` type | `design/theme/types.ts` |

### 2.3 COMPONENTS — Video UI Blocks

**Purpose:** Composable visual units that combine design primitives into reusable video blocks. Like UI components, but for video.

**Contains:**

```
components/
  TitleBlock        Hero title with badge + gradient + subtitle
  QuoteBlock        Large quote with attribution
  MetricBlock       Single metric with animated value
  StatBlock         Multiple metrics in a row
  IconBlock         Icon with label
  ChartBlock        Chart wrapper (bar, area, gauge)
  CardBlock         Glassmorphism card container
  SectionHeader     Section title with decorative elements
  Timeline          Horizontal timeline with nodes
  Comparison        Side-by-side comparison
  Callout           Highlighted text block
```

**Rules:**
- Components accept design tokens via props or theme context
- Components do NOT import from templates
- Components do NOT contain scene-level logic (no `useCurrentFrame` at top level)
- Components receive `frame` and `fps` as props when they need animation

**Current extractables from NQ57:**

| Source | Target |
|---|---|
| Role cards (RolesSceneV2) | `components/CardBlock.tsx` |
| Pillar labels (PillarsSceneV2) | `components/LabelBlock.tsx` |
| Stats cards (StatsSceneV2) | `components/StatBlock.tsx` |
| `EmblemBox` wrapper | `components/ThreeBlock.tsx` (generic Three.js wrapper) |

### 2.4 TEMPLATES — Video Structures

**Purpose:** Define specific video deliverables. Scene sequences, data bindings, content mappings. A template is a *recipe*, not a *rendering*.

**Contains:**

```
templates/
  nq57/
    index.ts          Template entry
    scenes/           Scene definitions
    data/             Content data (SCENES array)
    theme/            Theme overrides (if any)
    assets/           Static assets manifest
    README.md         Template documentation
  editorial/
    ...
  tech/
    ...
```

**Rules:**
- Templates import from components, design, core — never from other templates
- Templates define scene order, scene-to-component mapping, and data flow
- Templates do NOT redefine design primitives
- Templates do NOT contain engine code

**NQ57 as first template:**

```
templates/nq57/
  index.ts              NghiQuyet57VideoV2 composition
  scenes/               7 scene components (TitleSceneV2, etc.)
  data/nq57.ts          SCENES array
  theme/nq57.ts         Theme overrides (if any beyond defaults)
```

### 2.5 COMPOSITIONS — Remotion Entry Points

**Purpose:** The file Remotion actually renders. Maps a template to a `Composition` with specific dimensions, FPS, and duration.

**Contains:**

```
compositions/
  NghiQuyet57VideoV2.tsx    registerRoot entry
```

**Rules:**
- Compositions are thin: they wire template + data + config
- No visual logic in compositions
- One composition = one deliverable video

---

## 3. Type Contracts

### 3.1 SceneDef — Scene Data

```typescript
interface SceneDef {
  id: string;        // Unique scene identifier ("s1"..."s7")
  audio: string;     // Path to audio file relative to public/ ("nq57/s1.mp3")
  caption: string;   // Full caption text (may contain newlines for multi-speaker)
  dur: number;       // Duration in seconds (precise, from TTS output)
}
```

### 3.2 Theme — Design Tokens

```typescript
interface Theme {
  colors: {
    bg: string;           // Primary background
    bg2: string;          // Secondary background
    card: string;         // Card/surface (rgba)
    line: string;         // Border/separator (rgba)
    primary: string;      // Primary accent
    primarySoft: string;  // Primary accent (lighter)
    secondary: string;    // Secondary accent
    secondarySoft: string;
    tertiary: string;     // Tertiary accent
    ink: string;          // Primary text
    muted: string;        // Secondary text
  };
  fonts: {
    display: string;      // Heading font stack
    body: string;         // Body font stack
  };
}
```

### 3.3 MotionConfig — Animation Presets

```typescript
interface MotionConfig {
  enter: {
    fadeUp: SpringConfig;
    scale: SpringConfig;
    slideLeft: SpringConfig;
    slideRight: SpringConfig;
    blur: SpringConfig;
  };
  exit: {
    fade: SpringConfig;
    slideLeft: SpringConfig;
    scale: SpringConfig;
  };
  emphasis: {
    pulse: SpringConfig;
    bounce: SpringConfig;
    glow: SpringConfig;
  };
  duration: {
    fast: number;     // frames
    normal: number;
    slow: number;
  };
}
```

### 3.4 TransitionConfig — Scene Transitions

```typescript
interface TransitionConfig {
  type: 'fade' | 'slide' | 'push' | 'scale' | 'wipe' | 'morph';
  durationInFrames: number;
  // type-specific options
}
```

---

## 4. Architecture Rules (Constitution)

### Rule 1: Template does not define engine.
Templates consume the engine. They never modify core behavior.

### Rule 2: Core does not know specific templates.
Core code cannot import from `templates/`. It has no knowledge of NQ57, editorial, or any specific video.

### Rule 3: Theme determines style, not content.
Theme values (colors, fonts, spacing) are applied by components. Content (text, data, images) comes from data layers.

### Rule 4: Content does not contain presentation logic.
`SceneDef` has `caption` (text) and `dur` (timing). It has no style, no animation, no layout.

### Rule 5: Typography is a visual primitive.
Text rendering (fadeUp, word reveal, karaoke, counter) is defined in the design layer, not in scene components.

### Rule 6: SVG/icon/shape are visual primitives before image/footage.
Code-gen visuals (SVG paths, animated shapes, Three.js geometry) are preferred over external image assets for core visual elements.

### Rule 7: Motion and transition must be reusable.
No scene defines its own animation from scratch. Every animation uses a motion preset or composes from design primitives.

### Rule 8: UI/UX principles applied selectively.
Video borrows from UI/UX (glassmorphism, cards, spacing) but does not become interactive UI. Motion serves storytelling, not interaction.

### Rule 9: Templates may differ drastically in appearance.
NQ57 (dark, governmental, infographic) and a future editorial template (light, minimal, typography-heavy) share the same engine but look nothing alike.

### Rule 10: Architecture is proven by reuse.
Success is measured by template #2 and #3 working without modifying core or design layers.

---

## 5. Deterministic Rendering Rules

These rules are **inviolable** for all templates:

1. **Never use `useFrame()` from React Three Fiber.** Always use Remotion's `useCurrentFrame()`.
2. **Never use `isAnimationActive` default from Recharts.** Set `isAnimationActive={false}` and compute values via `spring()`/`interpolate()`.
3. **ThreeCanvas requires explicit `width`/`height`.** No auto-sizing.
4. **Sequence wrapping ThreeCanvas must use `layout="none"`.**
5. **No `Math.random()` in render path.** Use deterministic seeds or frame-based values.
6. **No `Date.now()` or `performance.now()` in render path.** Use `useCurrentFrame()` for all timing.
7. **Font loading via `@remotion/google-fonts`.** No external CSS imports.
8. **Output format: JPEG for speed, ProRes for edit pipeline.** Configured in `remotion.config.ts`.
9. **Three.js projects require `Config.setChromiumOpenGlRenderer("angle")`.**

---

## 6. Content/TTS Pipeline (Future)

```
script (DIALOGUE array)
  ↓
TTS backend (edge/omni/gemini/proxy)
  ↓
audio files (public/{template}/sN.mp3)
  ↓
metadata (SceneDef[] with dur from MP3)
  ↓
data layer (src/data/{template}.ts)
  ↓
template (scene mapping)
  ↓
composition (Remotion render)
```

**Content changes do not require visual code changes.** The data layer bridges content and presentation.

---

## 7. Validation Pipeline

```
typecheck
  ↓
composition discovery (Root.tsx registers all)
  ↓
still render (frame 0 of each composition)
  ↓
short render (first 5 seconds)
  ↓
full render
  ↓
(optional) visual snapshot comparison
```

Every template must pass this pipeline before merge.

---

## 8. File Structure (Target)

```
remotion-html/
  core/
    types/
    utils/
    adapters/
    constants/
  design/
    theme/
    tokens/
    motion/
    typography/
    svg/
    transitions/
  components/
  templates/
    nq57/
    editorial/          (future)
    tech/               (future)
  compositions/
  data/                 (generated by TTS pipeline)
  public/               (audio assets, gitignored)
  docs/
    PRODUCT-CONTRACT.md
    ARCHITECTURE.md
    GLOSSARY.md
    DESIGN-SYSTEM.md    (Phase 3)
    MOTION-SYSTEM.md    (Phase 3)
    TEMPLATE-CONTRACT.md
    RENDERING.md
    CONTRIBUTING.md
  legacy/               (historical reference, not compiled)
```
