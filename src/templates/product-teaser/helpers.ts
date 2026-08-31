// ---------------------------------------------------------------------------
// Product Teaser Animation Helpers
//
// Pure frame-based animation functions
// Extracted from: prototypes/product-teaser-remotion-prototype.html
// ---------------------------------------------------------------------------

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function interpolate(
  frame: number,
  [i0, i1]: [number, number],
  [o0, o1]: [number, number],
  easing: (t: number) => number = (t) => t
): number {
  const t = clamp((frame - i0) / (i1 - i0), 0, 1);
  return o0 + (o1 - o0) * easing(t);
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function sceneOpacity(
  localFrame: number,
  durationInFrames: number,
  fadeFrames: number = 14
): number {
  return interpolate(localFrame, [0, fadeFrames], [0, 1]) *
         interpolate(localFrame, [durationInFrames - fadeFrames, durationInFrames], [1, 0]);
}

/**
 * Format number with thousands separator (US locale)
 */
export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}
