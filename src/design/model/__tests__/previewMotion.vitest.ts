// ---------------------------------------------------------------------------
// Preview Motion Tests — pure functions of frame/fps
// ---------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import { clampProgress } from "../../motion/types";

// Re-implement the pure motion functions used in Preview Studio
// (same logic as preview/studio.html, but testable)
function springV(f: number, fps: number, cfg: { damping?: number; mass?: number } = {}) {
  const { damping: z = 18, mass: m = 0.6 } = cfg;
  const x = Math.max(0, f);
  const w = Math.sqrt((z * z) / (m * m) + 100);
  const zr = z / (2 * w);
  if (zr < 1) {
    const wd = w * Math.sqrt(1 - zr * zr);
    return (
      1 -
      Math.exp(-zr * w * x / fps) *
        (Math.cos((wd * x) / fps) + ((zr * w) / wd) * Math.sin((wd * x) / fps))
    );
  }
  return 1 - Math.exp(-w * x / fps) * (1 + (w * x) / fps);
}

function textIn(f: number, d: number, fps: number, dist = 30) {
  const t = springV(f - d, fps, { damping: 22, mass: 0.4 });
  return {
    opacity: clampProgress(t),
    transform: `translateY(${(1 - clampProgress(t)) * dist}px)`,
  };
}

function rev(f: number, d: number, dur: number) {
  return clampProgress((f - d) / dur);
}

describe("Preview Motion — springV", () => {
  it("spring at frame 0 → ~0", () => {
    const v = springV(0, 30);
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThan(0.1);
  });

  it("spring at frame 30 (1s) → near 1", () => {
    const v = springV(30, 30);
    expect(v).toBeGreaterThan(0.8);
  });

  it("spring at frame 60 (2s) → very close to 1", () => {
    const v = springV(60, 30);
    expect(v).toBeGreaterThan(0.95);
  });

  it("negative frame → clamped to 0 output", () => {
    const v = springV(-10, 30);
    expect(v).toBe(0);
  });

  it("higher damping → slower convergence", () => {
    const fast = springV(15, 30, { damping: 12, mass: 0.4 });
    const slow = springV(15, 30, { damping: 30, mass: 0.8 });
    expect(fast).toBeGreaterThan(slow);
  });
});

describe("Preview Motion — textIn", () => {
  it("at delay frame → starts animating", () => {
    const r = textIn(0, 0, 30);
    expect(r.opacity).toBeGreaterThanOrEqual(0);
    expect(r.opacity).toBeLessThan(1);
  });

  it("well past delay → fully visible", () => {
    const r = textIn(30, 0, 30);
    expect(r.opacity).toBeCloseTo(1, 1);
  });

  it("before delay → invisible", () => {
    const r = textIn(0, 10, 30);
    expect(r.opacity).toBe(0);
  });

  it("transform includes translateY", () => {
    const r = textIn(0, 0, 30);
    expect(r.transform).toContain("translateY");
  });
});

describe("Preview Motion — rev (reveal)", () => {
  it("frame before start → 0", () => {
    expect(rev(0, 10, 20)).toBe(0);
  });

  it("frame at start → 0", () => {
    expect(rev(10, 10, 20)).toBe(0);
  });

  it("frame at end → 1", () => {
    expect(rev(30, 10, 20)).toBe(1);
  });

  it("frame in middle → ~0.5", () => {
    const v = rev(20, 10, 20);
    expect(v).toBeGreaterThan(0.49);
    expect(v).toBeLessThan(0.51);
  });

  it("clamps to [0, 1]", () => {
    expect(rev(-5, 10, 20)).toBe(0);
    expect(rev(100, 10, 20)).toBe(1);
  });
});

describe("Preview Motion — deterministic behavior", () => {
  it("same inputs → same outputs", () => {
    const r1 = textIn(15, 5, 30, 40);
    const r2 = textIn(15, 5, 30, 40);
    expect(r1).toEqual(r2);
  });

  it("different frame → different result", () => {
    const r1 = textIn(5, 0, 30);
    const r2 = textIn(20, 0, 30);
    expect(r1.opacity).not.toBe(r2.opacity);
  });

  it("different fps → different result", () => {
    const r1 = textIn(15, 0, 30);
    const r2 = textIn(15, 0, 60);
    // Different fps should produce different spring values
    expect(r1.opacity).not.toBe(r2.opacity);
  });
});
