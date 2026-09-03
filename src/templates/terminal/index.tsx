// ---------------------------------------------------------------------------
// Terminal Template Root — Template entry point
//
// 9:16 vertical video with Matrix rain background.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ThemeProvider } from "../../design/theme";
import { renderScene } from "./scenes";
import { sceneFrames } from "../../data/contract";
import type { SceneDef } from "../../data/contract";
import type { TerminalSceneContent } from "./types";
import type { Theme } from "../../design/theme";

const TRANSITION_FRAMES = 12;

type TemplateProps = {
  scenes: SceneDef[];
  content: Record<string, TerminalSceneContent>;
  theme: Theme;
  sceneIndex?: number;
  totalScenes?: number;
};

export const TerminalTemplate: React.FC<TemplateProps> = ({
  scenes,
  content,
  theme,
  sceneIndex = 0,
  totalScenes,
}) => {
  const items: React.ReactNode[] = [];
  const total = totalScenes ?? scenes.length;

  scenes.forEach((s, i) => {
    const c = content[s.id];
    items.push(
      <TransitionSeries.Sequence key={s.id} durationInFrames={sceneFrames(s.dur)}>
        {renderScene(s.id, c, {
          audio: s.audio ?? "",
          caption: s.caption ?? "",
          dur: s.dur,
          sceneIndex: i,
          totalScenes: total,
        })}
      </TransitionSeries.Sequence>
    );
    if (i < scenes.length - 1) {
      items.push(
        <TransitionSeries.Transition
          key={`t-${s.id}`}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
      );
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
        <TransitionSeries>{items}</TransitionSeries>
      </AbsoluteFill>
    </ThemeProvider>
  );
};
