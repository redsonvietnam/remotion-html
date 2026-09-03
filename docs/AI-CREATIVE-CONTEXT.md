# AI Creative Context

Primary context file for visual template design work.

## A. Creative North Star

This project is NOT trying to make:

- Generic presentation slides
- Repeated colored cards with different palettes
- Static infographic panels
- NQ57 clones with swapped colors
- Template-factory content that looks interchangeable

This project IS trying to make:

- Cinematic code-generated visuals
- Frontend-quality visual composition
- SVG/icon-based visual storytelling
- Typography as a first-class composition element
- Purposeful motion that carries meaning
- Meaningful entrance/exit animations
- Smooth transitions that connect scenes
- Visual metaphors that reinforce the narrative
- Procedural graphics where useful
- Spatial hierarchy that guides the eye
- Rhythm and pacing in visual flow
- Composition that feels intentional
- Visual continuity across scenes
- Strong opening and closing moments

The goal is video that looks like it was designed by a motion designer, not assembled from a slide template.

## B. Reference: StoicLove

**StoicLove is the strongest current creative reference.**

Location: `src/templates/stoicLove/`

Why it is a reference:

- **Custom SVG vocabulary** — HeartShape, ControlOrbital, OrbitField, ImpermanenceCycle, InnerCore, OpenHand, FreedomOrbit, StoicSymbol (in `svg/visuals.tsx`)
- **Visual metaphor system** — orbits represent control, separation represents impermanence, inner core represents self
- **Scene-specific visual language** — each scene has its own visual treatment, not a color-swapped version of the same card
- **Motion-driven storytelling** — animation carries meaning, not just decoration
- **Continuity** — visual elements evolve across scenes, creating narrative flow
- **Separation from generic card layouts** — no borders, no centered text blocks, no bullet-point visuals
- **SVG as image replacement** — procedural visuals replace what would otherwise be stock photos

**StoicLove is a reference, NOT a template to copy.**

Do not recreate StoicLove's visual vocabulary for a different topic. Instead, understand the *principles* and invent a new visual grammar for each new template.

## C. Creative Freedom

Future template designers are encouraged to invent their own visual grammar.

Possible building blocks:

- Custom SVG systems
- Icon libraries (used compositionally)
- Geometric/abstract shape systems
- Data diagrams
- Kinetic typography
- Grid-based layouts
- Particle systems
- Procedural graphics
- Abstract visual metaphors
- Charts used as visual elements (not just data display)
- Spatial UI metaphors
- Cinematic transitions
- Any other code-generated visual technique

Do NOT prescribe a fixed scene layout. Each template should discover its own structure that serves its content.

## D. Image Replacement Principle

We intentionally minimize dependency on external images.

Reasons:
- Saves tokens (no image generation API calls)
- Maintains deterministic rendering
- Keeps the codebase self-contained
- Avoids licensing issues

The absence of images is NOT a reason for visually boring scenes.

Instead, visual information should be reconstructed using code:
- SVG for illustrations, icons, diagrams, metaphors
- Typography for emphasis, hierarchy, rhythm
- Motion for attention, transitions, narrative beats
- Layout for spatial relationships
- Color/gradient for mood and atmosphere
- Procedural generation for textures, patterns, abstract visuals

## E. Typography

Typography is a first-class visual asset in this system.

It should be used for:
- **Hierarchy** — size, weight, spacing establish importance
- **Rhythm** — typographic pacing creates visual tempo
- **Emphasis** — selective highlighting draws attention
- **Transitions** — text reveal animations create narrative flow
- **Data** — numbers, statistics, labels as visual elements
- **Narrative beats** — timing text appearance with audio

Do not treat text as an afterthought. In a code-generated video system, typography IS the primary visual language.

Available typography tools in `src/design/typography/`:
- `Text.tsx` — styled text component
- `WordReveal.tsx` — word-by-word reveal animation
- `KaraokeReveal.tsx` — synced narration highlight
- `Counter.tsx` — animated number counter
- `useWordTimings.ts` — word-level timing hook
- `useFadeIn.ts` — fade-in animation hook

## F. Quality Bar

A new template should be recognizably different from NQ57.

**A palette change alone is NOT a new template.**

A template should introduce a new visual grammar — different scene structure, different visual elements, different motion language, different compositional approach.

If a new production can use the NQ57 template with only palette/content changes, it does not need a new template. But if the content demands a different visual treatment, that is when a new template should be created.

The test: "Could someone tell which template this video uses without seeing the title card?" If the answer is "no, it looks like all the others," the template needs more differentiation.

## G. NodeFlow Template (New)

**Visual Grammar**: Blueprint engineering grid, node-edge network diagrams, electric cyan signal flow, amber data badges, system node orbits.

**Location**: `src/templates/nodeflow/`

**Components**:
- SVG primitives: `GridBackground`, `NodeBox`, `EdgeLine`, `SignalPulse`, `DataBadge`, `SystemNode`, `ProgressBar` (in `svg/visuals.tsx`)
- Motion helpers: `nodeIn`, `textIn`, `reveal`, `edgeDraw`, `Backdrop`, `SceneContainer`, `SectionLabel`, `SignalIndicator` (in `helpers.tsx`)
- Scene registry: 6 scenes (title, flow, contribution, benefit, compare, end)

**Creative Principles Applied**:
- Custom SVG vocabulary (not borrowed from NQ57 or StoicLove)
- Procedural visual metaphors: network topology = social insurance system
- Motion carries meaning: edges draw = money flow, signal pulses = system activity
- Typography as data display: amber badges for percentages, mono for rates
- No external images, no card layouts

**Production**: BaoHiem2024 (Luật 41/2024/QH15)
