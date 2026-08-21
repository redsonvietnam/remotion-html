// ---------------------------------------------------------------------------
// TitleScene — De An 06 Title Scene
//
// Uses: RingDraw (design/svg), LineDraw (design/svg), KaraokeReveal (design/typography)
// Uses: fadeUp, slideUp, Backdrop, EmblemBox (template-specific helpers)
// Theme: consumed via useTheme() — not imported directly
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
import { RingDraw } from "../../../design/svg";
import { LineDraw } from "../../../design/svg";
import { KaraokeReveal } from "../../../design/typography";
import { useTheme } from "../../../design/theme";
import { fadeUp, slideUp, Backdrop, EmblemBox } from "../helpers";
import type { NQ57TitleContent } from "../../../data/nq57";

type Props = { audio: string; caption: string; dur: number } & NQ57TitleContent;

export const TitleScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  badge,
  title,
  subtitle,
  tagline,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeAnim = slideUp(frame, 0, fps, 40);
  const ringAnim = interpolate(frame, [0, 90], [0, 1], { extrapolateRight: "clamp" });
  const emblemAnim = slideUp(frame, 10, fps, 30);
  const titleAnim = slideUp(frame, 20, fps, 50);
  const subAnim = slideUp(frame, 35, fps, 40);
  const lineAnim = interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagAnim = slideUp(frame, 60, fps, 30);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 6% 10%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <RingDraw progress={ringAnim} size={560} color={theme.colors.accent1} />
      <div style={{ ...badgeAnim, fontFamily: BV, fontWeight: 700, letterSpacing: 8, fontSize: 20, color: theme.colors.accent1, textTransform: "uppercase" }}>{badge}</div>
      <div style={{ ...emblemAnim }}>
        <EmblemBox size={400} />
      </div>
      <div
        style={{
          ...titleAnim,
          fontFamily: BV,
          fontWeight: 800,
          fontSize: 140,
          lineHeight: 1.05,
          marginTop: -20,
          background: `linear-gradient(135deg, ${theme.colors.accent1} 0%, ${theme.colors.accent3} 50%, ${theme.colors.accent2} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 80px rgba(0,212,255,0.15)",
        }}
      >
        {title}
      </div>
      <div style={{ ...subAnim, fontFamily: BV, fontWeight: 500, fontSize: 38, color: theme.colors.ink, textAlign: "center", maxWidth: "78%", marginTop: 18, lineHeight: 1.3 }}>
        {subtitle}
      </div>
      <LineDraw progress={lineAnim} width={500} stroke={theme.colors.accent1} strokeWidth={3} />
      <div style={{ ...tagAnim, fontFamily: BV, fontWeight: 500, fontSize: 26, color: theme.colors.muted, marginTop: 20, letterSpacing: 2 }}>{tagline}</div>
      <KaraokeReveal
        text={caption}
        dur={dur}
        fontFamily={BV}
        activeColor={theme.colors.accent1}
        revealedColor={theme.colors.ink}
        borderColor={theme.colors.line}
        fontSize={22}
      />
    </AbsoluteFill>
  );
};