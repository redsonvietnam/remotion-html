import { describe, it, expect } from "vitest";
import { getPreset, resolveConfig, totalFrames, sceneFrames } from "../helpers";
import { PRESETS } from "../types";

describe("getPreset", () => {
  it("fade preset", () => {
    expect(getPreset("fade").type).toBe("fade");
  });

  it("fade duration", () => {
    expect(getPreset("fade").durationInFrames).toBe(16);
  });

  it("cut preset = none", () => {
    expect(getPreset("cut").type).toBe("none");
  });

  it("cut duration = 0", () => {
    expect(getPreset("cut").durationInFrames).toBe(0);
  });

  it("slideLeft preset", () => {
    expect(getPreset("slideLeft").type).toBe("slide");
  });

  it("slideLeft direction", () => {
    expect(getPreset("slideLeft").slideDirection).toBe("left");
  });
});

describe("resolveConfig", () => {
  it("default type = fade", () => {
    const resolved = resolveConfig({});
    expect(resolved.type).toBe("fade");
  });

  it("default duration = 16", () => {
    const resolved = resolveConfig({});
    expect(resolved.durationInFrames).toBe(16);
  });

  it("custom type preserved", () => {
    const custom = resolveConfig({ type: "slide", slideDirection: "right" });
    expect(custom.type).toBe("slide");
  });

  it("custom direction preserved", () => {
    const custom = resolveConfig({ type: "slide", slideDirection: "right" });
    expect(custom.slideDirection).toBe("right");
  });

  it("default duration applied", () => {
    const custom = resolveConfig({ type: "slide", slideDirection: "right" });
    expect(custom.durationInFrames).toBe(16);
  });
});

describe("sceneFrames", () => {
  it("3s @ 30fps = 90 frames", () => {
    expect(sceneFrames(3, 30)).toBe(90);
  });

  it("1s @ 60fps = 60 frames", () => {
    expect(sceneFrames(1, 60)).toBe(60);
  });

  it("0s = 0 frames", () => {
    expect(sceneFrames(0, 30)).toBe(0);
  });

  it("2.5s @ 30fps = 75 frames", () => {
    expect(sceneFrames(2.5, 30)).toBe(75);
  });
});

describe("totalFrames", () => {
  it("3 scenes + 2 transitions", () => {
    expect(totalFrames([3, 3, 3], 16, 30)).toBe(302);
  });

  it("1 scene no transitions", () => {
    expect(totalFrames([3], 16, 30)).toBe(90);
  });

  it("cut transitions = 0 frames", () => {
    expect(totalFrames([1, 1], 0, 30)).toBe(60);
  });

  it("no scenes = 0", () => {
    expect(totalFrames([], 16, 30)).toBe(0);
  });
});

describe("PRESETS", () => {
  it("at least 8 presets", () => {
    expect(Object.keys(PRESETS).length).toBeGreaterThanOrEqual(8);
  });

  it("fade preset exists", () => {
    expect(PRESETS.fade).toBeDefined();
  });

  it("cut preset exists", () => {
    expect(PRESETS.cut).toBeDefined();
  });

  it("slideLeft preset exists", () => {
    expect(PRESETS.slideLeft).toBeDefined();
  });

  it("wipeLeft preset exists", () => {
    expect(PRESETS.wipeLeft).toBeDefined();
  });
});

describe("determinism", () => {
  it("same input produces identical output", () => {
    const r1 = totalFrames([3, 3, 3], 16, 30);
    const r2 = totalFrames([3, 3, 3], 16, 30);
    expect(r1).toBe(r2);
  });
});
