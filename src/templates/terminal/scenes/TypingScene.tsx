// ---------------------------------------------------------------------------
// Typing Scene — Code appears character-by-character in the terminal
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { useTheme } from "../../../design/theme";
import { MatrixRain, TerminalCard, CodeBlock, Caption, ProgressDots } from "../helpers";
import type { TerminalTypingContent } from "../../../data/terminal";

type Props = { audio: string; caption: string; dur: number; sceneIndex: number; totalScenes: number } & TerminalTypingContent;

export const TypingScene: React.FC<Props> = ({
  audio, caption, dur, sceneIndex, totalScenes,
  language, lines, caption: tipCaption,
}) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const theme = useTheme();

  const totalChars = lines.reduce((sum, l) => sum + l.text.length + 1, 0);
  const typingFrames = Math.round(dur * fps * 0.85);
  const charsVisible = Math.floor(
    interpolate(frame, [8, 8 + typingFrames], [0, totalChars], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill>
      <MatrixRain W={W} H={H} />
      <TerminalCard W={W} H={H} language={language}>
        <CodeBlock lines={lines} visibleChars={charsVisible} />
      </TerminalCard>
      <Caption text={tipCaption} W={W} H={H} />
      <ProgressDots total={totalScenes} current={sceneIndex} W={W} H={H} />
    </AbsoluteFill>
  );
};
