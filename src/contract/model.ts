// ---------------------------------------------------------------------------
// Remotion Production Contract v1 — pure semantics layer
//
// This module is the project-native implementation of the canonical
// Remotion Production Contract. It is ZeroClaw-independent and usable by any
// external operator.
//
// Pure logic + types only (no React, no Remotion, no Node-specific imports
// beyond what vitest/node can test). See contract.json for the canonical
// machine-readable document; this module is its testable semantic surface.
// ---------------------------------------------------------------------------

export type Result = "SUCCESS" | "BLOCKED" | "FAILED";

export const CONTRACT_VERSION = "1.0";
export const CAPABILITIES = ["inspect", "preflight", "tts", "render", "verify"] as const;
export type Capability = (typeof CAPABILITIES)[number];

export const ARTIFACT_BOUNDARY = "out/";

// ─── Result model ──────────────────────────────────────────────────────────

/**
 * Wrap an operation outcome in the canonical result model.
 * BLOCKED = operation cannot/should not continue due to a declared
 *           precondition/state/collision/incompatibility. No remediation.
 * FAILED   = operation was attempted and did not succeed.
 */
export function result(state: Result, message: string): { status: Result; message: string } {
  return { status: state, message };
}

// ─── Render output path validation ──────────────────────────────────────────

const EXTENSION_WHITELIST = /\.(mp4|mov|webm)$/;

/**
 * Validate a render output path under the project-owned artifact boundary.
 *
 * Rules:
 *  - must be project-relative (no absolute path, no drive, no leading /)
 *  - must not traverse upward (no "..")
 *  - must live within ARTIFACT_BOUNDARY (out/)
 *  - extension must be a supported container
 *
 * Returns BLOCKED for violations (the contract must not silently remediate).
 */
export function validateRenderOutput(output: string): { status: Result; message: string } {
  if (!output || typeof output !== "string") {
    return result("BLOCKED", "output must be a non-empty string");
  }
  if (/^([a-zA-Z]:[\\/]|[\\/])/.test(output)) {
    return result("BLOCKED", "output must be project-relative, not an absolute path");
  }
  if (output.split(/[\\/]/).includes("..")) {
    return result("BLOCKED", "output must not traverse outside project boundary");
  }
  if (output.split(/[\\/]/).some((seg) => seg === "")) {
    return result("BLOCKED", "output path contains empty segments");
  }
  if (!output.startsWith(ARTIFACT_BOUNDARY)) {
    return result("BLOCKED", `output must live within the artifact boundary "${ARTIFACT_BOUNDARY}"`);
  }
  if (!EXTENSION_WHITELIST.test(output)) {
    return result("BLOCKED", "output extension must be one of .mp4, .mov, .webm");
  }
  return result("SUCCESS", "output path is valid");
}

// ─── Render collision handling ──────────────────────────────────────────────

/**
 * An existing artifact at the requested output must BLOCK, never silently
 * overwrite. Collision detection is the caller's filesystem responsibility;
 * this marks the semantic outcome.
 */
export function renderCollision(exists: boolean): { status: Result; message: string } {
  if (exists) {
    return result("BLOCKED", "output artifact already exists; refusing to overwrite");
  }
  return result("SUCCESS", "no collision: output path is free");
}

// ─── Render request validation ──────────────────────────────────────────────

export interface RenderRequest {
  composition: string;
  output: string;
}

/**
 * Validate a render({ composition, output }) request.
 * Requires a stable composition identity and a boundary-safe output path.
 */
export function validateRenderRequest(req: RenderRequest): { status: Result; message: string } {
  if (!req || typeof req.composition !== "string" || req.composition.trim() === "") {
    return result("BLOCKED", "composition must be a non-empty stable composition identity");
  }
  return validateRenderOutput(req.output);
}

// ─── TTS productionId semantics ─────────────────────────────────────────────

export interface TtsRequest {
  productionId: string;
}

export const TTS_SUPPORTED_PRODUCTIONS: { productionId: string; composition: string }[] = [
  { productionId: "solarSystem", composition: "SolarSystem" },
];

/**
 * Validate a tts({ productionId }) request.
 * The public contract is productionId-keyed; implementation may support only
 * a limited set (currently SolarSystem). Unsupported production → BLOCKED.
 */
export function validateTtsRequest(req: TtsRequest): { status: Result; message: string; composition?: string } {
  if (!req || typeof req.productionId !== "string" || req.productionId.trim() === "") {
    return result("BLOCKED", "productionId must be a non-empty string");
  }
  const match = TTS_SUPPORTED_PRODUCTIONS.find((p) => p.productionId === req.productionId);
  if (!match) {
    return result("BLOCKED", `TTS not supported for production "${req.productionId}"`);
  }
  return { ...result("SUCCESS", "TTS productionId is valid"), composition: match.composition };
}

// ─── Preflight semantics ────────────────────────────────────────────────────

export type PreflightState = "READY" | "BLOCKED" | "FAILED";

export interface PreflightCheck {
  name: string;
  state: PreflightState;
  detail?: string;
}

/**
 * Preflight is READ-ONLY. It composes an ordered set of readiness checks and
 * reports the worst state. It never mutates source, installs, renders, or
 * generates TTS. A BLOCKED check stops further evaluation at that point.
 */
export function preflight(checks: PreflightCheck[]): { status: PreflightState; checks: PreflightCheck[] } {
  let state: PreflightState = "READY";
  const evaluated: PreflightCheck[] = [];
  for (const check of checks) {
    evaluated.push(check);
    if (check.state === "FAILED") {
      state = "FAILED";
      break;
    }
    if (check.state === "BLOCKED") {
      state = "BLOCKED";
      break;
    }
  }
  return { status: state, checks: evaluated };
}

// ─── Validate a stable composition identity against the contract ────────────

export function validateComposition(
  composition: string,
  known: string[],
): { status: Result; message: string } {
  if (known.includes(composition)) {
    return result("SUCCESS", `composition "${composition}" is a known stable identity`);
  }
  return result("BLOCKED", `composition "${composition}" is not a known stable identity`);
}
