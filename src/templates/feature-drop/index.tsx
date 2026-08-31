// ---------------------------------------------------------------------------
// Feature Drop Template Root — Template entry point
//
// 9:16 vertical video: hook → features → outro with TransitionSeries.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ThemeProvider } from "../../design/theme";
import { renderScene } from "./scenes";
import { sceneFrames } from "../../data/contract";
import type { SceneDef } from "../../data/contract";
import type { FeatureDropSceneContent } from "../../data/featureDrop";
import type { Theme } from "../../design/theme";

const TRANSITION_FRAMES = 12;

type TemplateProps = {
  scenes: SceneDef[];
  content: Record<string, FeatureDropSceneContent>;
  theme: Theme;
  sceneIndex?: number;
  totalScenes?: number;
};

export const FeatureDropTemplate: React.FC<TemplateProps> = ({
  scenes,
  content,
  theme,
}) => {
  const items: React.ReactNode[] = [];

  scenes.forEach((s, i) => {
    const c = content[s.id];
    items.push(
      <TransitionSeries.Sequence key={s.id} durationInFrames={sceneFrames(s.dur)}>
        {renderScene(s.id, c, {
          audio: s.audio ?? "",
          caption: s.caption ?? "",
          dur: s.dur,
        })}
      </TransitionSeries.Sequence>,
    );
    if (i < scenes.length - 1) {
      items.push(
        <TransitionSeries.Transition
          key={`t-${s.id}`}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />,
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
