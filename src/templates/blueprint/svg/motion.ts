// ---------------------------------------------------------------------------
// Blueprint — Motion Language
//
// Motion vocabulary for the Blueprint template. Every category maps to a
// semantic role, not a generic "animation style":
//
//   draft   — a line/shape being drawn by an unseen drafting pen (stroke
//             length progress). Used for grid, dimension lines, glyphs.
//   snap    — an element dropping into place and locking onto the grid with
//             a small overshoot, as if magnetically snapped to a gridline.
//   measure — a dimension line extending to "measure" an emphasized value.
//   settle  — calm settle-in for body text/labels once structure exists.
// ---------------------------------------------------------------------------

import { spring, interpolate } from "remotion";

export type MotionCategory = "draft" | "snap" | "measure" | "settle";

export const SPRING: Record<
  MotionCategory,
  { damping: number; mass: number; stiffness: number }
> = {
  draft: { damping: 200, mass: 0.4, stiffness: 60 }, // near-linear, mechanical
  snap: { damping: 12, mass: 0.5, stiffness: 180 }, // visible overshoot
  measure: { damping: 24, mass: 0.6, stiffness: 90 },
  settle: { damping: 26, mass: 1.0, stiffness: 40 },
};

/** Spring progress 0..1 for a given category starting at `delay`. */
export const sp = (
  frame: number,
  delay: number,
  fps: number,
  cat: MotionCategory = "snap"
): number => spring({ frame: frame - delay, fps, config: SPRING[cat] });

/** Clamped linear ramp between two frames. */
export const ramp = (
  frame: number,
  start: number,
  end: number,
  from = 0,
  to = 1
): number =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Stroke-draw progress (0..1) — mechanical, near-constant pen speed. */
export const draftProgress = (
  frame: number,
  delay: number,
  fps: number,
  duration = 26
): number => ramp(frame, delay, delay + duration, 0, 1);

/** A brief bracket-flash pulse (0..1..0) fired once an element snaps in. */
export const snapFlash = (frame: number, delay: number, fps: number): number => {
  const t = sp(frame, delay, fps, "snap");
  const settled = ramp(frame, delay + 10, delay + 26, 1, 0);
  return Math.min(t, 1) * settled;
};

/** Gentle grid drift (px) — near-static, communicates depth without noise. */
export const gridDrift = (frame: number, fps: number, amount = 6): number =>
  Math.sin(frame / fps / 9) * amount;
