// ---------------------------------------------------------------------------
// Contract v1 Regression Tests — WS-ZC-04
//
// Tests the canonical machine-readable contract.json and its semantic rules.
// Ensures ADR compliance, capability discovery, and result model stability.
// ---------------------------------------------------------------------------

import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { evaluatePreflight } from "../contract/preflight";
import { inspectContractData } from "../contract/inspect";

const ROOT = path.resolve(__dirname, "..", "..");
const CONTRACT_PATH = path.join(ROOT, "contract.json");

// ─── Contract file presence & basic structure ───────────────────────────────

describe("Contract file: contract.json", () => {
  it("contract.json exists at repository root", () => {
    expect(existsSync(CONTRACT_PATH)).toBe(true);
  });

  it("contract.json is valid JSON", () => {
    expect(() => JSON.parse(readFileSync(CONTRACT_PATH, "utf8"))).not.toThrow();
  });

  it("contractVersion is '1.0'", () => {
    const contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
    expect(contract.contractVersion).toBe("1.0");
  });

  it("project identity is stable", () => {
    const contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
    expect(contract.projectId).toBe("remotion-html-project");
    expect(contract.projectName).toBe("remotion-html");
    expect(contract.projectVersion).toBe("1.0.0"); // Matches package.json
  });
});

// ─── Capability surface & semantics ─────────────────────────────────────────

describe("Contract capabilities: ADR compliance", () => {
  let contract: any;
  beforeAll(() => {
    contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
  });

  it("exactly five V1 capabilities: inspect, preflight, tts, render, verify", () => {
    const capabilities = contract.capabilities.map((c: any) => c.name);
    expect(capabilities).toEqual(["inspect", "preflight", "tts", "render", "verify"]);
    expect(capabilities).toHaveLength(5);
  });

  it("capabilities do not expose stdout/stderr/exitCode as outputs", () => {
    for (const capability of contract.capabilities) {
      if (capability.outputs) {
        expect(capability.outputs).not.toContain("stdout");
        expect(capability.outputs).not.toContain("stderr");
        expect(capability.outputs).not.toContain("exitCode");
      }
    }
  });

  it("resultModel is defined (SUCCESS|BLOCKED|FAILED)", () => {
    expect(contract.resultModel).toEqual(["SUCCESS", "BLOCKED", "FAILED"]);
  });

  it("artifactBoundary is 'out/'", () => {
    expect(contract.artifactBoundary).toBe("out/");
  });

  it("inspect capability outputs expected metadata", () => {
    const inspectCap = contract.capabilities.find((c: any) => c.name === "inspect");
    expect(inspectCap.outputs).toEqual(["contractVersion", "projectId", "projectVersion", "capabilities", "productions"]);
  });

  it("preflight capability outputs status and checks", () => {
    const preflightCap = contract.capabilities.find((c: any) => c.name === "preflight");
    expect(preflightCap.outputs).toEqual(["status", "checks"]);
  });

  it("tts capability defines productionId input", () => {
    const ttsCap = contract.capabilities.find((c: any) => c.name === "tts");
    expect(ttsCap.inputs[0].name).toBe("productionId");
    expect(ttsCap.outputs).toEqual(["status", "artifact"]);
  });

  it("render capability defines composition and output inputs", () => {
    const renderCap = contract.capabilities.find((c: any) => c.name === "render");
    expect(renderCap.inputs.map((i: any) => i.name)).toEqual(["composition", "output"]);
    expect(renderCap.outputs).toEqual(["status", "artifact"]);
  });

  it("verify capability defines optional target input", () => {
    const verifyCap = contract.capabilities.find((c: any) => c.name === "verify");
    expect(verifyCap.inputs.find((i: any) => i.name === "target")?.type).toBe("string");
    expect(verifyCap.outputs).toEqual(["status", "checks"]);
  });
});

// ─── Production definitions (stable composition identities) ─────────────────

describe("Contract productions: stable composition identities", () => {
  let contract: any;
  beforeAll(() => {
    contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
  });

  it("productions map exists", () => {
    expect(contract.productions).toBeDefined();
    expect(Object.keys(contract.productions).length).toBeGreaterThan(0);
  });

  it("each production defines id, composition, output, format", () => {
    const productions = Object.values(contract.productions) as any[];
    for (const prod of productions) {
      expect(prod.id).toBeDefined();
      expect(prod.composition).toBeDefined();
      expect(prod.output).toBeDefined();
      expect(prod.format).toBeDefined();
    }
  });

  it("productions have consistent formats (16:9 or 9:16)", () => {
    const productions = Object.values(contract.productions) as any[];
    for (const prod of productions) {
      expect(["16:9", "9:16"]).toContain(prod.format);
    }
  });
});

// ─── Native command integration tests ───────────────────────────────────────

describe("Native command execution: inspect and preflight", () => {
  it("npm run inspect emits contract metadata", () => {
    const result = inspectContractData(CONTRACT_PATH);
    expect(result.contractVersion).toBe("1.0");
    expect(result.capabilities).toEqual(["inspect", "preflight", "tts", "render", "verify"]);
    expect(Object.keys(result.productions).length).toBeGreaterThan(0);
  });

  it("npm run preflight for a healthy project returns READY", () => {
    const result = evaluatePreflight(ROOT);
    expect(result.status).toBe("READY");
    expect(result.checks.length).toBeGreaterThanOrEqual(2);
    expect(result.checks.every((c: any) => c.state === "READY")).toBe(true);
  });
});

// ─── TTS limitations ────────────────────────────────────────────────────────

describe("TTS capability: implementation limitation", () => {
  let contract: any;
  beforeAll(() => {
    contract = JSON.parse(readFileSync(CONTRACT_PATH, "utf8"));
  });

  it("tts capability documentation exists for limitation", () => {
    expect(contract.tts).toBeDefined();
    expect(contract.tts.notes).toContain("SolarSystem");
    expect(contract.tts.notes).toContain("implementation limitation");
  });
});
