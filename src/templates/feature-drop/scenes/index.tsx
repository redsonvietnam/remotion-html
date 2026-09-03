// ---------------------------------------------------------------------------
// Feature Drop Scene Registry — maps scene kinds to components
// ---------------------------------------------------------------------------

import React from "react";
import { HookScene, FeaturesScene, OutroScene } from "./RemotionScenes";
import type { FeatureDropSceneContent } from "../../../data/featureDrop";

type BaseProps = { audio: string; caption: string; dur: number };

export function renderScene(
  sceneId: string,
  content: FeatureDropSceneContent | undefined,
  props: BaseProps,
): React.ReactNode {
  if (!content) return null;
  switch (content.kind) {
    case "hook":
      return <HookScene {...props} {...content} />;
    case "features":
      return <FeaturesScene {...props} {...content} />;
    case "outro":
      return <OutroScene {...props} {...content} />;
    default: {
      const _exhaustive: never = content;
      void _exhaustive;
      throw new Error(`Unknown scene kind for ${sceneId}`);
    }
  }
}
