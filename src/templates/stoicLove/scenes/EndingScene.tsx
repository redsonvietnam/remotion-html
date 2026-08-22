// ---------------------------------------------------------------------------
// Ending Scene (S10) — Minimal, the visual system comes to rest.
// Visual metaphor: an open ring cradling a heart, slow pulse only.
// "YÊU MÀ KHÔNG SỞ HỮU" / "Stoicism × Love"
// ---------------------------------------------------------------------------

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  Audio,
} from "remotion";
import { useTheme } from "../../../design/theme";
import { slideUp, fadeIn, Backdrop, SafeContainer, LightSweep, BlurReveal } from "../helpers";
import { StoicSymbol } from "../svg";
import type { StoicLoveEndingContent } from "../../../data/stoicLove";

type Props = { audio: string; caption: string; dur: number } & StoicLoveEndingContent;

export const EndingScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  closingThought,
  signature,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const thoughtAnim = slideUp(frame, 0, fps, 80);
  const sigAnim = fadeIn(frame, 60, fps, 40);

  return (
    <AbsoluteFill>
      <Backdrop />
      <LightSweep frame={frame} fps={fps} color={theme.colors.accent2} />
      <Audio src={staticFile(audio)} />
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <StoicSymbol frame={frame} fps={fps} size={460} />
      </div>
      <SafeContainer style={{ justifyContent: "flex-end", paddingBottom: 260 }}>
        <BlurReveal frame={frame} delay={0} fps={fps} duration={50}>
          <div style={{ ...thoughtAnim, textAlign: "center" }}>
            <div
              style={{
                fontFamily: BV,
                fontWeight: 700,
                fontSize: 58,
                lineHeight: 1.2,
                color: theme.colors.ink,
                textShadow: `0 4px 80px ${theme.colors.accent2}30`,
                letterSpacing: -1,
              }}
            >
              {closingThought}
            </div>
          </div>
        </BlurReveal>
        <BlurReveal frame={frame} delay={60} fps={fps} duration={40}>
          <div style={{ ...sigAnim, textAlign: "center", marginTop: 44 }}>
            <div style={{ fontFamily: BV, fontWeight: 500, fontSize: 30, color: theme.colors.muted, letterSpacing: 4 }}>
              {signature}
            </div>
          </div>
        </BlurReveal>
      </SafeContainer>
    </AbsoluteFill>
  );
};
