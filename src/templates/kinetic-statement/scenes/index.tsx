// ---------------------------------------------------------------------------
// Kinetic Statement Scene Registry — maps scene kinds to components
// ---------------------------------------------------------------------------

import React from "react";
import { HookScene, StatScene, QuoteScene, OutroScene } from "./RemotionScenes";
import type { KineticSceneContent } from "../../../data/kineticStatement";

type BaseProps = { audio: string; caption: string; dur: number };

export function renderScene(
  sceneId: string,
  content: KineticSceneContent | undefined,
  props: BaseProps,
): React.ReactNode {
  if (!content) return null;
  switch (content.kind) {
    case "hook":
      return <HookScene {...props} {...content} />;
    case "stat":
      return <StatScene {...props} {...content} />;
    case "quote":
      return <QuoteScene {...props} {...content} />;
    case "outro":
      return <OutroScene {...props} {...content} />;
    default: {
      const _exhaustive: never = content;
      void _exhaustive;
      throw new Error(`Unknown scene kind for ${sceneId}`);
    }
  }
}
