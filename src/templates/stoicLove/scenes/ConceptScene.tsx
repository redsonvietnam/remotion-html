// ---------------------------------------------------------------------------
// Concept Scene — Headline + body lines with emphasis
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
import { slideUp, slideInFromLeft, Backdrop, SafeContainer, HorizontalRule, LightSweep, BlurReveal } from "../helpers";
import type { StoicLoveConceptContent } from "../../../data/stoicLove";

type Props = { audio: string; caption: string; dur: number } & StoicLoveConceptContent;

export const ConceptScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  headline,
  bodyLines,
  emphasisIndex = -1,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineAnim = slideUp(frame, 0, fps, 60);
  const bodyAnims = bodyLines.map((_, i) => slideInFromLeft(frame, 25 + i * 15, fps, 70));
  const ruleAnim = slideUp(frame, 25 + bodyLines.length * 15 + 10, fps, 40);

  return (
    <AbsoluteFill>
      <Backdrop />
      <LightSweep frame={frame} fps={fps} color={theme.colors.accent2} />
      <Audio src={staticFile(audio)} />
      <SafeContainer>
        <BlurReveal frame={frame} delay={0} fps={fps} duration={40}>
          <div style={{ ...headlineAnim, textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                fontFamily: BV,
                fontWeight: 800,
                fontSize: 56,
                lineHeight: 1.2,
                color: theme.colors.accent1,
                textShadow: `0 4px 60px ${theme.colors.accent2}40`,
                letterSpacing: -1,
              }}
            >
              {headline}
            </div>
          </div>
        </BlurReveal>
        {bodyLines.map((line, i) => (
          <BlurReveal key={i} frame={frame} delay={25 + i * 15} fps={fps} duration={35}>
            <div style={{ ...bodyAnims[i], textAlign: "center", marginBottom: i === bodyLines.length - 1 ? 24 : 10 }}>
              <div
                style={{
                  fontFamily: BV,
                  fontWeight: emphasisIndex === i ? 700 : 500,
                  fontSize: emphasisIndex === i ? 52 : 44,
                  lineHeight: 1.4,
                  color: emphasisIndex === i ? theme.colors.accent1 : theme.colors.ink,
                  textShadow: emphasisIndex === i ? `0 4px 60px ${theme.colors.accent2}40` : "none",
                }}
              >
                {line}
              </div>
            </div>
          </BlurReveal>
        ))}
        <BlurReveal frame={frame} delay={25 + bodyLines.length * 15 + 10} fps={fps} duration={30}>
          <HorizontalRule width={200} color={theme.colors.accent2} />
        </BlurReveal>
      </SafeContainer>
    </AbsoluteFill>
  );
};