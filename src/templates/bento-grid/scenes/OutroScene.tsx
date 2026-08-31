// ---------------------------------------------------------------------------
// OutroScene — Brand pop-in + tagline fade + CTA gradient pulse
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { interpolate, easeOutBack, sceneOpacity } from "../helpers";
import type { BentoGridOutroContent } from "../types";

export type OutroSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & BentoGridOutroContent;

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

  const brandScale = interpolate(frame, [0, 18], [0.75, 1], easeOutBack);
  const tagOpacity = interpolate(frame, [16, 28], [0, 1]);
  const ctaOpacity = interpolate(frame, [30, 42], [0, 1]);
  const ctaPulse =
    frame > 44 ? 1 + 0.03 * Math.sin(frame * 0.15) : 1;

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 36px",
        opacity,
      }}
    >
      {/* Brand */}
      <div
        style={{
          fontWeight: 900,
          fontSize: 26,
          letterSpacing: 1,
          color: theme.colors.ink,
          transform: `scale(${brandScale})`,
        }}
      >
        {brand}
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 13,
          color: theme.colors.muted,
          marginTop: 10,
          maxWidth: 270,
          opacity: tagOpacity,
        }}
      >
        {tagline}
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: 24,
          fontWeight: 700,
          fontSize: 13.5,
          background: "linear-gradient(90deg,#7c5cff,#ff6bd6)",
          color: "#fff",
          padding: "11px 24px",
          borderRadius: 24,
          opacity: ctaOpacity,
          transform: `scale(${ctaPulse})`,
        }}
      >
        {cta}
      </div>
    </AbsoluteFill>
  );
};
