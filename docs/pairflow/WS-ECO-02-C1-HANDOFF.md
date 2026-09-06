# WS-ECO-02 C1 Handoff

## WS-ECO-02: ARTIFACT PROVENANCE

**Status:** COMPLETE — STANDBY FOR R1 APPROVAL

## Artifact Provenance Implementation

Implemented artifact traceability via sidecar `*.provenance.json` files generated at artifact-producing capability time.

### Changes

| File | Change |
|------|--------|
| `src/contract/provenance.ts` | NEW — Provenance types, generation, validation, sidecar path |
| `src/contract/model.ts` | Extended `ContractResult` with optional `provenance` field |
| `scripts/tts.mjs` | Generates provenance on successful TTS |
| `scripts/produce.mjs` | Generates provenance on successful render |
| `src/__tests__/provenance.vitest.ts` | NEW — 21 tests covering generation, validation, sidecar path |
| `docs/PROVENANCE.md` | NEW — Provenance model documentation |

### Provenance Fields

```
productionId, contractVersion, composition, ttsBackend, voice, duration,
sourceRevision, artifactPath, artifactSize, timestamp, environment
```

### Verification

- `npx vitest run`: 969 tests passed (32 files)
- `npx tsc --noEmit`: No errors
- `sourceRevision` resolves from Git commit SHA; returns `"unknown"` if Git unavailable
- Provenance sidecar written at `<artifact>.provenance.json` alongside produced artifacts

### Files Changed

```
src/contract/provenance.ts    (NEW)
src/contract/model.ts         (modified — extended ContractResult)
scripts/tts.mjs               (modified — provenance on TTS)
scripts/produce.mjs           (modified — provenance on render)
src/__tests__/provenance.vitest.ts (NEW)
docs/PROVENANCE.md            (NEW)
```

### Boundary

- No infrastructure added
- No new schemas — extends existing contract result model
- `sourceRevision` uses explicit `"unknown"` representation (not fabricated)
- Provenance is optional on `ContractResult` (backward compatible)
