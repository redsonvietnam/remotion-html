// ---------------------------------------------------------------------------
// HookScene — Eyebrow, mask-reveal title, ThreeCanvas icosahedron
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { ThreeCanvas } from "@remotion/three";
import { interpolate, easeOutExpo, easeOutBack, sceneOpacity, Icosahedron3D } from "../helpers";
import type { FeatureDropHookContent } from "../types";

export type HookSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & FeatureDropHookContent;

export const HookSceneData: React.FC<HookSceneProps> = ({
  frame,
  fps,
  dur,
  eyebrow,
  title,
}) => {
  const theme = useTheme();
  const total = Math.round(dur * fps);
  const opacity = sceneOpacity(frame, total);

  const eyebrowOp = interpolate(frame, [0, 10], [0, 1]);
  const line1Y = interpolate(frame, [8, 26], [110, 0], easeOutExpo);
  const line2Y = interpolate(frame, [16, 34], [110, 0], easeOutExpo);
  const threeOp = interpolate(frame, [26, 42], [0, 1]);
  const threeScale = interpolate(frame, [26, 42], [0.7, 1], easeOutBack);

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
        zIndex: 5,
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontFamily: theme.fonts.mono,
          fontSize: 11,
          letterSpacing: 3,
          color: theme.colors.accent2,
          opacity: eyebrowOp,
        }}
      >
        {eyebrow}
      </div>

      {/* Title line 1 */}
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            fontWeight: 900,
            fontSize: 32,
            lineHeight: 1.2,
            textAlign: "center",
            letterSpacing: -0.5,
            color: theme.colors.ink,
            transform: `translateY(${line1Y}%)`,
          }}
        >
          {title[0]}
        </div>
      </div>

      {/* Title line 2 */}
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            fontWeight: 900,
            fontSize: 32,
            lineHeight: 1.2,
            textAlign: "center",
            letterSpacing: -0.5,
            color: theme.colors.ink,
            transform: `translateY(${line2Y}%)`,
          }}
        >
          {title[1]}
        </div>
      </div>

      {/* Three.js icosahedron */}
      <div
        style={{
          width: 190,
          height: 190,
          marginTop: 12,
          opacity: threeOp,
          transform: `scale(${threeScale})`,
        }}
      >
        <ThreeCanvas width={190} height={190} camera={{ position: [0, 0, 4.3], fov: 42 }}>
          <Icosahedron3D />
        </ThreeCanvas>
      </div>
    </AbsoluteFill>
  );
};
