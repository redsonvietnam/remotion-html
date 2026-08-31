import React from 'react';
import { CoverScene } from './CoverScene';
import { PullquoteScene } from './PullquoteScene';
import { TakeawaysScene } from './TakeawaysScene';
import { OutroScene } from './OutroScene';
import {
  EDITORIAL_FEATURE_CONFIG,
  EditorialFeatureCoverData,
  EditorialFeaturePullquoteData,
  EditorialFeatureTakeaway,
  EditorialFeatureOutroData,
} from '../../../data/editorialFeature';

interface EditorialFeatureSceneProps {
  localFrame: number;
  sceneId: string;
  fadeFrames: number;
  coverData: EditorialFeatureCoverData;
  pullquoteData: EditorialFeaturePullquoteData;
  takeawaysTitle: string;
  takeaways: EditorialFeatureTakeaway[];
  outroData: EditorialFeatureOutroData;
}

export const EditorialFeatureScene: React.FC<EditorialFeatureSceneProps> = ({
  localFrame,
  sceneId,
  fadeFrames,
  coverData,
  pullquoteData,
  takeawaysTitle,
  takeaways,
  outroData,
}) => {
  const scene = EDITORIAL_FEATURE_CONFIG.scenes.find((s) => s.id === sceneId);
  if (!scene) return null;

  const sceneDurationFrames = scene.durationInFrames;

  switch (sceneId) {
    case 'cover':
      return (
        <CoverScene
          localFrame={localFrame}
          sceneDurationFrames={sceneDurationFrames}
          fadeFrames={fadeFrames}
          category={coverData.category}
          title={coverData.title}
          author={coverData.author}
          date={coverData.date}
          readTime={coverData.readTime}
        />
      );

    case 'pullquote':
      return (
        <PullquoteScene
          localFrame={localFrame}
          sceneDurationFrames={sceneDurationFrames}
          fadeFrames={fadeFrames}
          text={pullquoteData.text}
          attribution={pullquoteData.attribution}
        />
      );

    case 'takeaways':
      return (
        <TakeawaysScene
          localFrame={localFrame}
          sceneDurationFrames={sceneDurationFrames}
          fadeFrames={fadeFrames}
          title={takeawaysTitle}
          takeaways={takeaways}
        />
      );

    case 'outro':
      return (
        <OutroScene
          localFrame={localFrame}
          sceneDurationFrames={sceneDurationFrames}
          fadeFrames={fadeFrames}
          brand={outroData.brand}
          cta={outroData.cta}
          readTime={outroData.readTime}
        />
      );

    default:
      return null;
  }
};
