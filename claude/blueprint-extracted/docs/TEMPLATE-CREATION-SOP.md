# Template Creation SOP

> Standard Operating Procedure for creating new video templates on the remotion-html engine.

**Base:** d840cd0 | **Version:** 1.0 | **Scope:** Template creation lifecycle

---

## 1. Template Creation Pipeline

```
INPUT
  -> CONTENT ANALYSIS
  -> VISUAL DIRECTION
  -> TEMPLATE STRUCTURE
  -> COMPONENT SELECTION
  -> DESIGN PRIMITIVE SELECTION
  -> MOTION / TRANSITION PLAN
  -> THEME
  -> IMPLEMENTATION
  -> VALIDATION
  -> RENDER
```

### 1.1 INPUT

Receive the creative brief:

- **What** is the video about? (topic, message, call-to-action)
- **Who** is the audience? (general public, domain experts, stakeholders)
- **How long** should it be? (target duration, scene count estimate)
- **What assets** exist? (script, TTS audio, data, imagery)
- **What constraint** applies? (no footage, code-gen only, specific branding)

**Output:** Brief document (or PAIRFLOW work order) with clear scope.

### 1.2 CONTENT ANALYSIS

Break the content into scenes:

- **Scene count:** How many distinct visual segments?
- **Scene type per segment:** Title? Data? Quote? List? Comparison? Diagram?
- **Content density per scene:** Text-heavy? Data-heavy? Visual-heavy?
- **Audio structure:** One speaker? Multiple? Background music?

**Output:** SceneDef[] array with id, caption, dur, audio for each scene.

### 1.3 VISUAL DIRECTION

Define the design language before touching code:

- **Mood:** Serious, playful, corporate, editorial, futuristic, minimal?
- **Color strategy:** Dark background? Light? Gradient? Monochrome?
- **Typography role:** Hero text? Supporting? Kinetic? Decorative?
- **Icon/SVG role:** Structural diagrams? Decorative accents? Data visualization?
- **Imagery dependency:** None (code-gen only)? Minimal (few icons)? Heavy (photos)?

**Output:** Visual direction document (2-3 paragraphs + reference images/moodboard).

### 1.4 TEMPLATE STRUCTURE

Define the scene sequence:

```
Scene 1: Title/Hero     -- introduce topic
Scene 2: Context         -- why this matters
Scene 3: Data/Stats      -- evidence
Scene 4: Structure       -- framework/pillars
Scene 5: Details         -- specifics
Scene 6: Vision/Future   -- outlook
Scene 7: Closing/CTA     -- call to action
```

**Output:** Scene flow diagram with types (title, data, list, comparison, closing).

### 1.5 COMPONENT SELECTION

Map each scene to available components:

| Scene Type | Available Components |
|---|---|
| Title/Hero | GradientText, SectionLabel, CardBlock |
| Data/Stats | CardBlock, Gauge (design/svg) |
| Quote | KaraokeReveal (design/typography) |
| List/Pillars | CardBlock, SectionLabel |
| Diagram | FlowLine, RingDraw, LineDraw (design/svg) |
| Comparison | CardBlock (multiple instances) |

**Rule:** Use existing components. Do NOT create new ones unless the "When to Extract" rule (Section 4) is satisfied.

### 1.6 DESIGN PRIMITIVE SELECTION

Select from the design system:

**Typography:** KaraokeReveal, SectionLabel, GradientText

**SVG:** RingDraw, LineDraw, FlowLine

**Motion:** fadeUp, stagger

**Layout:** AbsoluteFill (Remotion)

### 1.7 MOTION / TRANSITION PLAN

Define animation for each scene:

| Phase | Description | Example |
|---|---|---|
| Enter | How elements appear | fadeUp(frame, delay, fps) |
| Emphasis | How key elements draw attention | spring() scale, RingDraw progress |
| Progress/Data | How data animates | interpolate() count-up, FlowLine cycling |
| Exit | How elements disappear | Scene transition handles this |
| Scene Transition | How scenes connect | @remotion/transitions (fade, slide, wipe) |

Rules:
- Every animation uses a motion primitive or composes from design primitives
- No scene defines its own animation from scratch
- Transition type and duration configured at template root, not in scenes

### 1.8 THEME

Define the theme. See THEME-SYSTEM.md for token definitions.

Rules:
- Colors use semantic names (primary, secondary, tertiary), not template-specific names
- Theme is provided at template root via ThemeProvider
- Scenes consume theme via useTheme() hook
- Design primitives receive theme values as props

**Output:** Theme file (src/theme/{template-id}.ts).

### 1.9 IMPLEMENTATION ORDER

1. Theme -> src/theme/{template-id}.ts
2. Fonts -> src/fonts/{template-id}.ts
3. Data -> src/data/{template-id}.ts (SceneDef[])
4. Helpers -> src/templates/{template-id}/helpers.tsx
5. Scenes -> src/templates/{template-id}/scenes/*.tsx
6. Scene registry -> src/templates/{template-id}/scenes/index.ts
7. Template root -> src/templates/{template-id}/index.tsx
8. Composition -> src/compositions/{TemplateId}Video.tsx
9. Register -> src/Root.tsx

### 1.10 VALIDATION

Run the validation pipeline (see Section 9).

### 1.11 RENDER

```bash
npx remotion still src/index.ts {CompositionId} out/test.png --log=error
npx remotion render src/index.ts {CompositionId} out/full.mp4 --log=error
```

---

## 2. Template Design Checklist

Every new template must answer these questions before implementation.

### Content

- [ ] What is the content? Topic, message, data points, call-to-action.
- [ ] What is the scene/story structure? Number of scenes, sequence, narrative arc.
- [ ] What is the audio structure? Single speaker, multi-speaker, background music.
- [ ] What data needs visualization? Charts, numbers, lists, diagrams.

### Visual

- [ ] What role does typography play? Hero text? Supporting labels? Kinetic? Decorative?
- [ ] What role do icons/SVG/shapes play? Structural diagrams? Decorative accents? Data viz?
- [ ] Is imagery needed? None (code-gen only)? Minimal (icons only)? Heavy (photos)?
- [ ] If no imagery, how is visual hierarchy created? Color? Size? Position? Motion? Density?

### Motion

- [ ] Enter: How do elements appear? (fadeUp, slide, scale, blur)
- [ ] Emphasis: How do key elements draw attention? (pulse, glow, ring-draw, counter)
- [ ] Progress/Data: How do data elements animate? (count-up, chart reveal, flow-line)
- [ ] Exit: How do elements disappear? (handled by scene transitions)
- [ ] Scene transition: How do scenes connect? (fade, slide, wipe, cut)

### UX/UI

- [ ] Hierarchy: What is the visual weight of each element? (title > data > supporting)
- [ ] Spacing: How much breathing room between elements? (consistent padding/margins)
- [ ] Alignment: What alignment system? (center, left, grid-based)
- [ ] Grouping: How are related elements grouped? (cards, spacing, color)
- [ ] Affordance: Do interactive-looking elements suggest interaction? (buttons, gauges)
- [ ] Information density: How much content per scene? (sparse = editorial, dense = infographic)

---

## 3. Template Boundary Contract

Each layer has strict ownership. Violating boundaries creates coupling that breaks reusability.

### TEMPLATE owns:

- Story structure (scene order, narrative arc)
- Scene composition (what components appear where)
- Content mapping (SceneDef to scene component)
- Theme selection (which theme to apply)
- Timing (scene duration, transition duration)
- Motion orchestration (when elements animate, in what order)
- Template-specific visual compositions (unique layouts, decorative elements)

### COMPONENT owns:

- Reusable video UI structures (CardBlock, SectionLabel, GradientText)
- Accepts theme values via props
- No scene-level logic (no useCurrentFrame at top level)
- No template-specific knowledge

### DESIGN owns:

- Typography primitives (KaraokeReveal, SectionLabel, GradientText)
- SVG primitives (RingDraw, LineDraw, FlowLine)
- Layout primitives (Container, Stack, Row)
- Motion primitives (fadeUp, stagger, spring helpers)
- Transition presets (fade, slide, wipe, cut)
- Theme/token contracts (Theme type, token definitions)

### CORE owns:

- Generic behavior (sceneFrames, buildTransitionSeries, clamp)
- Type contracts (SceneDef, Theme, MotionConfig)
- Framework adapters (RechartsAdapter, ThreeAdapter)
- Constants (FPS, TAIL, DEFAULT_TRANSITION)
- Zero visual knowledge, zero template knowledge

### Boundary violations:

| Violation | Why it is wrong |
|---|---|
| Template modifies a Design primitive | Breaks all other templates using that primitive |
| Design imports from a Template | Creates circular dependency |
| Component uses useCurrentFrame at top level | Becomes scene-level, not composable |
| Template hardcodes colors (not using theme) | Breaks when theme changes |
| Core imports from Design | Core becomes visual, loses template-agnosticism |
| Template imports from another Template | Creates inter-template coupling |

---

## 4. When to Extract Rule

Extracting too early creates unused abstractions. Extracting too late creates duplication.

### The Threshold

| Occurrences | Action |
|---|---|
| 1 occurrence | Template-specific. Keep in helpers.tsx or scene file. |
| 2 occurrences | Candidate. Note it. Do NOT extract yet. |
| 3+ across meaningful contexts | Extract to Component or Design primitive. |
| Cross-template evidence | Strong evidence. Extract immediately. |

### What counts as meaningful context

- Same visual pattern in different scenes of the SAME template = 1 context
- Same visual pattern in different templates = multiple contexts
- Same visual pattern but with completely different parameters = same context

### What does NOT justify extraction

- "This code could be reusable" (speculative reuse)
- "This looks like a common pattern" (only 1 occurrence)
- "I want clean architecture" (premature abstraction)
- "This would make a nice generic component" (designer vanity)

### Extraction targets

| Code pattern | Extraction target |
|---|---|
| Repeated scene layout (backdrop + content + caption) | Design primitive (layout) |
| Repeated visual element (cards, labels) | Component |
| Repeated animation pattern (enter + emphasis) | Design primitive (motion) |
| Repeated SVG decoration (ring, line, flow) | Design primitive (svg) |
| Repeated data visualization (chart, gauge) | Component |

### Example: NQ57 extraction history

| Pattern | Occurrences | Action |
|---|---|---|
| fadeUp(frame, delay, fps) | 7 scenes | Extracted to design/motion/fadeUp.ts |
| RingDraw animated circle | 3 scenes | Already in design/svg/RingDraw.tsx |
| CardBlock glassmorphism card | 3 scenes | Extracted to components/CardBlock.tsx |
| EmblemBox 3D wrapper | 1 scene | Kept in template helpers.tsx |
| Custom bars animation | 1 scene | Kept in template helpers.tsx |

---

## 5. Visual Methodology

The core principle: **visual primitives replace imagery selectively to create visual identity.**

### The Formula

```
Typography + Icon/SVG/Shape + Motion + Composition + Transition = Visual Storytelling
```

### Each element has a role beyond its surface function

**Typography is not just caption.**
- Hero text = visual anchor, establishes hierarchy
- Section labels = structural markers, guide the eye
- Kinetic text = motion-driven narrative element
- Gradient text = color identity, brand expression
- Karaoke = temporal synchronization, guides attention

**SVG is not just decoration.**
- RingDraw = progress indicator, completion metaphor
- LineDraw = connection, separation, emphasis
- FlowLine = movement, continuity, data flow
- Gauge = measurement, achievement, comparison

**Motion is not just fade-in.**
- fadeUp = entrance, appearance, introduction
- stagger = sequence, order, hierarchy
- spring = weight, physicality, natural feel
- counter = accumulation, growth, achievement

**Layout is not just CSS.**
- Alignment = order, professionalism
- Spacing = breathing room, hierarchy
- Grouping = relationships, categories
- Density = information weight, visual tempo

**Transition is not just scene change.**
- Fade = passage of time, soft change
- Slide = spatial movement, direction
- Wipe = reveal, uncovering
- Cut = urgency, immediacy

### How visual identity is created

Each template makes different choices about these primitives:

| Choice | Template A (editorial) | Template B (infographic) |
|---|---|---|
| Typography role | Hero (large, centered) | Supporting (small, labels) |
| SVG role | Minimal (underlines only) | Structural (rings, gauges, flows) |
| Motion style | Slow, weighted springs | Fast, snappy springs |
| Layout density | Sparse (white space) | Dense (data-rich) |
| Color usage | Monochrome + 1 accent | Multi-color palette |
| Transition | Fade (soft) | Slide (spatial) |

The engine supports all these variations. The template makes the choices.

---

## 6. UI/UX Influence

Frontend/UI/UX principles are applied selectively to video.

### Principles that apply

- **Hierarchy:** Visual weight guides the eye (title > data > supporting)
- **Spacing:** Consistent padding/margins create rhythm
- **Grids:** Alignment systems create order
- **Cards:** Grouped content with visual boundaries
- **Progressive disclosure:** Reveal complexity gradually (scene by scene)
- **Visual states:** Different states for different importance levels
- **Consistency:** Same element types look the same across scenes
- **Interaction-inspired motion:** Motion that references physical interaction

### Principles that do NOT apply

- **Interactivity:** Video is linear, not clickable
- **Hover states:** No mouse in video
- **Scrolling:** No scroll in video
- **Responsive design:** Fixed resolution per composition
- **Form inputs:** No user input in video

### The boundary

Video borrows from UI/UX for visual quality, but does not become interactive UI.

Motion serves storytelling, not interaction. A gauge animates to show data achievement, not to respond to a user clicking it. A card appears with spring physics to add visual weight, not to indicate it is clickable.

**Rule:** If an element would only make sense with user interaction, it does not belong in video.

---

## 7. Template Style Freedom

The engine supports drastically different visual styles. Templates are NOT required to look alike.

### Example: Five different template styles

**Template A: Editorial / Typography-heavy**
- Large hero text, minimal SVG, slow fade transitions
- Sparse layout, monochrome + 1 accent color
- Motion: gentle fadeUp, slow spring
- Use case: thought leadership, brand storytelling

**Template B: Infographic / Data-driven**
- Dense data layout, heavy SVG (rings, gauges, flow lines)
- Multi-color palette, cards, charts
- Motion: counter animations, staggered entrance
- Use case: reports, statistics, policy summaries

**Template C: Kinetic Typography**
- Text is the primary visual element
- No imagery, no SVG decoration
- Motion: word-by-word reveal, scale, rotation, blur
- Use case: quotes, manifestos, poetry, emphasis

**Template D: Minimal / Premium**
- Lots of white space, thin lines, subtle motion
- Monochrome or duotone palette
- Motion: slow fade, minimal entrance
- Use case: luxury brands, premium products, elegance

**Template E: Technical / Diagrammatic**
- SVG-heavy: flowcharts, diagrams, connection lines
- Structured layout, grid-based
- Motion: line-draw, node-by-node reveal
- Use case: technical documentation, engineering, architecture

### What they share

Despite radically different appearances, all five templates share:

- Same Design System (typography, SVG, motion, layout, transitions)
- Same Component System (CardBlock, SectionLabel, GradientText)
- Same Template Contract (SceneDef, theme injection, timing ownership)
- Same Validation Pipeline (typecheck, render, dependency checks)
- Same Directory Structure (template-id/, scenes/, helpers.tsx)

**The engine does not constrain visual style. The template defines visual identity.**

---

## 8. AI Template Workflow

Step-by-step workflow for AI-assisted template creation.

### Phase 1: Discovery

```
Brief (from R1 or human)
  -> Content analysis (scene count, types, data)
  -> Visual direction (mood, color, typography role)
  -> Component mapping (which existing components fit)
  -> Primitive audit (what exists, what is missing)
```

### Phase 2: Specification

```
Scene specification (SceneDef[] with timing)
  -> Theme definition (color palette, font selection)
  -> Motion plan (enter, emphasis, exit per scene)
  -> Transition plan (type, duration between scenes)
```

### Phase 3: Implementation

```
Create template directory structure
  -> Implement theme file
  -> Implement font loader
  -> Implement data file (SceneDef[])
  -> Implement scene components (using existing primitives)
  -> Implement template root (ThemeProvider + TransitionSeries)
  -> Implement composition (thin wrapper)
  -> Register in Root.tsx
```

### Phase 4: Validation

```
Typecheck (npx tsc --noEmit)
  -> Still render (frame 0)
  -> Short render (5 seconds)
  -> Visual review (screenshot comparison)
  -> Dependency direction check (no upward imports)
```

### Phase 5: Refinement

```
Identify visual issues from render review
  -> Adjust timing, spacing, colors (in template/theme, NOT in design)
  -> Re-render and re-review
  -> Iterate until satisfied
```

### Rules for AI

1. **Do NOT create new primitives** if existing ones meet the need.
2. **Do NOT modify Design layer** to accommodate a specific template.
3. **Do NOT modify other templates** when creating a new one.
4. **If a primitive is missing:**
   - Identify the gap (what capability is missing?)
   - Prove reusable need (would template #2 or #3 also use this?)
   - If proven: extend Design System with new primitive
   - If not proven: keep it template-specific in helpers.tsx
5. **Always validate** before handing off (typecheck + render).
6. **Always document** key decisions in the handoff.

---

## 9. Validation Contract

Every template must pass this validation pipeline before merge.

### 9.1 Typecheck

```bash
npx tsc --noEmit
```

Must pass with zero errors.

### 9.2 Dependency Direction Check

Verify no upward or cross-layer imports:

```
COMPOSITIONS -> TEMPLATES -> COMPONENTS -> DESIGN -> CORE -> REMOTION
```

No violations. Use import statements to verify:
- Templates import from: components/, design/, remotion
- Components import from: design/, remotion
- Design imports from: remotion only
- Core imports from: remotion only

### 9.3 Deterministic Render

```bash
npx remotion still src/index.ts {CompositionId} out/test.png --log=error
```

Must produce a valid image with no errors.

### 9.4 Template Contract Compliance

- [ ] SceneDef[] uses correct interface (id, audio, caption, dur)
- [ ] Theme uses semantic color names (primary, secondary, tertiary)
- [ ] No hardcoded colors in scene components
- [ ] No useCurrentFrame in component files (only in scene files)
- [ ] No imports from other templates
- [ ] Composition is thin (registration + duration only)

### 9.5 Scene Timing Validation

- [ ] Each scene has a defined duration (SceneDef.dur)
- [ ] Total duration matches sum of scene durations + transitions
- [ ] No scene exceeds reasonable length (typically < 30 seconds)

### 9.6 No Template-Specific Leakage

- [ ] Design primitives have no template-specific code
- [ ] Components have no template-specific knowledge
- [ ] Core has no visual knowledge

---

## 10. Directory Structure

Standard directory layout for every template:

```
src/
  theme/
    {template-id}.ts          Theme configuration
  fonts/
    {template-id}.ts          Font loading
  data/
    {template-id}.ts          SceneDef[] array
  templates/
    {template-id}/
      index.tsx               Template root (ThemeProvider + TransitionSeries)
      helpers.tsx             Template-specific helpers (NOT shared)
      scenes/
        index.ts              Scene registry (map of scene IDs to components)
        Scene1.tsx            Scene component
        Scene2.tsx
        ...
  compositions/
    {TemplateId}Video.tsx     Composition (thin wrapper)
  Root.tsx                    Entry point (registers compositions)
```

### File purposes

| File | Purpose | Shared? |
|---|---|---|
| theme/{id}.ts | Color palette, font config | Yes (Theme type) |
| fonts/{id}.ts | Font loading (@remotion/google-fonts) | No (per template) |
| data/{id}.ts | Scene definitions (SceneDef[]) | No (per template) |
| templates/{id}/index.tsx | Template root component | No (per template) |
| templates/{id}/helpers.tsx | Template-specific utilities | No (per template) |
| templates/{id}/scenes/*.tsx | Scene visual components | No (per template) |
| templates/{id}/scenes/index.ts | Scene ID to component mapping | No (per template) |
| compositions/{Id}Video.tsx | Remotion composition registration | No (per template) |

### Rules

- Each template has its own directory under templates/
- Template-specific code stays in the template directory
- Shared code (components, design) stays in its own layer
- Data, theme, and fonts are in shared top-level directories
- Compositions are thin wrappers that wire everything together
