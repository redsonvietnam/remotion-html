// ---------------------------------------------------------------------------
// CardBlock — Card with Badge, Title, Subtitle
//
// Replaces NQ57's inline card pattern with a configurable component.
// Used for: roles scene (3 cards with number, title, subtitle).
// ---------------------------------------------------------------------------

import React from "react";
import type { CardBlockProps } from "./types";

export const CardBlock: React.FC<CardBlockProps> = ({
  number = null,
  accent = "#f3c969",
  title,
  subtitle,
  width = 420,
  background = "rgba(255,255,255,0.045)",
  borderColor = "rgba(245,245,255,0.12)",
  text = "#f7f5ef",
  muted = "#9aa0b5",
  borderRadius = 24,
  padding = "40px 34px",
  fontFamily,
  titleSize = 34,
  titleWeight = 700,
  subtitleSize = 22,
  subtitleWeight = 500,
  badgeSize = 86,
  badgeFontSize = 40,
  badgeFontWeight = 800,
  boxShadow = "0 30px 60px -24px rgba(0,0,0,.55)",
  className,
  style,
  children,
}) => {
  return (
    <div
      className={className}
      style={{
        width,
        background,
        border: `1px solid ${borderColor}`,
        borderRadius,
        padding,
        textAlign: "center",
        boxShadow,
        ...style,
      }}
    >
      {number != null && (
        <div
          style={{
            width: badgeSize,
            height: badgeSize,
            borderRadius: 999,
            margin: "0 auto 22px",
            border: `3px solid ${accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
            fontWeight: badgeFontWeight,
            fontSize: badgeFontSize,
            color: accent,
          }}
        >
          {number}
        </div>
      )}
      {title && (
        <div
          style={{
            fontFamily,
            fontWeight: titleWeight,
            fontSize: titleSize,
            color: text,
          }}
        >
          {title}
        </div>
      )}
      {subtitle && (
        <div
          style={{
            fontFamily,
            fontWeight: subtitleWeight,
            fontSize: subtitleSize,
            color: muted,
            marginTop: 10,
          }}
        >
          {subtitle}
        </div>
      )}
      {children}
    </div>
  );
};
