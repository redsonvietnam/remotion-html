# Project Rules — Universal Constraints

Applies to ALL templates, productions, topics, and workstreams.

---

## 1. Data ↔ Template Layering Boundary

**Rule:** Data layer MUST NOT import from template layer.

```
src/data/contract.ts  ← single source of truth (types + validation)
       ↑                    ↑
src/data/*.ts          src/templates/*/types.ts (re-exports only)
       ↑                    ↑
src/templates/*/scenes/*.tsx (import from ../types)
```

- Production data files import types from `contract.ts` (or re-export via template types)
- Templates re-export types from `contract.ts` — NEVER define content types locally
- Templates NEVER import production data files (e.g., `baoHiem2024.ts`, `luatBHXH.ts`)
- Reverse dependency (template → data) is a hard violation

---

## 2. Reusable Template Genericity

**Rule:** Templates must be generic — no production-specific defaults.

- Template component accepts `scenes`, `content`, `theme` as REQUIRED props
- NO defaultProps in template that reference a specific production
- `Root.tsx` wires production via Composition `defaultProps`
- Scene kinds defined in `contract.ts` → `TEMPLATE_SCHEMAS[template]`
- Adding a production = new data + theme + Composition; NO template code changes

---

## 3. Inspect Before Create

**Rule:** Before adding new visual/motion/typography capability:

1. Search `src/design/*`, `src/templates/*/svg`, `src/templates/*/helpers`
2. Reuse or extend existing primitives
3. Only create new if capability genuinely doesn't exist

---

## 4. Required Validation Gates

**Rule:** Every production change must pass ALL:

```bash
npx tsc --noEmit
npm test
npm run verify
node scripts/validate.mjs --project <id> --check-assets --check-durations
```

Render validation (when assets exist):
```bash
npx remotion render src/index.ts <Composition> out/<id>.mp4
```

---

## 5. AI Workstream Bootstrap

**Rule:** Every AI agent starting a workstream MUST first read:

1. `docs/PROJECT-RULES.md`
2. `docs/PROJECT-KNOWLEDGE.md`

Then inspect current HEAD (`git log --oneline -1`) before proposing changes.

---

## 6. Renderer Boundary

**Rule:** Remotion hooks are ONLY allowed in adapter files.

- `useCurrentFrame`, `useVideoConfig` — ONLY in `RemotionScenes.tsx` (or equivalent adapter)
- Data components receive `frame`/`fps` as props — NEVER call hooks
- `AbsoluteFill`, `interpolate`, `spring` from remotion are acceptable in data components (pure functions)
- Preview adapter computes frame/progress from its own clock, passes as props
- Violation: any data component importing `useCurrentFrame` or `useVideoConfig`

---

## 7. Design Model Contract

**Rule:** Shared motion must be deterministic and renderer-agnostic.

- Motion primitives: `(ctx: FrameContext, ...args) => result`
- Must NOT call `useCurrentFrame()`, `useVideoConfig()`, or any React hook
- Must NOT depend on Remotion
- Accept timing information through explicit arguments/context
- `FrameContext`: `{ frame, fps, progress }` — canonical time unit

---

## 8. Template sceneFrames Import

**Rule:** Templates must import `sceneFrames` from `contract.ts`, not from production data.

- `contract.ts` exports `sceneFrames` as canonical conversion function
- Templates must NOT import from production data files (e.g., `nq57.ts`, `cr7Records.ts`)
- This ensures templates remain production-agnostic
- Violation: `import { sceneFrames } from "../../data/nq57"` in a template file

---

## 9. Preview/Remotion Duplication Boundary

**Rule:** Preview Studio scene renderers are intentionally separate from Remotion scene components.

- Preview (`preview/studio.jsx`) and Remotion (`src/templates/*/scenes/`) are independent implementations
- Both share the same frame model (`sceneFrames`) but share zero rendering code
- This duplication is intentional: Preview must work standalone (no npm, no build)
- Do NOT attempt to unify Preview and Remotion rendering code
- Do NOT import from `src/` in Preview files
- Frame model must remain consistent: `Math.ceil((dur + 0.5) * FPS)` everywhere
- Format metadata in Preview (`TEMPLATE_FORMATS`) must stay consistent with `TEMPLATE_SCHEMAS` in contract.ts

---

## 10. Legacy Template Technical Debt

**Rule:** Legacy templates (nq57, stoicLove, blueprint) have known architectural violations.

- Scene components directly call `useCurrentFrame()`/`useVideoConfig()` (Rule #6 violation)
- Helpers (`Backdrop`) call hooks
- Types defined in production data files (Rule #1 violation)
- No `RemotionScenes.tsx` boundary file
- **Decision:** Do not refactor legacy templates unless a production requires it
- These violations are documented in PROJECT-KNOWLEDGE.md (Entry #37)
- New templates MUST follow the clean architecture (nodeflow/cr7/cosmos pattern)

---

## 11. Template Library Data Consistency

**Rule:** Library page data must stay consistent with canonical sources.

- `preview/library.html` contains duplicated `TEMPLATES` and `PRODUCTIONS` arrays
- Canonical sources: `TEMPLATE_SCHEMAS` in `contract.ts`, `TEMPLATE_FORMATS` in `studio.jsx`
- When adding a new template or production, update BOTH `library.html` AND `studio.jsx`
- Data consistency is validated by `src/__tests__/templateLibrary.vitest.ts`
- Library page is standalone HTML (no build) — data is inline, not imported
- Template statuses (`ready`/`legacy`) are library-only metadata, not in contract.ts

---

## 12. Creator Shell Boundary

**Rule:** Creator Shell sets context only — no editing, no rendering, no production creation.

- Creator reads `?template=<id>` from URL, validates against known templates
- "Use Template" creates creator context (template, format, name) — NOT a production
- "Continue" routes to Editor (`preview/editor.html?template=<id>&format=<fmt>&name=<name>`)
- Demo productions remain independent — never become the "selected video"
- Legacy templates (nq57, stoiclove, blueprint) are preview-only in creator
- Creator data (TEMPLATES) duplicated from library — same standalone HTML pattern
- Composer/editor integration is DEFERRED — creator is a shell only

---

## 13. Creator Editor Boundary

**Rule:** Editor manages project state with real preview — no MP4 export, no audio editing, no production mutation.

- Editor creates/modifies editable project objects (template + scenes + content)
- Content editing is text-only in MVP — structured data (nodes, edges, lists) is read-only
- Scene management is CRUD + reorder — no scene composition or sub-scene nesting
- Preview renders real template visuals (static, no animation) via THEMES + RENDERERS registries
- Preview scale: CSS transform from 1920×1080 to editor canvas size
- Fallback renderer for unsupported scene kinds (documented, shows "Preview not available")
- Persistence is localStorage only — no server, no file system, no database
- Legacy templates are rejected — editor only works with editable templates (scrapbook, cr7, cosmos, nodeflow)
- Editor data (TEMPLATES) duplicated from library — same standalone HTML pattern
- No universal scene schema — each template defines its own scene kinds and fields
- No MP4 export — editor is state-only; rendering delegated to Preview Studio
- No production mutation — editor projects are independent copies, canonical data untouched
- Content immutability — all mutations create new objects
- Kind switching rejects invalid kinds (not in template's sceneKinds)
- No Composer UI (drag/drop, audio upload, TTS, AI generation) — DEFERRED

---

## 14. Composer Boundary

**Rule:** Composer is the state editor for new projects; Preview Studio is the animation renderer.

- Composer creates/modifies project objects (template + scenes + content + audio reference)
- Composer uses real static preview renderers (THEMES + RENDERERS registries)
- Composer serializes project to localStorage for Studio handoff
- Studio loads Composer projects via `?project=<id>` URL param + `nf_studio_project` localStorage
- Composer does NOT render animations — only static previews
- Composer does NOT handle audio playback — only stores audio path references
- Composer does NOT export MP4 — rendering delegated to Preview Studio
- No universal scene schema — each template defines its own scene kinds and fields
- Content immutability — all mutations create new objects
- Audio is reference-only (path string) — no upload, no playback in Composer
- Kind switching rejects invalid kinds (not in template's sceneKinds)