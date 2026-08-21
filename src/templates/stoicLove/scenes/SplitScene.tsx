// ---------------------------------------------------------------------------
// Split Scene — Two-column contrast (Within Control / Outside Control)
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
import { slideUp, slideInFromLeft, slideInFromRight, Backdrop, SafeContainer, VerticalDivider, LightSweep, BlurReveal } from "../helpers";
import type { StoicLoveSplitContent } from "../../../data/stoicLove";

type Props = { audio: string; caption: string; dur: number } & StoicLoveSplitContent;

export const SplitScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  title,
  leftLabel,
  leftItems,
  rightLabel,
  rightItems,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = slideUp(frame, 0, fps, 50);
  const dividerAnim = slideUp(frame, 20, fps, 60);
  const leftAnims = leftItems.map((_, i) => slideInFromLeft(frame, 35 + i * 12, fps, 80));
  const rightAnims = rightItems.map((_, i) => slideInFromRight(frame, 35 + i * 12, fps, 80));

  return (
    <AbsoluteFill>
      <Backdrop />
      <LightSweep frame={frame} fps={fps} color={theme.colors.accent2} />
      <Audio src={staticFile(audio)} />
      <SafeContainer style={{ paddingTop: 140, paddingBottom: 140 }}>
        <BlurReveal frame={frame} delay={0} fps={fps} duration={35}>
          <div style={{ ...titleAnim, textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                fontFamily: BV,
                fontWeight: 700,
                fontSize: 40,
                color: theme.colors.accent2,
                letterSpacing: 6,
                textTransform: "uppercase",
              }}
            >
              {title}
            </div>
          </div>
        </BlurReveal>
        <BlurReveal frame={frame} delay={20} fps={fps} duration={40}>
          <VerticalDivider height={280} color={theme.colors.accent2} />
        </BlurReveal>
        <div style={{ display: "flex", gap: 40, width: "100%", maxWidth: 900 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <BlurReveal frame={frame} delay={30} fps={fps} duration={30}>
              <div
                style={{
                  fontFamily: BV,
                  fontWeight: 700,
                  fontSize: 28,
                  color: theme.colors.accent1,
                  marginBottom: 24,
                  letterSpacing: 2,
                }}
              >
                {leftLabel}
              </div>
            </BlurReveal>
            {leftItems.map((item, i) => (
              <BlurReveal key={`L${i}`} frame={frame} delay={35 + i * 12} fps={fps} duration={35}>
                <div style={{ ...leftAnims[i], textAlign: "center", marginBottom: 16, width: "100%" }}>
                  <div
                    style={{
                      fontFamily: BV,
                      fontWeight: 500,
                      fontSize: 36,
                      lineHeight: 1.5,
                      color: theme.colors.ink,
                    }}
                  >
                    {item}
                  </div>
                </div>
              </BlurReveal>
            ))}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <BlurReveal frame={frame} delay={30} fps={fps} duration={30}>
              <div
                style={{
                  fontFamily: BV,
                  fontWeight: 700,
                  fontSize: 28,
                  color: theme.colors.muted,
                  marginBottom: 24,
                  letterSpacing: 2,
                }}
              >
                {rightLabel}
              </div>
            </BlurReveal>
            {rightItems.map((item, i) => (
              <BlurReveal key={`R${i}`} frame={frame} delay={35 + i * 12} fps={fps} duration={35}>
                <div style={{ ...rightAnims[i], textAlign: "center", marginBottom: 16, width: "100%" }}>
                  <div
                    style={{
                      fontFamily: BV,
                      fontWeight: 400,
                      fontSize: 36,
                      lineHeight: 1.5,
                      color: theme.colors.muted,
                    }}
                  >
                    {item}
                  </div>
                </div>
              </BlurReveal>
            ))}
          </div>
        </div>
      </SafeContainer>
    </AbsoluteFill>
  );
};