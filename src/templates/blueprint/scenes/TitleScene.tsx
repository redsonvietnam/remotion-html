// ---------------------------------------------------------------------------
// TitleScene (S1) — Hook / Title.
// Visual metaphor: the drafting pen finds its origin point (crosshair),
// stamps the law's code as a dimension figure, then the title assembles
// beneath it. Nothing before the crosshair resolves.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, Audio } from "remotion";
import { KaraokeReveal } from "../../../design/typography";
import { useTheme } from "../../../design/theme";
import { Backdrop, SafeContainer, snapUp, settleIn, EyebrowLabel } from "../helpers";
import { Crosshair, DimensionLine } from "../svg";
import { ramp } from "../svg/motion";
import { MONO } from "../../../fonts/blueprint";
import type { BlueprintTitleContent } from "../../../data/luatBHXH";

type Props = { audio: string; caption: string; dur: number } & BlueprintTitleContent;

export const TitleScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  code,
  title,
  subtitle,
  effectiveDate,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const codeReveal = ramp(frame, 24, 40, 0, 1);
  const titleLines = title.split("\n");

  return (
    <AbsoluteFill>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <SafeContainer>
        <Crosshair size={56} color={theme.colors.accent2} delay={0} />

        <div
          style={{
            marginTop: 14,
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: 4,
            color: theme.colors.accent2,
            opacity: codeReveal,
          }}
        >
          {code}
        </div>

        <div style={{ marginTop: 28, textAlign: "center" }}>
          {titleLines.map((line, i) => (
            <div
              key={i}
              style={{
                ...snapUp(frame, 44 + i * 10, fps, 34),
                fontFamily: BV,
                fontWeight: 800,
                fontSize: 96,
                lineHeight: 1.06,
                letterSpacing: 1,
                color: theme.colors.ink,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div style={{ ...settleIn(frame, 80, fps), marginTop: 22 }}>
          <EyebrowLabel text={subtitle} color={theme.colors.muted} fontFamily={BV} style={{ fontSize: 22, letterSpacing: 5 }} />
        </div>

        <div style={{ ...settleIn(frame, 96, fps), marginTop: 30, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <DimensionLine length={340} color={theme.colors.accent3} delay={96} duration={22} />
          <EyebrowLabel text={effectiveDate} color={theme.colors.accent1} fontFamily={BV} style={{ fontSize: 18, letterSpacing: 4 }} />
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
