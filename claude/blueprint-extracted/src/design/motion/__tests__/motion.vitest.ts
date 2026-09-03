import { describe, it, expect } from "vitest";
import { clampProgress } from "../types";
import {
  linearProgress,
  delayedProgress,
  staggerProgress,
  secondsToFrames,
  framesToSeconds,
} from "../timing";

describe("clampProgress", () => {
  it("normal value", () => {
    expect(clampProgress(0.5)).toBe(0.5);
  });

  it("zero", () => {
    expect(clampProgress(0)).toBe(0);
  });

  it("one", () => {
    expect(clampProgress(1)).toBe(1);
  });

  it("negative clamps to 0", () => {
    expect(clampProgress(-0.5)).toBe(0);
  });

  it("above 1 clamps to 1", () => {
    expect(clampProgress(1.5)).toBe(1);
  });

  it("large value", () => {
    expect(clampProgress(999)).toBe(1);
  });

  it("large negative", () => {
    expect(clampProgress(-999)).toBe(0);
  });
});

describe("linearProgress", () => {
  const approxEqual = (a: number, b: number, eps = 0.01) => Math.abs(a - b) < eps;

  it("frame 0 = 0", () => {
    expect(approxEqual(linearProgress({ frame: 0, startFrame: 0, endFrame: 100 }), 0)).toBe(true);
  });

  it("frame 50 = 0.5", () => {
    expect(approxEqual(linearProgress({ frame: 50, startFrame: 0, endFrame: 100 }), 0.5)).toBe(true);
  });

  it("frame 100 = 1", () => {
    expect(approxEqual(linearProgress({ frame: 100, startFrame: 0, endFrame: 100 }), 1)).toBe(true);
  });

  it("frame 150 clamped to 1", () => {
    expect(approxEqual(linearProgress({ frame: 150, startFrame: 0, endFrame: 100 }), 1)).toBe(true);
  });

  it("frame -10 clamped to 0", () => {
    expect(approxEqual(linearProgress({ frame: -10, startFrame: 0, endFrame: 100 }), 0)).toBe(true);
  });

  it("before start = 0", () => {
    expect(approxEqual(linearProgress({ frame: 10, startFrame: 20, endFrame: 60 }), 0)).toBe(true);
  });

  it("midpoint = 0.5", () => {
    expect(approxEqual(linearProgress({ frame: 40, startFrame: 20, endFrame: 60 }), 0.5)).toBe(true);
  });

  it("at end = 1", () => {
    expect(approxEqual(linearProgress({ frame: 60, startFrame: 20, endFrame: 60 }), 1)).toBe(true);
  });
});

describe("delayedProgress", () => {
  const approxEqual = (a: number, b: number, eps = 0.01) => Math.abs(a - b) < eps;

  it("before delay = 0", () => {
    expect(approxEqual(delayedProgress(0, { delay: 10, duration: 20 }), 0)).toBe(true);
  });

  it("at delay = 0", () => {
    expect(approxEqual(delayedProgress(10, { delay: 10, duration: 20 }), 0)).toBe(true);
  });

  it("midpoint = 0.5", () => {
    expect(approxEqual(delayedProgress(20, { delay: 10, duration: 20 }), 0.5)).toBe(true);
  });

  it("at end = 1", () => {
    expect(approxEqual(delayedProgress(30, { delay: 10, duration: 20 }), 1)).toBe(true);
  });

  it("after end = 1", () => {
    expect(approxEqual(delayedProgress(40, { delay: 10, duration: 20 }), 1)).toBe(true);
  });
});

describe("staggerProgress", () => {
  const approxEqual = (a: number, b: number, eps = 0.01) => Math.abs(a - b) < eps;

  it("item 0 frame 0 = 0", () => {
    expect(approxEqual(staggerProgress(0, { index: 0, stagger: 14, duration: 10 }), 0)).toBe(true);
  });

  it("item 0 at end = 1", () => {
    expect(approxEqual(staggerProgress(14, { index: 0, stagger: 14, duration: 10 }), 1)).toBe(true);
  });

  it("item 1 starts at 14", () => {
    expect(approxEqual(staggerProgress(14, { index: 1, stagger: 14, duration: 10 }), 0)).toBe(true);
  });

  it("item 1 ends at 28", () => {
    expect(approxEqual(staggerProgress(28, { index: 1, stagger: 14, duration: 10 }), 1)).toBe(true);
  });

  it("item 1 midpoint at frame 19", () => {
    expect(approxEqual(staggerProgress(19, { index: 1, stagger: 14, duration: 10 }), 0.5)).toBe(true);
  });

  it("item 1 at frame 21 = 0.7", () => {
    expect(approxEqual(staggerProgress(21, { index: 1, stagger: 14, duration: 10 }), 0.7)).toBe(true);
  });
});

describe("secondsToFrames / framesToSeconds", () => {
  const approxEqual = (a: number, b: number, eps = 0.01) => Math.abs(a - b) < eps;

  it("2.5s @ 30fps = 75 frames", () => {
    expect(secondsToFrames(2.5, 30)).toBe(75);
  });

  it("1s @ 60fps = 60 frames", () => {
    expect(secondsToFrames(1, 60)).toBe(60);
  });

  it("0s = 0 frames", () => {
    expect(secondsToFrames(0, 30)).toBe(0);
  });

  it("75 frames @ 30fps = 2.5s", () => {
    expect(approxEqual(framesToSeconds(75, 30), 2.5)).toBe(true);
  });

  it("60 frames @ 60fps = 1s", () => {
    expect(approxEqual(framesToSeconds(60, 60), 1)).toBe(true);
  });

  it("0 frames = 0s", () => {
    expect(approxEqual(framesToSeconds(0, 30), 0)).toBe(true);
  });
});

describe("determinism", () => {
  it("same input produces identical output", () => {
    const r1 = linearProgress({ frame: 42, startFrame: 10, endFrame: 80 });
    const r2 = linearProgress({ frame: 42, startFrame: 10, endFrame: 80 });
    expect(r1).toBe(r2);
  });
});
