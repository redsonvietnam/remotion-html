import { describe, it, expect } from "vitest";
import { computeTickMarks, clampProgress } from "../types";

describe("clampProgress", () => {
  it("normal value passes through", () => {
    expect(clampProgress(0.5)).toBe(0.5);
  });

  it("zero stays zero", () => {
    expect(clampProgress(0)).toBe(0);
  });

  it("one stays one", () => {
    expect(clampProgress(1)).toBe(1);
  });

  it("negative clamps to 0", () => {
    expect(clampProgress(-0.5)).toBe(0);
  });

  it("above 1 clamps to 1", () => {
    expect(clampProgress(1.5)).toBe(1);
  });

  it("large value clamps to 1", () => {
    expect(clampProgress(999)).toBe(1);
  });

  it("large negative clamps to 0", () => {
    expect(clampProgress(-999)).toBe(0);
  });
});

describe("computeTickMarks", () => {
  const approxEqual = (a: number, b: number, eps = 0.01) => Math.abs(a - b) < eps;

  it("8 ticks generated", () => {
    const marks = computeTickMarks(8, 50, 50, 51, 55);
    expect(marks.length).toBe(8);
  });

  it("tick 0 at top position", () => {
    const marks = computeTickMarks(8, 50, 50, 51, 55);
    expect(approxEqual(marks[0].x1, 50)).toBe(true);
    expect(approxEqual(marks[0].y1, -1)).toBe(true);
    expect(approxEqual(marks[0].x2, 50)).toBe(true);
    expect(approxEqual(marks[0].y2, -5)).toBe(true);
  });

  it("4 ticks at cardinal positions", () => {
    const marks = computeTickMarks(4, 50, 50, 40, 45);
    expect(marks.length).toBe(4);

    // Tick 0: top
    expect(approxEqual(marks[0].x1, 50)).toBe(true);
    expect(approxEqual(marks[0].y1, 10)).toBe(true);

    // Tick 1: right
    expect(approxEqual(marks[1].x1, 90)).toBe(true);
    expect(approxEqual(marks[1].y1, 50)).toBe(true);

    // Tick 2: bottom
    expect(approxEqual(marks[2].x1, 50)).toBe(true);
    expect(approxEqual(marks[2].y1, 90)).toBe(true);

    // Tick 3: left
    expect(approxEqual(marks[3].x1, 10)).toBe(true);
    expect(approxEqual(marks[3].y1, 50)).toBe(true);
  });

  it("0 ticks returns empty", () => {
    expect(computeTickMarks(0, 50, 50, 40, 45).length).toBe(0);
  });

  it("1 tick", () => {
    expect(computeTickMarks(1, 50, 50, 40, 45).length).toBe(1);
  });

  it("deterministic", () => {
    const m1 = computeTickMarks(8, 50, 50, 51, 55);
    const m2 = computeTickMarks(8, 50, 50, 51, 55);
    expect(m1).toEqual(m2);
  });
});
