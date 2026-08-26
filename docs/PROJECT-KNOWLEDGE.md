# Project Knowledge — Validated Decisions

Record of cross-production decisions. Statuses: CANDIDATE / ADOPTED / IMPLEMENTED / REJECTED / SUPERSEDED.

---

## 1. NodeFlow Baseline

**Status: ADOPTED**

- NodeFlow at 329f992 is the accepted generic horizontal template (1920×1080)
- Scene kinds: `title | flow | contribution | benefit | compare | end` (6)
- Visual grammar: blueprint grid, node-edge, signal pulses, amber data badges
- Production: BaoHiem2024 (Luật 41/2024/QH15) — rendered, validated, preview-wired
- Architecture: data/contract.ts ← types; template re-exports; zero production coupling

---

## 2. Blueprint Prototype

**Status: REJECTED (as template replacement)**

- Blueprint is a creative prototype/reference for legislative-document grammar
- Scene kinds: `title | pillars | measure | detail | process | seal` (6)
- Production: luatBHXH (same law as BaoHiem2024, different visual language)
- **Fatal flaw:** template imports production data, hardcoded defaults, types in luatBHXH.ts
- **Value:** Strong law-specific creative ideas (see below)

---

## 3. Blueprint Production Coupling

**Status: REJECTED (architecture pattern)**

- Template → production data import violates layering invariant
- Content types defined in production file (not neutral contract)
- Hardcoded scene/content/theme defaults in template
- Cannot be reused without duplication

---

## 4. DimensionLine (Blueprint → NodeFlow)

**Status: CANDIDATE**

- Proportional before/after dimension lines for policy change metrics
- Maps to NodeFlow `compare` scene kind (before/after)
- Actionable: implement as reusable SVG primitive in `src/design/svg/`

---

## 5. TimelineTrack (Blueprint)

**Status: CANDIDATE**

- Milestone nodes lighting up sequentially along a track
- Maps to NodeFlow `flow` or new `timeline` scene kind
- **Hold:** Do not implement until a real production needs legislative history

---

## 6. Snap / Settle / Drift Motion Vocabulary

**Status: CANDIDATE**

- Blueprint's `sp()` presets (snap, settle, drift) + `gridDrift` are semantic names
- Do NOT copy spring values directly
- Actionable: add named motion presets to `src/design/motion/` if gap exists

---

## 7. GridDrift / Blueprint Atmosphere

**Status: REJECTED (extraction)**

- Persistent grid drift across scenes + vignette + deep navy bg2
- Blueprint-specific visual system (document register)
- Do not extract — belongs to Blueprint visual language

---

## 8. SignalPulse

**Status: ADOPTED**

- Proven NodeFlow reusable pattern: animated dot traveling along edge
- Used in BaoHiem2024 for "money flow" / system activity
- Generic enough for any node-edge system explainer

---

## 9. KaraokeReveal

**Status: ADOPTED**

- Proven shared design-system pattern (src/design/typography/KaraokeReveal)
- Caption sync across ALL productions
- Single source, zero duplication

---

## 10. Creative Idea Recording Discipline

**Status: ADOPTED**

- Only record ideas with cross-production reuse potential
- Not every workstream detail
- Use PROJECT-KNOWLEDGE.md as the single registry
- CANDIDATE items need real use case before ADOPTED

---

## 11. BHXH V1 vs V2 — ADOPTED

- Same topic produced using NodeFlow (V1) and Blueprint (V2)
- Decision: Blueprint V2 preferred for law/policy storytelling because its visual grammar creates stronger narrative identity and communicates legal change more naturally
- NodeFlow remains preferred for system/network explainers
- Do not replace NodeFlow
- Use template selection based on narrative structure

---

## 12. Caption Word Count Budget

**Status: ADOPTED**

- Preferred: 4–7 words per chunk
- Acceptable: 8–10 when semantics demand (e.g., long legal name + identifier)
- Protected unit exception: 3 words allowed (e.g., "Theo Điều 64,")
- Hard maximum: 10 words (override for protected units only)
- Break signals must be contextual: conjunctions only break when starting new clause

---

## 13. Protected Semantic Units

**Status: ADOPTED**

- Vietnamese captions require protected spans that must not be split across chunks
- Categories: dates, law names+identifiers, legal refs, number+unit compounds, proper nouns, domain terms
- Detection via `PROTECTED_UNIT_PATTERNS` regex array in `useWordTimings.ts`
- Protected units can override word count minimum (3 words allowed)
- Overlap detection handles trailing punctuation on protected spans

---

## 14. Scored Breakpoint Selection

**Status: ADOPTED**

- Caption chunking uses scored breakpoints (0-100 scale)
- Priority: punctuation > protected boundary > conjunction > chunk balance
- Greedy left-to-right selection with hardMax override
- Known limitation: compound phrases spanning multiple words require lookahead (e.g., "có hiệu lực")
- Future improvement: bidirectional scoring or phrase-level protection

---

## 15. Blueprint Template Validation

**Status: ADOPTED**

- Blueprint template validated with BHXH V2 production (6 scenes)
- Visual grammar: blueprint grid, pillar cards, measure blocks, process steps, official seal
- Confirmed preference for law/policy storytelling (Decision #11)
- Blueprint added to template registry with ADOPTED status

---

## 16. Preview Studio Architecture

**Status: ADOPTED**

- Standalone HTML file (React 18 CDN + Babel standalone) — no build step
- Independent of Remotion — pure preview/MQA tool
- Supports multiple productions via `PRODUCTIONS` array
- Supports 16:9 and 9:16 canvas formats via `CANVAS` object
- Scene renderers are template-specific (NF_SCENES, CR7_SCENES)
- Production selector, scene selector, play/pause, scrubber, frame/time display
- Format switching changes canvas dimensions without layout recalculation
- Served via `npm run studio` (node preview/serve.mjs studio)

---

## 17. Design Model Contract

**Status: ADOPTED**

- `FrameContext`: `{ frame, fps, progress }` — canonical time unit
- `MotionPrimitive<T>`: `(ctx: FrameContext, ...args) => T` — pure function
- `CanvasSize`: `{ width, height }` — standard formats: `CANVAS_16_9`, `CANVAS_9_16`
- `PROJECT_FPS`: 30 — project-wide constant
- `DesignScene`: `{ id, kind, timing, content }` — renderer-agnostic scene
- Types are in `src/design/model/types.ts` — no React, no Remotion imports

---

## 18. Renderer Boundary

**Status: ADOPTED**

- Remotion hooks (`useCurrentFrame`, `useVideoConfig`) ONLY in `RemotionScenes.tsx` files
- Data components receive `frame`/`fps` as props — never call hooks
- Preview adapter computes frame/progress from its own clock, passes as props
- `AbsoluteFill`, `interpolate`, `spring` from remotion are acceptable in data components (pure functions/components)
- `useCurrentFrame`, `useVideoConfig` are violations in data components

---

## 19. Motion Classification

**Status: ADOPTED**

- Class A (reusable): `textIn`, `nodeIn`, `reveal`, `edgeDraw`, `countUp` — pure functions
- Class B (template-specific): `Backdrop` (blueprint grid), `LawBadge` (legal domain)
- Existing `design/motion` already covers similar patterns (fadeSlide, linearProgress)
- No extraction performed — template-local helpers work as-is
- Premature abstraction prevented: no UniversalAnimatedThing, GenericSceneEffect

---

## 20. Template vs Production Responsibilities

**Status: ADOPTED**

- **Template**: visual grammar, scene components, motion vocabulary, Remotion adapter
- **Production**: scene definitions (`SceneDef[]`), content records, theme
- **Shared design**: motion primitives, typography, layout, SVG math
- **Data contract**: `src/data/contract.ts` — single source of truth for types
- Adding a production = new data + theme + Composition; NO template code changes

---

## 21. Ronaldo Third-Template Experiment

**Status: ADOPTED**

- CR7 Records validates that Design Model is not secretly a "law video model"
- Visual language materially different from NodeFlow:
  - Dark warm background (not blueprint grid)
  - Large typography-driven statistics (not node-edge diagrams)
  - Gold/amber + red accents (not electric cyan)
  - Minimal decoration (not signal flow)
- Scene kinds: `hero`, `stat`, `milestone`, `closing` — different from NodeFlow's 6 kinds
- Same Design Model supports both templates without modification
- Template choice determines visual grammar — this is a hard coupling

---

## 22. What Is NOT Configurable

**Status: ADOPTED**

- Renderer boundary (hooks vs pure functions) — architectural invariant
- Data/template layering boundary — hard constraint
- Design Model contract — shared by all templates
- Template scene types — each template defines its own
- Content format — template-specific (NodeFlow needs flowNodes/edges; CR7 needs bigNumber/label)

---

## 23. Composer Decision

**Status: DEFERRED (revalidated)**

- Revalidated with evidence from 10 productions across 5 templates
- nq57 template: 6 productions — reuse proven
- cr7 template: 2 productions — reuse proven
- Theme handles visual customization
- Production workflow (data + Composition) is simple and proven
- No production needs to mix scene types from multiple templates
- No production needs dynamic template selection at runtime
- Deferred until a production requires cross-template scene mixing

---

## 24. Production Workflow

**Status: ADOPTED**

Proven workflow for creating a new production:

1. **Choose template** — select from registry (nodeflow, cr7, nq57, etc.)
2. **Create data file** — `src/data/<production>.ts`
   - Import `SceneDef`, `sceneFrames` from `contract.ts`
   - Import content types from `contract.ts`
   - Export `<NAME>_SCENES: SceneDef[]` (scene definitions)
   - Export `<NAME>_CONTENT: Record<string, Content>` (scene content)
3. **Create or reuse theme** — `src/theme/<name>.ts`
   - Must satisfy `Theme` interface from `design/theme`
4. **Register in Root.tsx** — add `Composition` with template, data, theme
5. **Register in contract.ts** — add template schema to `TEMPLATE_SCHEMAS` (if new template)
6. **Preview** — add to Preview Studio `PRODUCTIONS` array (if needed)
7. **Generate TTS** — edge-tts with `vi-VN-NamMinhNeural`
8. **Render** — `npx remotion render src/index.ts <Composition> out/<id>.mp4`

**What is code**: template scene components, motion primitives, Remotion adapter
**What is data**: scene definitions, content records, theme
**What is template**: visual grammar, scene kinds, motion vocabulary
**What is configurable**: theme (colors/fonts), format (16:9/9:16), content
**What is fixed**: renderer boundary, data/template layering, Design Model contract

---

## 25. CR7 Template Reuse

**Status: ADOPTED**

- CR7 template proven reusable: two productions share one template
- CR7 Records (career stats) + CR7 vs Messi (comparison) — same template code
- No template duplication required
- Adding a third CR7 production = new data file + Composition only
- Template remains untouched when adding productions

---

## 26. contract.ts Must Not Import Node.js Built-ins

**Status: ADOPTED**

- `contract.ts` is imported by data files which get bundled by webpack for Remotion
- webpack cannot resolve `node:path` or other Node.js built-ins
- Removed `import path from "node:path"` — replaced `path.isAbsolute()` with inline regex
- All `path`-dependent validation logic now lives in `scripts/validate.mjs` (esbuild, Node-only)
- Rule: `contract.ts` must never import Node.js built-ins

---

## 27. CR7 TTS Production Workflow

**Status: ADOPTED**

- TTS scripts: `gen_tts_cr7Records.py`, `gen_tts_cr7VsMessi.py`
- Voice: `vi-VN-NamMinhNeural` ( Vietnamese voice, works with English text)
- Retry logic: 3 attempts per scene (intermittent `NoAudioReceived` errors)
- Audio output: `public/cr7/s1.mp3` ... `s7.mp3`, `public/cr7vsMessi/s1.mp3` ... `s7.mp3`
- Duration metadata: `public/<id>/durations.json` (auto-generated by TTS script)
- Scene durations in data files must match actual audio durations (tolerance: 0.15s)
- Manifest: `tts` field points to the Python script; `--skip-tts` flag available

---

## 28. CR7 Full Production Pipeline

**Status: IMPLEMENTED**

- End-to-end pipeline proven for CR7 Records and CR7 vs Messi
- Data → TTS → manifest → Remotion → MP4 → Preview Studio
- Both MP4s render successfully (2181 and 2814 frames respectively)
- Template unchanged between productions — only data differs
- 10 productions now registered in manifest (8 with audio, 2 CR7 with audio)

---

## 29. Creative Studio Architecture

**Status: ADOPTED**

- Three-file architecture: `studio.html` (shell) + `studio.css` (styles) + `studio.jsx` (React app)
- Standalone HTML + React 18 CDN + Babel — no build step, no framework migration needed
- Studio Model: `Production { id, name, template, format, theme, scenes, content }`
- Template visibility: production → template relationship shown in header badge
- Format control: per-template supported formats (`TEMPLATE_FORMATS`), unsupported formats disabled
- Scene inspection: frame reset on select, progress bar per scene, duration display
- Motion inspection: frame stepping (left/right), scene jumping (up/down), keyboard shortcuts (Space, arrows, Home/End)
- Visual QA: safe-area overlay toggle, canvas dimensions indicator, FPS badge, progress percentage
- Template/production boundary: Studio knows `production → template → renderer` but never contains production-specific rendering logic
- Scene renderers: `NF_SCENES` (NodeFlow) and `CR7_SCENES` (CR7) — template-specific, co-located in JSX
- Preview is design QA only — no TTS, no MP4 render, no audio playback

---

## 30. Studio Keyboard Shortcuts

**Status: ADOPTED**

- Space: play/pause
- Left arrow: previous frame
- Right arrow: next frame
- Up arrow: previous scene
- Down arrow: next scene
- Home: jump to frame 0
- End: jump to last frame
- Scene click: select scene + reset to frame 0

---

## 31. Format Support Contract

**Status: ADOPTED**

- Each template declares supported formats via `TEMPLATE_FORMATS`
- `cr7`: 16:9, 9:16
- `nodeflow`: 16:9 only
- `nq57`: 16:9 only
- `stoiclove`: 9:16 only
- `blueprint`: 16:9 only
- `cosmos`: 16:9, 9:16
- `scrapbook`: 16:9, 9:16
- Unsupported formats are visually disabled in the Studio with explanation (tooltip)
- Switching production auto-selects a supported format if current is unsupported

---

## 32. Cosmos Third-Template Experiment

**Status: ADOPTED**

- Cosmos validates that Design Model supports space/astronomy visual language
- Visual language materially different from both NodeFlow and CR7:
  - Deep space backgrounds (#050510) — not blueprint grid, not warm dark
  - Orbital paths + constellation lines — not node-edge, not typography-only
  - Star fields + nebula accents — not signal flow, not gold/amber
  - Blue/purple palette (#3b82f6, #a855f7) — not electric cyan, not red/gold
- Scene kinds: `title`, `fact`, `compare`, `timeline`, `diagram`, `closing` — different from both NodeFlow (6) and CR7 (4)
- Template-specific helpers: `orbitalRotation`, `starTwinkle`, `constellationDraw` — unique motion vocabulary
- Format support: 16:9 + 9:16 (layout adapts to canvas)
- Same Design Model supports all 3 templates without modification

---

## 33. Template Reuse Evidence

**Status: ADOPTED**

- 4 templates now validated across 12 productions
- NodeFlow: 1 production (BaoHiem2024)
- CR7: 2 productions (CR7 Records, CR7 vs Messi) — cross-production reuse proven
- Cosmos: 1 production (Solar System)
- Scrapbook: 1 production (Champions League, 8 scenes)
- nq57: 5 productions (shared legacy template)
- All templates follow same architecture: data/contract.ts types, scene components, RemotionScenes adapter
- Template choice determines visual grammar — this is a hard coupling

---

## 34. NodeFlow sceneFrames Import Fix

**Status: IMPLEMENTED**

- NodeFlow `index.tsx` was importing `sceneFrames` from `nq57` production data
- Fixed to import from `contract.ts` (canonical source)
- Ensures templates never depend on production data files
- All 3 templates now consistently import `sceneFrames` from `contract.ts`

---

## Template Registry

| Template | Scene Kinds | Formats | Status | Productions |
|----------|-------------|---------|--------|-------------|
| nq57 | title, quote, roles, pillars, stats, vision, end | 16:9 | ADOPTED | 5 |
| stoicLove | hook, statement, split, concept, impermanence, ending | 9:16 | ADOPTED | 1 |
| nodeflow | title, flow, contribution, benefit, compare, end | 16:9 | ADOPTED | 1 |
| blueprint | title, pillars, measure, detail, process, seal | 16:9 | ADOPTED | 1 (BHXH V2) |
| cr7 | hero, stat, milestone, closing | 16:9, 9:16 | ADOPTED | 2 (CR7 Records, CR7 vs Messi) |
| cosmos | title, fact, compare, timeline, diagram, closing | 16:9, 9:16 | ADOPTED | 1 (Solar System) |
| scrapbook | hero, match, history, photo, timeline, closing | 16:9, 9:16 | ADOPTED | 1 (Champions League) |

---

## 35. Preview Studio as Visual QA Tool

**Status: ADOPTED**

- Preview Studio is a **design QA tool**, not an MP4 preview
- Purpose: inspect visual design, scene composition, motion, typography, layout without rendering
- Standalone HTML (React 18 CDN + Babel) — no build step, no Remotion dependency
- Preview and Remotion are **separate implementations** sharing the same frame model
- Duplication of scene renderers is intentional: keeps Preview standalone
- `npm run studio` → browser → visual QA → no MP4 render, no audio

---

## 36. Preview/Remotion Duplication Boundary

**Status: ADOPTED**

- Preview scene renderers (in `preview/studio.jsx`) are **independent** of Remotion scene components (in `src/templates/*/scenes/`)
- Both implement the same visual grammar for each scene kind, but share zero code
- This is intentional: Preview must work without npm dependencies or build steps
- Motion approximations in Preview (simplified spring) are acceptable for design QA
- Frame model is identical: both use `Math.ceil((dur + 0.5) * 30)` via `sceneFrames()`
- Format metadata is consistent: `TEMPLATE_FORMATS` in Preview matches `TEMPLATE_SCHEMAS` in contract.ts

---

## 37. Renderer Boundary Violations — Legacy Templates

**Status: DOCUMENTED (not fixed)**

- **New templates** (nodeflow, cr7, cosmos): clean architecture
  - Data components receive `frame`/`fps` as props
  - Remotion hooks ONLY in `RemotionScenes.tsx`
  - Types re-exported from `contract.ts`
- **Legacy templates** (nq57, stoicLove, blueprint): architectural violations
  - Scene components directly call `useCurrentFrame()`/`useVideoConfig()`
  - Helpers (`Backdrop`) call hooks
  - Blueprint SVG components call hooks (7 additional violations)
  - Types defined in production data files (not neutral contract)
  - No `RemotionScenes.tsx` boundary file
- **Decision:** Do not refactor legacy templates during this workstream
  - Legacy templates work correctly in Remotion
  - Refactoring would be a large-scale rewrite with no user-facing benefit
  - Violations are documented here as technical debt

---

## 38. Typography Hooks Boundary

**Status: ADOPTED**

- `src/design/typography/` components (`WordReveal`, `KaraokeReveal`, `Counter`) call `useCurrentFrame()`/`useVideoConfig()`
- These are **Remotion-specific** components — they cannot be used in Preview's standalone context
- `src/design/motion/` primitives are pure functions — they CAN be shared
- `src/design/svg/` components receive `progress` as prop — they CAN be shared
- The hook boundary is: typography = Remotion-specific; motion/svg/layout = renderer-agnostic

---

## 39. Fallback Renderer Policy

**Status: ADOPTED**

- `Fallback_Scene` in Preview Studio is a safety mechanism, not a design QA tool
- Three production/template families use fallback:
  - **nq57** (5 productions): quote, roles, pillars, stats, vision scenes → fallback
  - **stoicLove** (1 production): all 6 scene kinds → fallback
  - **blueprint** (1 production): pillars, measure, detail, process, seal scenes → fallback
- These are legacy templates; fallback is acceptable because:
  - nq57 and stoicLove are single-production templates with limited reuse potential
  - Blueprint is architecturally coupled to its production data
  - Dedicated renderers would not provide sufficient design QA value to justify the effort
- `SceneErrorBoundary` wraps all scene renders — catches runtime errors gracefully

---

## 40. Frame Model Consistency

**Status: ADOPTED**

- Canonical: `sceneFrames(dur) = Math.ceil((dur + 0.5) * 30)` (in `contract.ts`)
- Preview uses identical formula: `stf(s.dur + 0.5)` where `stf = s => Math.ceil(s * 30)`
- Both map `frame → progress` linearly: `progress = frame / (totalFrames - 1)`
- Spring motion is approximate in Preview (simplified damping) but structurally correct
- No second timing model introduced — frame is the canonical time unit everywhere

---

## 41. Scrapbook Template

**Status: IMPLEMENTED**

- Visual grammar: aged paper, handwritten annotations, Polaroid cards, tape effects, VOX editorial overlays, chapter bar, page-turn transitions
- Scene kinds: `hero | match | history | photo | timeline | closing` (6)
- Production: Champions League (1997-2005 era) — 8 scenes, rendered, validated, preview-wired
- Architecture: `contract.ts` → types; `templates/scrapbook/` → clean template; zero production coupling
- Components: `PaperBg` (paper texture), `ChapterBar` (progress), `Polaroid` (photo cards), `Trophy` (sticker)
- Motion: `highlightSwipe`, `handwrittenReveal`, `polaroidIn`, `tapeIn`, `trophyBounce`, `pageIn`
- 16:9 primary format; 9:16 adaptation enabled via `TEMPLATE_FORMATS`
- 22 regression tests in `scrapbookArchitecture.vitest.ts`
- Preview Studio: all 6 scene renderers with editorial styling, format switching support
- TTS generation: `gen_tts_championsLeague.py` using `vi-VN-NamMinhNeural` voice
- Audio files: `public/championsLeague/s1.mp3` ... `s8.mp3` (real TTS, not placeholders)
- Duration metadata: `public/championsLeague/durations.json` (auto-generated by TTS script)
- Scene durations in `championsLeague.ts` updated to match actual audio durations

---

## 42. Template Library Architecture

**Status: IMPLEMENTED**

- Entry point: `preview/library.html` — standalone HTML (React 18 CDN + Babel, no build step)
- Purpose: "Template Library → Preview → Create" discovery experience
- Shows all 7 templates with metadata: name, description, formats, scene kinds, status
- Shows demo productions grouped by template (13 total)
- Clicking a production navigates to `studio.html?production=<id>` for preview
- Navigation: Library ↔ Studio via header links; Library is default route (`/`)
- Data model: `TEMPLATES` and `PRODUCTIONS` arrays duplicated in library.html (same pattern as Studio)
- Data consistency enforced by `src/__tests__/templateLibrary.vitest.ts`
- Template statuses: `ready` (full renderer + demo), `legacy` (fallback renderer)
- Champions League is canonical demo for Scrapbook template (16:9 + 9:16)
- Composer integration is DEFERRED — library shows templates and links to Studio only

---

## 43. Creator Shell Architecture

**Status: IMPLEMENTED**

- Entry point: `preview/creator.html` — standalone HTML (React 18 CDN + Babel, no build step)
- Purpose: "Use this template" → new video context creation
- Flow: Library → Template Card → USE THIS TEMPLATE → Creator Shell
- Reads `?template=<id>` from URL, validates template exists and status
- Ready templates: format selector, video name input, Continue button
- Legacy templates: "Preview only" message, demo production links only
- "Continue" routes to Editor (`preview/editor.html?template=<id>&format=<fmt>&name=<name>`)
- Creator context is independent of demo productions (Champions League is never the "selected production")
- Demo productions linked separately via "Preview Demo" section → Studio
- Default video name: "Untitled <Template Name> Video"
- Default format: first supported format of the template
- No persistence (URL state only), no Composer, no editor

---

## 44. Creator Editor MVP

**Status: IMPLEMENTED**

- Entry point: `preview/editor.html` — standalone HTML (React 18 CDN + Babel, no build step)
- Purpose: editable project state for new videos created via Creator Shell
- Flow: Library → USE THIS TEMPLATE → Creator → Continue → Editor → Preview
- Reads `?project=<id>` or `?template=<id>&format=<fmt>&name=<name>` from URL
- New project: creates from template params, initializes default scenes with empty content
- Existing project: loads from localStorage by project ID
- Project schema: `{ id, name, templateId, format, scenes[], createdAt, updatedAt }`
- Scene schema: `{ id, kind, dur, content{} }` — content fields are template-specific
- Editable templates: scrapbook, cr7, cosmos, nodeflow — full scene kind + field definitions
- Legacy templates: nq57, stoiclove, blueprint — rejected (not editable)
- Scene management: select, reorder (move left/right), duplicate, delete, add new
- Content editing: text fields per scene kind, duration, kind switching
- Kind switching: preserves matching fields, clears fields not in new kind
- Duration: minimum 0.5s enforced
- Persistence: localStorage (`nf_editor_projects`, `nf_editor_current`)
- Preview: real template renderers (static, no animation) scaled to editor canvas via CSS transform
- Preview renderers: THEMES (per-template colors), RENDERERS (per-template per-kind static renderers)
- Preview scale: 1920×1080 → 480×270 (16:9) or 1080×1920 → 270×480 (9:16) via CSS transform
- Fallback renderer for unsupported scene kinds shows scene kind + title + "Preview not available"
- 86 data model tests: `src/__tests__/creatorEditor.vitest.ts`
- Editor data (TEMPLATES) duplicated from library — same standalone HTML pattern
- Kind switching rejects invalid kinds (not in template's sceneKinds)
- Content immutability: all mutations create new objects, never mutate originals