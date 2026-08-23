// ---------------------------------------------------------------------------
// SectionLabel — Uppercase Label Above Content
//
// Replaces NQ57's inline section labels with a configurable component.
// Used for: "BA CHỦ THỂ", "Năm trụ cột cốt lõi", "Mục tiêu 2030", etc.
//
// Policy: color is REQUIRED — no defaults.
// The template provides all colors via theme.
// ---------------------------------------------------------------------------

import React from "react";
import type { SectionLabelProps } from "./types";

export const SectionLabel: React.FC<SectionLabelProps> = ({
  text,
  fontFamily,
  fontSize = 26,
  fontWeight = 700,
  color,
  letterSpacing = 4,
  marginBottom = 30,
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        fontFamily,
        fontWeight,
        letterSpacing,
        fontSize,
        color,
        marginBottom,
        textAlign: "center",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {text}
    </div>
  );
};
