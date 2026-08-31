// ---------------------------------------------------------------------------
// Scene Router — Routes content to appropriate scene component
// ---------------------------------------------------------------------------

import React from "react";
import type { ProductTeaserSceneContent } from "../../../data/productTeaser";
import { HookScene } from "./HookScene";
import { DashboardScene } from "./DashboardScene";
import { FeaturesScene } from "./FeaturesScene";
import { OutroScene } from "./OutroScene";
import type { ProductTeaserTheme } from "../../../theme/productTeaser";

interface Props {
  sceneId: string;
  content: ProductTeaserSceneContent;
  durationInFrames: number;
  theme: ProductTeaserTheme;
}

export function renderScene({ sceneId, content, durationInFrames, theme }: Props): React.ReactNode {
  switch (sceneId) {
    case "hook":
      if (content.kind !== "hook") throw new Error(`Expected hook, got ${content.kind}`);
      return <HookScene content={content} durationInFrames={durationInFrames} theme={theme} />;

    case "dashboard":
      if (content.kind !== "dashboard") throw new Error(`Expected dashboard, got ${content.kind}`);
      return <DashboardScene content={content} durationInFrames={durationInFrames} theme={theme} />;

    case "features":
      if (content.kind !== "features") throw new Error(`Expected features, got ${content.kind}`);
      return <FeaturesScene content={content} durationInFrames={durationInFrames} theme={theme} />;

    case "outro":
      if (content.kind !== "outro") throw new Error(`Expected outro, got ${content.kind}`);
      return <OutroScene content={content} durationInFrames={durationInFrames} theme={theme} />;

    default:
      throw new Error(`Unknown scene: ${sceneId}`);
  }
}
