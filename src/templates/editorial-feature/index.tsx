import React from 'react';
import { Composition, Sequence, useCurrentFrame, AbsoluteFill } from 'remotion';
import { EditorialFeatureScene } from './scenes';
import { ReadingProgressBar } from './ReadingProgressBar';
import {
  EDITORIAL_FEATURE_CONFIG,
  EDITORIAL_FEATURE_TOTAL_FRAMES,
  EDITORIAL_FEATURE_CONTENT,
  EditorialFeatureCoverData,
  EditorialFeaturePullquoteData,
  EditorialFeatureTakeaway,
  EditorialFeatureOutroData,
} from '../../data/editorialFeature';
import { EDITORIAL_FEATURE_THEME } from '../../theme/editorialFeature';

interface EditorialFeatureTemplateProps {
  cover?: EditorialFeatureCoverData;
  pullquote?: EditorialFeaturePullquoteData;
  takeawaysTitle?: string;
  takeaways?: EditorialFeatureTakeaway[];
  outro?: EditorialFeatureOutroData;
}

/**
 * Editorial Feature Template Root Component
 * Renders multi-scene editorial video with global reading progress bar.
 */
export const EditorialFeatureTemplate: React.FC<EditorialFeatureTemplateProps> = ({
  cover = EDITORIAL_FEATURE_CONTENT.cover,
  pullquote = EDITORIAL_FEATURE_CONTENT.pullquote,
  takeawaysTitle = EDITORIAL_FEATURE_CONTENT.takeawaysTitle,
  takeaways = EDITORIAL_FEATURE_CONTENT.takeaways,
  outro = EDITORIAL_FEATURE_CONTENT.outro,
}) => {
  const frame = useCurrentFrame();
  const theme = EDITORIAL_FEATURE_THEME;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.color.bg,
        color: theme.color.ink,
        fontFamily: theme.typography.sans,
      }}
    >
      {/* Reading progress bar (global, on top of scenes) */}
      <ReadingProgressBar currentFrame={frame} totalFrames={EDITORIAL_FEATURE_TOTAL_FRAMES} />

      {/* Scene sequences */}
      {EDITORIAL_FEATURE_CONFIG.scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame || 0}
          durationInFrames={scene.durationInFrames}
        >
          <EditorialFeatureScene
            localFrame={frame - (scene.startFrame || 0)}
            sceneId={scene.id}
            fadeFrames={EDITORIAL_FEATURE_CONFIG.sceneFadeFrames}
            coverData={cover}
            pullquoteData={pullquote}
            takeawaysTitle={takeawaysTitle}
            takeaways={takeaways}
            outroData={outro}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export default EditorialFeatureTemplate;
