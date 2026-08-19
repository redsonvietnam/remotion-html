import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene1Orb } from "./scenes/Scene1Orb";
import { Scene2Chart } from "./scenes/Scene2Chart";

const FPS = 30;

export const HabitLoopVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={FPS * 5.5}>
          <Scene1Orb />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FPS * 0.6 })}
        />

        <TransitionSeries.Sequence durationInFrames={FPS * 6.4}>
          <Scene2Chart />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/*
        TTS + nhac nen: bo comment 2 dong duoi khi da co file audio trong public/.
        <Audio src={staticFile("voiceover.mp3")} />
        <Audio src={staticFile("bg-music.mp3")} volume={0.15} />
      */}
    </AbsoluteFill>
  );
};
