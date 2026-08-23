// ---------------------------------------------------------------------------
// Design Model Tests
// ---------------------------------------------------------------------------

import { describe, it, expect } from "vitest";
import {
  frameToProgress,
  buildFrameContext,
  progressToFrame,
  secondsToFrames,
  framesToSeconds,
  formatFrameTime,
  CANVAS_16_9,
  CANVAS_9_16,
  PROJECT_FPS,
} from "../index";
import { clampProgress } from "../../motion/types";

describe("Design Model — types and constants", () => {
  it("CANVAS_16_9 is 1920x1080", () => {
    expect(CANVAS_16_9).toEqual({ width: 1920, height: 1080 });
  });

  it("CANVAS_9_16 is 1080x1920", () => {
    expect(CANVAS_9_16).toEqual({ width: 1080, height: 1920 });
  });

  it("PROJECT_FPS is 30", () => {
    expect(PROJECT_FPS).toBe(30);
  });
});

describe("Design Model — frameToProgress", () => {
  it("frame 0 → progress 0", () => {
    expect(frameToProgress(0, 100)).toBe(0);
  });

  it("frame at duration-1 → progress 1", () => {
    expect(frameToProgress(99, 100)).toBe(1);
  });

  it("frame in middle → progress ~0.5", () => {
    const p = frameToProgress(50, 100);
    expect(p).toBeGreaterThan(0.49);
    expect(p).toBeLessThan(0.51);
  });

  it("zero duration → progress 1", () => {
    expect(frameToProgress(0, 0)).toBe(1);
  });

  it("clamps to [0, 1]", () => {
    expect(frameToProgress(-10, 100)).toBe(0);
    expect(frameToProgress(200, 100)).toBe(1);
  });
});

describe("Design Model — buildFrameContext", () => {
  it("returns correct frame, fps, progress", () => {
    const ctx = buildFrameContext(15, 300, 30);
    expect(ctx.frame).toBe(15);
    expect(ctx.fps).toBe(30);
    expect(ctx.progress).toBeCloseTo(15 / 299, 5);
  });

  it("frame 0 has progress 0", () => {
    const ctx = buildFrameContext(0, 100, 30);
    expect(ctx.progress).toBe(0);
  });

  it("last frame has progress 1", () => {
    const ctx = buildFrameContext(299, 300, 30);
    expect(ctx.progress).toBe(1);
  });
});

describe("Design Model — progressToFrame", () => {
  it("progress 0 → frame 0", () => {
    expect(progressToFrame(0, 100)).toBe(0);
  });

  it("progress 1 → frame duration-1", () => {
    expect(progressToFrame(1, 100)).toBe(99);
  });

  it("progress 0.5 → frame near middle", () => {
    expect(progressToFrame(0.5, 100)).toBe(50);
  });
});

describe("Design Model — secondsToFrames / framesToSeconds", () => {
  it("3 seconds at 30fps = 90 frames", () => {
    expect(secondsToFrames(3, 30)).toBe(90);
  });

  it("90 frames at 30fps = 3 seconds", () => {
    expect(framesToSeconds(90, 30)).toBe(3);
  });

  it("round-trips seconds → frames → seconds", () => {
    const frames = secondsToFrames(5.5, 30);
    const seconds = framesToSeconds(frames, 30);
    expect(seconds).toBeCloseTo(5.5, 1);
  });
});

describe("Design Model — formatFrameTime", () => {
  it("frame 0 → 0:00.00", () => {
    expect(formatFrameTime(0, 30)).toBe("0:00.00");
  });

  it("frame 30 → 0:01.00", () => {
    expect(formatFrameTime(30, 30)).toBe("0:01.00");
  });

  it("frame 90 → 0:03.00", () => {
    expect(formatFrameTime(90, 30)).toBe("0:03.00");
  });

  it("frame 45 → 0:01.50", () => {
    expect(formatFrameTime(45, 30)).toBe("0:01.50");
  });
});
