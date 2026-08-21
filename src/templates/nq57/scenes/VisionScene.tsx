// ---------------------------------------------------------------------------
// VisionScene — NQ57 Vision 2045 Scene
//
// Uses: RingDraw (design/svg), KaraokeReveal (design/typography)
// Uses: fadeUp, Backdrop (template-specific helpers)
// ---------------------------------------------------------------------------

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Audio,
} from "remotion";
import { RingDraw } from "../../../design/svg";
import { KaraokeReveal } from "../../../design/typography";
import { nq57 } from "../../../theme/nq57";
import { BV } from "../../../fonts/nq57";
import { fadeUp, Backdrop } from "../helpers";

export const VisionScene: React.FC<{ audio: string; caption: string; dur: number }> = ({
  audio,
  caption,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = fadeUp(frame, 0, fps);
  const ring = interpolate(frame, [10, 70], [0, 1], { extrapolateRight: "clamp" });
  const p = spring({ frame, fps, config: { damping: 16, mass: 0.9 } });
  const val = Math.round(interpolate(p, [0, 1], [0, 50]));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", paddingBottom: "12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ position: "relative" }}>
        <RingDraw progress={ring} size={460} color={nq57.colors.red} />
        <div style={{ ...e, textAlign: "center", padding: "0 6%" }}>
          <div style={{ fontFamily: BV, fontWeight: 700, letterSpacing: 8, fontSize: 30, color: nq57.colors.gold }}>TẦM NHÌN 2045</div>
          <div style={{ fontFamily: BV, fontWeight: 800, fontSize: 168, lineHeight: 1, margin: "6px 0",
            background: `linear-gradient(90deg, ${nq57.colors.red}, ${nq57.colors.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{val}%</div>
        </div>
      </div>
      <div style={{ fontFamily: BV, fontWeight: 600, fontSize: 38, color: nq57.colors.ink, marginTop: 10 }}>Kinh tế số · Nước phát triển, thu nhập cao</div>
      <div style={{ fontFamily: BV, fontWeight: 500, fontSize: 26, color: nq57.colors.muted, marginTop: 10 }}>Top 30 thế giới về đổi mới sáng tạo & chuyển đổi số</div>
      <KaraokeReveal
        text={caption}
        dur={dur}
        fontFamily={BV}
        activeColor={nq57.colors.gold}
        revealedColor={nq57.colors.ink}
        borderColor={nq57.colors.line}
      />
    </AbsoluteFill>
  );
};
