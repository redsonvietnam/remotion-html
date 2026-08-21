// ---------------------------------------------------------------------------
// PillarsScene — De An 06 Pillars Scene
//
// Uses: LineDraw (design/svg), KaraokeReveal (design/typography)
// Uses: slideUp, fadeIn, Backdrop, Bars3DBox (template-specific helpers)
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
import { slideUp, fadeIn, Backdrop, Bars3DBox } from "../helpers";
import type { NQ57PillarsContent } from "../../../data/nq57";

type Props = { audio: string; caption: string; dur: number } & NQ57PillarsContent;

export const PillarsScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  title,
  subtitle,
  pillars,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const PILLAR_COLORS = [theme.colors.accent1, theme.colors.accent2, theme.colors.accent3, theme.colors.accent2, theme.colors.accent1];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = slideUp(frame, 0, fps, 30);
  const subAnim = slideUp(frame, 10, fps, 25);
  const lineAnim = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barsAnim = fadeIn(frame, 30, fps, 30);
  const pillAnims = pillars.map((_, i) => slideUp(frame, 50 + i * 8, fps, 30));

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 4% 10%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ ...titleAnim, fontFamily: BV, fontWeight: 800, fontSize: 54, color: theme.colors.ink, marginTop: 20, textAlign: "center", letterSpacing: -1 }}>{title}</div>
      <div style={{ ...subAnim, fontFamily: BV, fontWeight: 500, fontSize: 28, color: theme.colors.accent1, marginBottom: 10 }}>{subtitle}</div>
      <div style={{ opacity: lineAnim, transform: `scaleX(${lineAnim})`, transformOrigin: "center" }}>
        <LineDraw progress={1} width={480} stroke={theme.colors.accent1} strokeWidth={3} />
      </div>
      <div style={{ ...barsAnim, width: "100%", maxWidth: 1400 }}>
        <Bars3DBox count={pillars.length} width={1400} height={520} />
      </div>
      <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {pillars.map((p, i) => {
          const e = pillAnims[i];
          return (
            <div
              key={i}
              style={{
                ...e,
                width: 220,
                minHeight: 80,
                textAlign: "center",
                fontFamily: BV,
                fontWeight: 600,
                fontSize: 22,
                color: theme.colors.ink,
                padding: "16px 12px",
                background: theme.colors.card,
                border: `1px solid ${theme.colors.line}`,
                borderRadius: 16,
                borderLeft: `4px solid ${PILLAR_COLORS[i % PILLAR_COLORS.length]}`,
                boxShadow: `0 8px 24px -8px ${PILLAR_COLORS[i % PILLAR_COLORS.length]}40`,
              }}
            >
              <span style={{ color: PILLAR_COLORS[i % PILLAR_COLORS.length], fontWeight: 800, marginRight: 8, fontSize: 20 }}>{i + 1}.</span>
              {p}
            </div>
          );
        })}
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