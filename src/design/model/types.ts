// ---------------------------------------------------------------------------
// Design Model — Renderer-agnostic scene contract
//
// Defines the minimal representation of a scene that both Preview and
// Remotion adapters can consume. Motion primitives receive frame/fps
// as props — never from hooks.
// ---------------------------------------------------------------------------

import type { CSSProperties } from "react";

/** Canonical time unit: frames at project FPS. */
export type Frames = number;

/** Progress value normalized to [0, 1]. */
export type Progress = number;

/** Frame-based timing for a scene. */
export interface SceneTiming {
  /** Total frames for this scene (including any tail buffer). */
  durationFrames: Frames;
  /** Project FPS. */
  fps: number;
}

/** A renderable scene in the design model. */
export interface DesignScene {
  /** Unique scene identifier (e.g. "s1", "s2"). */
  id: string;
  /** Scene kind — maps to template component. */
  kind: string;
  /** Frame timing. */
  timing: SceneTiming;
  /** Scene content — template-specific data. */
  content: Record<string, unknown>;
}

/** Adapter-agnostic frame context passed to all visual components. */
export interface FrameContext {
  /** Current frame (0-based). */
  frame: Frames;
  /** Project FPS. */
  fps: number;
  /** Normalized progress [0, 1] = frame / durationFrames. */
  progress: Progress;
}

/**
 * Motion primitive contract.
 *
 * A pure function that takes a FrameContext and returns visual props/style.
 * Must NOT call useCurrentFrame(), useVideoConfig(), or any React hook.
 */
export type MotionPrimitive<T = CSSProperties> = (
  ctx: FrameContext,
  ...args: unknown[]
) => T;

/** Canvas dimensions. */
export interface CanvasSize {
  width: number;
  height: number;
}

/** Standard 16:9 landscape canvas. */
export const CANVAS_16_9: CanvasSize = { width: 1920, height: 1080 };

/** Standard 9:16 portrait canvas. */
export const CANVAS_9_16: CanvasSize = { width: 1080, height: 1920 };

/** Project-wide FPS constant. */
export const PROJECT_FPS = 30;
