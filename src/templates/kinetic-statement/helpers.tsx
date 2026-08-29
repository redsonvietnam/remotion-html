// ---------------------------------------------------------------------------
// Kinetic Statement Helpers — frame-based animation primitives
//
// Pure functions that mirror the prototype's animation logic.
// No Remotion hooks — receives frame/fps as arguments.
// ---------------------------------------------------------------------------

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export const interpolate = (
  frame: number,
  [i0, i1]: [number, number],
  [o0, o1]: [number, number],
  easing: (t: number) => number = (t) => t,
): number => {
  const t = clamp((frame - i0) / (i1 - i0), 0, 1);
  return o0 + (o1 - o0) * easing(t);
};

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Per-scene opacity: fade-in 15 frames, fade-out 15 frames. */
export const sceneOpacity = (localFrame: number, dur: number) =>
  interpolate(localFrame, [0, 15], [0, 1], easeOutCubic) *
  interpolate(localFrame, [dur - 15, dur], [1, 0], easeOutCubic);
