// ---------------------------------------------------------------------------
// Timing Helpers — Pure functions for frame-based timing
//
// Convert frame/delay/duration into progress values (0-1).
// These are building blocks for motion, SVG, and any frame-driven animation.
// ---------------------------------------------------------------------------

import { interpolate } from "remotion";
import type { LinearProgressConfig } from "./types";
import { clampProgress } from "./types";

/**
 * Compute linear progress (0-1) from frame, startFrame, and endFrame.
 * Returns 0 before start, 1 after end, linear interpolation between.
 *
 * @example
 *   const p = linearProgress({ frame, startFrame: 10, endFrame: 60 });
 *   // p goes from 0 to 1 as frame goes from 10 to 60
 */
export function linearProgress(config: LinearProgressConfig): number {
  const { frame, startFrame, endFrame } = config;
  return clampProgress(
    interpolate(frame, [startFrame, endFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
}

/**
 * Compute delayed progress: progress starts after a delay, then goes 0-1.
 *
 * @example
 *   const p = delayedProgress(frame, { delay: 10, duration: 30 });
 *   // p = 0 for frames 0-10, then 0→1 over frames 10-40
 */
export function delayedProgress(
  frame: number,
  config: { delay: number; duration: number }
): number {
  const { delay, duration } = config;
  return linearProgress({
    frame,
    startFrame: delay,
    endFrame: delay + duration,
  });
}

/**
 * Compute stagger progress for indexed items.
 * Each item starts `stagger` frames after the previous one.
 *
 * @example
 *   items.forEach((_, i) => {
 *     const p = staggerProgress(frame, { index: i, stagger: 14, duration: 20 });
 *   });
 */
export function staggerProgress(
  frame: number,
  config: {
    index: number;
    stagger: number;
    duration: number;
    delay?: number;
  }
): number {
  const { index, stagger: staggerFrames, duration, delay = 0 } = config;
  const itemDelay = delay + index * staggerFrames;
  return delayedProgress(frame, { delay: itemDelay, duration });
}

/**
 * Convert duration in seconds to frames.
 *
 * @example
 *   const frames = secondsToFrames(2.5, 30); // 75
 */
export function secondsToFrames(seconds: number, fps: number): number {
  return Math.round(seconds * fps);
}

/**
 * Convert frames to duration in seconds.
 *
 * @example
 *   const seconds = framesToSeconds(75, 30); // 2.5
 */
export function framesToSeconds(frames: number, fps: number): number {
  return frames / fps;
}
