// ---------------------------------------------------------------------------
// Outro Scene — Branding / call to action
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../../../design/theme";
import { fadeIn, slideUp, MatrixRain, ProgressDots } from "../helpers";
import type { TerminalOutroContent } from "../../../data/terminal";

type Props = { audio: string; caption: string; dur: number; sceneIndex: number; totalScenes: number } & TerminalOutroContent;

export const OutroScene: React.FC<Props> = ({
  audio, caption, dur, sceneIndex, totalScenes,
  kicker, title, subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const theme = useTheme();

  const kickerAnim = slideUp(frame, 4, fps, 30);
  const titleAnim = slideUp(frame, 14, fps, 40);
  const subAnim = slideUp(frame, 24, fps, 30);

  return (
    <AbsoluteFill>
      <MatrixRain W={W} H={H} />
      <div
        style={{
          position: "absolute",
          top: H * 0.28,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={kickerAnim}>
          <span
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 600,
              fontSize: 22,
              color: theme.colors.accent1,
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            {kicker}
          </span>
        </div>
        <div style={titleAnim}>
          <span
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: 56,
              color: theme.colors.ink,
              textShadow: `0 2px 30px rgba(0,255,102,0.3)`,
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: W * 0.8,
              display: "inline-block",
            }}
          >
            {title}
          </span>
        </div>
        <div style={subAnim}>
          <span
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 500,
              fontSize: 28,
              color: theme.colors.muted,
              textAlign: "center",
              maxWidth: W * 0.7,
              display: "inline-block",
            }}
          >
            {subtitle}
          </span>
        </div>
      </div>
      <ProgressDots total={totalScenes} current={sceneIndex} W={W} H={H} />
    </AbsoluteFill>
  );
};
