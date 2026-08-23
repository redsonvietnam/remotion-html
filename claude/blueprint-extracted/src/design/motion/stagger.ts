// ---------------------------------------------------------------------------
// stagger — Pure stagger animation for indexed items
//
// Computes fade+slide animation for items in a sequence, where each item
// starts its animation after a configurable delay from the previous one.
//
// Replaces NQ57's manual fadeUp(frame, 10 + i * 14, fps) pattern.
// ---------------------------------------------------------------------------

import { spring, interpolate } from "remotion";
import type { StaggerConfig, MotionStyle, Direction } from "./types";
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
 * Pure function: stagger animation for indexed items.
 *
 * @example
 *   // 3 cards, 14 frames apart
 *   items.map((item, i) => {
 *     const style = stagger({ frame, index: i, stagger: 14 });
 *     return <div style={style}>{item}</div>;
 *   });
 */
export function stagger(config: StaggerConfig): MotionStyle {
  const {
    frame,
    index,
    stagger: staggerFrames = 4,
    delay = 0,
    direction = "up",
    distance = 30,
    spring: springConfig = DEFAULT_SPRING,
  } = config;

  const itemDelay = delay + index * staggerFrames;

  const t = spring({
    frame: frame - itemDelay,
    fps: 30,
    config: springConfig,
  });

  const p = clampProgress(t);
  const opacity = p;
  const transform = getTranslate(p, direction, distance);

  return { opacity, transform };
}

/**
 * Pure function: stagger animation with explicit fps.
 */
export function staggerWithFps(
  config: StaggerConfig & { fps: number }
): MotionStyle {
  const {
    frame,
    index,
    stagger: staggerFrames = 4,
    delay = 0,
    direction = "up",
    distance = 30,
    spring: springConfig = DEFAULT_SPRING,
    fps,
  } = config;

  const itemDelay = delay + index * staggerFrames;

  const t = spring({
    frame: frame - itemDelay,
    fps,
    config: springConfig,
  });

  const p = clampProgress(t);
  const opacity = p;
  const transform = getTranslate(p, direction, distance);

  return { opacity, transform };
}
