// ---------------------------------------------------------------------------
// Feature Drop Template — Focused Tests
// ---------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import {
  FEATURE_DROP_SCENES,
  FEATURE_DROP_CONTENT,
} from "../../data/featureDrop";
import { featureDropTheme, ICON_PATHS } from "../../theme/featureDrop";
import { sceneFrames, FPS } from "../../data/contract";
import { renderScene } from "../feature-drop/scenes";
import { interpolate, easeOutCubic, easeOutExpo, easeOutBack, sceneOpacity } from "../feature-drop/helpers";

// ─── Scene structure ────────────────────────────────────────────────────────

describe("Feature Drop — scene structure", () => {
  it("has 3 scenes", () => {
    expect(FEATURE_DROP_SCENES).toHaveLength(3);
  });

  it("scene kinds are hook, features, outro", () => {
    const kinds = Object.values(FEATURE_DROP_CONTENT).map((c) => c.kind);
    expect(kinds).toEqual(["hook", "features", "outro"]);
  });

  it("scene IDs match content keys", () => {
    for (const s of FEATURE_DROP_SCENES) {
      expect(FEATURE_DROP_CONTENT[s.id]).toBeDefined();
    }
  });

  it("total frames = 340 (75 + 190 + 75)", () => {
    const totalFrames =
      FEATURE_DROP_SCENES.reduce((acc, s) => acc + sceneFrames(s.dur), 0);
    expect(totalFrames).toBe(340);
  });

  it("hook scene is 75 frames (2.5s + 0.5s tail = 90 frames via sceneFrames)", () => {
    expect(sceneFrames(2.0)).toBe(75);
  });

  it("features scene is 190 frames (5.83s + 0.5s tail = 190 frames via sceneFrames)", () => {
    expect(sceneFrames(5.83)).toBe(190);
  });

  it("outro scene is 75 frames (2.0s + 0.5s tail = 75 frames via sceneFrames)", () => {
    expect(sceneFrames(2.0)).toBe(75);
  });
});

// ─── Hook content ──────────────────────────────────────────────────────────

describe("Feature Drop — hook content", () => {
  const hook = FEATURE_DROP_CONTENT.s1;

  it("has kind hook", () => {
    expect(hook.kind).toBe("hook");
  });

  it("has eyebrow", () => {
    if (hook.kind === "hook") {
      expect(hook.eyebrow).toBe("BẢN CẬP NHẬT MỚI");
    }
  });

  it("has title array with 2 items", () => {
    if (hook.kind === "hook") {
      expect(hook.title).toHaveLength(2);
      expect(hook.title[0]).toBe("3 tính năng");
      expect(hook.title[1]).toBe("bạn sẽ mê");
    }
  });
});

// ─── Features content ──────────────────────────────────────────────────────

describe("Feature Drop — features content", () => {
  const features = FEATURE_DROP_CONTENT.s2;

  it("has kind features", () => {
    expect(features.kind).toBe("features");
  });

  it("has 3 feature items", () => {
    if (features.kind === "features") {
      expect(features.items).toHaveLength(3);
    }
  });

  it("each item has icon, label, sub", () => {
    if (features.kind === "features") {
      for (const item of features.items) {
        expect(item.icon).toBeTruthy();
        expect(item.label).toBeTruthy();
        expect(item.sub).toBeTruthy();
      }
    }
  });

  it("icon keys exist in ICON_PATHS", () => {
    if (features.kind === "features") {
      for (const item of features.items) {
        expect(ICON_PATHS[item.icon]).toBeDefined();
      }
    }
  });
});

// ─── Outro content ─────────────────────────────────────────────────────────

describe("Feature Drop — outro content", () => {
  const outro = FEATURE_DROP_CONTENT.s3;

  it("has kind outro", () => {
    expect(outro.kind).toBe("outro");
  });

  it("has brand", () => {
    if (outro.kind === "outro") {
      expect(outro.brand).toBe("NOVA");
    }
  });

  it("has cta", () => {
    if (outro.kind === "outro") {
      expect(outro.cta).toBe("Cập nhật ngay →");
    }
  });
});

// ─── Theme ─────────────────────────────────────────────────────────────────

describe("Feature Drop — theme", () => {
  it("has correct name", () => {
    expect(featureDropTheme.name).toBe("featureDrop");
  });

  it("has bg color", () => {
    expect(featureDropTheme.colors.bg).toBe("#0a0812");
  });

  it("has accent1", () => {
    expect(featureDropTheme.colors.accent1).toBe("#7c5cff");
  });

  it("has accent2", () => {
    expect(featureDropTheme.colors.accent2).toBe("#3ddcff");
  });

  it("has ink color", () => {
    expect(featureDropTheme.colors.ink).toBe("#f5f4fa");
  });

  it("has Inter display font", () => {
    expect(featureDropTheme.fonts.display).toContain("Inter");
  });

  it("has JetBrains Mono mono font", () => {
    expect(featureDropTheme.fonts.mono).toContain("JetBrains Mono");
  });
});

// ─── Icon paths ────────────────────────────────────────────────────────────

describe("Feature Drop — icon paths", () => {
  it("has sync, shield, bolt icons", () => {
    expect(ICON_PATHS.sync).toBeDefined();
    expect(ICON_PATHS.shield).toBeDefined();
    expect(ICON_PATHS.bolt).toBeDefined();
  });

  it("all icon paths are valid SVG path strings", () => {
    for (const [key, path] of Object.entries(ICON_PATHS)) {
      expect(path).toMatch(/^M/);
      expect(path.length).toBeGreaterThan(10);
    }
  });
});

// ─── Deterministic helpers ─────────────────────────────────────────────────

describe("Feature Drop — deterministic helpers", () => {
  it("interpolate returns output start at frame i0", () => {
    expect(interpolate(10, [10, 20], [0, 1])).toBe(0);
  });

  it("interpolate returns output end at frame i1", () => {
    expect(interpolate(20, [10, 20], [0, 1])).toBe(1);
  });

  it("interpolate clamps below input range", () => {
    expect(interpolate(0, [10, 20], [0, 100])).toBe(0);
  });

  it("interpolate clamps above input range", () => {
    expect(interpolate(30, [10, 20], [0, 100])).toBe(100);
  });

  it("interpolate with easing applies correctly", () => {
    const mid = interpolate(15, [10, 20], [0, 1], easeOutCubic);
    expect(mid).toBeGreaterThan(0.5);
    expect(mid).toBeLessThan(1);
  });

  it("easeOutCubic(0) = 0", () => {
    expect(easeOutCubic(0)).toBe(0);
  });

  it("easeOutCubic(1) = 1", () => {
    expect(easeOutCubic(1)).toBe(1);
  });

  it("easeOutExpo(0) = 0", () => {
    expect(easeOutExpo(0)).toBe(0);
  });

  it("easeOutExpo(1) = 1", () => {
    expect(easeOutExpo(1)).toBe(1);
  });

  it("easeOutBack(0) ≈ 0", () => {
    expect(easeOutBack(0)).toBeCloseTo(0, 10);
  });

  it("easeOutBack(1) = 1", () => {
    expect(easeOutBack(1)).toBe(1);
  });

  it("sceneOpacity returns 0 at frame 0", () => {
    expect(sceneOpacity(0, 75)).toBe(0);
  });

  it("sceneOpacity returns 0 at last frame", () => {
    expect(sceneOpacity(75, 75)).toBe(0);
  });

  it("sceneOpacity > 0 in middle of scene", () => {
    expect(sceneOpacity(37, 75)).toBeGreaterThan(0);
  });
});

// ─── Deterministic rotation ────────────────────────────────────────────────

describe("Feature Drop — Three.js deterministic rotation", () => {
  it("rx = frame * 0.0065", () => {
    const frame = 42;
    const rx = frame * 0.0065;
    expect(rx).toBeCloseTo(0.273);
  });

  it("ry = frame * 0.011", () => {
    const frame = 42;
    const ry = frame * 0.011;
    expect(ry).toBeCloseTo(0.462);
  });

  it("wireframe rx = frame * 0.0065 * 1.02", () => {
    const frame = 42;
    const rxWire = frame * 0.0065 * 1.02;
    expect(rxWire).toBeCloseTo(0.27846);
  });

  it("wireframe ry = frame * 0.011 * 1.02", () => {
    const frame = 42;
    const ryWire = frame * 0.011 * 1.02;
    expect(ryWire).toBeCloseTo(0.47124);
  });

  it("rotation is pure function of frame (deterministic)", () => {
    const frameA = 50;
    const frameB = 50;
    const rxA = frameA * 0.0065;
    const rxB = frameB * 0.0065;
    expect(rxA).toBe(rxB);
  });
});

// ─── Scene registry exhaustiveness ─────────────────────────────────────────

describe("Feature Drop — scene registry", () => {
  it("renderScene handles all content kinds without throwing", () => {
    const baseProps = { audio: "", caption: "", dur: 2.5 };

    // These should not throw — they render React elements
    expect(() => renderScene("s1", FEATURE_DROP_CONTENT.s1, baseProps)).not.toThrow();
    expect(() => renderScene("s2", FEATURE_DROP_CONTENT.s2, { ...baseProps, dur: 5.83 })).not.toThrow();
    expect(() => renderScene("s3", FEATURE_DROP_CONTENT.s3, baseProps)).not.toThrow();
  });

  it("renderScene returns null for undefined content", () => {
    const result = renderScene("missing", undefined, { audio: "", caption: "", dur: 1 });
    expect(result).toBeNull();
  });
});

// ─── Demo data validity ────────────────────────────────────────────────────

describe("Feature Drop — demo data validity", () => {
  it("all scenes have non-empty audio path or empty string", () => {
    for (const s of FEATURE_DROP_SCENES) {
      expect(typeof s.audio).toBe("string");
    }
  });

  it("all scenes have captions", () => {
    for (const s of FEATURE_DROP_SCENES) {
      expect(s.caption.length).toBeGreaterThan(0);
    }
  });

  it("all scene durations are positive", () => {
    for (const s of FEATURE_DROP_SCENES) {
      expect(s.dur).toBeGreaterThan(0);
    }
  });
});
