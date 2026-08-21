// ---------------------------------------------------------------------------
// Stoic Love Template Root — Vertical Short-Form Entry Point
//
// Cinematic philosophy template for 1080x1920 vertical video.
// Provides theme, scene registry, and scene sequencing.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ThemeProvider } from "../../design/theme";
import { STOIC_LOVE_SCENES, STOIC_LOVE_CONTENT, sceneFrames } from "../../data/stoicLove";
import { renderScene } from "./scenes";
import { stoicLove } from "../../theme/stoicLove";
import type { SceneDef, StoicLoveSceneContent } from "../../data/stoicLove";
import type { Theme } from "../../design/theme";

const TRANSITION_FRAMES = 12;

type TemplateProps = {
  scenes?: SceneDef[];
  content?: Record<string, StoicLoveSceneContent>;
  theme?: Theme;
};

export const StoicLoveTemplate: React.FC<TemplateProps> = ({
  scenes = STOIC_LOVE_SCENES,
  content = STOIC_LOVE_CONTENT,
  theme = stoicLove,
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