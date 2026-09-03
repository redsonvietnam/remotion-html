import React from 'react';
import { REAL_ESTATE_LISTING_THEME } from '../../../theme/realEstateListing';
import { interpolate, easeOutBack, sceneOpacity } from '../helpers';

interface OutroSceneProps {
  localFrame: number;
  sceneDurationFrames: number;
  fadeFrames: number;
  agentName: string;
  agentRole: string;
  agentPhone: string;
  agentCta: string;
}

export const OutroScene: React.FC<OutroSceneProps> = ({
  localFrame,
  sceneDurationFrames,
  fadeFrames,
  agentName,
  agentRole,
  agentPhone,
  agentCta,
}) => {
  const theme = REAL_ESTATE_LISTING_THEME;
  const opacity = sceneOpacity(localFrame, sceneDurationFrames, fadeFrames);

  // Card scale: frames 0-18
  const cardScale = interpolate(localFrame, [0, 18], [0.9, 1], easeOutBack);

  // Avatar: fade in frames 0-12
  const avatarOpacity = interpolate(localFrame, [0, 12], [0, 1]);

  // Name: fade in frames 10-20
  const nameOpacity = interpolate(localFrame, [10, 20], [0, 1]);

  // Role: fade in frames 14-24
  const roleOpacity = interpolate(localFrame, [14, 24], [0, 1]);

  // CTA: fade in frames 26-36
  const ctaOpacity = interpolate(localFrame, [26, 36], [0, 1]);
  const ctaPulse = localFrame > 38 ? 1 + 0.03 * Math.sin(localFrame * 0.15) : 1;

  // Phone: fade in frames 40-50
  const phoneOpacity = interpolate(localFrame, [40, 50], [0, 1]);

  // Extract first character of last name for avatar initial
  const avatarInitial = agentName.split(' ').slice(-1)[0][0];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 30px',
        opacity,
        backgroundColor: theme.color.bg,
        fontFamily: theme.typography.serif,
      }}
    >
      {/* Agent card */}
      <div
        style={{
          background: theme.color.ink,
          color: theme.color.bg,
          borderRadius: '20px',
          padding: '26px 24px',
          width: '100%',
          textAlign: 'center',
          transform: `scale(${cardScale})`,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: theme.color.accent,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '20px',
            opacity: avatarOpacity,
          }}
        >
          {avatarInitial}
        </div>

        {/* Name */}
        <div
          style={{
            fontFamily: theme.typography.serif,
            fontWeight: 600,
            fontSize: '18px',
            marginTop: '12px',
            color: theme.color.bg,
            opacity: nameOpacity,
          }}
        >
          {agentName}
        </div>

        {/* Role */}
        <div
          style={{
            fontSize: '11.5px',
            color: '#c9bfaf',
            opacity: roleOpacity,
            marginTop: '2px',
          }}
        >
          {agentRole}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: '18px',
            background: theme.color.accent,
            color: theme.color.bg,
            fontWeight: 700,
            fontSize: '13px',
            padding: '11px 20px',
            borderRadius: '24px',
            display: 'inline-block',
            opacity: ctaOpacity,
            transform: `scale(${ctaPulse})`,
          }}
        >
          {agentCta}
        </div>

        {/* Phone */}
        <div
          style={{
            marginTop: '12px',
            fontSize: '12px',
            color: '#c9bfaf',
            opacity: phoneOpacity,
          }}
        >
          📞 {agentPhone}
        </div>
      </div>
    </div>
  );
};
