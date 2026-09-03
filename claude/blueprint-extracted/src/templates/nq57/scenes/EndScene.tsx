// ---------------------------------------------------------------------------
// EndScene — De An 06 End Scene
//
// Uses: RingDraw (design/svg), KaraokeReveal (design/typography)
// Uses: slideUp, fadeIn, Backdrop, EmblemBox (template-specific helpers)
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
import { KaraokeReveal } from "../../../design/typography";
import { useTheme } from "../../../design/theme";
import { slideUp, fadeIn, Backdrop, EmblemBox } from "../helpers";
import type { NQ57EndContent } from "../../../data/nq57";

type Props = { audio: string; caption: string; dur: number } & NQ57EndContent;

export const EndScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  title,
  subtitle,
  reference,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ringAnim = interpolate(frame, [0, 90], [0, 1], { extrapolateRight: "clamp" });
  const emblemAnim = slideUp(frame, 10, fps, 30);
  const titleAnim = slideUp(frame, 25, fps, 50);
  const subAnim = slideUp(frame, 45, fps, 40);
  const refAnim = slideUp(frame, 65, fps, 30);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", paddingBottom: "10%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ position: "relative" }}>
        <RingDraw progress={ringAnim} size={460} color={theme.colors.accent1} strokeWidth={5} />
        <div style={{ ...emblemAnim }}>
          <EmblemBox size={380} />
        </div>
      </div>
      <div
        style={{
          ...titleAnim,
          textAlign: "center",
          padding: "0 6%",
          marginTop: -20,
        }}
      >
        <div
          style={{
            fontFamily: BV,
            fontWeight: 800,
            fontSize: 88,
            lineHeight: 1.1,
            background: `linear-gradient(135deg, ${theme.colors.accent1} 0%, ${theme.colors.accent3} 50%, ${theme.colors.accent2} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 80px rgba(0,212,255,0.15)",
          }}
        >
          {title}
        </div>
        <div style={{ ...subAnim, fontFamily: BV, fontWeight: 500, fontSize: 40, color: theme.colors.ink, marginTop: 22, lineHeight: 1.3 }}>{subtitle}</div>
        <div style={{ ...refAnim, fontFamily: BV, fontWeight: 600, letterSpacing: 6, fontSize: 22, color: theme.colors.muted, marginTop: 40, textTransform: "uppercase" }}>{reference}</div>
      </div>
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