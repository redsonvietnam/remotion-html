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
  accentColor = "#f3c969",
  title,
  subtitle,
  width = 420,
  background = "rgba(255,255,255,0.045)",
  border = "1px solid rgba(245,245,255,0.12)",
  borderRadius = 24,
  padding = "40px 34px",
  fontFamily,
  titleFontSize = 34,
  titleFontWeight = 700,
  titleColor = "#f7f5ef",
  subtitleFontSize = 22,
  subtitleFontWeight = 500,
  subtitleColor = "#9aa0b5",
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
        border,
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
            border: `3px solid ${accentColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
            fontWeight: badgeFontWeight,
            fontSize: badgeFontSize,
            color: accentColor,
          }}
        >
          {number}
        </div>
      )}
      {title && (
        <div
          style={{
            fontFamily,
            fontWeight: titleFontWeight,
            fontSize: titleFontSize,
            color: titleColor,
          }}
        >
          {title}
        </div>
      )}
      {subtitle && (
        <div
          style={{
            fontFamily,
            fontWeight: subtitleFontWeight,
            fontSize: subtitleFontSize,
            color: subtitleColor,
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
