// ---------------------------------------------------------------------------
// NQ57 Template Root — Template entry point
//
// Provides theme, scene registry, and TransitionSeries.
// This is the real entry point — Composition is just a thin wrapper.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { SCENES, sceneFrames } from "../../data/nq57";
import { SCENE_REGISTRY } from "./scenes";

const TRANSITION_FRAMES = 16;

export const NQ57Template: React.FC = () => {
  const items: React.ReactNode[] = [];
  SCENES.forEach((s, i) => {
    const Comp = SCENE_REGISTRY[s.id];
    items.push(
      <TransitionSeries.Sequence key={s.id} durationInFrames={sceneFrames(s.dur)}>
        <Comp audio={s.audio} caption={s.caption} dur={s.dur} />
      </TransitionSeries.Sequence>
    );
    if (i < SCENES.length - 1) {
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
