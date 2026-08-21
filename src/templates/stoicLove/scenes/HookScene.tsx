// ---------------------------------------------------------------------------
// Hook Scene — Opening hook with strong visual question
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
import { slideUp, slideInFromLeft, Backdrop, SafeContainer, LightSweep, BlurReveal } from "../helpers";
import type { StoicLoveHookContent } from "../../../data/stoicLove";

type Props = { audio: string; caption: string; dur: number } & StoicLoveHookContent;

export const HookScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  mainQuestion,
  subText,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const qAnim = slideInFromLeft(frame, 0, fps, 100);
  const subAnim = slideUp(frame, 20, fps, 80);
  const sweep = frame / fps;

  return (
    <AbsoluteFill>
      <Backdrop />
      <LightSweep frame={frame} fps={fps} color={theme.colors.accent2} />
      <Audio src={staticFile(audio)} />
      <SafeContainer>
        <BlurReveal frame={frame} delay={0} fps={fps} duration={40}>
          <div style={{ ...qAnim, textAlign: "center", marginBottom: 40 }}>
            <div
              style={{
                fontFamily: BV,
                fontWeight: 600,
                fontSize: 48,
                lineHeight: 1.3,
                color: theme.colors.ink,
                textShadow: `0 4px 40px ${theme.colors.accent2}30`,
              }}
            >
              {mainQuestion}
            </div>
          </div>
        </BlurReveal>
        <BlurReveal frame={frame} delay={25} fps={fps} duration={40}>
          <div style={{ ...subAnim, textAlign: "center" }}>
            <div
              style={{
                fontFamily: BV,
                fontWeight: 700,
                fontSize: 56,
                lineHeight: 1.2,
                color: theme.colors.accent1,
                textShadow: `0 4px 60px ${theme.colors.accent2}40`,
                letterSpacing: -1,
              }}
            >
              {subText}
            </div>
          </div>
        </BlurReveal>
      </SafeContainer>
    </AbsoluteFill>
  );
};