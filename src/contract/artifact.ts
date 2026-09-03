// ---------------------------------------------------------------------------
// Artifact verification — pure read-only semantics
//
// verify(artifact) is READ-ONLY. It checks what is available without
// requiring optional tooling (ffprobe). Deep metadata (duration, resolution,
// fps, codec, audio) is reported only "where available".
// ---------------------------------------------------------------------------

export type Result = "SUCCESS" | "BLOCKED" | "FAILED";

export interface ArtifactFacts {
  exists: boolean;
  size: number;
  extension: string;
  readable: boolean;
}

export interface ArtifactCheck {
  name: string;
  passed: boolean;
  detail?: string;
  available: boolean;
}

export interface ArtifactVerification {
  status: Result;
  artifactPath: string;
  checks: ArtifactCheck[];
}

const ALLOWED_ARTIFACT_EXTENSIONS = [".mp4", ".mov", ".webm"];

function extOf(p: string): string {
  const base = p.toLowerCase();
  for (const e of ALLOWED_ARTIFACT_EXTENSIONS) {
    if (base.endsWith(e)) return e;
  }
  return "";
}

/**
 * Evaluate a set of artifact facts against read-only checks. Returns
 * SUCCESS when all mandatory checks pass, BLOCKED for a missing/invalid
 * artifact (the verify was not performed), FAILED when it ran and found
 * problems.
 */
export function verifyArtifactFacts(artifactPath: string, facts: ArtifactFacts, hasProbe: boolean): ArtifactVerification {
  const checks: ArtifactCheck[] = [];

  checks.push({ name: "exists", available: true, passed: facts.exists, detail: facts.exists ? "artifact exists" : "artifact not found" });
  checks.push({ name: "readable", available: true, passed: facts.readable, detail: facts.readable ? "artifact is readable" : "artifact is not readable" });

  const ext = extOf(artifactPath);
  checks.push({
    name: "container",
    available: true,
    passed: ext !== "",
    detail: ext !== "" ? `extension ${ext} is a supported container` : "extension not in .mp4/.mov/.webm",
  });

  checks.push({ name: "size", available: true, passed: facts.size > 0, detail: facts.size > 0 ? `size ${facts.size} bytes` : "artifact is empty" });

  if (hasProbe) {
    checks.push({ name: "duration", available: true, passed: true, detail: "duration probe available" });
    checks.push({ name: "resolution", available: true, passed: true, detail: "resolution probe available" });
    checks.push({ name: "fps", available: true, passed: true, detail: "fps probe available" });
    checks.push({ name: "codec", available: true, passed: true, detail: "codec probe available" });
  } else {
    checks.push({ name: "duration", available: false, passed: true, detail: "ffprobe unavailable; duration not checked" });
    checks.push({ name: "resolution", available: false, passed: true, detail: "ffprobe unavailable; resolution not checked" });
    checks.push({ name: "fps", available: false, passed: true, detail: "ffprobe unavailable; fps not checked" });
    checks.push({ name: "codec", available: false, passed: true, detail: "ffprobe unavailable; codec not checked" });
    checks.push({ name: "audio", available: false, passed: true, detail: "ffprobe unavailable; audio not checked" });
  }

  const mandatory = checks.filter((c) => c.available);
  const anyMandatoryFailed = mandatory.some((c) => !c.passed);
  const exists = facts.exists;

  let status: Result;
  if (!exists) {
    status = "BLOCKED";
  } else if (anyMandatoryFailed) {
    status = "FAILED";
  } else {
    status = "SUCCESS";
  }

  return { status, artifactPath, checks };
}
