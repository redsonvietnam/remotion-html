// ---------------------------------------------------------------------------
// ProcessScene — Timeline / Sequence.
// Visual metaphor: milestones are nodes lighting up in order along a
// drafting-style track, the same "measured fact" language as DimensionLine
// but laid out across time instead of value — completes the scene grammar
// for content that is a sequence of steps/dates rather than a static
// structure (pillars) or a single stat (measure).
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, Audio, interpolate } from "remotion";
import { KaraokeReveal } from "../../../design/typography";
import { useTheme } from "../../../design/theme";
import { Backdrop, SafeContainer, settleIn, EyebrowLabel } from "../helpers";
import { Crosshair, TimelineTrack } from "../svg";
import { MONO } from "../../../fonts/blueprint";
import type { BlueprintProcessContent } from "../../../data/luatBHXH";

type Props = { audio: string; caption: string; dur: number } & BlueprintProcessContent;

const TRACK_WIDTH = 1260;
const STEP_DELAY = 26;

export const ProcessScene: React.FC<Props> = ({ audio, caption, dur, heading, steps }) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <SafeContainer>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 56 }}>
          <Crosshair size={36} color={theme.colors.accent2} delay={0} />
          <div style={settleIn(frame, 10, fps)}>
            <EyebrowLabel text={heading} color={theme.colors.accent2} fontFamily={BV} />
          </div>
        </div>

        <TimelineTrack
          width={TRACK_WIDTH}
          steps={steps.length}
          color={theme.colors.line}
          activeColor={theme.colors.accent2}
          delay={20}
          stepDelay={STEP_DELAY}
        />

        <div style={{ display: "flex", width: TRACK_WIDTH, marginTop: 26, justifyContent: "space-between" }}>
          {steps.map((s, i) => {
            const nodeDelay = 20 + 8 + i * STEP_DELAY;
            const fade = interpolate(frame, [nodeDelay + 4, nodeDelay + 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const shift = interpolate(frame, [nodeDelay + 4, nodeDelay + 20], [10, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            // Edge steps align to the track's endpoints; middle steps stay centered.
            const align = i === 0 ? "flex-start" : i === steps.length - 1 ? "flex-end" : "center";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: align,
                  opacity: fade,
                  transform: `translateY(${shift}px)`,
                  maxWidth: TRACK_WIDTH / steps.length + 60,
                  textAlign: align === "flex-start" ? "left" : align === "flex-end" ? "right" : "center",
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 2, color: theme.colors.accent2 }}>
                  {s.date}
                </div>
                <div
                  style={{
                    fontFamily: BV,
                    fontWeight: 500,
                    fontSize: 21,
                    color: theme.colors.ink,
                    marginTop: 8,
                    lineHeight: 1.4,
                  }}
                >
                  {s.label}
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
