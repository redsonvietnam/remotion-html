// ---------------------------------------------------------------------------
// Statement Scene (S2) — Love itself is not pain; the desire to control is.
// Visual metaphor: a stable heart/light; control lines wrap around it, tighten,
// then release. Motion contrasts LOVE vs CONTROL.
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
import { slideUp, Backdrop, SafeContainer, HorizontalRule, LightSweep, BlurReveal } from "../helpers";
import { ControlOrbital } from "../svg";
import { ramp } from "../svg/motion";
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
  const total = Math.round(dur * fps);

  // Control wraps tight, then releases near the end.
  const wrap = ramp(frame, total * 0.1, total * 0.6, 0, 1);
  const release = ramp(frame, total * 0.7, total * 0.95, 0, 1);
  const amount = wrap * (1 - release * 0.75);

  const ruleAnim = slideUp(frame, lines.length * 18 + 10, fps, 40);

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
        <ControlOrbital frame={frame} fps={fps} size={500} amount={amount} />
      </div>
      <SafeContainer style={{ justifyContent: "flex-end", paddingBottom: 230 }}>
        {lines.map((line, i) => {
          const lineAnim = slideUp(frame, 6 + i * 18, fps, 60);
          return (
            <BlurReveal key={i} frame={frame} delay={6 + i * 18} fps={fps} duration={35}>
              <div style={{ ...lineAnim, textAlign: "center", marginBottom: i === lines.length - 1 ? 24 : 8 }}>
                <div
                  style={{
                    fontFamily: BV,
                    fontWeight: highlightIndex === i ? 800 : 500,
                    fontSize: 50,
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
          );
        })}
        <BlurReveal frame={frame} delay={lines.length * 18 + 10} fps={fps} duration={30}>
          <HorizontalRule width={180} color={theme.colors.accent2} />
        </BlurReveal>
      </SafeContainer>
    </AbsoluteFill>
  );
};
