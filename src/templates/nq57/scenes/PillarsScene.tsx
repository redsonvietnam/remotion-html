// ---------------------------------------------------------------------------
// PillarsScene — NQ57 Pillars Scene
//
// Uses: LineDraw (design/svg), KaraokeReveal (design/typography)
// Uses: fadeUp, Backdrop, Bars3DBox (template-specific helpers)
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
import { fadeUp, Backdrop, Bars3DBox } from "../helpers";

const PILLARS = ["Thể chế", "Nhân lực", "Hạ tầng", "Dữ liệu", "Công nghệ chiến lược"];
const PILLAR_COLORS = [nq57.colors.red, nq57.colors.gold, nq57.colors.teal, nq57.colors.gold, nq57.colors.red];

export const PillarsScene: React.FC<{ audio: string; caption: string; dur: number }> = ({
  audio,
  caption,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ul = interpolate(frame, [16, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 5% 12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ fontFamily: BV, fontWeight: 800, fontSize: 50, color: nq57.colors.ink, marginTop: 16 }}>Năm trụ cột cốt lõi</div>
      <div style={{ fontFamily: BV, fontWeight: 500, fontSize: 26, color: nq57.colors.gold, marginBottom: 6 }}>Thể chế là điều kiện tiên quyết — đi trước một bước</div>
      <LineDraw progress={ul} width={420} stroke={nq57.colors.gold} />
      <Bars3DBox count={PILLARS.length} width={Math.round(1920 * 0.7)} height={500} />
      <div style={{ display: "flex", gap: 18, marginTop: 6 }}>
        {PILLARS.map((p, i) => {
          const e = fadeUp(frame, 20 + i * 8, fps);
          return (
            <div key={i} style={{ ...e, width: 200, textAlign: "center", fontFamily: BV, fontWeight: 600, fontSize: 22, color: nq57.colors.ink }}>
              <span style={{ color: PILLAR_COLORS[i], fontWeight: 800, marginRight: 6 }}>{i + 1}.</span>
              {p}
            </div>
          );
        })}
      </div>
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
