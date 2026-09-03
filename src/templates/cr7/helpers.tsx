// ---------------------------------------------------------------------------
// CR7 Template Helpers — Motion vocabulary
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
