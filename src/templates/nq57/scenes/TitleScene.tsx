// ---------------------------------------------------------------------------
// TitleScene — NQ57 Title Scene
//
// Uses: RingDraw (design/svg), LineDraw (design/svg), KaraokeReveal (design/typography)
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
import { LineDraw } from "../../../design/svg";
import { KaraokeReveal } from "../../../design/typography";
import { nq57 } from "../../../theme/nq57";
import { BV } from "../../../fonts/nq57";
import { fadeUp, Backdrop, EmblemBox } from "../helpers";

export const TitleScene: React.FC<{ audio: string; caption: string; dur: number }> = ({
  audio,
  caption,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badge = fadeUp(frame, 0, fps);
  const big = fadeUp(frame, 8, fps);
  const sub = fadeUp(frame, 26, fps);
  const foot = fadeUp(frame, 44, fps);
  const ring = interpolate(frame, [0, 70], [0, 1], { extrapolateRight: "clamp" });
  const ul = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 8% 12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <RingDraw progress={ring} size={520} color={nq57.colors.gold} />
      <div style={{ ...badge, fontFamily: BV, fontWeight: 700, letterSpacing: 6, fontSize: 22, color: nq57.colors.gold }}>BỘ CHÍNH TRỊ · 22/12/2024</div>
      <EmblemBox size={430} />
      <div style={{ ...big, fontFamily: BV, fontWeight: 800, fontSize: 150, lineHeight: 1, marginTop: -10,
        background: `linear-gradient(90deg, ${nq57.colors.red}, ${nq57.colors.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        NGHỊ QUYẾT 57
      </div>
      <div style={{ ...sub, fontFamily: BV, fontWeight: 600, fontSize: 34, color: nq57.colors.ink, textAlign: "center", maxWidth: "72%", marginTop: 14 }}>
        Đột phá phát triển Khoa học – Công nghệ – Đổi mới sáng tạo & Chuyển đổi số quốc gia
      </div>
      <LineDraw progress={ul} width={460} stroke={nq57.colors.gold} />
      <div style={{ ...foot, fontFamily: BV, fontWeight: 500, fontSize: 24, color: nq57.colors.muted, marginTop: 14 }}>Kỷ nguyên vươn mình của Dân tộc</div>
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
