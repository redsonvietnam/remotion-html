// ---------------------------------------------------------------------------
// Hook Scene (S1) — Why do we fear losing someone more as we love them more?
// Visual metaphor: a heart at center, orbit tightens around it (LOVE →
// ATTACHMENT → FEAR) without the text needing to explain it.
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
import { slideUp, Backdrop, SafeContainer, LightSweep, BlurReveal } from "../helpers";
import { OrbitField } from "../svg";
import { ramp } from "../svg/motion";
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
  const total = Math.round(dur * fps);

  // Orbit tightens across the scene: LOVE → ATTACHMENT → FEAR.
  const amount = ramp(frame, total * 0.12, total * 0.92, 0, 0.9);

  const qAnim = slideUp(frame, 6, fps, 60);
  const subAnim = slideUp(frame, 26, fps, 70);

  return (
    <AbsoluteFill>
      <Backdrop />
      <LightSweep frame={frame} fps={fps} color={theme.colors.accent2} />
      <Audio src={staticFile(audio)} />
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <OrbitField frame={frame} fps={fps} size={540} amount={amount} />
      </div>
      <SafeContainer style={{ justifyContent: "flex-end", paddingBottom: 220 }}>
        <BlurReveal frame={frame} delay={6} fps={fps} duration={40}>
          <div style={{ ...qAnim, textAlign: "center", marginBottom: 28 }}>
            <div
              style={{
                fontFamily: BV,
                fontWeight: 600,
                fontSize: 46,
                lineHeight: 1.35,
                color: theme.colors.ink,
                textShadow: `0 4px 40px ${theme.colors.accent2}30`,
              }}
            >
              {mainQuestion}
            </div>
          </div>
        </BlurReveal>
        <BlurReveal frame={frame} delay={26} fps={fps} duration={40}>
          <div style={{ ...subAnim, textAlign: "center" }}>
            <div
              style={{
                fontFamily: BV,
                fontWeight: 700,
                fontSize: 54,
                lineHeight: 1.22,
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
