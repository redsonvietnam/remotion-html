// ---------------------------------------------------------------------------
// HookScene — Mask-reveal kinetic type (two lines, staggered, gradient line 2)
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { interpolate, easeOutExpo, sceneOpacity } from "../helpers";
import type { BentoGridHookContent } from "../types";

export type HookSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & BentoGridHookContent;

export const HookSceneData: React.FC<HookSceneProps> = ({
  frame,
  fps,
  dur,
  line1,
  line2,
}) => {
  const theme = useTheme();
  const opacity = sceneOpacity(frame, Math.round(dur * fps));

  const l1Y = interpolate(frame, [0, 20], [110, 0], easeOutExpo);
  const l2Y = interpolate(frame, [10, 32], [110, 0], easeOutExpo);

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 30px",
        opacity,
      }}
    >
      {/* Line 1 — white text */}
      <div style={{ overflow: "hidden", marginBottom: 4 }}>
        <div
          style={{
            fontWeight: 900,
            fontSize: 38,
            lineHeight: 1.18,
            letterSpacing: -1,
            textAlign: "center",
            color: theme.colors.ink,
            transform: `translateY(${l1Y}%)`,
          }}
        >
          {line1}
        </div>
      </div>
      {/* Line 2 — gradient text */}
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            fontWeight: 900,
            fontSize: 38,
            lineHeight: 1.18,
            letterSpacing: -1,
            textAlign: "center",
            background: "linear-gradient(90deg,#7c5cff,#ff6bd6,#3ddcff)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transform: `translateY(${l2Y}%)`,
          }}
        >
          {line2}
        </div>
      </div>
    </AbsoluteFill>
  );
};
