// ---------------------------------------------------------------------------
// PillarsScene — NQ57 Pillars Scene
//
// Uses: LineDraw (design/svg), KaraokeReveal (design/typography)
// Uses: fadeUp, Backdrop, Bars3DBox (template-specific helpers)
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
import { LineDraw } from "../../../design/svg";
import { KaraokeReveal } from "../../../design/typography";
import { useTheme } from "../../../design/theme";
import { fadeUp, Backdrop, Bars3DBox } from "../helpers";
import type { NQ57PillarsContent } from "../../../data/nq57";

type Props = { audio: string; caption: string; dur: number } & NQ57PillarsContent;

export const PillarsScene: React.FC<Props> = ({
  audio, caption, dur,
  title, subtitle, pillars,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const PILLAR_COLORS = [theme.colors.accent1, theme.colors.accent2, theme.colors.accent3, theme.colors.accent2, theme.colors.accent1];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ul = interpolate(frame, [16, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 5% 12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ fontFamily: BV, fontWeight: 800, fontSize: 50, color: theme.colors.ink, marginTop: 16 }}>{title}</div>
      <div style={{ fontFamily: BV, fontWeight: 500, fontSize: 26, color: theme.colors.accent2, marginBottom: 6 }}>{subtitle}</div>
      <LineDraw progress={ul} width={420} stroke={theme.colors.accent2} />
      <Bars3DBox count={pillars.length} width={Math.round(1920 * 0.7)} height={500} />
      <div style={{ display: "flex", gap: 18, marginTop: 6 }}>
        {pillars.map((p, i) => {
          const e = fadeUp(frame, 20 + i * 8, fps);
          return (
            <div key={i} style={{ ...e, width: 200, textAlign: "center", fontFamily: BV, fontWeight: 600, fontSize: 22, color: theme.colors.ink }}>
              <span style={{ color: PILLAR_COLORS[i % PILLAR_COLORS.length], fontWeight: 800, marginRight: 6 }}>{i + 1}.</span>
              {p}
            </div>
          );
        })}
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
