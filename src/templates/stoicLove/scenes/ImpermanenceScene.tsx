// ---------------------------------------------------------------------------
// Impermanence Scene — Observation + Reframe
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
import { slideUp, slideInFromLeft, Backdrop, SafeContainer, LightSweep, BlurReveal, SilhouettePair, OpenHand, HorizontalRule } from "../helpers";
import type { StoicLoveImpermanenceContent } from "../../../data/stoicLove";

type Props = { audio: string; caption: string; dur: number } & StoicLoveImpermanenceContent;

export const ImpermanenceScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  observation,
  reframe,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const obsAnim = slideUp(frame, 0, fps, 60);
  const reframeAnim = slideUp(frame, 40, fps, 80);
  const ruleAnim = slideUp(frame, 85, fps, 40);
  const handAnim = frame;
  const silhouetteAnim = frame;

  return (
    <AbsoluteFill>
      <Backdrop />
      <LightSweep frame={frame} fps={fps} color={theme.colors.accent2} />
      <Audio src={staticFile(audio)} />
      <SafeContainer style={{ paddingTop: 120, paddingBottom: 120 }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <SilhouettePair frame={silhouetteAnim} fps={fps} distance={140} color={theme.colors.accent2} />
        </div>
        <BlurReveal frame={frame} delay={0} fps={fps} duration={40}>
          <div style={{ ...obsAnim, textAlign: "center", marginBottom: 40, paddingLeft: 40, paddingRight: 40 }}>
            <div
              style={{
                fontFamily: BV,
                fontWeight: 500,
                fontSize: 44,
                lineHeight: 1.5,
                color: theme.colors.ink,
                textShadow: `0 4px 40px ${theme.colors.accent2}20`,
              }}
            >
              {observation}
            </div>
          </div>
        </BlurReveal>
        <BlurReveal frame={frame} delay={85} fps={fps} duration={30}>
          <HorizontalRule width={180} color={theme.colors.accent2} />
        </BlurReveal>
        <BlurReveal frame={frame} delay={40} fps={fps} duration={50}>
          <div style={{ ...reframeAnim, textAlign: "center", paddingLeft: 40, paddingRight: 40 }}>
            <div
              style={{
                fontFamily: BV,
                fontWeight: 600,
                fontSize: 48,
                lineHeight: 1.4,
                color: theme.colors.accent1,
                textShadow: `0 4px 60px ${theme.colors.accent2}40`,
              }}
            >
              {reframe}
            </div>
          </div>
        </BlurReveal>
      </SafeContainer>
    </AbsoluteFill>
  );
};