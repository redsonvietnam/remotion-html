# HANDOFF — Nghi quyet 57 Video (Remotion)

## Current Canonical Architecture

- **Composition**: `NghiQuyet57V2` (src/compositions/NghiQuyet57VideoV2.tsx)
- **Scenes**: 7 scenes in `src/scenes/NQ57ScenesV2.tsx` (Title, Quote, Roles, Pillars, Stats, Vision, End)
- **Data**: `src/data/nq57.ts` — SCENES array with id/audio/caption/dur per scene
- **Theme**: `src/theme/nq57.ts` — design tokens (colors, fonts)
- **Fonts**: `src/fonts/nq57.ts` — Be Vietnam Pro via @remotion/google-fonts
- **TTS**: `gen_tts_v2.py` — 4 backends (edge, omni, gemini, proxy), outputs to `public/nq57/`
- **Entry**: `src/index.ts` → `src/Root.tsx` → single Composition `NghiQuyet57V2`

## Production Composition

`NghiQuyet57V2`: 1920×1080, 30fps, TransitionSeries with fade crossfade between scenes.
Each scene has Audio, karaoke Caption (marquee), and visual elements:
- TitleSceneV2: RingDraw SVG + Emblem3D (Three.js torus + icosahedron)
- QuoteSceneV2: large quote mark + UnderlineDraw
- RolesSceneV2: 3 role cards + DataFlow SVG
- PillarsSceneV2: Bars3D (Three.js 3D bar chart)
- StatsSceneV2: AreaChart (Recharts) + DataFlow + 3 Gauge SVGs
- VisionSceneV2: RingDraw + animated counter
- EndSceneV2: RingDraw + Emblem3D

## Current Status

- All 7 scenes render correctly with TTS audio
- Karaoke captions scroll with speech timing
- 3D emblem and bars use @remotion/three (deterministic via useCurrentFrame)
- Recharts AreaChart uses isAnimationActive=false + frame-based spring
- TTS supports 4 backends, auto-updates nq57-data.ts with durations

## Remaining Work

- Visual upgrade (WS-VISUAL) — separate workstream, not mixed into this branch
- Possible: React Flow for complex flowcharts, Lottie for pre-built animations
- Possible: Iconify offline icon set for non-3D scenes

## Known Limitations

- Three.js scenes render slower (headless Chromium WebGL)
- TTS edge backend has 2 Vietnamese voices only
- gen_tts_v2.py requires ffmpeg-static binary path detection (Windows PowerShell)

## Legacy Files

`legacy/` contains HabitLoop demo (Scene1Orb, Scene2Chart, Icon3D) and NQ57 V1 scenes.
Kept for historical reference only — not compiled or rendered.
