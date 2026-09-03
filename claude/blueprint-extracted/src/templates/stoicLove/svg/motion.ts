// ---------------------------------------------------------------------------
// Stoic Love — Motion Language
//
// Intentional motion categories. Motion supports meaning, not decoration.
//   slow   — emotional / philosophical / ambient
//   medium — explanatory / structural
//   fast   — emphasis / key phrase / transition accent
// ---------------------------------------------------------------------------

import { spring, interpolate } from "remotion";

export type MotionCategory = "slow" | "medium" | "fast";

export const SPRING: Record<
  MotionCategory,
  { damping: number; mass: number; stiffness: number }
> = {
  slow: { damping: 26, mass: 1.0, stiffness: 34 },
  medium: { damping: 22, mass: 0.5, stiffness: 95 },
  fast: { damping: 15, mass: 0.3, stiffness: 165 },
};

/** Spring progress 0..1 for a given category starting at `delay`. */
export const sp = (
  frame: number,
  delay: number,
  fps: number,
  cat: MotionCategory = "medium"
): number =>
  spring({ frame: frame - delay, fps, config: SPRING[cat] });

/** Clamped ramp between two frames. */
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

/** Continuous rotation in degrees from frame at given deg/sec. */
export const rot = (frame: number, fps: number, degPerSec: number): number =>
  (frame / fps) * degPerSec;

/** Gentle oscillation 0..1 (breathing). */
export const breathe = (frame: number, fps: number, period = 4): number =>
  0.5 + 0.5 * Math.sin((frame / fps) * ((2 * Math.PI) / period));
