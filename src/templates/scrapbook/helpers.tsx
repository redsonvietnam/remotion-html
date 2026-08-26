// ---------------------------------------------------------------------------
// Scrapbook Template Helpers — Motion vocabulary
//
// All primitives are template-private. Reusable design-system pieces
// are consumed from src/design/.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";

// ─── Motion utilities ────────────────────────────────────────────────────────

/** Text slides in from below with spring. */
export const textIn = (frame: number, delay: number, fps: number, distance = 30) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 22, mass: 0.4 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(t, [0, 1], [distance, 0])}px)`,
  };
};

/** Linear reveal: 0→1 over `duration` frames starting at `delay`. */
export const reveal = (frame: number, delay: number, duration: number): number =>
  interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Highlighter swipe: horizontal wipe left→right. */
export const highlightSwipe = (frame: number, delay: number, duration: number): number =>
  interpolate(frame, [delay, delay + duration], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Page turn: slide in from right edge. */
export const pageIn = (frame: number, delay: number, fps: number) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 20, mass: 0.5 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateX(${interpolate(t, [0, 1], [80, 0])}px) rotate(${interpolate(t, [0, 1], [3, 0])}deg)`,
  };
};

/** Handwritten text reveal: clip-path wipe from left. */
export const handwrittenReveal = (frame: number, delay: number, duration: number): React.CSSProperties => {
  const pct = interpolate(frame, [delay, delay + duration], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { clipPath: `inset(0 ${100 - pct}% 0 0)` };
};

/** Polaroid entrance: staggered slide from below with slight rotation. */
export const polaroidIn = (frame: number, delay: number, fps: number, rotation = 0) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 18, mass: 0.6 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(t, [0, 1], [60, 0])}px) rotate(${interpolate(t, [0, 1], [rotation, 0])}deg)`,
  };
};

/** Tape entrance: slight scale bounce. */
export const tapeIn = (frame: number, delay: number, fps: number) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 15, mass: 0.3 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `scale(${interpolate(t, [0, 1], [0.5, 1])})`,
  };
};

/** Trophy bounce: spring pop-in. */
export const trophyBounce = (frame: number, delay: number, fps: number) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 12, mass: 0.4 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `scale(${interpolate(t, [0, 1], [0, 1])})`,
  };
};
