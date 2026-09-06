// ---------------------------------------------------------------------------
// Artifact Provenance — WS-ECO-02
//
// Provenance records attribute produced artifacts to their production inputs,
// contract/version context, and execution configuration. This enables
// reproducibility and traceability without introducing infrastructure.
//
// Provenance is generated at artifact-producing capability time and persisted
// as a sidecar JSON file alongside the artifact.
// ---------------------------------------------------------------------------

import { execSync } from "node:child_process";
import path from "node:path";

export type Result = "SUCCESS" | "BLOCKED" | "FAILED";

// ─── Provenance types ──────────────────────────────────────────────────────

/**
 * Provenance record for a produced artifact.
 *
 * Field semantics:
 * - productionId: stable production identity (e.g., "solarSystem")
 * - contractVersion: Remotion Contract version (e.g., "1.0")
 * - composition: stable composition identity (e.g., "SolarSystem")
 * - ttsBackend: TTS provider used (e.g., "edge", "openai", null if not applicable)
 * - voice: voice identifier (e.g., "vi-VN-HoaiMyNeural", null if not applicable)
 * - duration: artifact duration in seconds (null if not measured)
 * - sourceRevision: immutable source-state identity (Git commit SHA)
 * - artifactPath: path to the produced artifact
 * - artifactSize: artifact size in bytes (null if not measured)
 * - timestamp: ISO 8601 production timestamp
 * - environment: execution environment metadata
 */
export interface Provenance {
  productionId: string;
  contractVersion: string;
  composition: string;
  ttsBackend: string | null;
  voice: string | null;
  duration: number | null;
  sourceRevision: string;
  artifactPath: string;
  artifactSize: number | null;
  timestamp: string;
  environment: ProvenanceEnvironment;
}

/**
 * Execution environment metadata.
 */
export interface ProvenanceEnvironment {
  nodeVersion: string;
  platform: string;
  arch: string;
}

// ─── Source revision resolution ────────────────────────────────────────────

/**
 * Resolve the current Git commit SHA from the repository root.
 * Returns "unknown" if Git is not available or the repository is not a Git repo.
 * Does not perform destructive or network-changing operations.
 */
export function resolveSourceRevision(repoRoot: string): string {
  try {
    const sha = execSync("git rev-parse HEAD", {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    return sha || "unknown";
  } catch {
    return "unknown";
  }
}

// ─── Provenance generation ─────────────────────────────────────────────────

/**
 * Generate a provenance record for a produced artifact.
 */
export function generateProvenance(params: {
  productionId: string;
  contractVersion: string;
  composition: string;
  ttsBackend: string | null;
  voice: string | null;
  duration: number | null;
  artifactPath: string;
  artifactSize: number | null;
  repoRoot: string;
}): Provenance {
  return {
    productionId: params.productionId,
    contractVersion: params.contractVersion,
    composition: params.composition,
    ttsBackend: params.ttsBackend,
    voice: params.voice,
    duration: params.duration,
    sourceRevision: resolveSourceRevision(params.repoRoot),
    artifactPath: params.artifactPath,
    artifactSize: params.artifactSize,
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    },
  };
}

// ─── Provenance sidecar path ───────────────────────────────────────────────

/**
 * Compute the sidecar provenance path for an artifact.
 * Example: "out/video.mp4" → "out/video.provenance.json"
 */
export function provenancePath(artifactPath: string): string {
  const ext = path.extname(artifactPath);
  const base = artifactPath.slice(0, -ext.length);
  return `${base}.provenance.json`;
}

// ─── Provenance validation ─────────────────────────────────────────────────

/**
 * Validate a provenance record. Returns SUCCESS if valid, FAILED if invalid.
 * Used for verification tests.
 */
export function validateProvenance(p: Provenance): { status: Result; message: string; missing: string[] } {
  const requiredFields: (keyof Provenance)[] = [
    "productionId",
    "contractVersion",
    "composition",
    "sourceRevision",
    "artifactPath",
    "timestamp",
  ];

  const missing: string[] = [];
  for (const field of requiredFields) {
    const value = p[field];
    if (value === undefined || value === null || value === "") {
      missing.push(field);
    }
  }

  // sourceRevision must not be fabricated
  if (p.sourceRevision === "unknown") {
    // "unknown" is an explicit unavailable representation, not fabrication
  } else if (!/^[0-9a-f]{40}$/.test(p.sourceRevision)) {
    missing.push("sourceRevision (invalid format)");
  }

  // timestamp must be valid ISO 8601
  if (p.timestamp && isNaN(Date.parse(p.timestamp))) {
    missing.push("timestamp (invalid ISO 8601)");
  }

  if (missing.length > 0) {
    return { status: "FAILED", message: `provenance missing or invalid fields: ${missing.join(", ")}`, missing };
  }

  return { status: "SUCCESS", message: "provenance is valid", missing: [] };
}
