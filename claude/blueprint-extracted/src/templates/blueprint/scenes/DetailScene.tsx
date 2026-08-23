// ---------------------------------------------------------------------------
// DetailScene (S4) — Clause / Itemized Detail.
// Visual metaphor: exceptions/conditions are annotated like callouts on a
// spec sheet — a leader line arrives, then a numbered tag resolves, then
// the clause text settles. Reading order mirrors how a technical drawing
// is annotated, not a bullet list.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, Audio, interpolate } from "remotion";
import { KaraokeReveal } from "../../../design/typography";
import { useTheme } from "../../../design/theme";
import { Backdrop, SafeContainer, settleIn, EyebrowLabel } from "../helpers";
import { Crosshair, CalloutTag } from "../svg";
import { MONO } from "../../../fonts/blueprint";
import type { BlueprintDetailContent } from "../../../data/luatBHXH";

type Props = { audio: string; caption: string; dur: number } & BlueprintDetailContent;

export const DetailScene: React.FC<Props> = ({ audio, caption, dur, heading, items }) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <SafeContainer style={{ justifyContent: "flex-start", paddingTop: "10%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 44 }}>
          <Crosshair size={36} color={theme.colors.accent2} delay={0} />
          <div style={settleIn(frame, 10, fps)}>
            <EyebrowLabel text={heading} color={theme.colors.accent2} fontFamily={BV} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26, width: "100%", maxWidth: 1180 }}>
          {items.map((item, i) => {
            const delay = 24 + i * 18;
            const textFade = interpolate(frame, [delay + 6, delay + 22], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const textShift = interpolate(frame, [delay + 6, delay + 22], [14, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <CalloutTag index={i + 1} delay={delay} color={theme.colors.accent2} mono={MONO} />
                <div
                  style={{
                    fontFamily: BV,
                    fontWeight: 500,
                    fontSize: 30,
                    color: theme.colors.ink,
                    opacity: textFade,
                    transform: `translateX(${textShift}px)`,
                  }}
                >
                  {item}
                </div>
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
          fontSize={22}
        />
      </SafeContainer>
    </AbsoluteFill>
  );
};
