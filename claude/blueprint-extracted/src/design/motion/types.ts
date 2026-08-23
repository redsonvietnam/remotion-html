// ---------------------------------------------------------------------------
// Motion System — Type Contracts
//
// Template-agnostic motion primitives.
// Pure functions — no React hooks, no browser timing.
// ---------------------------------------------------------------------------

// ─── Direction ──────────────────────────────────────────────────────────────

/** Direction for enter/exit animations. */
export type Direction = "up" | "down" | "left" | "right" | "none";

// ─── Spring ─────────────────────────────────────────────────────────────────

/** Spring configuration for Remotion's spring() function. */
export interface SpringConfig {
  damping: number;
  mass: number;
  stiffness?: number;
}

// ─── MotionResult ───────────────────────────────────────────────────────────

/** Standard motion return value — opacity + CSS transform. */
export interface MotionStyle {
  opacity: number;
  transform: string;
}

// ─── fadeSlide ──────────────────────────────────────────────────────────────

export interface FadeSlideConfig {
  /** Current frame (from useCurrentFrame() or any source). */
  frame: number;

  /** Frame delay before animation starts. Default: 0. */
  delay?: number;

  /** Direction of slide. Default: "up". */
  direction?: Direction;

  /** Translate distance in pixels. Default: 40. */
  distance?: number;

  /** Spring config. Default: { damping: 18, mass: 0.6 }. */
  spring?: SpringConfig;
}

// ─── stagger ────────────────────────────────────────────────────────────────

export interface StaggerConfig {
  /** Current frame. */
  frame: number;

  /** Index of this item in the stagger sequence. */
  index: number;

  /** Frames between each item's start. Default: 4. */
  stagger?: number;

  /** Extra delay before the first item starts. Default: 0. */
  delay?: number;

  /** Direction of slide. Default: "up". */
  direction?: Direction;

  /** Translate distance in pixels. Default: 30. */
  distance?: number;

  /** Spring config. */
  spring?: SpringConfig;
}

// ─── linearProgress ─────────────────────────────────────────────────────────

export interface LinearProgressConfig {
  /** Current frame. */
  frame: number;

  /** Frame at which animation starts. */
  startFrame: number;

  /** Frame at which animation ends. */
  endFrame: number;
}

// ─── clampProgress (shared) ─────────────────────────────────────────────────

/**
 * Clamp a progress value to [0, 1].
 * Shared across design layers.
 */
export function clampProgress(value: number): number {
  return Math.max(0, Math.min(1, value));
}
