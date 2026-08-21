# Typography Engine

Reusable typography primitives for Remotion video templates.

## Location

**Canonical path:** `design/typography/` (per ARCHITECTURE.md)

**Current (transitional) path:** `src/design/typography/`

The typography engine lives inside `src/` until the full architecture migration
moves `design/`, `core/`, `components/` to the project root. This is a
transitional location — the canonical path is `design/typography/`.

```
src/design/typography/          ← transitional (inside src/)
  index.ts              Public API (barrel export)
  types.ts              Type contracts and defaults
  useFadeIn.ts          Basic fade+slide animation hook
  useWordTimings.ts     Word timing calculation (pure logic)
  Text.tsx              Basic text with enter animation
  WordReveal.tsx        Word-by-word text reveal
  KaraokeReveal.tsx     Progressive word highlighting with marquee
  Counter.tsx           Animated number counter (candidate for motion/data-visual)
  __tests__/            Standalone unit tests
```

## Architecture Layer

This lives in the **DESIGN** layer:

```
COMPOSITIONS → TEMPLATES → COMPONENTS → DESIGN → CORE → REMOTION
                                      ▲
                                      │
                               typography/
```

**Rules:**
- No template-specific knowledge (no NQ57, no editorial, no tech)
- No hardcoded visual values (colors, fonts come from props)
- Deterministic: uses Remotion's `useCurrentFrame()`, never `useFrame()`
- Content stays in templates, presentation stays here

## Primitives

### Text

Simplest primitive. Text with a fade+slide enter animation.

```tsx
import { Text } from "../design/typography";

<Text
  text="Nghị quyết 57"
  fontFamily="'Be Vietnam Pro', sans-serif"
  fontSize={200}
  fontWeight={800}
  color="#f7f5ef"
  enterDirection="up"
  delay={8}
/>
```

### WordReveal

Text appears word-by-word with individual spring animations.

```tsx
import { WordReveal } from "../design/typography";

<WordReveal
  text="Brain loves habits, not willpower"
  dur={5.5}
  fontFamily="'Inter', sans-serif"
  fontSize={68}
  color="#f7f5ef"
  stagger={4}
  enterDirection="up"
/>
```

**Props:**
- `text` — plain string (may contain newlines for multi-line)
- `dur` — duration in seconds (for timing calculation)
- `stagger` — frames between each word reveal (default: 4)
- `enterDirection` — "up" | "down" | "left" | "right" | "none"
- All standard text style props (fontFamily, fontSize, color, etc.)

### KaraokeReveal

Caption-style progressive word highlighting with marquee scroll.

```tsx
import { KaraokeReveal } from "../design/typography";

<KaraokeReveal
  text="MC: Hello. Expert: Today we discuss..."
  dur={10.5}
  fontFamily="'Be Vietnam Pro', sans-serif"
  activeColor="#f3c969"
  revealedColor="#f7f5ef"
  borderColor="rgba(245,245,255,0.12)"
/>
```

**Props:**
- `text` — full caption text (may contain newlines for multi-speaker)
- `dur` — duration in seconds
- `activeColor` — color for the currently spoken word
- `revealedColor` — color for already-spoken words
- `pendingColor` — color for not-yet-spoken words
- `enableMarquee` — auto-scroll long lines (default: true)
- All standard text style props

### Counter (candidate — motion/data-visual primitive)

Animated number that counts up from 0 to a target value.

**Note:** Counter is a candidate for a future `design/motion/` or
`design/data-visual/` primitive. Its animation logic is not typography-specific.
It is included here as a transitional extraction from NQ57. The `text` prop
is required by the base interface but unused — this will be addressed when
Counter moves to its proper home.

```tsx
import { Counter } from "../design/typography";

<Counter
  text="" // unused — counter generates its own display
  target={57}
  unit="%"
  color="#f3c969"
  fontFamily="'Be Vietnam Pro', sans-serif"
  numberFontSize={110}
  unitFontSize={46}
  delay={10}
/>
```

## Hooks

### useFadeIn

Returns `{ opacity, transform }` for a fade+slide animation.

```tsx
const style = useFadeIn({ delay: 10, direction: "up", spring: { damping: 18, mass: 0.6 } });
return <div style={{ ...style, fontFamily: "..." }}>Hello</div>;
```

### useWordTimings

Computes per-word timing data for a text string.

```tsx
const { timings, totalWords } = useWordTimings({ text, dur: 10.5 });
// timings[i] = { word, index, startFrame, endFrame, charOffset }
```

**Pure functions (no React):**
- `computeWordTimings(text, totalFrames, startOffset, endBuffer)` — compute timings
- `parseTextLines(text)` — split multi-line text
- `countWords(line)` — count words in a line
- `getActiveWordIndex(timings, frame)` — find which word is active at a frame
- `getWordProgress(timing, frame, fps)` — get reveal progress for a word

## Types

```typescript
interface SpringConfig { damping: number; mass: number; stiffness?: number; }
type EnterDirection = "up" | "down" | "left" | "right" | "none";

interface TypographyBaseProps {
  text: string;
  delay?: number;
  dur?: number;
  style?: CSSProperties;
  className?: string;
}

interface MotionProps {
  enterDirection?: EnterDirection;
  enterSpring?: SpringConfig;
  exit?: boolean;
  exitSpring?: SpringConfig;
}

interface TextStyleProps {
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  lineHeight?: number;
  color?: string;
  textAlign?: CSSProperties["textAlign"];
}

interface WordTiming {
  word: string;
  index: number;
  startFrame: number;
  endFrame: number;
  charOffset: number;
}

interface KaraokeConfig {
  activeColor?: string;
  revealedColor?: string;
  pendingColor?: string;
  pendingOpacity?: number;
  activeFontWeight?: number;
  defaultFontWeight?: number;
  enableMarquee?: boolean;
  containerWidth?: number;
  fontSize?: number;
  charWidthRatio?: number;
}

interface CounterConfig {
  target: number;
  unit?: string;
  color?: string;
  unitColor?: string;
  numberFontSize?: number;
  unitFontSize?: number;
}
```

## Deterministic Rendering

All primitives follow Remotion's deterministic rendering rules:

1. **No `useFrame()`** — only Remotion's `useCurrentFrame()`
2. **No `Math.random()`** — all values computed from frame + config
3. **No `Date.now()`** — timing comes from frame count
4. **Spring-based animations** — `spring()` from Remotion for physics-based motion
5. **Interpolation** — `interpolate()` for linear transitions

## Boundaries

**This layer DOES:**
- Define how text animates (fade, slide, reveal, highlight)
- Provide timing calculations for word-by-word effects
- Accept style props (fontFamily, fontSize, color)
- Return React components and hooks

**This layer does NOT:**
- Know what text content to display (that's the template's job)
- Know what colors/fonts to use (that's the theme's job)
- Know about specific video topics (NQ57, editorial, etc.)
- Import from `templates/`, `components/`, or `compositions/`

## Primitive Vocabulary (non-exhaustive)

```
Typography Engine
  ├── Text              Basic text with enter animation
  ├── WordReveal        Word-by-word reveal
  ├── KaraokeReveal     Progressive word highlighting
  └── Counter           (candidate → motion/data-visual)

Motion Vocabulary (future WS6)
  ├── useFadeIn
  ├── useWordTimings
  └── ...
```

Keep typography focused on text rendering and word-level animation.
Data visualization (counters, gauges, charts) belongs in motion or
data-visual primitives.
