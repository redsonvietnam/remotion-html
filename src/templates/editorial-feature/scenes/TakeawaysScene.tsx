import React from 'react';
import { EDITORIAL_FEATURE_THEME } from '../../../theme/editorialFeature';
import { interpolate, easeOutCubic, sceneOpacity } from '../helpers';
import { EditorialFeatureTakeaway } from '../../../data/editorialFeature';

interface TakeawaysSceneProps {
  localFrame: number;
  sceneDurationFrames: number;
  fadeFrames: number;
  title: string;
  takeaways: EditorialFeatureTakeaway[];
}

export const TakeawaysScene: React.FC<TakeawaysSceneProps> = ({
  localFrame,
  sceneDurationFrames,
  fadeFrames,
  title,
  takeaways,
}) => {
  const theme = EDITORIAL_FEATURE_THEME;
  const opacity = sceneOpacity(localFrame, sceneDurationFrames, fadeFrames);

  // Title: fade in, frames 0-14
  const titleOpacity = interpolate(localFrame, [0, 14], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '80px 32px 0',
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
          fontWeight: 700,
          fontSize: '21px',
          marginBottom: '28px',
          opacity: titleOpacity,
        }}
      >
        {title}
      </div>

      {/* Takeaways list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {takeaways.map((takeaway, index) => {
          // Each takeaway staggered 24 frames: start = 16 + index*24
          const startFrame = 16 + index * 24;
          const itemOpacity = interpolate(localFrame, [startFrame, startFrame + 18], [0, 1]);
          const itemTranslate = interpolate(
            localFrame,
            [startFrame, startFrame + 18],
            [14, 0],
            easeOutCubic
          );

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                opacity: itemOpacity,
                transform: `translateY(${itemTranslate}px)`,
              }}
            >
              {/* Number */}
              <div
                style={{
                  fontFamily: theme.typography.serif,
                  fontWeight: 900,
                  fontSize: '26px',
                  color: theme.color.hairline,
                  flex: 'none',
                  width: '40px',
                }}
              >
                {takeaway.num}
              </div>

              {/* Text */}
              <div
                style={{
                  fontSize: '14.5px',
                  lineHeight: 1.6,
                  color: theme.color.inkSoft,
                  paddingTop: '4px',
                }}
              >
                {takeaway.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
