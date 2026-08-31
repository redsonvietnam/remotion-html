import React from 'react';
import { REAL_ESTATE_LISTING_THEME } from '../../../theme/realEstateListing';
import { interpolate, easeOutCubic, sceneOpacity } from '../helpers';

interface HighlightsScenesProps {
  localFrame: number;
  sceneDurationFrames: number;
  fadeFrames: number;
  title: string;
  highlights: string[];
}

export const HighlightsScene: React.FC<HighlightsScenesProps> = ({
  localFrame,
  sceneDurationFrames,
  fadeFrames,
  title,
  highlights,
}) => {
  const theme = REAL_ESTATE_LISTING_THEME;
  const opacity = sceneOpacity(localFrame, sceneDurationFrames, fadeFrames);

  // Title: fade in frames 0-12
  const titleOpacity = interpolate(localFrame, [0, 12], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '80px 30px 0',
        opacity,
        backgroundColor: theme.color.bg,
        color: theme.color.ink,
        fontFamily: theme.typography.sans,
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <div
        style={{
          fontFamily: theme.typography.serif,
          fontWeight: 600,
          fontSize: '19px',
          marginBottom: '22px',
          opacity: titleOpacity,
        }}
      >
        {title}
      </div>

      {/* Highlights list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {highlights.map((highlight, index) => {
          // Each highlight staggered 18 frames: start = 14 + index*18
          const startFrame = 14 + index * 18;
          const itemOpacity = interpolate(localFrame, [startFrame, startFrame + 14], [0, 1]);
          const itemTranslate = interpolate(
            localFrame,
            [startFrame, startFrame + 14],
            [-14, 0],
            easeOutCubic
          );

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                opacity: itemOpacity,
                transform: `translateX(${itemTranslate}px)`,
              }}
            >
              {/* Checkmark circle */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: theme.color.accent,
                  color: theme.color.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  flex: 'none',
                }}
              >
                ✓
              </div>

              {/* Text */}
              <div
                style={{
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: theme.color.ink,
                }}
              >
                {highlight}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
