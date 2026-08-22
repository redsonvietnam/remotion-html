// ---------------------------------------------------------------------------
// Concept Scene — shared by S4, S5, S7, S8, S9.
// Each scene carries a distinct visual metaphor selected by sceneId:
//   s4  love-without-possession → OpenHand (opens, heart floats free)
//   s5  five qualities          → InnerCore (radial constellation builds)
//   s7  when love ends          → Separation (two orbits part, self-core stays)
//   s8  stoic nature            → FreedomOrbit (cage becomes open system)
//   s9  final thought           → FreedomOrbit (calm, open)
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
import { useTheme } from "../../../design/theme";
import { slideUp, Backdrop, SafeContainer, HorizontalRule, LightSweep, BlurReveal } from "../helpers";
import {
  OpenHand,
  InnerCore,
  Separation,
  FreedomOrbit,
} from "../svg";
import { ramp } from "../svg/motion";
import type { StoicLoveConceptContent } from "../../../data/stoicLove";

type Props = { audio: string; caption: string; dur: number; sceneId?: string } & StoicLoveConceptContent;

function motifFor(sceneId?: string): "openHand" | "innerCore" | "separation" | "freedom" | "freedomCalm" {
  switch (sceneId) {
    case "s4":
      return "openHand";
    case "s5":
      return "innerCore";
    case "s7":
      return "separation";
    case "s8":
      return "freedom";
    case "s9":
      return "freedomCalm";
    default:
      return "freedomCalm";
  }
}

export const ConceptScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  sceneId,
  headline,
  bodyLines,
  emphasisIndex = -1,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = Math.round(dur * fps);
  const motif = motifFor(sceneId);

  const headlineAnim = slideUp(frame, 0, fps, 60);
  const bodyAnims = bodyLines.map((_, i) => slideUp(frame, 25 + i * 15, fps, 70));

  const hero = (() => {
    switch (motif) {
      case "openHand":
        return <OpenHand frame={frame} fps={fps} size={460} openness={ramp(frame, total * 0.15, total * 0.85, 0, 1)} />;
      case "innerCore":
        return <InnerCore frame={frame} fps={fps} size={460} count={5} activation={ramp(frame, total * 0.12, total * 0.9, 0, 1)} />;
      case "separation":
        return <Separation frame={frame} fps={fps} size={480} amount={ramp(frame, total * 0.2, total * 0.9, 0, 1)} />;
      case "freedom":
        return <FreedomOrbit frame={frame} fps={fps} size={480} freedom={ramp(frame, total * 0.1, total * 0.9, 0, 1)} />;
      case "freedomCalm":
      default:
        return <FreedomOrbit frame={frame} fps={fps} size={480} freedom={0.85} />;
    }
  })();

  const heroOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Backdrop />
      <LightSweep frame={frame} fps={fps} color={theme.colors.accent2} />
      <Audio src={staticFile(audio)} />
      <div
        style={{
          position: "absolute",
          top: "9%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: heroOpacity,
          pointerEvents: "none",
        }}
      >
        {hero}
      </div>
      <SafeContainer style={{ justifyContent: "flex-end", paddingBottom: 240 }}>
        <BlurReveal frame={frame} delay={0} fps={fps} duration={40}>
          <div style={{ ...headlineAnim, textAlign: "center", marginBottom: 28 }}>
            <div
              style={{
                fontFamily: BV,
                fontWeight: 800,
                fontSize: 54,
                lineHeight: 1.2,
                color: theme.colors.accent1,
                textShadow: `0 4px 60px ${theme.colors.accent2}40`,
                letterSpacing: -1,
              }}
            >
              {headline}
            </div>
          </div>
        </BlurReveal>
        {bodyLines.map((line, i) => (
          <BlurReveal key={i} frame={frame} delay={25 + i * 15} fps={fps} duration={35}>
            <div style={{ ...bodyAnims[i], textAlign: "center", marginBottom: i === bodyLines.length - 1 ? 24 : 10 }}>
              <div
                style={{
                  fontFamily: BV,
                  fontWeight: emphasisIndex === i ? 700 : 500,
                  fontSize: emphasisIndex === i ? 50 : 42,
                  lineHeight: 1.4,
                  color: emphasisIndex === i ? theme.colors.accent1 : theme.colors.ink,
                  textShadow: emphasisIndex === i ? `0 4px 60px ${theme.colors.accent2}40` : "none",
                }}
              >
                {line}
              </div>
            </div>
          </BlurReveal>
        ))}
        <BlurReveal frame={frame} delay={25 + bodyLines.length * 15 + 10} fps={fps} duration={30}>
          <HorizontalRule width={200} color={theme.colors.accent2} />
        </BlurReveal>
      </SafeContainer>
    </AbsoluteFill>
  );
};
