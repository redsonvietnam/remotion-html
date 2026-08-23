import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { SCENES, sceneFrames } from "./nq57-data";
import {
  TitleScene,
  QuoteScene,
  RolesScene,
  PillarsScene,
  StatsScene,
  VisionScene,
  EndScene,
} from "./scenes/NQ57Scenes";

const SceneById: Record<string, React.FC<{ audio: string; caption: string }>> = {
  s1: TitleScene,
  s2: QuoteScene,
  s3: RolesScene,
  s4: PillarsScene,
  s5: StatsScene,
  s6: VisionScene,
  s7: EndScene,
};

export const NghiQuyet57Video: React.FC = () => {
  const items: React.ReactNode[] = [];
  SCENES.forEach((s, i) => {
    const Comp = SceneById[s.id];
    items.push(
      <TransitionSeries.Sequence key={s.id} durationInFrames={sceneFrames(s.dur)}>
        <Comp audio={s.audio} caption={s.caption} />
      </TransitionSeries.Sequence>
    );
    if (i < SCENES.length - 1) {
      items.push(
        <TransitionSeries.Transition
          key={`t-${s.id}`}
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />
      );
    }
  });

  const totalFrames = SCENES.reduce((acc, s) => acc + sceneFrames(s.dur), 0) + (SCENES.length - 1) * 12;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0e1a" }}>
      <TransitionSeries durationInFrames={totalFrames}>{items}</TransitionSeries>
    </AbsoluteFill>
  );
};
