import React from 'react';
import { interpolate as remotionInterpolate } from 'remotion';
import { EDITORIAL_FEATURE_THEME } from '../../../theme/editorialFeature';
import { interpolate, easeOutCubic, sceneOpacity } from '../helpers';

interface CoverSceneProps {
  localFrame: number;
  sceneDurationFrames: number;
  fadeFrames: number;
  category: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
}

export const CoverScene: React.FC<CoverSceneProps> = ({
  localFrame,
  sceneDurationFrames,
  fadeFrames,
  category,
  title,
  author,
  date,
  readTime,
}) => {
  const theme = EDITORIAL_FEATURE_THEME;
  const opacity = sceneOpacity(localFrame, sceneDurationFrames, fadeFrames);

  // Category: fade in frames 0-10
  const categoryOpacity = interpolate(localFrame, [0, 10], [0, 1]);

  // Title: fade in + slide up, frames 8-26
  const titleOpacity = interpolate(localFrame, [8, 26], [0, 1]);
  const titleTranslate = interpolate(localFrame, [8, 26], [16, 0], easeOutCubic);

  // Rule: scale in from left, frames 28-40
  const ruleScale = interpolate(localFrame, [28, 40], [0, 1], easeOutCubic);

  // Metadata: fade in, frames 36-48
  const metaOpacity = interpolate(localFrame, [36, 48], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 34px',
        opacity,
        backgroundColor: theme.color.bg,
        color: theme.color.ink,
        fontFamily: theme.typography.sans,
      }}
    >
      {/* Category tag */}
      <div
        style={{
          fontFamily: theme.typography.sans,
          fontWeight: 700,
          fontSize: '11.5px',
          letterSpacing: '2.5px',
          color: theme.color.accent,
          opacity: categoryOpacity,
          textTransform: 'uppercase',
        }}
      >
        {category}
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: theme.typography.serif,
          fontWeight: 900,
          fontSize: '38px',
          lineHeight: 1.18,
          marginTop: '14px',
          color: theme.color.ink,
          opacity: titleOpacity,
          transform: `translateY(${titleTranslate}px)`,
        }}
      >
        {title}
      </div>

      {/* Rule/divider */}
      <div
        style={{
          width: '46px',
          height: '2px',
          background: theme.color.ink,
          marginTop: '26px',
          transform: `scaleX(${ruleScale})`,
          transformOrigin: 'left',
        }}
      />

      {/* Metadata: author, date, read time */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '22px',
          fontSize: '12px',
          color: theme.color.muted,
          opacity: metaOpacity,
        }}
      >
        <span>{author}</span>
        <span
          style={{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: theme.color.muted,
          }}
        />
        <span>{date}</span>
        <span
          style={{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: theme.color.muted,
          }}
        />
        <span>{readTime}</span>
      </div>
    </div>
  );
};
