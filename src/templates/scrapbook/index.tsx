// ---------------------------------------------------------------------------
// Scrapbook Template Root — Template entry point
//
// Visual grammar: aged paper, handwritten annotations, Polaroid cards,
// VOX editorial overlays, chapter bar, page-turn transitions.
// Resolution: 1920x1080 / 1080x1920
//
// Accepts scenes/content/theme props for topic reuse.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { renderScene } from "./scenes";
import { sceneFrames } from "../../data/contract";
import type { SceneDef } from "../../data/contract";
import type { ScrapbookSceneContent } from "./types";
import { SCRAPBOOK_THEME } from "./theme";

const TRANSITION_FRAMES = 16;

type TemplateProps = {
  scenes: SceneDef[];
  content: Record<string, ScrapbookSceneContent>;
};

export const ScrapbookTemplate: React.FC<TemplateProps> = ({
  scenes,
  content,
}) => {
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
    <AbsoluteFill style={{ backgroundColor: SCRAPBOOK_THEME.colors.paper }}>
      <TransitionSeries>{items}</TransitionSeries>
    </AbsoluteFill>
  );
};
