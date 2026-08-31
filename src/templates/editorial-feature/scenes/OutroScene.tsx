import React from 'react';
import { EDITORIAL_FEATURE_THEME } from '../../../theme/editorialFeature';
import { interpolate, sceneOpacity } from '../helpers';

interface OutroSceneProps {
  localFrame: number;
  sceneDurationFrames: number;
  fadeFrames: number;
  brand: string;
  cta: string;
  readTime: string;
}

export const OutroScene: React.FC<OutroSceneProps> = ({
  localFrame,
  sceneDurationFrames,
  fadeFrames,
  brand,
  cta,
  readTime,
}) => {
  const theme = EDITORIAL_FEATURE_THEME;
  const opacity = sceneOpacity(localFrame, sceneDurationFrames, fadeFrames);

  // Brand: fade in, frames 0-14
  const brandOpacity = interpolate(localFrame, [0, 14], [0, 1]);

  // CTA: fade in, frames 16-28
  const ctaOpacity = interpolate(localFrame, [16, 28], [0, 1]);

  // Read time: fade in, frames 30-40
  const readTimeOpacity = interpolate(localFrame, [30, 40], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 34px',
        opacity,
        backgroundColor: theme.color.bg,
        color: theme.color.ink,
        fontFamily: theme.typography.serif,
      }}
    >
      {/* Brand name */}
      <div
        style={{
          fontFamily: theme.typography.serif,
          fontWeight: 900,
          fontSize: '20px',
          letterSpacing: '1px',
          color: theme.color.ink,
          opacity: brandOpacity,
        }}
      >
        {brand}
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: '20px',
          fontWeight: 700,
          fontSize: '14px',
          color: theme.color.ink,
          borderBottom: `2px solid ${theme.color.ink}`,
          paddingBottom: '3px',
          opacity: ctaOpacity,
        }}
      >
        {cta}
      </div>

      {/* Read time info */}
      <div
        style={{
          marginTop: '16px',
          fontSize: '11.5px',
          color: theme.color.muted,
          opacity: readTimeOpacity,
        }}
      >
        {readTime}
      </div>
    </div>
  );
};
