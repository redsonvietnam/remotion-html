# Artifact Provenance — WS-ECO-02

Provenance records attribute produced artifacts to their production inputs, contract/version context, and execution configuration. This enables reproducibility and traceability without introducing infrastructure.

## Provenance Record

Each produced artifact generates a sidecar `*.provenance.json` file alongside it.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `productionId` | `string` | Stable production identity (e.g., `"solarSystem"`) |
| `contractVersion` | `string` | Remotion Contract version (e.g., `"1.0"`) |
| `composition` | `string` | Stable composition identity (e.g., `"SolarSystem"`) |
| `ttsBackend` | `string \| null` | TTS provider used (e.g., `"python"`, `"openai"`, or `null` if not applicable) |
| `voice` | `string \| null` | Voice identifier (e.g., `"vi-VN-HoaiMyNeural"`, or `null` if not applicable) |
| `duration` | `number \| null` | Artifact duration in seconds (null if not measured) |
| `sourceRevision` | `string` | Git commit SHA at production time |
| `artifactPath` | `string` | Path to the produced artifact |
| `artifactSize` | `number \| null` | Artifact size in bytes (null if not measured) |
| `timestamp` | `string` | ISO 8601 production timestamp |
| `environment` | `object` | Execution environment metadata (`nodeVersion`, `platform`, `arch`) |

### Sidecar Path

For an artifact at `out/video.mp4`, the provenance sidecar is at `out/video.provenance.json`.

### Source Revision

`sourceRevision` is resolved from the Git commit SHA at the repository root. If Git is unavailable, it returns `"unknown"` as an explicit unavailable representation.

## Integration Points

### TTS (`scripts/tts.mjs`)

On successful TTS generation, a provenance sidecar is written alongside the sentinel file.

### Render (`scripts/produce.mjs`)

On successful render, a provenance sidecar is written alongside the output artifact.

### Validation

`validateProvenance()` in `src/contract/provenance.ts` validates a provenance record:
- Checks required fields are present and non-empty
- Validates `sourceRevision` format (40-char hex or `"unknown"`)
- Validates `timestamp` is valid ISO 8601

## Tests

`src/__tests__/provenance.vitest.ts` covers:
- Source revision resolution (real repo + non-existent path)
- Provenance generation with all fields
- Sidecar path computation
- Provenance validation (valid + missing fields)
- Contract result model compatibility
