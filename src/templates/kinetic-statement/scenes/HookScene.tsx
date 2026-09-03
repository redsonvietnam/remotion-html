// ---------------------------------------------------------------------------
// HookScene — Staggered word reveal
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { interpolate, easeOutCubic, sceneOpacity } from "../helpers";
import type { KineticHookContent } from "../types";

export type HookSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
  width?: number;
  height?: number;
} & KineticHookContent;

export const HookSceneData: React.FC<HookSceneProps> = ({
  frame,
  fps,
  dur,
  words,
}) => {
  const theme = useTheme();
  const opacity = sceneOpacity(frame, Math.round(dur * fps));

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 10,
          padding: "0 34px",
        }}
      >
        {words.map((word, i) => {
          const delay = i * 8;
          const o = interpolate(frame, [delay, delay + 15], [0, 1], easeOutCubic);
          const y = interpolate(frame, [delay, delay + 15], [26, 0], easeOutCubic);
          const blur = interpolate(frame, [delay, delay + 15], [10, 0]);
          return (
            <span
              key={i}
              style={{
                fontWeight: 900,
                fontSize: 30,
                color: theme.colors.ink,
                letterSpacing: 0.5,
                opacity: o,
                transform: `translateY(${y}px)`,
                filter: `blur(${blur}px)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
