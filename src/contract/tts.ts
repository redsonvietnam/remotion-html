// ---------------------------------------------------------------------------
// TTS capability — pure contract semantics
//
// Public abstraction: tts({ productionId })
//
// Implementation is deliberately SolarSystem-limited (matches the actual
// project state). No generic engine is fabricated. Public contract never
// exposes provider, voice, script path, or executable.
// ---------------------------------------------------------------------------

export type Result = "SUCCESS" | "BLOCKED" | "FAILED";

export interface TtsTarget {
  productionId: string;
  /** Deterministic, project-owned artifact root. */
  artifactRoot: string;
  /** Sentinel file whose existence proves artifacts were generated. */
  sentinel: string;
}

/**
 * Registered TTS-enabled productions (stable project identities).
 * Currently only solarSystem has a real generation path.
 */
export const TTS_TARGETS: Record<string, TtsTarget> = {
  solarSystem: {
    productionId: "solarSystem",
    artifactRoot: "public/solarSystem",
    sentinel: "public/solarSystem/durations.json",
  },
};

export interface TtsRequest {
  productionId: string;
}

export interface TtsResolution {
  status: Result;
  message: string;
  target?: TtsTarget;
}

/**
 * Resolve a tts({ productionId }) request to a deterministic target.
 * Unsupported productionId or empty input → BLOCKED (never FAILED; the
 * operation was not attempted).
 */
export function resolveTtsRequest(req: TtsRequest, supported: Record<string, TtsTarget> = TTS_TARGETS): TtsResolution {
  if (!req || typeof req.productionId !== "string" || req.productionId.trim() === "") {
    return { status: "BLOCKED", message: "productionId must be a non-empty string" };
  }
  const target = supported[req.productionId];
  if (!target) {
    return { status: "BLOCKED", message: `tts not supported for production "${req.productionId}"` };
  }
  return { status: "SUCCESS", message: "productionId resolved", target };
}

/**
 * Collision guard: an existing generated artifact must BLOCK, never silently
 * overwrite. `exists` is the caller's filesystem check against `target.sentinel`.
 */
export function ttsCollision(target: TtsTarget, exists: boolean): TtsResolution {
  if (exists) {
    return { status: "BLOCKED", message: `artifact for "${target.productionId}" already exists; refusing to overwrite` };
  }
  return { status: "SUCCESS", message: "no collision: artifact path is free" };
}
