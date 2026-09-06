// ---------------------------------------------------------------------------
// Provenance Regression Tests — WS-ECO-02
//
// Tests the provenance model: types, generation, sidecar path computation,
// and validation. Provenance enables artifact traceability and reproducibility.
// ---------------------------------------------------------------------------

import { describe, it, expect, vi } from "vitest";
import path from "node:path";
import {
  Provenance,
  resolveSourceRevision,
  generateProvenance,
  provenancePath,
  validateProvenance,
} from "../contract/provenance";

// ─── Source revision resolution ────────────────────────────────────────────

describe("Provenance: resolveSourceRevision", () => {
  it("returns a 40-char hex SHA from a real Git repo", () => {
    // This test file is inside a Git repo
    const repoRoot = path.resolve(__dirname, "..", "..");
    const sha = resolveSourceRevision(repoRoot);
    expect(sha).toMatch(/^[0-9a-f]{40}$/);
  });

  it("returns 'unknown' for a non-existent path", () => {
    const sha = resolveSourceRevision("/nonexistent/path");
    expect(sha).toBe("unknown");
  });
});

// ─── Provenance generation ─────────────────────────────────────────────────

describe("Provenance: generateProvenance", () => {
  it("generates a valid provenance record", () => {
    const repoRoot = path.resolve(__dirname, "..", "..");
    const p = generateProvenance({
      productionId: "solarSystem",
      contractVersion: "1.0",
      composition: "SolarSystem",
      ttsBackend: "python",
      voice: "vi-VN-HoaiMyNeural",
      duration: 120.5,
      artifactPath: "out/solarSystem.mp4",
      artifactSize: 1024000,
      repoRoot,
    });

    expect(p.productionId).toBe("solarSystem");
    expect(p.contractVersion).toBe("1.0");
    expect(p.composition).toBe("SolarSystem");
    expect(p.ttsBackend).toBe("python");
    expect(p.voice).toBe("vi-VN-HoaiMyNeural");
    expect(p.duration).toBe(120.5);
    expect(p.sourceRevision).toMatch(/^[0-9a-f]{40}$/);
    expect(p.artifactPath).toBe("out/solarSystem.mp4");
    expect(p.artifactSize).toBe(1024000);
    expect(p.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(p.environment.nodeVersion).toMatch(/^v\d+/);
    expect(p.environment.platform).toBeDefined();
    expect(p.environment.arch).toBeDefined();
  });

  it("handles null optional fields", () => {
    const repoRoot = path.resolve(__dirname, "..", "..");
    const p = generateProvenance({
      productionId: "test",
      contractVersion: "1.0",
      composition: "TestComp",
      ttsBackend: null,
      voice: null,
      duration: null,
      artifactPath: "out/test.mp4",
      artifactSize: null,
      repoRoot,
    });

    expect(p.ttsBackend).toBeNull();
    expect(p.voice).toBeNull();
    expect(p.duration).toBeNull();
    expect(p.artifactSize).toBeNull();
  });
});

// ─── Provenance sidecar path ───────────────────────────────────────────────

describe("Provenance: provenancePath", () => {
  it("computes sidecar path for .mp4", () => {
    expect(provenancePath("out/video.mp4")).toBe("out/video.provenance.json");
  });

  it("computes sidecar path for .webm", () => {
    expect(provenancePath("out/video.webm")).toBe("out/video.provenance.json");
  });

  it("computes sidecar path for nested paths", () => {
    expect(provenancePath("out/nested/video.mp4")).toBe("out/nested/video.provenance.json");
  });

  it("computes sidecar path for durations.json", () => {
    expect(provenancePath("public/solarSystem/durations.json")).toBe(
      "public/solarSystem/durations.provenance.json"
    );
  });
});

// ─── Provenance validation ─────────────────────────────────────────────────

describe("Provenance: validateProvenance", () => {
  const validProvenance: Provenance = {
    productionId: "solarSystem",
    contractVersion: "1.0",
    composition: "SolarSystem",
    ttsBackend: "python",
    voice: "vi-VN-HoaiMyNeural",
    duration: 120.5,
    sourceRevision: "a".repeat(40),
    artifactPath: "out/solarSystem.mp4",
    artifactSize: 1024000,
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    },
  };

  it("validates a correct provenance record", () => {
    const result = validateProvenance(validProvenance);
    expect(result.status).toBe("SUCCESS");
    expect(result.missing).toHaveLength(0);
  });

  it("rejects missing productionId", () => {
    const result = validateProvenance({ ...validProvenance, productionId: "" });
    expect(result.status).toBe("FAILED");
    expect(result.missing).toContain("productionId");
  });

  it("rejects missing contractVersion", () => {
    const result = validateProvenance({ ...validProvenance, contractVersion: "" });
    expect(result.status).toBe("FAILED");
    expect(result.missing).toContain("contractVersion");
  });

  it("rejects missing composition", () => {
    const result = validateProvenance({ ...validProvenance, composition: "" });
    expect(result.status).toBe("FAILED");
    expect(result.missing).toContain("composition");
  });

  it("rejects missing sourceRevision", () => {
    const result = validateProvenance({ ...validProvenance, sourceRevision: "" });
    expect(result.status).toBe("FAILED");
    expect(result.missing).toContain("sourceRevision");
  });

  it("rejects invalid sourceRevision format", () => {
    const result = validateProvenance({ ...validProvenance, sourceRevision: "not-a-sha" });
    expect(result.status).toBe("FAILED");
    expect(result.missing.some((m) => m.includes("sourceRevision"))).toBe(true);
  });

  it("allows 'unknown' as explicit unavailable representation", () => {
    const result = validateProvenance({ ...validProvenance, sourceRevision: "unknown" });
    expect(result.status).toBe("SUCCESS");
  });

  it("rejects missing artifactPath", () => {
    const result = validateProvenance({ ...validProvenance, artifactPath: "" });
    expect(result.status).toBe("FAILED");
    expect(result.missing).toContain("artifactPath");
  });

  it("rejects missing timestamp", () => {
    const result = validateProvenance({ ...validProvenance, timestamp: "" });
    expect(result.status).toBe("FAILED");
    expect(result.missing).toContain("timestamp");
  });

  it("rejects invalid timestamp format", () => {
    const result = validateProvenance({ ...validProvenance, timestamp: "not-a-date" });
    expect(result.status).toBe("FAILED");
    expect(result.missing.some((m) => m.includes("timestamp"))).toBe(true);
  });

  it("reports multiple missing fields", () => {
    const result = validateProvenance({
      ...validProvenance,
      productionId: "",
      composition: "",
    });
    expect(result.status).toBe("FAILED");
    expect(result.missing).toContain("productionId");
    expect(result.missing).toContain("composition");
  });
});

// ─── Contract result model with provenance ─────────────────────────────────

describe("Contract result model: provenance compatibility", () => {
  it("result() returns status and message without provenance", async () => {
    const { result } = await import("../contract/model");
    const r = result("SUCCESS", "test");
    expect(r.status).toBe("SUCCESS");
    expect(r.message).toBe("test");
    expect(r.provenance).toBeUndefined();
  });

  it("result can include provenance", async () => {
    const prov: Provenance = {
      productionId: "test",
      contractVersion: "1.0",
      composition: "TestComp",
      ttsBackend: null,
      voice: null,
      duration: null,
      sourceRevision: "a".repeat(40),
      artifactPath: "out/test.mp4",
      artifactSize: null,
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    };
    const r = { status: "SUCCESS" as const, message: "done", provenance: prov };
    expect(r.provenance?.productionId).toBe("test");
    expect(r.provenance?.sourceRevision).toMatch(/^[0-9a-f]{40}$/);
  });
});
