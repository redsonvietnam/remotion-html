/**
 * Real Estate Listing — Animation Helpers
 * Frame-based interpolation and easing utilities.
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
 * Back easing out: slight bounce/overshoot.
 */
export const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

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
