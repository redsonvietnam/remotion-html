# AI Architecture Map

Compact dependency and navigation map for the codebase.

## Entry Points

| File | Role | Used By |
|------|------|---------|
| `src/index.ts` | Remotion entry — `registerRoot(Root)` | Remotion CLI |
| `src/Root.tsx` | Composition registry — 6 compositions | `src/index.ts` |

## Composition → Template → Data Flow

```
src/Root.tsx
  ├── NghiQuyet57V2 → NQ57Template + nq57 SCENES/CONTENT (no props, hardcoded)
  ├── DeAn06 → NQ57Template + deAn06 SCENES/CONTENT + deAn06 theme
  ├── NghiQuyet79 → NQ57Template + nghiQuyet79 SCENES/CONTENT + nghiQuyet79 theme
  ├── StoicLove → StoicLoveTemplate + stoicLove SCENES/CONTENT + stoicLove theme
  ├── CanCuoc → NQ57Template + canCuoc SCENES/CONTENT + canCuoc theme
  └── LuatGTDB → NQ57Template + luatGTDB SCENES/CONTENT + luatGTDB theme
```

## Template Map

### nq57 template (`src/templates/nq57/`)

```
index.tsx — NQ57Template component
  ├── helpers.tsx — SafeContainer, LightSweep, BlurReveal, etc.
  └── scenes/index.tsx — switch(content.kind) dispatcher
        ├── TitleScene.tsx
        ├── QuoteScene.tsx
        ├── RolesScene.tsx
        ├── PillarsScene.tsx
        ├── StatsScene.tsx
        ├── VisionScene.tsx
        └── EndScene.tsx
```

Scene kinds: `title | quote | roles | pillars | stats | vision | end`

### stoicLove template (`src/templates/stoicLove/`)

```
index.tsx — StoicLoveTemplate component
  ├── helpers.tsx — SafeContainer, LightSweep, BlurReveal, SilhouettePair, etc.
  ├── scenes/index.tsx — switch(content.kind) dispatcher
  │     ├── HookScene.tsx
  │     ├── StatementScene.tsx
  │     ├── SplitScene.tsx
  │     ├── ConceptScene.tsx
  │     ├── ImpermanenceScene.tsx
  │     └── EndingScene.tsx
  └── svg/
        ├── index.ts — barrel export
        ├── visuals.tsx — HeartShape, ControlOrbital, OrbitField, etc.
        └── motion.ts — rot(), orbital animations
```

Scene kinds: `hook | statement | split | concept | impermanence | ending`

## Design System (`src/design/`)

```
src/design/
  ├── theme/        — createTheme(), ThemeProvider, useTheme(), types
  ├── motion/       — fadeSlide(), stagger(), timing utilities
  ├── typography/   — Text, WordReveal, KaraokeReveal, Counter, useWordTimings
  ├── layout/       — Container, Stack, Row
  ├── transition/   — transition helpers, types
  └── svg/          — PathDraw, LineDraw, FlowLine, RingDraw
```

Dependencies flow: templates → design/* → React/Remotion

## Data Layer

```
src/data/
  ├── contract.ts     — SceneDef, TEMPLATE_SCHEMAS, validateProductionData()
  ├── nq57.ts         — NQ57_SCENES + NQ57_CONTENT (exports FPS, TAIL, sceneFrames)
  ├── deAn06.ts       — imports from nq57.ts, exports DE_AN06_SCENES + DE_AN06_CONTENT
  ├── nghiQuyet79.ts  — imports from nq57.ts, exports NGHI_QUYET_79_SCENES + NGHI_QUYET_79_CONTENT
  ├── stoicLove.ts    — standalone (stoicLove template has own types)
  ├── canCuoc.ts      — imports from nq57.ts, exports CAN_CUOC_SCENES + CAN_CUOC_CONTENT
  └── luatGTDB.ts     — imports from nq57.ts, exports LUAT_GTDB_SCENES + LUAT_GTDB_CONTENT
```

Note: nq57.ts exports `SceneDef`, `NQ57SceneContent`, `FPS`, `TAIL`, `sceneFrames` — reused by all nq57-family data files.

## Theme Map

```
src/theme/
  ├── nq57.ts           — red/gold/teal
  ├── deAn06.ts         — blue/cyan
  ├── nghiQuyet79.ts    — (similar to nq57)
  ├── stoicLove.ts      — warm gold/amber
  ├── canCuoc.ts        — (similar to nq57)
  ├── luatGTDB.ts       — blue/yellow
  └── baoHiem2024.ts    — unused (no composition)
```

All themes use `createTheme()` from `src/design/theme/index.ts`.

## Pipeline Scripts

```
scripts/
  ├── manifest.json    — Production registry (6 productions)
  ├── produce.mjs      — Orchestrator: topic → route → validate → TTS → render
  ├── validate.mjs     — Content-contract validator CLI
  ├── verify.mjs       — Production-matrix verification gate (CI)
  └── verify.d.mts     — Type declarations for verify.mjs
```

### Manifest → Routing → Production Flow

```
scripts/manifest.json
  ↓ (topic string)
scripts/produce.mjs --topic "<topic>"
  ↓ (normalize + match aliases/keywords)
scripts/manifest.json.productions[alias]
  ↓ (resolve dataFile, tts, composition, output)
scripts/validate.mjs --project <alias> --check-assets --check-durations
  ↓ (validate content contract + audio assets)
gen_tts_<name>.py (Python TTS generation)
  ↓ (public/<name>/*.mp3 + durations.json)
npx remotion render src/index.ts <Composition> out/<name>.mp4
```

## Preview System

```
preview/
  ├── index.html   — Tabbed browser UI (PREVIEWS array drives tabs)
  └── serve.mjs    — Zero-dependency HTTP server (port 4321)
```

Preview serves `out/*.mp4` files. Tabs are registered in `PREVIEWS` array in `index.html`.

## Test Locations

| Test | Location | Coverage |
|------|----------|----------|
| Architecture invariants | `src/__tests__/architecture.vitest.ts` | Template isolation, theme contract |
| Verify gate logic | `src/__tests__/verify.vitest.ts` | Manifest completeness, routing |
| NQ57 content | `src/data/__tests__/nq57Content.vitest.ts` | NQ57 scene data |
| Contract validation | `src/data/contract.vitest.ts` | Schema validation |
| NQ57 template | `src/templates/__tests__/nq57Template.vitest.ts` | Template structure |
| Theme contract | `src/design/theme/__tests__/theme.vitest.ts` | createTheme validation |
| Motion | `src/design/motion/__tests__/motion.vitest.ts` | fadeSlide, stagger |
| Typography | `src/design/typography/__tests__/wordTimings.vitest.ts` | Word timing logic |
| Layout | `src/design/layout/__tests__/layout.vitest.ts` | Container, Stack, Row |
| Transition | `src/design/transition/__tests__/transition.vitest.ts` | Transition helpers |
| SVG math | `src/design/svg/__tests__/svgMath.vitest.ts` | SVG path calculations |

## Key Dependency Chains

### Adding a new production (reusing existing template)

1. Create `src/data/<name>.ts` (import types from template data file)
2. Create `src/theme/<name>.ts` (use `createTheme()`)
3. Add `<Composition>` in `src/Root.tsx`
4. Add entry in `scripts/manifest.json`
5. Add tab in `preview/index.html`
6. Create `gen_tts_<name>.py` (follow existing pattern)
7. Run TTS → validate → render

### Adding a new template

1. Create `src/templates/<name>/` with index.tsx, helpers.tsx, scenes/
2. Define scene kinds in `src/data/contract.ts` (TEMPLATE_SCHEMAS)
3. Create `src/data/<name>.ts` with matching scene kinds
4. Register in `src/Root.tsx`
5. Add to `scripts/manifest.json`
6. Create `preview/index.html` tab entry
