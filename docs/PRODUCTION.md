# Production Workflow — Topic → Video

This document is the single entry point for producing a video from a topic.
Read this first; do **not** rediscover the repository architecture.

## What already exists (do not rebuild)

| Concern        | Where                                                        |
|----------------|--------------------------------------------------------------|
| Compositions   | `src/Root.tsx` (NghiQuyet57V2, DeAn06, NghiQuyet79, StoicLove) |
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

## Adding a NEW topic that reuses an existing template

1. **Research & storyboard** the topic (C1's manual work).
2. **Reuse a template.** If `stoicLove` grammar fits, create a new content
   file `src/data/<newtopic>.ts` shaped like `src/data/stoicLove.ts`, and a
   new composition in `src/Root.tsx` that points at the stoicLove template
   with your data. Do **not** duplicate the visual components.
3. **TTS.** Either parametrize the existing `gen_tts_*.py` to your content or
   write a small generator following the same `public/<name>/*.mp3` +
   `durations.json` contract.
4. **Wire the orchestrator.** Add an entry to `PROJECTS` in
   `scripts/produce.mjs` (alias → comp, tts, out, content, res).
5. **Render + preview.** `node scripts/produce.mjs --project <alias>`.
6. **Expose in preview.** Add a tab to `PREVIEWS` in `preview/index.html`.

Only create a brand-new visual template if no existing grammar fits.

## Constraints

- Components carry **zero palette knowledge** — semantic color props are required.
- Theme contract uses `accent1/accent2/accent3`; consume via `useTheme()`.
- Architecture must stay 5-layer (compositions → templates → components →
  design → core). Design must not import templates; components must not import
  a specific theme.
