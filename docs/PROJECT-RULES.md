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