// ---------------------------------------------------------------------------
// Reveal Scene — Full code visible, highlight line pulses
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { useTheme } from "../../../design/theme";
import { MatrixRain, TerminalCard, CodeBlock, Caption, ProgressDots } from "../helpers";
import type { TerminalRevealContent } from "../../../data/terminal";

type Props = { audio: string; caption: string; dur: number; sceneIndex: number; totalScenes: number } & TerminalRevealContent;

export const RevealScene: React.FC<Props> = ({
  audio, caption, dur, sceneIndex, totalScenes,
  language, lines, highlightLine, caption: tipCaption,
}) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const theme = useTheme();

  // Pulsing glow on the highlight line
  const pulse = interpolate(frame % 40, [0, 20, 40], [0.08, 0.18, 0.08], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <MatrixRain W={W} H={H} />
      <TerminalCard W={W} H={H} language={language}>
        <CodeBlock lines={lines} highlightLine={highlightLine} />
      </TerminalCard>
      <Caption text={tipCaption} W={W} H={H} />
      <ProgressDots total={totalScenes} current={sceneIndex} W={W} H={H} />
    </AbsoluteFill>
  );
};
