// ---------------------------------------------------------------------------
// EndScene — NQ57 End Scene
//
// Uses: RingDraw (design/svg), KaraokeReveal (design/typography)
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
import { KaraokeReveal } from "../../../design/typography";
import { useTheme } from "../../../design/theme";
import { fadeUp, Backdrop, EmblemBox } from "../helpers";
import type { NQ57EndContent } from "../../../data/nq57";

type Props = { audio: string; caption: string; dur: number } & NQ57EndContent;

export const EndScene: React.FC<Props> = ({
  audio, caption, dur,
  title, subtitle, reference,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = fadeUp(frame, 0, fps);
  const ring = interpolate(frame, [0, 70], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", paddingBottom: "12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ position: "relative" }}>
        <RingDraw progress={ring} size={420} color={theme.colors.accent2} />
        <EmblemBox size={360} />
      </div>
      <div style={{ ...e, textAlign: "center", padding: "0 8%", marginTop: -10 }}>
        <div style={{ fontFamily: BV, fontWeight: 800, fontSize: 82, lineHeight: 1.15,
          background: `linear-gradient(90deg, ${theme.colors.accent1}, ${theme.colors.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{title}</div>
        <div style={{ fontFamily: BV, fontWeight: 600, fontSize: 38, color: theme.colors.ink, marginTop: 18 }}>{subtitle}</div>
        <div style={{ fontFamily: BV, fontWeight: 700, letterSpacing: 4, fontSize: 24, color: theme.colors.muted, marginTop: 34 }}>{reference}</div>
      </div>
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
