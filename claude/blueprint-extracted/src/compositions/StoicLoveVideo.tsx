// ---------------------------------------------------------------------------
// Stoic Love Composition — Vertical Short-Form Remotion Entry Point
//
// Registers the Stoic Love video using the StoicLoveTemplate with
// vertical 1080x1920 dimensions, stoicLove theme, and Vietnamese narration.
// ---------------------------------------------------------------------------

import React from "react";
import { Composition } from "remotion";
import { StoicLoveTemplate } from "../templates/stoicLove";
import { STOIC_LOVE_SCENES, STOIC_LOVE_CONTENT, sceneFrames } from "../data/stoicLove";
import { stoicLove } from "../theme/stoicLove";

const FPS = 30;

const STOIC_LOVE_FRAMES =
  STOIC_LOVE_SCENES.reduce((acc, s) => acc + sceneFrames(s.dur), 0) +
  (STOIC_LOVE_SCENES.length - 1) * 12;

export const StoicLoveVideo: React.FC = () => {
  return (
    <Composition
      id="StoicLove"
      component={StoicLoveTemplate}
      durationInFrames={STOIC_LOVE_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{
        scenes: STOIC_LOVE_SCENES,
        content: STOIC_LOVE_CONTENT,
        theme: stoicLove,
      }}
    />
  );
};