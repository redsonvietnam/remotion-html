import React from 'react';
import { EDITORIAL_FEATURE_THEME } from '../../theme/editorialFeature';
import { readingProgress } from './helpers';

interface ReadingProgressBarProps {
  currentFrame: number;
  totalFrames: number;
}

/**
 * Global reading progress bar overlay.
 * Runs at top of video, independent of scenes.
 * Width animates from 0% → 100% as currentFrame/totalFrames increases.
 */
export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  currentFrame,
  totalFrames,
}) => {
  const theme = EDITORIAL_FEATURE_THEME;
  const progressPercentage = readingProgress(currentFrame, totalFrames) * 100;

  return (
    <>
      {/* Background bar container */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'rgba(26, 26, 26, 0.08)',
          zIndex: 20,
        }}
      >
        {/* Animated fill */}
        <div
          style={{
            height: '100%',
            width: `${progressPercentage}%`,
            background: theme.color.accent,
          }}
        />
      </div>
    </>
  );
};
