import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { SCENES, sceneFrames } from "../data/nq57";
import {
  TitleSceneV2,
  QuoteSceneV2,
  RolesSceneV2,
  PillarsSceneV2,
  StatsSceneV2,
  VisionSceneV2,
  EndSceneV2,
} from "../scenes/NQ57ScenesV2";

const SceneById: Record<string, React.FC<{ audio: string; caption: string; dur: number }>> = {
  s1: TitleSceneV2,
  s2: QuoteSceneV2,
  s3: RolesSceneV2,
  s4: PillarsSceneV2,
  s5: StatsSceneV2,
  s6: VisionSceneV2,
  s7: EndSceneV2,
};

export const NghiQuyet57VideoV2: React.FC = () => {
  const items: React.ReactNode[] = [];
  SCENES.forEach((s, i) => {
    const Comp = SceneById[s.id];
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
          timing={linearTiming({ durationInFrames: 16 })}
        />
      );
    }
  });

  const totalFrames =
    SCENES.reduce((acc, s) => acc + sceneFrames(s.dur), 0) + (SCENES.length - 1) * 16;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0e1a" }}>
      <TransitionSeries>{items}</TransitionSeries>
    </AbsoluteFill>
  );
};
