# Template Runtime Contract

> Technical contract for a Template to be called, rendered, and validated by the system.

**Base:** df5c402 | **Version:** 1.0

---

## 1. Template Interface

A template is a module that exports the following:

```typescript
interface Template {
  /** Unique identifier (e.g., "nq57", "editorial-01"). */
  id: string;

  /** Scene registry: maps scene ID strings to React components. */
  scenes: Record<string, React.FC<SceneProps>>;

  /** Ordered list of scene definitions (content data). */
  sceneList: SceneDef[];

  /** Theme tokens for this template. */
  theme: ThemeColors;

  /** Font loader — called once before render. */
  loadFonts: () => void;

  /** Root component — renders the full video (TransitionSeries). */
  Root: React.FC;

  /** Render parameters for Remotion Composition. */
  render: {
    width: number;
    height: number;
    fps: number;
  };
}
```

A template does NOT export:
- Composition registration (that belongs in `src/Root.tsx` or `src/compositions/`)
- Duration calculation (derived from sceneList + transitions, not stored)
- Transition configuration (owned by the template root component internally)

---

## 2. Input / Output Separation

Four distinct concerns, each with clear ownership:

| Concern | Defines | Owned by |
|---|---|---|
| **Content** | WHAT is shown (text, data, audio paths) | `data/{template-id}.ts` |
| **Theme** | HOW IT LOOKS (colors, fonts, spacing) | `theme/{template-id}.ts` |
| **Template** | HOW STORY IS STRUCTURED (scene order, transitions, composition) | `templates/{id}/` |
| **Composition** | HOW REMOTION RUNS IT (registration, dimensions, FPS) | `src/Root.tsx` or `compositions/` |

### Flow

```
Content (SceneDef[])
  ↓
Template (scene registry + root component)
  ↓
Composition (Remotion Composition registration)
  ↓
Remotion (render engine)
```

---

## 3. Scene Contract

### 3.1 SceneDef — Content metadata

```typescript
interface SceneDef {
  /** Unique scene identifier within the template. */
  id: string;

  /** Duration in seconds (float). From TTS output or manual specification. */
  dur: number;
}
```

**SceneDef is content metadata.** It answers: "How long does this scene last?"

### 3.2 What belongs in SceneDef vs. what does NOT

| Field | In SceneDef? | Reason |
|---|---|---|
| `id` | Yes | Identifies the scene for registry lookup |
| `dur` | Yes | Drives frame calculation and Composition duration |
| `audio` | Template-specific | Audio path is content, but not all templates use TTS. Store in template-specific content type or data file. |
| `caption` | Template-specific | Caption text is content, but not all templates have captions. Store in template-specific content type or data file. |
| `data` | Template-specific | Additional content (charts, lists, numbers) varies per template. Use template-specific typed data. |

### 3.3 Template-specific content type

Templates extend SceneDef with their own content:

```typescript
// NQ57 example
interface NQ57SceneDef extends SceneDef {
  audio: string;
  caption: string;
}

// Hypothetical editorial template
interface EditorialSceneDef extends SceneDef {
  headline: string;
  body: string;
  pullQuote?: string;
}

// Hypothetical data template
interface DataSceneDef extends SceneDef {
  chartType: "bar" | "line" | "gauge";
  dataPoints: { label: string; value: number }[];
}
```

**Rule:** The base SceneDef is minimal. Template-specific content is typed by the template, not forced into a universal interface.

### 3.4 Scene component contract

```typescript
interface SceneProps {
  /** Scene data (template-specific). */
  scene: SceneDef;
}
```

Scene components receive scene data as a single prop. They do NOT receive:
- Theme (use `useTheme()` hook)
- Frame (use `useCurrentFrame()` from Remotion)
- Global config (access via module-level constants)

---

## 4. Composition Contract

### 4.1 Composition is thin

A Composition does exactly three things:

1. **Registers** a template with Remotion
2. **Calculates** total duration from scene data
3. **Provides** default props (if any)

```typescript
// src/Root.tsx or src/compositions/{id}.tsx
<Composition
  id="TemplateId"
  component={Template.Root}
  durationInFrames={totalFrames}
  fps={Template.render.fps}
  width={Template.render.width}
  height={Template.render.height}
/>
```

### 4.2 What Composition does NOT contain

- Scene design or visual logic
- Template-specific styling
- Business/content logic
- Transition configuration
- Theme injection

### 4.3 Duration calculation

Duration is derived, not stored:

```
totalFrames = sum(sceneFrames(scene.dur)) + (sceneCount - 1) * transitionFrames
```

Where:
- `sceneFrames(dur)` converts seconds to frames with TAIL buffer
- `transitionFrames` is the transition duration in frames
- Both are constants or derived values, not hardcoded per scene

---

## 5. Template Registry

### 5.1 Current approach: static import

Templates are imported directly in `src/Root.tsx`:

```typescript
import { NQ57Template } from "./templates/nq57";
```

This is deterministic and explicit. No dynamic resolution.

### 5.2 What a registry WOULD look like (not yet needed)

```typescript
// Hypothetical future — not implemented
const registry: Record<string, Template> = {
  nq57: NQ57Template,
  "editorial-01": Editorial01Template,
};
```

### 5.3 What is NOT needed

- Dynamic plugin system
- Filesystem discovery
- Dependency injection framework
- Runtime template loading

**Current approach is correct.** Static imports give type safety and determinism. Dynamic resolution adds complexity without proven need.

---

## 6. Render Contract

### 6.1 Template provides render parameters

```typescript
render: {
  width: number;   // e.g., 1920
  height: number;  // e.g., 1080
  fps: number;     // e.g., 30
}
```

### 6.2 Ownership

| Parameter | Owner | Notes |
|---|---|---|
| `width` | Template | Defines output resolution |
| `height` | Template | Defines output resolution |
| `fps` | Template | Defines frame rate |
| `durationInFrames` | Composition | Calculated from scene data + transitions |
| `codec` | Remotion config | Global setting (MP4, ProRes) |
| `output format` | Remotion config | Global setting |

### 6.3 Defaults

| Parameter | Default | Override? |
|---|---|---|
| Width | 1920 | Per template |
| Height | 1080 | Per template |
| FPS | 30 | Per template (rarely changed) |
| Tail (scene buffer) | 0.5s | Per template (global constant) |

---

## 7. Data / Content Separation

### 7.1 Boundary definitions

```
src/
  data/                  Content (WHAT)
    {template-id}.ts       SceneDef[] + template-specific content

  theme/                 Theme (HOW IT LOOKS)
    {template-id}.ts       Colors, fonts, spacing tokens

  templates/             Template (HOW STORY IS STRUCTURED)
    {template-id}/
      index.tsx             Root component (TransitionSeries)
      scenes/
        index.ts            Scene registry
        *.tsx               Scene components

  compositions/          Composition (HOW REMOTION RUNS IT)
    {TemplateId}Video.tsx  Registration + duration
    Root.tsx               Entry point
```

### 7.2 What stays where

| File | Purpose | Can reference |
|---|---|---|
| `data/{id}.ts` | Scene definitions + content data | Nothing (pure data) |
| `theme/{id}.ts` | Theme tokens | Nothing (pure data) |
| `templates/{id}/index.tsx` | Root component | data, theme, templates/{id}/scenes |
| `templates/{id}/scenes/*.tsx` | Scene components | design, components, theme (via hook) |
| `compositions/` or `Root.tsx` | Registration | templates, data |

### 7.3 No forced restructuring

Current file structure works. This contract defines the boundaries, not prescribes directory changes.

---

## 8. Validation Contract

Every template must pass:

### 8.1 TypeScript

```bash
npx tsc --noEmit
```

Zero errors. No `any` escapes in template code.

### 8.2 Dependency direction

```
COMPOSITIONS -> TEMPLATES -> COMPONENTS -> DESIGN -> CORE -> REMOTION
```

Verify:
- Templates do NOT import from other templates
- Templates do NOT modify Design or Component layers
- Templates do NOT import from compositions

### 8.3 Deterministic rendering

- No `Math.random()` in render path
- No `Date.now()` or `performance.now()` in render path
- No `useFrame()` from React Three Fiber (use `useCurrentFrame()`)
- Recharts `isAnimationActive={false}` always

### 8.4 Duration calculation

```bash
npx remotion still src/index.ts {CompositionId} out/test.png --log=error
```

Must produce a valid image. Duration must match:
```
sum(sceneFrames(scene.dur)) + (sceneCount - 1) * transitionFrames
```

### 8.5 Scene registry consistency

Every scene ID in `sceneList` must have a corresponding entry in `scenes` registry. No orphaned IDs, no unused components.

### 8.6 Theme validity

- All color tokens used by scenes must exist in theme
- No hardcoded colors in scene components
- Theme conforms to `ThemeColors` interface

---

## 9. NQ57 as Reference

NQ57 is the first template. It validates the contract but does NOT define it.

### 9.1 NQ57 satisfies the contract

| Contract requirement | NQ57 compliance |
|---|---|
| Exports Template interface | Yes (id, scenes, sceneList, theme, loadFonts, Root, render) |
| SceneDef is minimal | Partial — NQ57 adds `audio` and `caption` as template-specific content |
| Composition is thin | Yes — registration + duration only |
| Theme is separate | Yes — `theme/nq57.ts` |
| Data is separate | Yes — `data/nq57.ts` |
| No cross-template deps | Yes — NQ57 does not import from other templates |
| Deterministic rendering | Yes — no Math.random, no Date.now |

### 9.2 NQ57 quirks that are template-specific

| Quirk | Why it exists | Is it in the contract? |
|---|---|---|
| `audio` field in SceneDef | NQ57 uses TTS voiceover | No — template-specific content |
| `caption` field in SceneDef | NQ57 has karaoke captions | No — template-specific content |
| `TAIL = 0.5s` buffer | Prevents audio clipping at scene boundaries | No — NQ57-specific timing concern |
| `sceneFrames()` utility | Converts seconds to frames with TAIL | No — derived, not in contract |
| `TRANSITION_FRAMES = 16` | NQ57-specific transition duration | No — template-specific |

### 9.3 Contract is NOT shaped around NQ57

The contract defines minimum requirements. NQ57 extends them with template-specific content. A template without TTS (e.g., a kinetic typography video) would NOT have `audio` or `caption` fields — and that is correct.

---

## 10. Architecture Test: Hypothetical Template #2

### 10.1 Template #2: Editorial / Kinetic Typography

Completely different from NQ57:

| Aspect | NQ57 | Template #2 (Editorial) |
|---|---|---|
| Visual style | Dark, governmental, infographic | Light, minimal, typography-focused |
| Content type | TTS voiceover + captions | Text-only, no audio |
| Scene structure | 7 scenes, dialogue format | 5 scenes, essay format |
| Typography role | Supporting (labels, captions) | Hero (kinetic text is the visual) |
| SVG usage | Heavy (rings, gauges, flow lines) | Minimal (underlines only) |
| Data visualization | Charts, gauges, counters | None |
| Transitions | Fade (16 frames) | Slide (24 frames) |
| Theme | Dark palette, 3 accents | Light palette, 1 accent |

### 10.2 What Template #2 needs to create

```
data/editorial-01.ts          SceneDef[] with headline, body, pullQuote
theme/editorial-01.ts         Light palette, single accent
fonts/editorial-01.ts         Serif + sans-serif pair
templates/editorial-01/
  index.tsx                   Root with TransitionSeries
  scenes/
    index.ts                  Registry: s1-s5
    HeroScene.tsx             Large kinetic headline
    BodyScene.tsx             Paragraph reveal
    PullQuoteScene.tsx        Large quote with attribution
    DataScene.tsx             Simple stat with counter
    EndScene.tsx              Closing CTA
compositions/Editorial01Video.tsx   Thin wrapper
```

### 10.3 What Template #2 does NOT touch

- `src/design/` — no new primitives needed (uses existing fadeUp, KaraokeReveal, GradientText, LineDraw)
- `src/components/` — no new components needed (uses existing SectionLabel, GradientText)
- `src/templates/nq57/` — no modifications
- `src/core/` — no modifications

### 10.4 Validation

Template #2 passes:
- `npx tsc --noEmit` — clean
- `npx remotion still src/index.ts Editorial01V1 out/test.png --log=error` — valid image
- No dependencies on NQ57
- No modifications to shared layers

**The architecture is proven when Template #2 works without modifying Core or Design.**

---

## 11. Anti-Framework Rules

The following are explicitly prohibited:

| Anti-pattern | Why it is prohibited |
|---|---|
| `TemplateBase` class | Templates are modules, not class instances. No inheritance hierarchy. |
| Universal `Scene` component | Scenes are template-specific. No generic scene renderer. |
| Generic `VideoPage` abstraction | Layout is per-scene, not per-page. No page-level abstraction. |
| Dynamic plugin machinery | Static imports are sufficient. Dynamic loading adds complexity without proven need. |
| Premature DI | Direct imports are clear and type-safe. DI frameworks are over-engineering for this scale. |
| NQ57-specific interfaces | Contract must be generic. NQ57 quirks stay in NQ57's template directory. |

### The principle

**Minimal contract. Maximum freedom.**

The contract defines the minimum interface for a template to work. Everything else — visual style, scene structure, content type, motion plan — is template-specific and freely chosen.

---

## 12. Summary

```
Template = {
  id,                    // identifier
  scenes,                // scene registry (ID -> component)
  sceneList,             // ordered scene definitions
  theme,                 // visual tokens
  loadFonts,             // font loader
  Root,                  // root component (TransitionSeries)
  render,                // { width, height, fps }
}
```

```
Composition = {
  id,                    // Remotion composition ID
  component,             // Template.Root
  durationInFrames,      // calculated from sceneList
  fps,                   // from Template.render
  width,                 // from Template.render
  height,                // from Template.render
}
```

```
SceneDef = {
  id,                    // scene identifier
  dur,                   // duration in seconds
  // + template-specific content fields
}
```

---

## 13. Validation Checklist

- [ ] Template exports all required fields (id, scenes, sceneList, theme, loadFonts, Root, render)
- [ ] SceneDef has at minimum: `id` and `dur`
- [ ] Composition is thin (registration + duration only)
- [ ] No hardcoded colors in scene components
- [ ] No imports from other templates
- [ ] No modifications to Design or Component layers
- [ ] `npx tsc --noEmit` passes
- [ ] `npx remotion still` produces valid image
- [ ] Scene registry matches sceneList (no orphans, no missing)
- [ ] Theme tokens used by scenes exist in theme definition
