// ---------------------------------------------------------------------------
// Scrapbook Remotion Wrappers — Bridge Remotion hooks to data components
//
// Each wrapper calls useCurrentFrame()/useVideoConfig() and passes the
// values as props to the corresponding data component. This is the ONLY
// file that should import useCurrentFrame/useVideoConfig for Scrapbook scenes.
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { HeroSceneData } from "./HeroScene";
import { MatchSceneData } from "./MatchScene";
import { HistorySceneData } from "./HistoryScene";
import { PhotoSceneData } from "./PhotoScene";
import { TimelineSceneData } from "./TimelineScene";
import { ClosingSceneData } from "./ClosingScene";
import type { ScrapbookSceneContent } from "../types";

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
export const MatchScene = withRemotion(MatchSceneData);
export const HistoryScene = withRemotion(HistorySceneData);
export const PhotoScene = withRemotion(PhotoSceneData);
export const TimelineScene = withRemotion(TimelineSceneData);
export const ClosingScene = withRemotion(ClosingSceneData);

/** Render a Scrapbook scene by kind — Remotion version. */
export function renderRemotionScene(
  sceneId: string,
  content: ScrapbookSceneContent | undefined,
  props: BaseProps
): React.ReactNode {
  if (!content) return null;
  switch (content.kind) {
    case "hero":
      return <HeroScene {...props} {...content} />;
    case "match":
      return <MatchScene {...props} {...content} />;
    case "history":
      return <HistoryScene {...props} {...content} />;
    case "photo":
      return <PhotoScene {...props} {...content} />;
    case "timeline":
      return <TimelineScene {...props} {...content} />;
    case "closing":
      return <ClosingScene {...props} {...content} />;
    default: {
      const _exhaustive: never = content;
      void _exhaustive;
      throw new Error(`Unknown scene kind for ${sceneId}`);
    }
  }
}
