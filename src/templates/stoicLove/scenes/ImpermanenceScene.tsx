// ---------------------------------------------------------------------------
// Impermanence Scene (S6) — Nothing guarantees permanence.
// Visual metaphor: a circular cycle, particles forming and dissolving;
// a heart briefly exists inside the cycle, then dissolves — the cycle continues.
// PRESENCE → CHANGE → LOSS → CONTINUATION.
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
import { slideUp, Backdrop, SafeContainer, LightSweep, BlurReveal, HorizontalRule } from "../helpers";
import { ImpermanenceCycle } from "../svg";
import { ramp } from "../svg/motion";
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
  const total = Math.round(dur * fps);

  // Heart presence rises in the middle of the scene, then dissolves.
  const presence = ramp(frame, total * 0.15, total * 0.45, 0, 1) * (1 - ramp(frame, total * 0.6, total * 0.9, 0, 1));
  const phase = frame / total;

  const obsAnim = slideUp(frame, 0, fps, 60);
  const reframeAnim = slideUp(frame, 30, fps, 80);

  return (
    <AbsoluteFill>
      <Backdrop />
      <LightSweep frame={frame} fps={fps} color={theme.colors.accent2} />
      <Audio src={staticFile(audio)} />
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <ImpermanenceCycle frame={frame} fps={fps} size={500} phase={phase} presence={presence} />
      </div>
      <SafeContainer style={{ justifyContent: "flex-end", paddingBottom: 240 }}>
        <BlurReveal frame={frame} delay={0} fps={fps} duration={40}>
          <div style={{ ...obsAnim, textAlign: "center", marginBottom: 28, paddingLeft: 40, paddingRight: 40 }}>
            <div style={{ fontFamily: BV, fontWeight: 500, fontSize: 42, lineHeight: 1.5, color: theme.colors.ink, textShadow: `0 4px 40px ${theme.colors.accent2}20` }}>
              {observation}
            </div>
          </div>
        </BlurReveal>
        <BlurReveal frame={frame} delay={40} fps={fps} duration={30}>
          <HorizontalRule width={180} color={theme.colors.accent2} />
        </BlurReveal>
        <BlurReveal frame={frame} delay={55} fps={fps} duration={50}>
          <div style={{ ...reframeAnim, textAlign: "center", paddingLeft: 40, paddingRight: 40 }}>
            <div style={{ fontFamily: BV, fontWeight: 600, fontSize: 46, lineHeight: 1.4, color: theme.colors.accent1, textShadow: `0 4px 60px ${theme.colors.accent2}40` }}>
              {reframe}
            </div>
          </div>
        </BlurReveal>
      </SafeContainer>
    </AbsoluteFill>
  );
};
