// ---------------------------------------------------------------------------
// OutroScene — Brand + tagline + CTA
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { interpolate, easeOutBack, sceneOpacity } from "../helpers";
import type { KineticOutroContent } from "../types";

export type OutroSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
  width?: number;
  height?: number;
} & KineticOutroContent;

export const OutroSceneData: React.FC<OutroSceneProps> = ({
  frame,
  fps,
  dur,
  brand,
  tagline,
  cta,
}) => {
  const theme = useTheme();
  const opacity = sceneOpacity(frame, Math.round(dur * fps));

  const brandOpacity = interpolate(frame, [0, 14], [0, 1]);
  const brandScale = interpolate(frame, [0, 18], [0.6, 1], easeOutBack);
  const tagOpacity = interpolate(frame, [18, 30], [0, 1]);
  const ctaOpacity = interpolate(frame, [36, 50], [0, 1]);
  const ctaPulse = frame > 50 ? 1 + 0.035 * Math.sin(frame * 0.18) : 1;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #05060a, #12131c)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontWeight: 900,
          fontSize: 26,
          color: theme.colors.accent1,
          letterSpacing: 2,
          opacity: brandOpacity,
          transform: `scale(${Math.max(0, brandScale)})`,
        }}
      >
        {brand}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 13,
          color: theme.colors.muted,
          letterSpacing: 1,
          opacity: tagOpacity,
        }}
      >
        {tagline}
      </div>
      <div
        style={{
          marginTop: 26,
          fontSize: 15,
          fontWeight: 700,
          color: theme.colors.ink,
          border: `1.5px solid ${theme.colors.accent1}`,
          borderRadius: 24,
          padding: "9px 22px",
          opacity: ctaOpacity,
          transform: `scale(${ctaPulse})`,
        }}
      >
        {cta}
      </div>
    </AbsoluteFill>
  );
};
