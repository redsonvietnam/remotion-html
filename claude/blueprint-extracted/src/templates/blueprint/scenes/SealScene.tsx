// ---------------------------------------------------------------------------
// SealScene (S5) — Closing / Resolution.
// Visual metaphor: every crosshair drawn earlier in the video collapses
// into one finished stamp. This is the only scene where the grid itself
// gently brightens, signaling the drawing is complete.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, Audio, interpolate } from "remotion";
import { KaraokeReveal } from "../../../design/typography";
import { useTheme } from "../../../design/theme";
import { Backdrop, SafeContainer, settleIn } from "../helpers";
import { Seal } from "../svg";
import { MONO } from "../../../fonts/blueprint";
import type { BlueprintSealContent } from "../../../data/luatBHXH";

type Props = { audio: string; caption: string; dur: number } & BlueprintSealContent;

export const SealScene: React.FC<Props> = ({ audio, caption, dur, heading, lines, closingCode }) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glow = interpolate(frame, [0, 60], [0, 0.35], { extrapolateRight: "clamp" });
  const headingFade = settleIn(frame, 60, fps);
  const codeFade = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ background: theme.colors.accent2, opacity: glow, mixBlendMode: "overlay" }} />
      <Audio src={staticFile(audio)} />
      <SafeContainer>
        <Seal size={210} color={theme.colors.accent2} delay={0} />

        <div style={{ ...headingFade, marginTop: 26, textAlign: "center" }}>
          <div style={{ fontFamily: BV, fontWeight: 800, fontSize: 42, color: theme.colors.ink, letterSpacing: 2 }}>
            {heading}
          </div>
        </div>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                ...settleIn(frame, 72 + i * 8, fps, 10),
                fontFamily: BV,
                fontWeight: 500,
                fontSize: 22,
                letterSpacing: 3,
                color: theme.colors.muted,
                textTransform: "uppercase",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 24,
            fontFamily: MONO,
            fontSize: 20,
            letterSpacing: 4,
            color: theme.colors.accent2,
            opacity: codeFade,
          }}
        >
          {closingCode}
        </div>

        <KaraokeReveal
          text={caption}
          dur={dur}
          fontFamily={BV}
          activeColor={theme.colors.accent2}
          revealedColor={theme.colors.ink}
          borderColor={theme.colors.line}
          fontSize={22}
        />
      </SafeContainer>
    </AbsoluteFill>
  );
};
