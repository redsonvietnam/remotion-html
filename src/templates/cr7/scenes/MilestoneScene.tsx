// ---------------------------------------------------------------------------
// MilestoneScene — Grid of achievements
//
// Data component: receives frame/fps as props (no Remotion hooks).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../../design/theme";
import { textIn } from "../helpers";
import type { CR7MilestoneContent } from "../types";

export type MilestoneSceneProps = {
  audio: string;
  caption: string;
  dur: number;
  frame: number;
  fps: number;
} & CR7MilestoneContent;

export const MilestoneSceneData: React.FC<MilestoneSceneProps> = ({
  frame,
  fps,
  title,
  items,
}) => {
  const theme = useTheme();

  const titleAnim = textIn(frame, 0, fps, 30);
  const itemAnims = items.map((_, i) => textIn(frame, 12 + i * 15, fps, 40));

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(130% 130% at 50% 50%, ${theme.colors.bg2} 0%, ${theme.colors.bg} 60%, #050403 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            ...titleAnim,
            fontFamily: theme.fonts.mono ?? theme.fonts.display,
            fontSize: 14,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: theme.colors.accent1,
            marginBottom: 48,
          }}
        >
          {title}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 800 }}>
          {items.map((it, i) => (
            <div
              key={i}
              style={{
                ...itemAnims[i],
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 32,
                background: `${theme.colors.card}80`,
                borderRadius: 12,
                border: `1px solid ${theme.colors.line}`,
              }}
            >
              <div
                style={{
                  fontFamily: theme.fonts.display,
                  fontWeight: 900,
                  fontSize: 72,
                  color: theme.colors.accent1,
                  lineHeight: 1,
                }}
              >
                {it.value}
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 18,
                  color: theme.colors.muted,
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                {it.label}
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
