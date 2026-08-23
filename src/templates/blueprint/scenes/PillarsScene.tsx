// ---------------------------------------------------------------------------
// PillarsScene (S2) — Structure.
// Visual metaphor: the law's reforms are drawn as four load-bearing beam
// blocks that snap into place left-to-right, forming one diagram instead of
// four disconnected cards.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, Audio, interpolate } from "remotion";
import { KaraokeReveal } from "../../../design/typography";
import { useTheme } from "../../../design/theme";
import { Backdrop, SafeContainer, settleIn, EyebrowLabel } from "../helpers";
import { BeamBlock, Crosshair } from "../svg";
import { MONO } from "../../../fonts/blueprint";
import type { BlueprintPillarsContent } from "../../../data/luatBHXH";

type Props = { audio: string; caption: string; dur: number } & BlueprintPillarsContent;

const BLOCK_W = 380;
const BLOCK_H = 340;
const GAP = 24;

export const PillarsScene: React.FC<Props> = ({ audio, caption, dur, heading, pillars }) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <SafeContainer>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 34 }}>
          <Crosshair size={36} color={theme.colors.accent2} delay={0} />
          <div style={settleIn(frame, 10, fps)}>
            <EyebrowLabel text={heading} color={theme.colors.accent2} fontFamily={BV} />
          </div>
        </div>

        <div style={{ display: "flex", gap: GAP }}>
          {pillars.map((p, i) => {
            const delay = 20 + i * 14;
            const bodyFade = interpolate(frame, [delay + 14, delay + 34], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <BeamBlock key={i} width={BLOCK_W} height={BLOCK_H} delay={delay} color={theme.colors.accent1}>
                <div style={{ padding: 26, display: "flex", flexDirection: "column", height: "100%" }}>
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 15,
                      letterSpacing: 2,
                      color: theme.colors.accent2,
                      opacity: bodyFade,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    style={{
                      fontFamily: BV,
                      fontWeight: 700,
                      fontSize: 28,
                      lineHeight: 1.15,
                      color: theme.colors.ink,
                      marginTop: 14,
                      opacity: bodyFade,
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    style={{
                      fontFamily: BV,
                      fontWeight: 400,
                      fontSize: 19,
                      lineHeight: 1.45,
                      color: theme.colors.muted,
                      marginTop: 14,
                      opacity: bodyFade,
                    }}
                  >
                    {p.body}
                  </div>
                </div>
              </BeamBlock>
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
          fontSize={22}
        />
      </SafeContainer>
    </AbsoluteFill>
  );
};
