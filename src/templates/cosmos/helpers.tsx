// ---------------------------------------------------------------------------
// Cosmos Template Helpers — Motion vocabulary
//
// All primitives are template-private. Reusable design-system pieces
// are consumed from src/design/.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { useTheme } from "../../design/theme";

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

/** Orbital rotation: circular motion around a center point. */
export const orbitalRotation = (
  frame: number,
  fps: number,
  period: number,
  radius: number,
  offset: number = 0
): { x: number; y: number; angle: number } => {
  const angle = ((frame / fps) / period) * Math.PI * 2 + offset;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    angle: (angle * 180) / Math.PI,
  };
};

/** Star twinkle: pulsing opacity for star elements. */
export const starTwinkle = (frame: number, fps: number, speed: number = 1): number => {
  return 0.4 + 0.6 * Math.abs(Math.sin((frame / fps) * speed * 2));
};

/** Constellation line draw: 0→1 progress for line drawing animation. */
export const constellationDraw = (
  frame: number,
  delay: number,
  duration: number
): number =>
  interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
