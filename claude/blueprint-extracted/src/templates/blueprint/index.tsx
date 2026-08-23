// ---------------------------------------------------------------------------
// Blueprint Template Root — Landscape (1920x1080) Entry Point
//
// Technical-drafting explainer template for law/policy topics. Provides
// theme, scene registry, and scene sequencing. See docs/ (or the handoff
// note) for the visual thesis and grammar.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ThemeProvider } from "../../design/theme";
import { LUAT_BHXH_SCENES, LUAT_BHXH_CONTENT, sceneFrames } from "../../data/luatBHXH";
import { renderScene } from "./scenes";
import { blueprint } from "../../theme/blueprint";
import type { SceneDef, BlueprintSceneContent } from "../../data/luatBHXH";
import type { Theme } from "../../design/theme";

const TRANSITION_FRAMES = 14;

type TemplateProps = {
  scenes?: SceneDef[];
  content?: Record<string, BlueprintSceneContent>;
  theme?: Theme;
};

export const BlueprintTemplate: React.FC<TemplateProps> = ({
  scenes = LUAT_BHXH_SCENES,
  content = LUAT_BHXH_CONTENT,
  theme = blueprint,
} = {}) => {
  const items: React.ReactNode[] = [];
  scenes.forEach((s, i) => {
    const c = content[s.id];
    items.push(
      <TransitionSeries.Sequence key={s.id} durationInFrames={sceneFrames(s.dur)}>
        {renderScene(s.id, c, { audio: s.audio, caption: s.caption, dur: s.dur })}
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
