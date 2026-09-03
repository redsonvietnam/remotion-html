import React from 'react';
import { REAL_ESTATE_LISTING_THEME } from '../../../theme/realEstateListing';
import { interpolate, sceneOpacity } from '../helpers';
import { formatVND } from '../../../data/realEstateListing';

interface CoverSceneProps {
  localFrame: number;
  sceneDurationFrames: number;
  fadeFrames: number;
  tag: string;
  type: string;
  price: number;
  address: string;
}

export const CoverScene: React.FC<CoverSceneProps> = ({
  localFrame,
  sceneDurationFrames,
  fadeFrames,
  tag,
  type,
  price,
  address,
}) => {
  const theme = REAL_ESTATE_LISTING_THEME;
  const opacity = sceneOpacity(localFrame, sceneDurationFrames, fadeFrames);

  // Tag: fade in frames 0-10
  const tagOpacity = interpolate(localFrame, [0, 10], [0, 1]);

  // Type: fade in frames 10-20
  const typeOpacity = interpolate(localFrame, [10, 20], [0, 1]);

  // Price: count up frames 16-44
  const priceProgress = interpolate(localFrame, [16, 44], [0, price]);
  const priceOpacity = interpolate(localFrame, [14, 22], [0, 1]);

  // Address: fade in frames 46-56
  const addressOpacity = interpolate(localFrame, [46, 56], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 32px',
        opacity,
        backgroundColor: theme.color.bg,
        color: theme.color.ink,
        fontFamily: theme.typography.sans,
      }}
    >
      {/* Tag */}
      <div
        style={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          fontFamily: theme.typography.sans,
          fontWeight: 700,
          fontSize: '10.5px',
          letterSpacing: '2px',
          color: theme.color.bg,
          background: theme.color.accent,
          padding: '5px 12px',
          borderRadius: '20px',
          opacity: tagOpacity,
          textTransform: 'uppercase',
        }}
      >
        {tag}
      </div>

      {/* Type */}
      <div
        style={{
          fontSize: '13.5px',
          color: theme.color.muted,
          marginTop: '16px',
          fontWeight: 600,
          opacity: typeOpacity,
        }}
      >
        {type}
      </div>

      {/* Price */}
      <div
        style={{
          fontFamily: theme.typography.serif,
          fontWeight: 700,
          fontSize: '44px',
          marginTop: '8px',
          letterSpacing: '-0.5px',
          opacity: priceOpacity,
        }}
      >
        {formatVND(priceProgress)}
      </div>

      {/* Address */}
      <div
        style={{
          fontSize: '13px',
          color: theme.color.inkSoft,
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          opacity: addressOpacity,
        }}
      >
        <span>📍</span>
        <span>{address}</span>
      </div>
    </div>
  );
};
