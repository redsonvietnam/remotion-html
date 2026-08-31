/**
 * Editorial Feature — Animation Helpers
 * Frame-based interpolation and easing utilities (matching Product Teaser pattern).
 */

/**
 * Linear interpolation with optional easing.
 * @param frame Current frame
 * @param [inputStart, inputEnd] Input frame range
 * @param [outputStart, outputEnd] Output value range
 * @param easing Optional easing function
 */
export function interpolate(
  frame: number,
  [inputStart, inputEnd]: [number, number],
  [outputStart, outputEnd]: [number, number],
  easing: (t: number) => number = (t) => t
): number {
  const t = Math.min(Math.max((frame - inputStart) / (inputEnd - inputStart), 0), 1);
  return outputStart + (outputEnd - outputStart) * easing(t);
}

/**
 * Cubic easing out: decelerates as motion approaches end.
 */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * Scene fade in/out with configured fade duration.
 * @param localFrame Frame within scene
 * @param sceneDurationFrames Total scene duration
 * @param fadeFrames Fade duration (configurable via CONFIG)
 */
export function sceneOpacity(
  localFrame: number,
  sceneDurationFrames: number,
  fadeFrames: number
): number {
  const fadeIn = interpolate(localFrame, [0, fadeFrames], [0, 1]);
  const fadeOut = interpolate(localFrame, [sceneDurationFrames - fadeFrames, sceneDurationFrames], [1, 0]);
  return fadeIn * fadeOut;
}

/**
 * Reading progress calculation.
 * @param currentFrame Current frame in composition
 * @param totalFrames Total composition frames
 */
export function readingProgress(currentFrame: number, totalFrames: number): number {
  return Math.min(Math.max(currentFrame / totalFrames, 0), 1);
}
