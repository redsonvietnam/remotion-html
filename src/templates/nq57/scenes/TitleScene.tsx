// ---------------------------------------------------------------------------
// TitleScene — NQ57 Title Scene
//
// Uses: RingDraw (design/svg), LineDraw (design/svg), KaraokeReveal (design/typography)
// Uses: fadeUp, Backdrop, EmblemBox (template-specific helpers)
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
import { fadeUp, Backdrop, EmblemBox } from "../helpers";
import type { NQ57TitleContent } from "../../../data/nq57";

type Props = { audio: string; caption: string; dur: number } & NQ57TitleContent;

export const TitleScene: React.FC<Props> = ({
  audio, caption, dur,
  badge, title, subtitle, tagline,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badgeAnim = fadeUp(frame, 0, fps);
  const big = fadeUp(frame, 8, fps);
  const sub = fadeUp(frame, 26, fps);
  const foot = fadeUp(frame, 44, fps);
  const ring = interpolate(frame, [0, 70], [0, 1], { extrapolateRight: "clamp" });
  const ul = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 8% 12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <RingDraw progress={ring} size={520} color={theme.colors.accent2} />
      <div style={{ ...badgeAnim, fontFamily: BV, fontWeight: 700, letterSpacing: 6, fontSize: 22, color: theme.colors.accent2 }}>{badge}</div>
      <EmblemBox size={430} />
      <div style={{ ...big, fontFamily: BV, fontWeight: 800, fontSize: 150, lineHeight: 1, marginTop: -10,
        background: `linear-gradient(90deg, ${theme.colors.accent1}, ${theme.colors.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {title}
      </div>
      <div style={{ ...sub, fontFamily: BV, fontWeight: 600, fontSize: 34, color: theme.colors.ink, textAlign: "center", maxWidth: "72%", marginTop: 14 }}>
        {subtitle}
      </div>
      <LineDraw progress={ul} width={460} stroke={theme.colors.accent2} />
      <div style={{ ...foot, fontFamily: BV, fontWeight: 500, fontSize: 24, color: theme.colors.muted, marginTop: 14 }}>{tagline}</div>
      <KaraokeReveal
        text={caption}
        dur={dur}
        fontFamily={BV}
        activeColor={theme.colors.accent2}
        revealedColor={theme.colors.ink}
        borderColor={theme.colors.line}
      />
    </AbsoluteFill>
  );
};
