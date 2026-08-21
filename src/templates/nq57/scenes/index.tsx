// ---------------------------------------------------------------------------
// NQ57 Scene Registry — Maps scene IDs to components
//
// Uses a kind-discriminated switch to call each scene component with
// its correct NQ57 content props. No `any`, no generic framework.
// ---------------------------------------------------------------------------

import React from "react";
import { TitleScene } from "./TitleScene";
import { QuoteScene } from "./QuoteScene";
import { RolesScene } from "./RolesScene";
import { PillarsScene } from "./PillarsScene";
import { StatsScene } from "./StatsScene";
import { VisionScene } from "./VisionScene";
import { EndScene } from "./EndScene";
import type { NQ57SceneContent } from "../../../data/nq57";

type BaseProps = { audio: string; caption: string; dur: number };

/**
 * Render a scene component with its correct NQ57 content props.
 * The `kind` discriminator in NQ57SceneContent enables type-safe narrowing.
 */
export function renderScene(
  sceneId: string,
  content: NQ57SceneContent,
  props: BaseProps,
): React.ReactNode {
  switch (content.kind) {
    case "title":
      return <TitleScene {...props} {...content} />;
    case "quote":
      return <QuoteScene {...props} {...content} />;
    case "roles":
      return <RolesScene {...props} {...content} />;
    case "pillars":
      return <PillarsScene {...props} {...content} />;
    case "stats":
      return <StatsScene {...props} {...content} />;
    case "vision":
      return <VisionScene {...props} {...content} />;
    case "end":
      return <EndScene {...props} {...content} />;
    default: {
      const _exhaustive: never = content;
      void _exhaustive;
      throw new Error(`Unknown scene kind for ${sceneId}`);
    }
  }
}
