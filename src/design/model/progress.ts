// ---------------------------------------------------------------------------
// Progress Utilities — Pure functions for frame-to-progress conversion
// ---------------------------------------------------------------------------

import type { Frames, Progress, FrameContext } from "./types";
import { clampProgress } from "../motion/types";

/**
 * Compute normalized progress from frame and duration.
 * Result is clamped to [0, 1].
 */
export function frameToProgress(frame: Frames, durationFrames: Frames): Progress {
  if (durationFrames <= 0) return 1;
  return clampProgress(frame / (durationFrames - 1));
}

/**
 * Build a FrameContext from raw frame and duration values.
 */
export function buildFrameContext(
  frame: Frames,
  durationFrames: Frames,
  fps: number
): FrameContext {
  return {
    frame,
    fps,
    progress: frameToProgress(frame, durationFrames),
  };
}

/**
 * Compute the frame at a given progress value.
 */
export function progressToFrame(progress: Progress, durationFrames: Frames): Frames {
  return Math.round(clampProgress(progress) * (durationFrames - 1));
}

/**
 * Convert seconds to frames at a given FPS.
 */
export function secondsToFrames(seconds: number, fps: number): Frames {
  return Math.ceil(seconds * fps);
}

/**
 * Convert frames to seconds at a given FPS.
 */
export function framesToSeconds(frames: Frames, fps: number): number {
  return frames / fps;
}

/**
 * Format frames as MM:SS.ms display string.
 */
export function formatFrameTime(frame: Frames, fps: number): string {
  const totalSeconds = frame / fps;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const ms = Math.floor((totalSeconds % 1) * 100);
  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
}
