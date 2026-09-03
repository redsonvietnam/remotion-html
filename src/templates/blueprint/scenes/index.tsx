// ---------------------------------------------------------------------------
// Blueprint Scene Registry — Maps scene content `kind` to components
//
// Kind-discriminated switch, exhaustive over BlueprintSceneContent.
// ---------------------------------------------------------------------------

import React from "react";
import { TitleScene } from "./TitleScene";
import { PillarsScene } from "./PillarsScene";
import { MeasureScene } from "./MeasureScene";
import { DetailScene } from "./DetailScene";
import { ProcessScene } from "./ProcessScene";
import { SealScene } from "./SealScene";
import type { BlueprintSceneContent } from "../../../data/luatBHXH";

type BaseProps = { audio: string; caption: string; dur: number };

/**
 * Render a scene component with its correct Blueprint content props.
 * The `kind` discriminator in BlueprintSceneContent enables type-safe
 * narrowing.
 */
export function renderScene(
  sceneId: string,
  content: BlueprintSceneContent,
  props: BaseProps
): React.ReactNode {
  switch (content.kind) {
    case "title":
      return <TitleScene {...props} {...content} />;
    case "pillars":
      return <PillarsScene {...props} {...content} />;
    case "measure":
      return <MeasureScene {...props} {...content} />;
    case "detail":
      return <DetailScene {...props} {...content} />;
    case "process":
      return <ProcessScene {...props} {...content} />;
    case "seal":
      return <SealScene {...props} {...content} />;
    default: {
      const _exhaustive: never = content;
      void _exhaustive;
      throw new Error(`Unknown scene kind for ${sceneId}`);
    }
  }
}
