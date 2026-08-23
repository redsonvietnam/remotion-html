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

## Template Registry

| Template | Scene Kinds | Status | Productions |
|----------|-------------|--------|-------------|
| nq57 | title, quote, roles, pillars, stats, vision, end | ADOPTED | 5 |
| stoicLove | hook, statement, split, concept, impermanence, ending | ADOPTED | 1 |
| nodeflow | title, flow, contribution, benefit, compare, end | ADOPTED | 1 |
| blueprint | title, pillars, measure, detail, process, seal | REJECTED | 1 (prototype) |