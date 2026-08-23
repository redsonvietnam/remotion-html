# PRODUCT CONTRACT — remotion-html

## What This Is

A **Video Design/Template System** built on Remotion (video-as-code).

One engine + one method + multiple design languages + multiple templates.

## What This Is Not

- Not a single-video project (NQ57 is the first template, not the only one)
- Not a React UI library (components render video frames, not browser DOM)
- Not a video editor (no GUI, no drag-and-drop — all code-driven)
- Not a media production pipeline (no footage grading, no NLE integration)

## Core Deliverable

**Programmatically generated videos** with:
- Deterministic rendering (same input = same output, every time)
- Code-gen visuals (SVG, Three.js, animated charts — not stock footage)
- TTS voiceover (multi-backend, multi-speaker)
- Karaoke captions (word-level timing)
- Multiple design languages via theme system

## Template

A **template** is a complete video recipe:
- Scene structure (order, timing, transitions)
- Design language (theme, motion, typography choices)
- Content data (text, statistics, dialogue)
- Audio binding (TTS paths, durations)

A template renders to one composition = one video file.

## User

The primary user is an **AI agent (C1)** working within PAIRFLOW:
- Receives work orders from R1
- Implements templates, components, designs
- Validates via typecheck + render pipeline
- Hands off for R1 review

Secondary user: **human developer** who can read, modify, and extend templates.

## Workflow

```
Human defines content/script
  ↓
AI agent (C1) creates/updates template
  ↓
TTS pipeline generates audio
  ↓
Remotion renders video
  ↓
Human reviews output
```

## Constraints

- **Deterministic:** No runtime randomness, no wall-clock dependencies
- **Code-gen first:** Visuals are generated, not sourced from external assets
- **Layered:** Core engine is template-agnostic
- **Validated:** Every merge passes typecheck + render pipeline
- **Documented:** Architecture, design system, and templates are documented

## Scale

- Phase 1: 1 template (NQ57) — prove the engine works
- Phase 2: 2nd template (editorial/minimal) — prove reuse
- Phase 3: 3rd template (tech/futuristic) — prove stress tolerance
- Beyond: N templates, each with unique design language, sharing one engine

## Success Criteria

> The architecture is proven when template #2 and #3 can be built without modifying core or design layers.

If building a new template requires changing `core/` or `design/`, the architecture has failed.
