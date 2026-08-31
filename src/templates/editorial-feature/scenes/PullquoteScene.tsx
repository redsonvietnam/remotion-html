import React from 'react';
import { EDITORIAL_FEATURE_THEME } from '../../../theme/editorialFeature';
import { interpolate, easeOutCubic, sceneOpacity } from '../helpers';

interface PullquoteSceneProps {
  localFrame: number;
  sceneDurationFrames: number;
  fadeFrames: number;
  text: string;
  attribution: string;
}

export const PullquoteScene: React.FC<PullquoteSceneProps> = ({
  localFrame,
  sceneDurationFrames,
  fadeFrames,
  text,
  attribution,
}) => {
  const theme = EDITORIAL_FEATURE_THEME;
  const opacity = sceneOpacity(localFrame, sceneDurationFrames, fadeFrames);

  // Opening quote: fade in + scale, frames 0-14
  const quoteOpacity = interpolate(localFrame, [0, 14], [0, 1]);
  const quoteScale = interpolate(localFrame, [0, 14], [0.6, 1], easeOutCubic);

  // Quote text: fade in + slide up, frames 14-34
  const textOpacity = interpolate(localFrame, [14, 34], [0, 1]);
  const textTranslate = interpolate(localFrame, [14, 34], [10, 0], easeOutCubic);

  // Attribution: fade in, frames 40-52
  const attributionOpacity = interpolate(localFrame, [40, 52], [0, 1]);

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
        padding: '0 40px',
        opacity,
        backgroundColor: theme.color.bg,
        color: theme.color.ink,
        fontFamily: theme.typography.serif,
      }}
    >
      {/* Opening quotation mark */}
      <div
        style={{
          fontFamily: theme.typography.serif,
          fontWeight: 900,
          fontSize: '70px',
          color: theme.color.hairline,
          lineHeight: 0.5,
          opacity: quoteOpacity,
          transform: `scale(${quoteScale})`,
        }}
      >
        "
      </div>

      {/* Quote text */}
      <div
        style={{
          fontFamily: theme.typography.serif,
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: 1.45,
          color: theme.color.ink,
          marginTop: '10px',
          opacity: textOpacity,
          transform: `translateY(${textTranslate}px)`,
        }}
      >
        {text}
      </div>

      {/* Attribution */}
      <div
        style={{
          fontSize: '12px',
          color: theme.color.muted,
          marginTop: '20px',
          letterSpacing: '0.5px',
          opacity: attributionOpacity,
        }}
      >
        {attribution}
      </div>
    </div>
  );
};
