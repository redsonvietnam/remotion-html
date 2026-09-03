import React from 'react';
import { REAL_ESTATE_LISTING_THEME } from '../../../theme/realEstateListing';
import { interpolate, easeOutCubic, easeOutBack, sceneOpacity } from '../helpers';
import { RealEstateListingSpec } from '../../../data/realEstateListing';

interface SpecsSceneProps {
  localFrame: number;
  sceneDurationFrames: number;
  fadeFrames: number;
  specs: RealEstateListingSpec[];
}

export const SpecsScene: React.FC<SpecsSceneProps> = ({
  localFrame,
  sceneDurationFrames,
  fadeFrames,
  specs,
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        opacity,
        backgroundColor: theme.color.bg,
        fontFamily: theme.typography.sans,
      }}
    >
      {/* Title */}
      <div
        style={{
          fontFamily: theme.typography.serif,
          fontWeight: 600,
          fontSize: '19px',
          marginBottom: '26px',
          color: theme.color.ink,
          opacity: titleOpacity,
        }}
      >
        Thông số căn hộ
      </div>

      {/* Specs row */}
      <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
        {specs.map((spec, index) => {
          // Each spec card staggered: start = 12 + index*10
          const startFrame = 12 + index * 10;
          const cardOpacity = interpolate(localFrame, [startFrame, startFrame + 16], [0, 1]);
          const cardScale = interpolate(
            localFrame,
            [startFrame, startFrame + 16],
            [0.85, 1],
            easeOutBack
          );

          // Count animation: frames 6-26 within card
          const countProgress = interpolate(
            localFrame,
            [startFrame + 6, startFrame + 26],
            [0, spec.value],
            easeOutCubic
          );

          return (
            <div
              key={index}
              style={{
                flex: 1,
                background: theme.color.card,
                border: `1px solid ${theme.color.border}`,
                borderRadius: '16px',
                padding: '18px 10px',
                textAlign: 'center',
                opacity: cardOpacity,
                transform: `scale(${cardScale})`,
              }}
            >
              {/* Icon */}
              <div style={{ fontSize: '24px' }}>{spec.icon}</div>

              {/* Value */}
              <div
                style={{
                  fontFamily: theme.typography.serif,
                  fontWeight: 700,
                  fontSize: '24px',
                  marginTop: '8px',
                  color: theme.color.ink,
                }}
              >
                {Math.round(countProgress)}
                {spec.suffix}
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: '10.5px',
                  color: theme.color.muted,
                  marginTop: '4px',
                }}
              >
                {spec.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
