// ---------------------------------------------------------------------------
// fadeSlide — Pure fade + slide animation
//
// The core motion primitive. Returns { opacity, transform } for a fade+slide
// animation driven by Remotion's spring(). Works with any frame value.
//
// Replaces NQ57's fadeUp() with a template-agnostic pure function.
// ---------------------------------------------------------------------------

import { interpolate, spring } from "remotion";
import type { FadeSlideConfig, MotionStyle, Direction } from "./types";
import { clampProgress } from "./types";

const DEFAULT_SPRING = { damping: 18, mass: 0.6 };

/**
 * Compute translate offset from progress and direction.
 */
function getTranslate(
  progress: number,
  direction: Direction,
  distance: number
): string {
  switch (direction) {
    case "up":
      return `translateY(${interpolate(progress, [0, 1], [distance, 0])}px)`;
    case "down":
      return `translateY(${interpolate(progress, [0, 1], [-distance, 0])}px)`;
    case "left":
      return `translateX(${interpolate(progress, [0, 1], [distance, 0])}px)`;
    case "right":
      return `translateX(${interpolate(progress, [0, 1], [-distance, 0])}px)`;
    case "none":
    default:
      return "none";
  }
}

/**
 * Pure function: fade + slide animation.
 *
 * @example
 *   const style = fadeSlide({ frame, delay: 10, direction: "up" });
 *   return <div style={style}>Hello</div>
 */
export function fadeSlide(config: FadeSlideConfig): MotionStyle {
  const {
    frame,
    delay = 0,
    direction = "up",
    distance = 40,
    spring: springConfig = DEFAULT_SPRING,
  } = config;

  const t = spring({
    frame: frame - delay,
    fps: 30, // default — will be overridden if fps is provided
    config: springConfig,
  });

  const opacity = clampProgress(t);
  const transform = getTranslate(clampProgress(t), direction, distance);

  return { opacity, transform };
}

/**
 * Pure function: fade + slide with explicit fps.
 *
 * @example
 *   const style = fadeSlideWithFps({ frame, delay: 10, direction: "up", fps: 60 });
 */
export function fadeSlideWithFps(
  config: FadeSlideConfig & { fps: number }
): MotionStyle {
  const {
    frame,
    delay = 0,
    direction = "up",
    distance = 40,
    spring: springConfig = DEFAULT_SPRING,
    fps,
  } = config;

  const t = spring({
    frame: frame - delay,
    fps,
    config: springConfig,
  });

  const opacity = clampProgress(t);
  const transform = getTranslate(clampProgress(t), direction, distance);

  return { opacity, transform };
}

// Re-export getTranslate for external use
export { getTranslate };
