# Production Workflow — Topic → Video

This document is the single entry point for producing a video from a topic.
Read this first; do **not** rediscover the repository architecture.

## What already exists (do not rebuild)

| Concern        | Where                                                        |
|----------------|--------------------------------------------------------------|
| Compositions   | `src/Root.tsx` (NghiQuyet57V2, DeAn06, NghiQuyet79, StoicLove, CanCuoc) |
| Templates      | `src/templates/<name>/` (nq57, deAn06, stoicLove)            |
| Scene content  | `src/data/<name>.ts` (per-template scene arrays + timing)    |
| Themes         | `src/theme/<name>.ts` (created via `createTheme`)            |
| Design system  | `src/design/` (components, motion, theme context)            |
| TTS audio      | `gen_tts_*.py` scripts → `public/<name>/*.mp3` + `durations.json` |
| Render         | `remotion render src/index.ts <Comp> out/<name>.mp4`         |
| Preview        | `npm run preview` → `http://localhost:4321/` (serves `out/*.mp4`) |

`out/` and `public/` are gitignored — generated assets are never committed.

## The orchestrated flow

From a topic, the production steps are:

```
USER GIVES TOPIC
  → C1 researches / fact-checks
  → C1 creates storyboard + content (edits src/data/<name>.ts)
  → C1 selects an EXISTING template whose visual grammar fits
  → C1 generates Vietnamese TTS      (gen_tts_<name>.py)
  → C1 renders the video             (remotion render)
  → C1 generates / updates preview   (npm run preview serves out/*.mp4)
  → C1 reports final video + preview
```

To run the TTS + render + report steps in one command, use the orchestrator:

```bash
# List wired productions
node scripts/produce.mjs --list

# Produce a known production end-to-end
node scripts/produce.mjs --project stoiclove --topic "Stoic Love"
node scripts/produce.mjs --project nq57      --topic "Nghị quyết 57"

# Skip a step
node scripts/produce.mjs --project stoiclove --skip-tts      # reuse existing audio
node scripts/produce.mjs --project stoiclove --skip-render   # TTS only
```

`--project` accepts the short alias (`stoiclove`) or the composition id
(`StoicLove`). The orchestrator resolves the TTS script, output path, and
content-data location from the registry in `scripts/produce.mjs`.

You can also run the steps manually:

```bash
python gen_tts_stoicLove.py                     # generate audio + data
npx remotion render src/index.ts StoicLove out/stoicLove.mp4
npm run preview                                 # open http://localhost:4321/
```

## Topic intake & routing (WS34)

The orchestrator understands a topic at a higher level and deterministically
routes it to an existing template — no AI, no external API.

```bash
# Explicit production (original behavior, preserved)
node scripts/produce.mjs --project stoiclove --topic "Stoic Love"

# Topic-level request → routes to the right template
node scripts/produce.mjs --topic "Nghị quyết 79"
node scripts/produce.mjs --topic "Đề án 06"
node scripts/produce.mjs --topic "Nghị quyết 57"
node scripts/produce.mjs --topic "quan niệm Stoicism trong tình yêu"

# Inspect routing / contract
node scripts/produce.mjs --list           # productions + routing examples
node scripts/produce.mjs --manifest       # full machine-readable contract
node scripts/produce.mjs --topic "..." --route-only   # resolve + print manifest, no TTS/render
```

Routing is deterministic over the contract in `scripts/manifest.json`:

- Each production declares `aliases` (exact, after diacritic/lowercase
  normalization) and `keywords` (substring match).
- `--topic` normalizes the input, then matches aliases first, then keywords.
- If nothing matches, the system prints `NO_MATCH` and exits non-zero. It
  **never** silently picks an inappropriate template.

### Production manifest schema

`scripts/manifest.json` is the repository-side contract. Each entry:

| Field        | Meaning                                                |
|--------------|--------------------------------------------------------|
| `id`         | production alias (also the `--project` value)          |
| `template`   | visual template under `src/templates/`                 |
| `composition`| Remotion composition id (in `src/Root.tsx`)            |
| `dataFile`   | scene/content data (`src/data/<name>.ts`)              |
| `tts`        | TTS generator script (`gen_tts_*.py`)                 |
| `output`     | rendered video path (`out/<name>.mp4`)                |
| `resolution` | `1920x1080` or `1080x1920`                            |
| `preview`    | how to preview (server + URL + tab)                    |
| `aliases`    | exact topic strings that route here                    |
| `keywords`   | substrings that route here                             |

### Adding a new topic that reuses an existing template

1. **Research & storyboard** the topic (C1's manual work — not automated).
2. Add/extend the production's content in its `gen_tts_*.py` `SCRIPTS` and run
   it (this regenerates `src/data/<name>.ts`). Do **not** edit the generated
   `.ts` by hand for NQ57 — it is produced by `gen_tts_v2.py`.
3. If a *new* template is needed (no existing grammar fits), create it under
   `src/templates/` and register a new composition in `src/Root.tsx`.
4. Add the production to `scripts/manifest.json` with aliases/keywords.
5. Produce + preview: `node scripts/produce.mjs --project <alias>`.
6. Expose in preview: add a tab to `PREVIEWS` in `preview/index.html`.

Content research/fact-checking is always C1's responsibility before the
manifest is finalized; this layer only routes and orchestrates.

## Content contract & validation (WS35)

Every production's data must satisfy a machine-checkable contract before it
enters the pipeline. The contract lives in `src/data/contract.ts`:

- `SceneDef` — base scene metadata: `id`, `audio` (path under `public/`),
  `caption` (on-screen narration), `dur` (seconds). Every data file exports a
  `SceneDef[]` (named `<NAME>_SCENES`) and a content `Record` (named
  `<NAME>_CONTENT`) keyed by scene id.
- `TEMPLATE_SCHEMAS` — per template, the allowed scene `kind`s and which kinds
  must carry a non-empty primary text field.
- `Storyboard` / `validateStoryboard` — the higher-level artifact C1 writes
  from research + fact-checking (project, topic, platform, aspect ratio,
  template, scenes with purpose / narration / on-screen text / visual concept /
  factual claims + source + verified flag). `validateStoryboard` rejects
  unverified or unsourced claims — fact-checking is enforced, not automated.

The validator (`scripts/validate.mjs`) loads a data file via esbuild and runs
`validateProductionData`. It checks: missing/empty scene array, missing content
map, missing scene content, orphan content (scene-count mismatch), invalid or
unsupported scene kind, missing narration, missing required text, invalid
duration, invalid audio path. Errors are explicit; it never silently repairs
content.

`produce.mjs` runs validation **before** TTS/render and stops on failure
(`--skip-validation` bypasses).

### How to turn a topic into a production (canonical workflow)

```
1. TOPIC            "Làm video về <TOPIC>"
2. RESEARCH         C1 researches + fact-checks (no API/automation)
3. STORYBOARD       write a Storyboard (src/data/contract.ts shape):
                      project, topic, platform, aspectRatio, template,
                      scenes[] with purpose/narration/onScreenText/
                      visualConcept + factualClaims[]{claim,source,verified}
4. ROUTE            node scripts/produce.mjs --topic "<TOPIC>"
                      → resolves to an existing template (or NO_MATCH)
5. CONTENT DATA     author src/data/<project>.ts (SceneDef[] + content map);
                      validate: node scripts/validate.mjs --project <alias>
6. TTS              node scripts/produce.mjs --project <alias>  (runs TTS)
7. RENDER           (same command continues to remotion render)
8. PREVIEW          npm run preview  → http://localhost:4321/
9. HANDOFF          report final video + preview URL
```

A new topic reuses an existing template when its visual grammar fits; the
storyboard + data file are the only new artifacts.

## Audio duration / scene timing validation (WS37)

The production contract enforces a hard scene-timing invariant:

```
0 < audioDuration <= sceneDuration   (per scene with narration)
```

This is checked by `checkAudioDurations(scenes, getDuration)` in
`src/data/contract.ts`, with the duration resolver **injected** (pure contract
logic stays free of any media probing). The CLI (`scripts/validate.mjs`) injects
a resolver backed by `ffmpeg-static` (the MP3 duration is read from the asset
itself, never hard-coded).

Checks per scene:

- audio file missing → `INVALID_AUDIO_ASSET` (WS36)
- audio path invalid (absolute / `../` traversal / non-relative) → `INVALID_AUDIO_PATH`
- audio file exists but its duration cannot be read → `INVALID_AUDIO_METADATA`
- audio duration exceeds scene duration → `INVALID_AUDIO_DURATION`
  (message: `Scene sN audio duration 14.82s exceeds scene duration 13.00s.`)

Tolerance: `DURATION_TOLERANCE = 0.15s`, applied as
`audioDuration <= sceneDuration + 0.15`. It absorbs fractional MP3/codec probing
error only — deliberately too small to hide a real timing bug.

Failure behavior: any of the above stops production **before render**. The
duration gate runs **after TTS and after the asset-existence gate** (so freshly
generated audio is probed) and **before render** — see the `produce.mjs` gate
(`validate.mjs --check-assets --check-durations`).

## Adding a NEW topic that reuses an existing template

1. **Research & storyboard** the topic (C1's manual work).
2. **Reuse a template.** If `stoicLove` grammar fits, create a new content
   file `src/data/<newtopic>.ts` shaped like `src/data/stoicLove.ts`, and a
   new composition in `src/Root.tsx` that points at the stoicLove template
   with your data. Do **not** duplicate the visual components.
3. **TTS.** Either parametrize the existing `gen_tts_*.py` to your content or
   write a small generator following the same `public/<name>/*.mp3` +
   `durations.json` contract.
4. **Wire the orchestrator.** Add an entry to `scripts/manifest.json`
    (alias → comp, tts, out, content, resolution, preview, aliases, keywords).
5. **Render + preview.** `node scripts/produce.mjs --project <alias>`.
6. **Expose in preview.** Add a tab to `PREVIEWS` in `preview/index.html`.

Only create a brand-new visual template if no existing grammar fits.

## Constraints

- Components carry **zero palette knowledge** — semantic color props are required.
- Theme contract uses `accent1/accent2/accent3`; consume via `useTheme()`.
- Architecture must stay 5-layer (compositions → templates → components →
  design → core). Design must not import templates; components must not import
  a specific theme.

## Verification / CI gate (WS40)

The baseline ships one deterministic command that answers:

> "Is `master` structurally valid and safe to continue from?"

```bash
npm run verify
```

`npm run verify` runs, in order:

1. `tsc --noEmit` — type safety
2. `npm test` — the unit / contract test suite
3. `node scripts/verify.mjs` — the production-matrix gate (below)

### What `scripts/verify.mjs` checks

For **every** production registered in `scripts/manifest.json` it runs
`scripts/validate.mjs --check-assets --check-durations` (content contract +
real audio asset existence + `0 < audioDuration ≤ sceneDuration`). It also
checks:

- **Manifest completeness** — the five baseline production lines
  (`nq57`, `dean06`, `nq79`, `stoiclove`, `canCuoc`) must all be present; if
  one disappears, verify fails.
- **Topic routing** — a set of known topics must still route to their expected
  compositions via `scripts/produce.mjs --route-only`.

It exits non-zero on any failure, so it is safe as a CI gate. It does **not**
render video and does **not** duplicate the validation algorithms.

### CI vs local / render-time checks

| Check                              | Where it runs              | Command                                        |
| ---------------------------------- | -------------------------- | ---------------------------------------------- |
| Typecheck                          | CI / local                 | `npx tsc --noEmit`                             |
| Unit & contract tests              | CI / local                 | `npm test`                                     |
| Contract + real audio + duration   | CI / local (no render)     | `scripts/verify.mjs` (via `npm run verify`)    |
| Topic routing                      | CI / local                 | `scripts/verify.mjs`                           |
| TTS audio generation               | local / render-time        | `gen_tts_*.py` (via `produce`)                 |
| MP4 render                         | local / render-time only   | `remotion render` / `produce`                  |
| Standalone preview                 | local                      | `npm run preview` → `http://localhost:4321/`   |

The render (Remotion → `out/*.mp4`) is intentionally **not** part of
`npm run verify`, because `out/` is a generated artifact. To produce a
watchable video, run `node scripts/produce.mjs --project <alias>`.

### Pipeline recap

```text
topic
  → storyboard / data        (src/data/<name>.ts)
  → validation               (scripts/validate.mjs: contract + assets + duration)
  → real audio assets        (gen_tts_*.py → public/<name>/*.mp3)
  → TTS + render             (remotion render / produce)
  → HTML preview             (npm run preview → http://localhost:4321/)
```
