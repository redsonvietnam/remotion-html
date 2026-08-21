// ---------------------------------------------------------------------------
// RolesScene — De An 06 Roles Scene
//
// Uses: FlowLine (design/svg), KaraokeReveal (design/typography), CardBlock (components)
// Uses: slideUp, fadeIn, Backdrop (template-specific helpers)
// Theme: consumed via useTheme() — not imported directly
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
import { useTheme } from "../../../design/theme";
import { slideUp, fadeIn, Backdrop } from "../helpers";
import type { NQ57RolesContent } from "../../../data/nq57";

type Props = { audio: string; caption: string; dur: number } & NQ57RolesContent;

export const RolesScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  sectionTitle,
  roles,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const ROLE_ACCENTS = [theme.colors.accent1, theme.colors.accent2, theme.colors.accent3];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = slideUp(frame, 0, fps, 30);
  const cardAnims = roles.map((_, i) => slideUp(frame, 15 + i * 12, fps, 40));
  const lineAnim = fadeIn(frame, 50, fps, 30);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 5% 10%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ ...titleAnim, fontFamily: BV, fontWeight: 700, letterSpacing: 6, fontSize: 24, color: theme.colors.accent2, textTransform: "uppercase", marginBottom: 40 }}>{sectionTitle}</div>
      <div style={{ display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>
        {roles.map((r, i) => {
          const e = cardAnims[i];
          return (
            <div key={i} style={e}>
              <CardBlock
                number={i + 1}
                accent={ROLE_ACCENTS[i % ROLE_ACCENTS.length]}
                title={r.title}
                subtitle={r.subtitle}
                background={theme.colors.card}
                borderColor={theme.colors.line}
                text={theme.colors.ink}
                muted={theme.colors.muted}
                fontFamily={BV}
                width={460}
                titleSize={36}
                subtitleSize={20}
                badgeSize={96}
                badgeFontSize={44}
                boxShadow={`0 40px 80px -30px ${theme.colors.accent1}30, 0 20px 40px -20px rgba(0,0,0,0.4)`}
              />
            </div>
          );
        })}
      </div>
      <div style={{ width: 1150, marginTop: 30, opacity: lineAnim.opacity }}>
        <FlowLine width={1150} progress={(frame * 3) / 1150} dotColor={theme.colors.accent1} lineColor={theme.colors.line} dotRadius={4} dotCount={6} />
      </div>
      <KaraokeReveal
        text={caption}
        dur={dur}
        fontFamily={BV}
        activeColor={theme.colors.accent1}
        revealedColor={theme.colors.ink}
        borderColor={theme.colors.line}
        fontSize={20}
      />
    </AbsoluteFill>
  );
};