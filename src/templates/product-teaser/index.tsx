// ---------------------------------------------------------------------------
// Product Teaser Template Root
//
// Dashboard reveal template for 1080x1920 vertical video (9:16).
// Composition entry point with scene sequencing.
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { PRODUCT_TEASER_SCENES, PRODUCT_TEASER_CONTENT, sceneFrames, FPS } from "../../data/productTeaser";
import { renderScene } from "./scenes";
import { productTeaser } from "../../theme/productTeaser";
import type { SceneDef, ProductTeaserSceneContent } from "../../data/productTeaser";
import type { ProductTeaserTheme } from "../../theme/productTeaser";

interface TemplateProps {
  scenes?: SceneDef[];
  content?: Record<string, ProductTeaserSceneContent>;
  theme?: ProductTeaserTheme;
}

export const ProductTeaserTemplate: React.FC<TemplateProps> = ({
  scenes = PRODUCT_TEASER_SCENES,
  content = PRODUCT_TEASER_CONTENT,
  theme = productTeaser,
} = {}) => {
  // Calculate scene start frames
  const sceneStartFrames: Record<string, number> = {};
  let currentFrame = 0;
  scenes.forEach((scene) => {
    sceneStartFrames[scene.id] = currentFrame;
    currentFrame += sceneFrames(scene.dur);
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      {scenes.map((scene) => {
        const sceneContent = content[scene.id];
        if (!sceneContent) {
          console.warn(`No content for scene: ${scene.id}`);
          return null;
        }

        return (
          <Sequence
            key={scene.id}
            from={sceneStartFrames[scene.id]}
            durationInFrames={sceneFrames(scene.dur)}
          >
            {renderScene({
              sceneId: scene.id,
              content: sceneContent,
              durationInFrames: sceneFrames(scene.dur),
              theme,
            })}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
