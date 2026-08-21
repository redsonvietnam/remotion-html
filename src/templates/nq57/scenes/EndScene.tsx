// ---------------------------------------------------------------------------
// EndScene — NQ57 End Scene
//
// Uses: RingDraw (design/svg), KaraokeReveal (design/typography)
// Uses: fadeUp, Backdrop, EmblemBox (template-specific helpers)
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
import { RingDraw } from "../../../design/svg";
import { KaraokeReveal } from "../../../design/typography";
import { nq57 } from "../../../theme/nq57";
import { BV } from "../../../fonts/nq57";
import { fadeUp, Backdrop, EmblemBox } from "../helpers";
import type { NQ57EndContent } from "../../../data/nq57";

type Props = { audio: string; caption: string; dur: number } & NQ57EndContent;

export const EndScene: React.FC<Props> = ({
  audio, caption, dur,
  title, subtitle, reference,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = fadeUp(frame, 0, fps);
  const ring = interpolate(frame, [0, 70], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", paddingBottom: "12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ position: "relative" }}>
        <RingDraw progress={ring} size={420} color={nq57.colors.accent2} />
        <EmblemBox size={360} />
      </div>
      <div style={{ ...e, textAlign: "center", padding: "0 8%", marginTop: -10 }}>
        <div style={{ fontFamily: BV, fontWeight: 800, fontSize: 82, lineHeight: 1.15,
          background: `linear-gradient(90deg, ${nq57.colors.accent1}, ${nq57.colors.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{title}</div>
        <div style={{ fontFamily: BV, fontWeight: 600, fontSize: 38, color: nq57.colors.ink, marginTop: 18 }}>{subtitle}</div>
        <div style={{ fontFamily: BV, fontWeight: 700, letterSpacing: 4, fontSize: 24, color: nq57.colors.muted, marginTop: 34 }}>{reference}</div>
      </div>
      <KaraokeReveal
        text={caption}
        dur={dur}
        fontFamily={BV}
        activeColor={nq57.colors.accent2}
        revealedColor={nq57.colors.ink}
        borderColor={nq57.colors.line}
      />
    </AbsoluteFill>
  );
};
