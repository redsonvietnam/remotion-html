// ---------------------------------------------------------------------------
// QuoteScene — De An 06 Quote Scene
//
// Uses: LineDraw (design/svg), KaraokeReveal (design/typography)
// Uses: slideUp, fadeIn, Backdrop (template-specific helpers)
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
import { slideUp, fadeIn, Backdrop } from "../helpers";
import type { NQ57QuoteContent } from "../../../data/nq57";

type Props = { audio: string; caption: string; dur: number } & NQ57QuoteContent;

function renderQuote(text: string, keyPhrases: string[], accentColor: string, inkColor: string): React.ReactNode {
  if (keyPhrases.length === 0) return text;
  const pattern = keyPhrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const parts = text.split(new RegExp(`(${pattern})`, "g"));
  return parts.map((part, i) => {
    const isKey = keyPhrases.includes(part);
    return isKey ? (
      <span key={i} style={{ color: accentColor, fontWeight: 700 }}>{part}</span>
    ) : (
      <span key={i} style={{ color: inkColor }}>{part}</span>
    );
  });
}

export const QuoteScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  text,
  keyPhrases,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const quoteAnim = slideUp(frame, 0, fps, 40);
  const lineAnim = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const markAnim = fadeIn(frame, 0, fps, 30);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 8% 10%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div
        style={{
          ...markAnim,
          position: "absolute",
          top: "10%",
          left: "8%",
          fontFamily: BV,
          fontWeight: 800,
          fontSize: 180,
          color: `${theme.colors.accent1}20`,
          lineHeight: 1,
        }}
      >
        {"\u201C"}
      </div>
      <div
        style={{
          ...quoteAnim,
          fontFamily: BV,
          fontWeight: 600,
          fontSize: 58,
          lineHeight: 1.5,
          color: theme.colors.ink,
          textAlign: "center",
          maxWidth: "85%",
          textShadow: "0 2px 20px rgba(0,0,0,0.3)",
        }}
      >
        {renderQuote(text, keyPhrases, theme.colors.accent1, theme.colors.ink)}
      </div>
      <LineDraw progress={lineAnim} width={580} stroke={theme.colors.accent2} strokeWidth={3} />
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