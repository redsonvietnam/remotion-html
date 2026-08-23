// ---------------------------------------------------------------------------
// MeasureScene (S3) — Stat / Emphasis.
// Visual metaphor: a policy number-change is drawn as two dimension lines,
// proportional to their values, so the eye reads the reduction as a
// measured fact rather than a printed statistic.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, Audio, interpolate } from "remotion";
import { KaraokeReveal } from "../../../design/typography";
import { useTheme } from "../../../design/theme";
import { Backdrop, SafeContainer, settleIn, EyebrowLabel } from "../helpers";
import { Crosshair, DimensionLine } from "../svg";
import { ramp } from "../svg/motion";
import { MONO } from "../../../fonts/blueprint";
import type { BlueprintMeasureContent } from "../../../data/luatBHXH";

type Props = { audio: string; caption: string; dur: number } & BlueprintMeasureContent;

export const MeasureScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  heading,
  fromLabel,
  fromValue,
  toLabel,
  toValue,
  unit,
  note,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fromNum = parseFloat(fromValue) || 1;
  const toNum = parseFloat(toValue) || 1;
  const scale = 18; // px per unit
  const fromLen = fromNum * scale;
  const toLen = toNum * scale;

  const fromFade = ramp(frame, 20, 34, 0, 1);
  const toFade = ramp(frame, 46, 60, 0, 1);
  const arrowFade = ramp(frame, 60, 76, 0, 1);
  const noteFade = interpolate(frame, [86, 106], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Column: React.FC<{ label: string; value: string; len: number; color: string; delay: number; fade: number }> = ({
    label,
    value,
    len,
    color,
    delay,
    fade,
  }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: fade }}>
      <div style={{ fontFamily: BV, fontWeight: 700, fontSize: 18, letterSpacing: 4, color: theme.colors.muted }}>{label}</div>
      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 150, lineHeight: 1, color, marginTop: 6 }}>{value}</div>
      <div style={{ marginTop: 18 }}>
        <DimensionLine length={len} color={color} delay={delay} duration={20} />
      </div>
    </div>
  );

  return (
    <AbsoluteFill>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <SafeContainer>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <Crosshair size={36} color={theme.colors.accent2} delay={0} />
          <div style={settleIn(frame, 10, fps)}>
            <EyebrowLabel text={heading} color={theme.colors.accent2} fontFamily={BV} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 70 }}>
          <Column label={fromLabel} value={fromValue} len={fromLen} color={theme.colors.muted} delay={20} fade={fromFade} />
          <div
            style={{
              fontFamily: BV,
              fontSize: 52,
              color: theme.colors.accent3,
              opacity: arrowFade,
              transform: `translateY(-20px)`,
            }}
          >
            →
          </div>
          <Column label={toLabel} value={toValue} len={toLen} color={theme.colors.accent2} delay={46} fade={toFade} />
        </div>

        <div style={{ fontFamily: BV, fontWeight: 600, fontSize: 22, letterSpacing: 2, color: theme.colors.ink, marginTop: 36, opacity: noteFade }}>
          {unit}
        </div>
        <div
          style={{
            fontFamily: BV,
            fontWeight: 400,
            fontSize: 20,
            color: theme.colors.muted,
            marginTop: 10,
            maxWidth: 760,
            textAlign: "center",
            lineHeight: 1.5,
            opacity: noteFade,
          }}
        >
          {note}
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
