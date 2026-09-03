// ---------------------------------------------------------------------------
// Luật BHXH Composition — Thin Remotion entry point
//
// Registers the Luật Bảo hiểm xã hội 2024 video using the Blueprint
// template with luatBHXH data and the blueprint theme.
// ---------------------------------------------------------------------------

import React from "react";
import { Composition } from "remotion";
import { BlueprintTemplate } from "../templates/blueprint";
import { LUAT_BHXH_SCENES, LUAT_BHXH_CONTENT, sceneFrames } from "../data/luatBHXH";
import { blueprint } from "../theme/blueprint";

const FPS = 30;

const LUAT_BHXH_FRAMES =
  LUAT_BHXH_SCENES.reduce((acc, s) => acc + sceneFrames(s.dur), 0) +
  (LUAT_BHXH_SCENES.length - 1) * 14;

export const LuatBHXHVideo: React.FC = () => {
  return (
    <Composition
      id="LuatBHXH"
      component={BlueprintTemplate}
      durationInFrames={LUAT_BHXH_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{
        scenes: LUAT_BHXH_SCENES,
        content: LUAT_BHXH_CONTENT,
        theme: blueprint,
      }}
    />
  );
};
