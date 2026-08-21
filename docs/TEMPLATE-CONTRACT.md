# Template Contract

This document defines the canonical contract for reusable video templates.

## 1. Template Responsibilities

A template is a **complete video configuration** that defines:

- **What content** to show (scenes, text, data)
- **What order** to show it (scene sequencing)
- **What theme** to apply (colors, fonts, spacing)
- **What audio** to play (TTS, music)
- **What transitions** to use between scenes

A template is NOT:
- A visual implementation (that's scenes/components)
- A design system (that's Design layer)
- A composition engine (that's Remotion)

## 2. Template Inputs

A template receives:

```typescript
interface TemplateInput {
  /** Template identifier. */
  id: string;
  /** Video resolution. */
  width: number;
  height: number;
  fps: number;
  /** Scene definitions (content data). */
  scenes: SceneDef[];
  /** Theme configuration. */
  theme: Theme;
  /** Font loader function. */
  loadFonts: () => void;
  /** Scene component registry. */
  scenes: Record<string, React.FC<SceneProps>>;
  /** Transition configuration. */
  transition?: TransitionConfig;
}
```

## 3. Content vs Presentation Separation

**Content (data):**
- Scene text/captions
- Audio files
- Duration
- Data (numbers, charts, lists)
- Order/sequence

**Presentation (visual):**
- How text is styled
- How elements are positioned
- How animations work
- How transitions look

**Rule:** Content is data. Presentation is code. They must be separate.

```
BAD:
  const scene = <div style={{ color: "#f3c969" }}>NGHỊ QUYẾT 57</div>

GOOD:
  // Content
  { id: "s1", text: "NGHỊ QUYẾT 57", dur: 20 }

  // Presentation (scene component)
  <GradientText text={scene.text} colorFrom={theme.accent1} colorTo={theme.accent2} />
```

## 4. Scene Definition Contract

```typescript
interface SceneDef {
  /** Unique scene identifier. */
  id: string;
  /** Audio file path (relative to public/). */
  audio: string;
  /** Caption/subtitle text (plain string, may contain newlines). */
  caption: string;
  /** Duration in seconds. */
  dur: number;
  /** Scene-specific data (optional, type-safe per template). */
  data?: Record<string, unknown>;
}
```

**Rules:**
- `id` must be unique within the template
- `audio` is a file path, not a URL
- `caption` is plain text, no JSX
- `dur` is in seconds (float), not frames
- `data` is optional, template-specific

## 5. Theme Injection

Templates provide theme via React context:

```typescript
// Template root
<ThemeProvider theme={nq57Theme}>
  <TransitionSeries>
    {/* scenes */}
  </TransitionSeries>
</ThemeProvider>

// Scene component
const theme = useTheme();
return <div style={{ color: theme.colors.ink }}>...</div>;
```

**Rules:**
- Theme is provided at template root
- Scenes consume theme via hook
- Design primitives receive theme values as props
- Theme is not imported directly by scenes

## 6. Component Usage

Templates use components from `src/components/`:

```tsx
import { SectionLabel, GradientText, CardBlock } from "../components";

// In scene
<SectionLabel text="BA CHỦ THỂ" fontFamily={theme.fonts.display} color={theme.colors.muted} />
<GradientText text="50%" colorFrom={theme.colors.accent1} colorTo={theme.colors.accent2} />
<CardBlock number={1} accent={theme.colors.accent2} title="..." background={theme.colors.card} />
```

**Rules:**
- Components receive theme values as props
- Components do NOT import theme directly
- Animation is the template's job (using motion primitives)
- Layout is the template's job (using layout primitives)

## 7. Design-System Usage

Templates use Design primitives directly:

```tsx
import { Container, Stack, Row } from "../design/layout";
import { fadeSlide, stagger } from "../design/motion";
import { RingDraw, LineDraw, FlowLine } from "../design/svg";
```

**Rules:**
- Templates may use Design primitives directly
- Templates may use Components (which wrap Design primitives)
- Templates do NOT modify Design primitives
- Templates do NOT import from other templates

## 8. Audio/TTS Boundary

**Audio ownership:**
- Template defines which audio files to use (via SceneDef.audio)
- Template does NOT generate audio (that's the content pipeline)
- Audio files live in `public/{template-id}/`

**TTS boundary:**
- TTS generates audio files from text
- TTS is a build-time operation, not runtime
- Template consumes pre-generated audio files

**Rules:**
- Audio paths are relative to `public/`
- Templates do NOT call TTS APIs at runtime
- Templates do NOT generate audio dynamically

## 9. Timing/Duration Ownership

**Template owns:**
- Scene duration (via `SceneDef.dur`)
- Transition duration (via `TransitionConfig`)
- Total video duration (calculated from scenes + transitions)

**Scene owns:**
- Internal animation timing (delay, stagger, spring)
- Element entrance/exit timing

**Design owns:**
- Animation math (fadeSlide, stagger, spring)
- Timing helpers (linearProgress, delayedProgress)

**Rules:**
- Duration is in seconds (float), not frames
- Frame conversion happens at composition level
- Templates do NOT hardcode frame numbers

## 10. Transition Ownership

**Template owns:**
- Which transition between which scenes
- Transition duration
- Transition type (fade, slide, wipe, cut)

**Design owns:**
- Transition presets (fade, slide, wipe, cut)
- Transition helpers (totalFrames, sceneFrames)

**Rules:**
- Transitions are configured in composition, not scenes
- Scenes are unaware of transitions
- Transition duration is in frames

## 11. Composition vs Template Boundary

**Composition (src/compositions/):**
- Registers Remotion Composition
- Calculates total duration
- Provides default props
- Imports template's root component

**Template (src/templates/{id}/):**
- Defines scene ordering
- Provides theme
- Maps scene IDs to components
- Handles TransitionSeries

**Rules:**
- Composition is thin (registration + duration)
- Template is the real entry point
- Template may have multiple compositions (different resolutions, etc.)

## 12. What Templates MUST NOT Depend On

- ❌ Other templates
- ❌ Design primitives directly (use components when possible)
- ❌ Remotion internals (use template-level abstractions)
- ❌ Hardcoded colors/fonts (use theme)
- ❌ Runtime audio generation (use pre-generated files)
- ❌ Canvas/WebGL (use SVG or images)
- ❌ Browser APIs (deterministic rendering)

## 13. What Templates MAY Depend On

- ✅ Components (src/components/)
- ✅ Design primitives (src/design/)
- ✅ Theme (src/design/theme/)
- ✅ Remotion APIs (useCurrentFrame, spring, interpolate)
- ✅ @remotion/transitions (TransitionSeries)
- ✅ Pre-generated audio files
- ✅ Static assets (images, SVGs)

## 14. Template Directory Structure

```
src/
  templates/
    {template-id}/
      index.ts              Template root (ThemeProvider + TransitionSeries)
      scenes/
        index.ts            Scene registry
        Scene1.tsx          Scene component
        Scene2.tsx
        ...
  data/
    {template-id}.ts        Scene definitions (SceneDef[])
  theme/
    {template-id}.ts        Theme configuration
  fonts/
    {template-id}.ts        Font loading
  compositions/
    {TemplateId}Video.tsx   Composition (thin wrapper)
```

**Rules:**
- Each template has its own directory
- Scenes are in template's scenes/ directory
- Data, theme, fonts are in shared directories
- Composition is a thin wrapper

## 15. Rules for Creating Template #2

When creating Template #2:

1. **Copy structure from Template #1** — same directory layout
2. **Define new SceneDef[]** — new content, same contract
3. **Define new Theme** — new colors, same tokens
4. **Create new scenes** — reuse components, new visual style
5. **Create new composition** — same pattern, different ID
6. **Do NOT modify Design layer** — templates are independent
7. **Do NOT modify Components** — components are shared
8. **Do NOT modify Template #1** — templates are independent

**Checklist for Template #2:**
- [ ] New template directory created
- [ ] New SceneDef[] defined
- [ ] New Theme defined
- [ ] New scenes implemented (using Components + Design)
- [ ] New composition registered
- [ ] No dependencies on Template #1
- [ ] No modifications to Design/Components
- [ ] Typecheck passes
- [ ] Render test passes

## Unresolved Questions

1. **Scene component props:** Should scenes receive all data via props, or use context? Current NQ57 uses props.

2. **Scene data typing:** How to make `SceneDef.data` type-safe per template? Current approach: `Record<string, unknown>`.

3. **Font loading:** Should fonts be loaded per-template or globally? Current NQ57: per-template.

4. **Audio pre-generation:** Who generates TTS audio? Current: manual. Future: pipeline.

5. **Multiple compositions:** Should a template support multiple resolutions? Current: single composition.

## Architecture Status

```
COMPOSITIONS    ✅ (thin wrappers)
    ↓
TEMPLATES       📝 (this contract)
    ↓
COMPONENTS      ✅ (SectionLabel, GradientText, CardBlock)
    ↓
DESIGN          ✅ (typography, svg, layout, motion, transition, theme)
    ↓
CORE            ✅ (Remotion)
    ↓
REMOTION        ✅ (framework)
```
