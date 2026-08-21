// ---------------------------------------------------------------------------
// RolesScene — NQ57 Roles Scene
//
// Uses: FlowLine (design/svg), KaraokeReveal (design/typography), CardBlock (components)
// Uses: fadeUp, Backdrop (template-specific helpers)
// ---------------------------------------------------------------------------

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Audio,
} from "remotion";
import { FlowLine } from "../../../design/svg";
import { KaraokeReveal } from "../../../design/typography";
import { CardBlock } from "../../../components";
import { nq57 } from "../../../theme/nq57";
import { BV } from "../../../fonts/nq57";
import { fadeUp, Backdrop } from "../helpers";
import type { NQ57RolesContent } from "../../../data/nq57";

const ROLE_ACCENTS = [nq57.colors.accent2, nq57.colors.accent3, nq57.colors.accent1];

type Props = { audio: string; caption: string; dur: number } & NQ57RolesContent;

export const RolesScene: React.FC<Props> = ({
  audio, caption, dur,
  sectionTitle, roles,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 7% 12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ fontFamily: BV, fontWeight: 700, letterSpacing: 4, fontSize: 26, color: nq57.colors.muted, marginBottom: 30 }}>{sectionTitle}</div>
      <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {roles.map((r, i) => {
          const e = fadeUp(frame, 10 + i * 14, fps);
          return (
            <div key={i} style={e}>
              <CardBlock
                number={i + 1}
                accent={ROLE_ACCENTS[i % ROLE_ACCENTS.length]}
                title={r.title}
                subtitle={r.subtitle}
                background={nq57.colors.card}
                borderColor={nq57.colors.line}
                text={nq57.colors.ink}
                muted={nq57.colors.muted}
                fontFamily={BV}
                width={420}
              />
            </div>
          );
        })}
      </div>
      <div style={{ width: 1100, marginTop: 24 }}>
        <FlowLine width={1100} progress={(frame * 4) / 1100} dotColor={nq57.colors.accent2} lineColor={nq57.colors.line} />
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
