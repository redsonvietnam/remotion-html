import { describe, it, expect } from "vitest";
import * as nq57 from "./nq57";
import * as deAn06 from "./deAn06";
import * as nghiQuyet79 from "./nghiQuyet79";
import * as stoicLove from "./stoicLove";
import { validateProductionData, validateStoryboard, TEMPLATE_SCHEMAS } from "./contract";

const baseScene = { id: "s1", audio: "x/s1.mp3", caption: "narration", dur: 5 };

describe("existing productions validate", () => {
  it("nq57", () => {
    const r = validateProductionData(nq57 as any, "nq57");
    expect(r.valid).toBe(true);
  });
  it("dean06", () => {
    const r = validateProductionData(deAn06 as any, "dean06");
    expect(r.valid).toBe(true);
  });
  it("nq79", () => {
    const r = validateProductionData(nghiQuyet79 as any, "nq79");
    expect(r.valid).toBe(true);
  });
  it("stoiclove", () => {
    const r = validateProductionData(stoicLove as any, "stoiclove");
    expect(r.valid).toBe(true);
  });
});

describe("invalid production data is rejected", () => {
  it("missing scene content (scene-count mismatch)", () => {
    const mod = { SCENES: [baseScene], CONTENT: { s2: { kind: "quote", text: "x" } } };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.code === "MISSING_SCENE_CONTENT")).toBe(true);
  });

  it("invalid scene kind", () => {
    const mod = { SCENES: [baseScene], CONTENT: { s1: { kind: "bogus" } } };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.errors.some((e) => e.code === "INVALID_SCENE_KIND")).toBe(true);
  });

  it("unsupported template/content combination", () => {
    const mod = { SCENES: [baseScene], CONTENT: { s1: { kind: "quote", text: "x" } } };
    const r = validateProductionData(mod as any, "stoiclove");
    expect(r.errors.some((e) => e.code === "INVALID_SCENE_KIND")).toBe(true);
  });

  it("missing narration", () => {
    const mod = { SCENES: [{ ...baseScene, caption: "" }], CONTENT: { s1: { kind: "quote", text: "x" } } };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.errors.some((e) => e.code === "MISSING_NARRATION")).toBe(true);
  });

  it("invalid duration", () => {
    const mod = { SCENES: [{ ...baseScene, dur: 0 }], CONTENT: { s1: { kind: "quote", text: "x" } } };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.errors.some((e) => e.code === "INVALID_DURATION")).toBe(true);
  });

  it("invalid audio path", () => {
    const mod = { SCENES: [{ ...baseScene, audio: "" }], CONTENT: { s1: { kind: "quote", text: "x" } } };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.errors.some((e) => e.code === "INVALID_AUDIO_PATH")).toBe(true);
  });

  it("orphan content (scene-count mismatch)", () => {
    const mod = {
      SCENES: [baseScene],
      CONTENT: { s1: { kind: "quote", text: "x" }, s2: { kind: "quote", text: "y" } },
    };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.errors.some((e) => e.code === "ORPHAN_CONTENT")).toBe(true);
  });

  it("missing required text field", () => {
    const mod = { SCENES: [baseScene], CONTENT: { s1: { kind: "quote" } } };
    const r = validateProductionData(mod as any, "nq57");
    expect(r.errors.some((e) => e.code === "MISSING_TEXT")).toBe(true);
  });
});

describe("storyboard contract", () => {
  const valid = {
    project: "demo",
    topic: "Demo topic",
    platform: "youtube",
    aspectRatio: "16:9",
    template: "nq57",
    scenes: [
      {
        id: "s1",
        kind: "title",
        purpose: "Introduce",
        narration: "X",
        onScreenText: "Y",
        visualConcept: "Z",
        factualClaims: [{ claim: "A", source: "official.gov", verified: true }],
      },
    ],
  };

  it("valid storyboard passes", () => {
    expect(validateStoryboard(valid).valid).toBe(true);
  });

  it("unverified claim is rejected", () => {
    const sb = JSON.parse(JSON.stringify(valid));
    sb.scenes[0].factualClaims[0].verified = false;
    const r = validateStoryboard(sb);
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.code === "UNVERIFIED_CLAIM")).toBe(true);
  });

  it("missing source is rejected", () => {
    const sb = JSON.parse(JSON.stringify(valid));
    sb.scenes[0].factualClaims[0].source = "";
    const r = validateStoryboard(sb);
    expect(r.errors.some((e) => e.code === "MISSING_SOURCE")).toBe(true);
  });
});

describe("template schemas", () => {
  it("covers all four templates", () => {
    for (const t of ["nq57", "dean06", "nq79", "stoiclove"]) {
      expect(TEMPLATE_SCHEMAS[t]).toBeDefined();
    }
  });
});
