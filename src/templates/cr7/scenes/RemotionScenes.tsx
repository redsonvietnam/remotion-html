// ---------------------------------------------------------------------------
// CR7 Remotion Wrappers — Bridge Remotion hooks to data components
//
// Each wrapper calls useCurrentFrame()/useVideoConfig() and passes the
// values as props to the corresponding data component. This is the ONLY
// file that should import useCurrentFrame/useVideoConfig for CR7 scenes.
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { HeroSceneData } from "./HeroScene";
import { StatSceneData } from "./StatScene";
import { MilestoneSceneData } from "./MilestoneScene";
import { ClosingSceneData } from "./ClosingScene";
import type { CR7SceneContent } from "../types";

type BaseProps = { audio: string; caption: string; dur: number };

/** Wrap a data component with Remotion frame/fps injection. */
function withRemotion<P extends { frame: number; fps: number }>(
  DataComponent: React.FC<P>
): React.FC<Omit<P, "frame" | "fps">> {
  return (props) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    return <DataComponent {...(props as P)} frame={frame} fps={fps} />;
  };
}

export const HeroScene = withRemotion(HeroSceneData);
export const StatScene = withRemotion(StatSceneData);
export const MilestoneScene = withRemotion(MilestoneSceneData);
export const ClosingScene = withRemotion(ClosingSceneData);

/** Render a CR7 scene by kind — Remotion version. */
export function renderRemotionScene(
  sceneId: string,
  content: CR7SceneContent | undefined,
  props: BaseProps
): React.ReactNode {
  if (!content) return null;
  switch (content.kind) {
    case "hero":
      return <HeroScene {...props} {...content} />;
    case "stat":
      return <StatScene {...props} {...content} />;
    case "milestone":
      return <MilestoneScene {...props} {...content} />;
    case "closing":
      return <ClosingScene {...props} {...content} />;
    default: {
      const _exhaustive: never = content;
      void _exhaustive;
      throw new Error(`Unknown scene kind for ${sceneId}`);
    }
  }
}
