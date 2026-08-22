// ---------------------------------------------------------------------------
// NodeFlow Template Root — Template entry point
//
// Visual grammar: network/system diagram, blueprint grid, node-edge language,
// amber data labels, electric cyan signal flow.
// Resolution: 1920x1080 (YouTube/Facebook horizontal)
//
// Accepts optional scenes/content/theme props for topic reuse.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ThemeProvider } from "../../design/theme";
import { BAO_HIEM_SCENES, BAO_HIEM_CONTENT, sceneFrames } from "../../data/baoHiem2024";
import { baoHiem2024 } from "../../theme/baoHiem2024";
import { renderScene } from "./scenes";
import type { SceneDef, NodeFlowSceneContent } from "../../data/baoHiem2024";
import type { Theme } from "../../design/theme";

// Custom slide transition duration for NodeFlow
// Slightly longer (20f) than NQ57's 16f to let grid breathe during change
const TRANSITION_FRAMES = 20;

type TemplateProps = {
  scenes?: SceneDef[];
  content?: Record<string, NodeFlowSceneContent>;
  theme?: Theme;
};

export const NodeFlowTemplate: React.FC<TemplateProps> = ({
  scenes = BAO_HIEM_SCENES,
  content = BAO_HIEM_CONTENT,
  theme = baoHiem2024,
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
