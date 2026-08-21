// ---------------------------------------------------------------------------
// GradientText — Gradient Background Clip Text
//
// Replaces NQ57's inline gradient text with a configurable component.
// Used for: "NGHỊ QUYẾT 57", "Kỷ nguyên vươn mình", "50%", etc.
// ---------------------------------------------------------------------------

import React from "react";
import type { GradientTextProps } from "./types";

export const GradientText: React.FC<GradientTextProps> = ({
  text,
  colorFrom = "#e23b3b",
  colorTo = "#f3c969",
  gradientAngle = 90,
  fontFamily,
  fontSize = 120,
  fontWeight = 800,
  lineHeight = 1,
  className,
  style,
}) => {
  const gradient = `linear-gradient(${gradientAngle}deg, ${colorFrom}, ${colorTo})`;

  return (
    <div
      className={className}
      style={{
        fontFamily,
        fontWeight,
        fontSize,
        lineHeight,
        background: gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textAlign: "center",
        ...style,
      }}
    >
      {text}
    </div>
  );
};
