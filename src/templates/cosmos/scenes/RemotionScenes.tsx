// ---------------------------------------------------------------------------
// Cosmos Remotion Wrappers — Bridge Remotion hooks to data components
//
// Each wrapper calls useCurrentFrame()/useVideoConfig() and passes the
// values as props to the corresponding data component. This is the ONLY
// file that should import useCurrentFrame/useVideoConfig for Cosmos scenes.
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { TitleSceneData } from "./TitleScene";
import { FactSceneData } from "./FactScene";
import { CompareSceneData } from "./CompareScene";
import { TimelineSceneData } from "./TimelineScene";
import { DiagramSceneData } from "./DiagramScene";
import { ClosingSceneData } from "./ClosingScene";
import type { CosmosSceneContent } from "../types";

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

export const TitleScene = withRemotion(TitleSceneData);
export const FactScene = withRemotion(FactSceneData);
export const CompareScene = withRemotion(CompareSceneData);
export const TimelineScene = withRemotion(TimelineSceneData);
export const DiagramScene = withRemotion(DiagramSceneData);
export const ClosingScene = withRemotion(ClosingSceneData);

/** Render a Cosmos scene by kind — Remotion version. */
export function renderRemotionScene(
  sceneId: string,
  content: CosmosSceneContent | undefined,
  props: BaseProps
): React.ReactNode {
  if (!content) return null;
  switch (content.kind) {
    case "title":
      return <TitleScene {...props} {...content} />;
    case "fact":
      return <FactScene {...props} {...content} />;
    case "compare":
      return <CompareScene {...props} {...content} />;
    case "timeline":
      return <TimelineScene {...props} {...content} />;
    case "diagram":
      return <DiagramScene {...props} {...content} />;
    case "closing":
      return <ClosingScene {...props} {...content} />;
    default: {
      const _exhaustive: never = content;
      void _exhaustive;
      throw new Error(`Unknown scene kind for ${sceneId}`);
    }
  }
}
