// ---------------------------------------------------------------------------
// Statement Scene — Single powerful statement with highlight
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
import type { StoicLoveStatementContent } from "../../../data/stoicLove";

type Props = { audio: string; caption: string; dur: number } & StoicLoveStatementContent;

export const StatementScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  lines,
  highlightIndex = -1,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineAnims = lines.map((_, i) => slideUp(frame, 5 + i * 18, fps, 60));
  const ruleAnim = slideUp(frame, lines.length * 18 + 10, fps, 40);

  return (
    <AbsoluteFill>
      <Backdrop />
      <LightSweep frame={frame} fps={fps} color={theme.colors.accent2} />
      <Audio src={staticFile(audio)} />
      <SafeContainer>
        {lines.map((line, i) => (
          <BlurReveal key={i} frame={frame} delay={5 + i * 18} fps={fps} duration={35}>
            <div style={{ ...lineAnims[i], textAlign: "center", marginBottom: i === lines.length - 1 ? 24 : 8 }}>
              <div
                style={{
                  fontFamily: BV,
                  fontWeight: highlightIndex === i ? 800 : 500,
                  fontSize: 52,
                  lineHeight: 1.4,
                  color: highlightIndex === i ? theme.colors.accent1 : theme.colors.ink,
                  textShadow: highlightIndex === i ? `0 4px 60px ${theme.colors.accent2}50` : "none",
                  letterSpacing: -0.5,
                }}
              >
                {line}
              </div>
            </div>
          </BlurReveal>
        ))}
        <BlurReveal frame={frame} delay={lines.length * 18 + 10} fps={fps} duration={30}>
          <HorizontalRule width={180} color={theme.colors.accent2} />
        </BlurReveal>
      </SafeContainer>
    </AbsoluteFill>
  );
};