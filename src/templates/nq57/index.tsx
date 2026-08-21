// ---------------------------------------------------------------------------
// NQ57 Template Root — Template entry point
//
// Provides theme, scene registry, and TransitionSeries.
// This is the real entry point — Composition is just a thin wrapper.
//
// Accepts optional scenes/content props to enable topic reuse.
// When props are omitted, falls back to NQ57 default data.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { SCENES as NQ57_SCENES, NQ57_CONTENT, sceneFrames } from "../../data/nq57";
import { renderScene } from "./scenes";
import type { SceneDef, NQ57SceneContent } from "../../data/nq57";

const TRANSITION_FRAMES = 16;

type TemplateProps = {
  scenes?: SceneDef[];
  content?: Record<string, NQ57SceneContent>;
};

export const NQ57Template: React.FC<TemplateProps> = ({
  scenes = NQ57_SCENES,
  content = NQ57_CONTENT,
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
    <AbsoluteFill style={{ backgroundColor: "#0a0e1a" }}>
      <TransitionSeries>{items}</TransitionSeries>
    </AbsoluteFill>
  );
};
