// ---------------------------------------------------------------------------
// QuoteScene — Karaoke word highlight
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { interpolate, sceneOpacity } from "../helpers";
import type { KineticQuoteContent } from "../types";

export type QuoteSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
  width?: number;
  height?: number;
} & KineticQuoteContent;

export const QuoteSceneData: React.FC<QuoteSceneProps> = ({
  frame,
  fps,
  dur,
  text,
}) => {
  const theme = useTheme();
  const opacity = sceneOpacity(frame, dur);
  const words = (text || "").split(" ");
  const total = words.length;
  const activeFloat = interpolate(frame, [8, dur - 34], [0, total], (t) => t);
  const activeIndex = Math.floor(activeFloat);

  return (
    <AbsoluteFill
      style={{
        background: "#f5f1e8",
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
          gap: "8px 8px",
          padding: "0 40px",
        }}
      >
        {words.map((word, i) => {
          const isRevealed = i < activeIndex;
          const isActive = i === activeIndex;
          return (
            <span
              key={i}
              style={{
                fontWeight: 800,
                fontSize: 23,
                color: isRevealed || isActive ? "#1c1c1e" : "#d8d0bf",
                lineHeight: 1.5,
                position: "relative",
                padding: "2px 3px",
                borderRadius: 4,
                background: isActive ? "#e0a72e" : "transparent",
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
