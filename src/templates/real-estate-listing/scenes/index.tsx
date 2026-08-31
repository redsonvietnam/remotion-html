import React from 'react';
import { CoverScene } from './CoverScene';
import { SpecsScene } from './SpecsScene';
import { HighlightsScene } from './HighlightsScene';
import { OutroScene } from './OutroScene';
import {
  REAL_ESTATE_LISTING_CONFIG,
  RealEstateListingCoverData,
  RealEstateListingSpec,
  RealEstateListingAgentData,
} from '../../../data/realEstateListing';

interface RealEstateListingSceneProps {
  localFrame: number;
  sceneId: string;
  fadeFrames: number;
  coverData: RealEstateListingCoverData;
  specs: RealEstateListingSpec[];
  highlightsTitle: string;
  highlights: string[];
  agentData: RealEstateListingAgentData;
}

export const RealEstateListingScene: React.FC<RealEstateListingSceneProps> = ({
  localFrame,
  sceneId,
  fadeFrames,
  coverData,
  specs,
  highlightsTitle,
  highlights,
  agentData,
}) => {
  const scene = REAL_ESTATE_LISTING_CONFIG.scenes.find((s) => s.id === sceneId);
  if (!scene) return null;

  const sceneDurationFrames = scene.durationInFrames;

  switch (sceneId) {
    case 'cover':
      return (
        <CoverScene
          localFrame={localFrame}
          sceneDurationFrames={sceneDurationFrames}
          fadeFrames={fadeFrames}
          tag={coverData.tag}
          type={coverData.type}
          price={coverData.price}
          address={coverData.address}
        />
      );

    case 'specs':
      return (
        <SpecsScene
          localFrame={localFrame}
          sceneDurationFrames={sceneDurationFrames}
          fadeFrames={fadeFrames}
          specs={specs}
        />
      );

    case 'highlights':
      return (
        <HighlightsScene
          localFrame={localFrame}
          sceneDurationFrames={sceneDurationFrames}
          fadeFrames={fadeFrames}
          title={highlightsTitle}
          highlights={highlights}
        />
      );

    case 'outro':
      return (
        <OutroScene
          localFrame={localFrame}
          sceneDurationFrames={sceneDurationFrames}
          fadeFrames={fadeFrames}
          agentName={agentData.name}
          agentRole={agentData.role}
          agentPhone={agentData.phone}
          agentCta={agentData.cta}
        />
      );

    default:
      return null;
  }
};
