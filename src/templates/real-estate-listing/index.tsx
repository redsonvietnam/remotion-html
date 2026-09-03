import React from 'react';
import { Composition, Sequence, useCurrentFrame, AbsoluteFill } from 'remotion';
import { RealEstateListingScene } from './scenes';
import {
  REAL_ESTATE_LISTING_CONFIG,
  REAL_ESTATE_LISTING_TOTAL_FRAMES,
  REAL_ESTATE_LISTING_CONTENT,
  RealEstateListingCoverData,
  RealEstateListingSpec,
  RealEstateListingAgentData,
} from '../../data/realEstateListing';
import { REAL_ESTATE_LISTING_THEME } from '../../theme/realEstateListing';

interface RealEstateListingTemplateProps {
  cover?: RealEstateListingCoverData;
  specs?: RealEstateListingSpec[];
  highlightsTitle?: string;
  highlights?: string[];
  agent?: RealEstateListingAgentData;
}

/**
 * Real Estate Listing Template Root Component
 * Renders multi-scene property reveal video.
 */
export const RealEstateListingTemplate: React.FC<RealEstateListingTemplateProps> = ({
  cover = REAL_ESTATE_LISTING_CONTENT.cover,
  specs = REAL_ESTATE_LISTING_CONTENT.specs,
  highlightsTitle = REAL_ESTATE_LISTING_CONTENT.highlightsTitle,
  highlights = REAL_ESTATE_LISTING_CONTENT.highlights,
  agent = REAL_ESTATE_LISTING_CONTENT.agent,
}) => {
  const frame = useCurrentFrame();
  const theme = REAL_ESTATE_LISTING_THEME;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.color.bg,
        color: theme.color.ink,
        fontFamily: theme.typography.sans,
      }}
    >
      {/* Scene sequences */}
      {REAL_ESTATE_LISTING_CONFIG.scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame || 0}
          durationInFrames={scene.durationInFrames}
        >
          <RealEstateListingScene
            localFrame={frame - (scene.startFrame || 0)}
            sceneId={scene.id}
            fadeFrames={REAL_ESTATE_LISTING_CONFIG.sceneFadeFrames}
            coverData={cover}
            specs={specs}
            highlightsTitle={highlightsTitle}
            highlights={highlights}
            agentData={agent}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export default RealEstateListingTemplate;
