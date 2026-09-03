// ---------------------------------------------------------------------------
// OutroScene — Layered ghost typography + CTA pulse
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { interpolate, easeOutBack, sceneOpacity, GhostText } from "../helpers";
import type { FeatureDropOutroContent } from "../types";

export type OutroSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & FeatureDropOutroContent;

export const OutroSceneData: React.FC<OutroSceneProps> = ({
  frame,
  fps,
  dur,
  brand,
  cta,
}) => {
  const theme = useTheme();
  const total = Math.round(dur * fps);
  const opacity = sceneOpacity(frame, total);
  const ctaOp = interpolate(frame, [24, 36], [0, 1]);
  const ctaPulse = frame > 38 ? 1 + 0.03 * Math.sin(frame * 0.15) : 1;

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        zIndex: 5,
      }}
    >
      <GhostText text={brand} frame={frame} />

      <div
        style={{
          marginTop: 22,
          fontWeight: 700,
          fontSize: 14,
          background: "#fff",
          color: "#0a0812",
          padding: "11px 24px",
          borderRadius: 24,
          opacity: ctaOp,
          transform: `scale(${ctaPulse})`,
        }}
      >
        {cta}
      </div>
    </AbsoluteFill>
  );
};
