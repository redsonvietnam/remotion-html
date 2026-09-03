// ---------------------------------------------------------------------------
// Split Scene (S3) — Dichotomy of Control.
// Visual metaphor: two gravitational fields either side of a central axis.
//   LEFT  (within my control)  — stable gold orbit with a heart core.
//   RIGHT (not in my control)  — drifting bronze field, no core, no center.
// The distinction is immediate before reading a word.
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
import { slideUp, Backdrop, SafeContainer, VerticalDivider, LightSweep, BlurReveal } from "../helpers";
import { OrbitField } from "../svg";
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
  const leftAnims = leftItems.map((_, i) => slideUp(frame, 40 + i * 12, fps, 70));
  const rightAnims = rightItems.map((_, i) => slideUp(frame, 40 + i * 12, fps, 70));

  return (
    <AbsoluteFill>
      <Backdrop />
      <LightSweep frame={frame} fps={fps} color={theme.colors.accent2} />
      <Audio src={staticFile(audio)} />
      <SafeContainer style={{ justifyContent: "flex-start", paddingTop: 120, paddingBottom: 120 }}>
        <BlurReveal frame={frame} delay={0} fps={fps} duration={35}>
          <div style={{ ...titleAnim, textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                fontFamily: BV,
                fontWeight: 700,
                fontSize: 38,
                color: theme.colors.accent2,
                letterSpacing: 6,
                textTransform: "uppercase",
              }}
            >
              {title}
            </div>
          </div>
        </BlurReveal>

        {/* Dual gravitational fields + central axis */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 28 }}>
          <OrbitField
            frame={frame}
            fps={fps}
            size={300}
            amount={0.15}
            struct={theme.colors.accent2}
            love={theme.colors.accent1}
          />
          <VerticalDivider height={260} color={theme.colors.accent2} />
          <OrbitField
            frame={frame}
            fps={fps}
            size={300}
            amount={0.15}
            showHeart={false}
            struct={theme.colors.accent3}
            love={theme.colors.accent3}
          />
        </div>

        <div style={{ display: "flex", gap: 36, width: "100%", maxWidth: 900 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <BlurReveal frame={frame} delay={30} fps={fps} duration={30}>
              <div style={{ fontFamily: BV, fontWeight: 700, fontSize: 26, color: theme.colors.accent1, marginBottom: 16, letterSpacing: 2 }}>
                {leftLabel}
              </div>
            </BlurReveal>
            {leftItems.map((item, i) => (
              <BlurReveal key={`L${i}`} frame={frame} delay={40 + i * 12} fps={fps} duration={35}>
                <div style={{ ...leftAnims[i], textAlign: "center", marginBottom: 14, width: "100%" }}>
                  <div style={{ fontFamily: BV, fontWeight: 500, fontSize: 32, lineHeight: 1.5, color: theme.colors.ink }}>{item}</div>
                </div>
              </BlurReveal>
            ))}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <BlurReveal frame={frame} delay={30} fps={fps} duration={30}>
              <div style={{ fontFamily: BV, fontWeight: 700, fontSize: 26, color: theme.colors.muted, marginBottom: 16, letterSpacing: 2 }}>
                {rightLabel}
              </div>
            </BlurReveal>
            {rightItems.map((item, i) => (
              <BlurReveal key={`R${i}`} frame={frame} delay={40 + i * 12} fps={fps} duration={35}>
                <div style={{ ...rightAnims[i], textAlign: "center", marginBottom: 14, width: "100%" }}>
                  <div style={{ fontFamily: BV, fontWeight: 400, fontSize: 32, lineHeight: 1.5, color: theme.colors.muted }}>{item}</div>
                </div>
              </BlurReveal>
            ))}
          </div>
        </div>
      </SafeContainer>
    </AbsoluteFill>
  );
};
