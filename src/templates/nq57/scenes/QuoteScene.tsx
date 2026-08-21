// ---------------------------------------------------------------------------
// QuoteScene — NQ57 Quote Scene
//
// Uses: LineDraw (design/svg), KaraokeReveal (design/typography)
// Uses: fadeUp, Backdrop (template-specific helpers)
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
import { fadeUp, Backdrop } from "../helpers";
import type { NQ57QuoteContent } from "../../../data/nq57";

type Props = { audio: string; caption: string; dur: number } & NQ57QuoteContent;

function renderQuote(text: string, keyPhrases: string[], accentColor: string): React.ReactNode {
  if (keyPhrases.length === 0) return text;
  const pattern = keyPhrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const parts = text.split(new RegExp(`(${pattern})`, "g"));
  return parts.map((part, i) => {
    const isKey = keyPhrases.includes(part);
    return isKey ? (
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

export const QuoteScene: React.FC<Props> = ({
  audio, caption, dur,
  text, keyPhrases,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = fadeUp(frame, 0, fps);
  const ul = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 9% 12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ position: "absolute", top: "12%", left: "9%", fontFamily: BV, fontWeight: 800, fontSize: 200, color: "rgba(226,59,59,0.16)" }}>{"\u201C"}</div>
      <div style={{ ...q, fontFamily: BV, fontWeight: 700, fontSize: 60, lineHeight: 1.35, color: theme.colors.ink, textAlign: "center", maxWidth: "80%" }}>
        {renderQuote(text, keyPhrases, theme.colors.accent2)}
      </div>
      <LineDraw progress={ul} width={520} stroke={theme.colors.accent3} />
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
