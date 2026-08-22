# AI Context — Global Map

Compact reference for any AI agent entering this repository.

## Project Purpose

Vietnamese public-information video production system using Remotion (video-as-code). Produces explainer videos from topics with fact-checked content, Vietnamese TTS narration, and deterministic rendering.

## Technical Architecture

```
Topic → Storyboard → Data File → TTS → Validation → Render → Preview
```

Single Remotion codebase, multiple production lines, shared design system.

## Key Directories

| Path | Purpose |
|------|---------|
| `src/` | Application source (95 files) |
| `src/templates/` | Visual templates (nq57, stoicLove) |
| `src/data/` | Production content data + contract schema |
| `src/theme/` | Per-production color/font themes |
| `src/design/` | Shared design system (theme, motion, typography, layout, transition, svg) |
| `src/components/` | Shared UI components (SectionLabel, GradientText, CardBlock) |
| `src/compositions/` | Composition wrappers (one per production) |
| `scripts/` | Pipeline tools (manifest, produce, validate, verify) |
| `preview/` | Standalone browser preview server |
| `docs/` | Documentation |
| `public/` | Generated TTS audio (gitignored) |
| `out/` | Rendered MP4 output (gitignored) |

## Current Templates

| Template | Resolution | Scenes | Used By |
|----------|------------|--------|---------|
| `nq57` | 1920×1080 | title, quote, roles, pillars, stats, vision, end | nq57, dean06, nq79, canCuoc, luatGTDB |
| `stoicLove` | 1080×1920 | hook, statement, split, concept, impermanence, ending | stoicLove |

## Current Production Lines (6)

| ID | Template | Composition | Data File | TTS Script | Output |
|----|----------|-------------|-----------|------------|--------|
| nq57 | nq57 | NghiQuyet57V2 | `src/data/nq57.ts` | `gen_tts_v2.py` | `out/nq57.mp4` |
| dean06 | nq57 | DeAn06 | `src/data/deAn06.ts` | `gen_tts_deAn06.py` | `out/dean06.mp4` |
| nq79 | nq57 | NghiQuyet79 | `src/data/nghiQuyet79.ts` | `gen_tts_nghiQuyet79.py` | `out/nghiQuyet79.mp4` |
| stoiclove | stoicLove | StoicLove | `src/data/stoicLove.ts` | `gen_tts_stoicLove.py` | `out/stoicLove.mp4` |
| canCuoc | nq57 | CanCuoc | `src/data/canCuoc.ts` | `gen_tts_canCuoc.py` | `out/canCuoc.mp4` |
| luatGTDB | nq57 | LuatGTDB | `src/data/luatGTDB.ts` | `gen_tts_luatGTDB.py` | `out/luatGTDB.mp4` |

## Content/Data Contract

`src/data/contract.ts` defines:
- `SceneDef` — base scene metadata: `{ id, audio, caption, dur }`
- `TEMPLATE_SCHEMAS` — per-template allowed scene kinds + required text fields
- `validateProductionData()` — validates data files against template schema
- `checkAudioAssets()` — verifies audio files exist
- `checkAudioDurations()` — verifies `0 < audioDuration ≤ sceneDuration`

Each production data file exports:
- `<NAME>_SCENES: SceneDef[]` — ordered scene list
- `<NAME>_CONTENT: Record<string, NQ57SceneContent>` — scene-specific content

## Validation Pipeline

```
scripts/validate.mjs --project <alias>
  → loads data file via esbuild
  → runs validateProductionData()
  → optional: --check-assets (audio files exist)
  → optional: --check-durations (duration timing)
```

## TTS/Audio Pipeline

Python scripts (`gen_tts_*.py`) generate:
- `public/<name>/s1.mp3` ... `sN.mp3` — narration audio
- `public/<name>/durations.json` — scene durations

Voice: `vi-VN-NamMinhNeural` (Edge TTS). All scripts support `--backend edge`.

## Preview Pipeline

- `npm run preview` → `http://localhost:4321/`
- `preview/serve.mjs` — zero-dependency HTTP server
- `preview/index.html` — tabbed browser UI for all productions

## CI Pipeline

`.github/workflows/verify.yml`:
- Triggers on push/PR to master
- Runs `npm ci` → Python TTS regen → `npm run verify`

## Important Commands

| Command | Purpose |
|---------|---------|
| `npm run verify` | Full health gate (tsc + tests + production matrix) |
| `npm test` | Unit/contract tests (vitest, 214 tests) |
| `npx tsc --noEmit` | Type safety check |
| `npm run dev` | Remotion Studio preview |
| `npm run preview` | Standalone browser preview |
| `node scripts/produce.mjs --project <alias>` | Full production pipeline |
| `node scripts/validate.mjs --project <alias>` | Content contract validation |
| `python gen_tts_<name>.py` | Generate TTS audio |

## Critical Architectural Invariants

1. **5-layer architecture**: compositions → templates → components → design → core
2. **Design must not import templates; components must not import a specific theme**
3. **Theme contract**: `accent1/accent2/accent3` semantic colors via `useTheme()`
4. **`out/` and `public/` are gitignored** — generated assets never committed
5. **`npm run verify` is the canonical health gate** — does NOT render video
6. **No external images** — visuals are code-generated (SVG, typography, motion)
7. **Vietnamese diacritics mandatory** — no fabricated quotations
8. **Deterministic rendering** — `useCurrentFrame()` only, never `useFrame()` from R3F

## Critical Files by Responsibility

| File | Role |
|------|------|
| `src/Root.tsx` | Composition registry |
| `src/index.ts` | Remotion entry point |
| `src/data/contract.ts` | Content contract schema + validation |
| `scripts/manifest.json` | Production registry + routing |
| `scripts/produce.mjs` | Production orchestrator |
| `scripts/verify.mjs` | CI verification gate |
| `scripts/validate.mjs` | Content validation CLI |
| `src/design/theme/index.ts` | `createTheme()` + theme contract |
| `src/design/motion/index.ts` | Motion utilities |
| `src/design/svg/index.ts` | SVG drawing primitives |

## Current Baseline

- **Branch**: master
- **HEAD**: `f7d70e5` (WS44 — New Topic Production Trial)
- **Productions**: 6 registered, all validated
- **Tests**: 214 passing (11 test files)
- **CI**: Active on push/PR to master

## Important Warning

Historical handoff reports (HANDOFF.md, conversation context) may contain stale information. Always verify against the actual source tree. The source code is the source of truth.
