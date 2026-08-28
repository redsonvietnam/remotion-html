// ---------------------------------------------------------------------------
// Intro Scene — Kicker + title appear above the terminal
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../../../design/theme";
import { fadeIn, slideUp, MatrixRain, Caption } from "../helpers";
import type { TerminalIntroContent } from "../../../data/terminal";

type Props = { audio: string; caption: string; dur: number } & TerminalIntroContent;

export const IntroScene: React.FC<Props> = ({ audio, caption, dur, kicker, title }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const theme = useTheme();

  const kickerAnim = slideUp(frame, 4, fps, 40);
  const titleAnim = slideUp(frame, 14, fps, 40);

  return (
    <AbsoluteFill>
      <MatrixRain W={W} H={H} />
      <div
        style={{
          position: "absolute",
          top: H * 0.25,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={kickerAnim}>
          <span
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 600,
              fontSize: 24,
              color: theme.colors.accent1,
              textTransform: "uppercase",
              letterSpacing: 4,
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
              fontSize: 52,
              color: theme.colors.ink,
              textShadow: `0 2px 30px rgba(0,255,102,0.25)`,
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: W * 0.8,
              display: "inline-block",
            }}
          >
            {title}
          </span>
        </div>
      </div>
      <Caption text={caption} W={W} H={H} anim={fadeIn(frame, 20, fps)} />
    </AbsoluteFill>
  );
};
