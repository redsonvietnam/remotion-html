// ---------------------------------------------------------------------------
// VisionScene — De An 06 Vision 2030 Scene
//
// Uses: RingDraw (design/svg), KaraokeReveal (design/typography)
// Uses: slideUp, fadeIn, Backdrop (template-specific helpers)
// Theme: consumed via useTheme() — not imported directly
// ---------------------------------------------------------------------------

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Audio,
} from "remotion";
import { RingDraw } from "../../../design/svg";
import { KaraokeReveal } from "../../../design/typography";
import { useTheme } from "../../../design/theme";
import { slideUp, fadeIn, Backdrop } from "../helpers";
import type { NQ57VisionContent } from "../../../data/nq57";

type Props = { audio: string; caption: string; dur: number } & NQ57VisionContent;

export const VisionScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  label,
  targetValue,
  subtitle,
  description,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelAnim = slideUp(frame, 0, fps, 30);
  const ringAnim = interpolate(frame, [15, 85], [0, 1], { extrapolateRight: "clamp" });
  const p = spring({ frame, fps, config: { damping: 18, mass: 0.8 } });
  const val = Math.round(interpolate(p, [0, 1], [0, targetValue]));
  const numAnim = slideUp(frame, 25, fps, 40);
  const subAnim = slideUp(frame, 45, fps, 30);
  const descAnim = slideUp(frame, 60, fps, 30);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", paddingBottom: "10%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ position: "relative" }}>
        <RingDraw progress={ringAnim} size={500} color={theme.colors.accent1} strokeWidth={6} />
        <div style={{ ...numAnim, textAlign: "center", padding: "0 6%" }}>
          <div style={{ fontFamily: BV, fontWeight: 700, letterSpacing: 10, fontSize: 28, color: theme.colors.accent2, textTransform: "uppercase" }}>{label}</div>
          <div
            style={{
              fontFamily: BV,
              fontWeight: 800,
              fontSize: 180,
              lineHeight: 1,
              margin: "8px 0",
              background: `linear-gradient(135deg, ${theme.colors.accent1} 0%, ${theme.colors.accent3} 50%, ${theme.colors.accent2} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 100px rgba(0,212,255,0.2)",
            }}
          >
            {val}%
          </div>
        </div>
      </div>
      <div style={{ ...subAnim, fontFamily: BV, fontWeight: 600, fontSize: 42, color: theme.colors.ink, marginTop: 16, textAlign: "center", maxWidth: "80%" }}>{subtitle}</div>
      <div style={{ ...descAnim, fontFamily: BV, fontWeight: 400, fontSize: 28, color: theme.colors.muted, marginTop: 16, textAlign: "center", maxWidth: "70%", lineHeight: 1.5 }}>{description}</div>
      <KaraokeReveal
        text={caption}
        dur={dur}
        fontFamily={BV}
        activeColor={theme.colors.accent1}
        revealedColor={theme.colors.ink}
        borderColor={theme.colors.line}
        fontSize={20}
      />
    </AbsoluteFill>
  );
};