// ---------------------------------------------------------------------------
// QuoteScene — NQ57 Quote Scene
//
// Uses: LineDraw (design/svg), KaraokeReveal (design/typography)
// Uses: fadeUp, Backdrop (template-specific helpers)
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
import { LineDraw } from "../../../design/svg";
import { KaraokeReveal } from "../../../design/typography";
import { nq57 } from "../../../theme/nq57";
import { BV } from "../../../fonts/nq57";
import { fadeUp, Backdrop } from "../helpers";

export const QuoteScene: React.FC<{ audio: string; caption: string; dur: number }> = ({
  audio,
  caption,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = fadeUp(frame, 0, fps);
  const ul = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 9% 12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ position: "absolute", top: "12%", left: "9%", fontFamily: BV, fontWeight: 800, fontSize: 200, color: "rgba(226,59,59,0.16)" }}>{"\u201C"}</div>
      <div style={{ ...q, fontFamily: BV, fontWeight: 700, fontSize: 60, lineHeight: 1.35, color: nq57.colors.ink, textAlign: "center", maxWidth: "80%" }}>
        Là <span style={{ color: nq57.colors.gold }}>đột phá quan trọng hàng đầu</span>, là{" "}
        <span style={{ color: nq57.colors.teal }}>động lực chính</span> để đưa đất nước bứt phá trong kỷ nguyên mới.
      </div>
      <LineDraw progress={ul} width={520} stroke={nq57.colors.teal} />
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
