// ---------------------------------------------------------------------------
// PaperBg — Aged paper texture background
// ---------------------------------------------------------------------------

import React from "react";
import { AbsoluteFill } from "remotion";

export const PaperBg: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(200, 180, 150, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(180, 160, 130, 0.1) 0%, transparent 50%),
          linear-gradient(180deg, #f5f0e8 0%, #e8e0d0 100%)
        `,
      }}
    >
      {/* Grid lines */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, opacity: 0.08 }}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#a09080" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Paper grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(160, 144, 128, 0.03) 2px,
              rgba(160, 144, 128, 0.03) 4px
            )
          `,
        }}
      />

      {/* Edge darkening */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 150px rgba(0,0,0,0.08)",
        }}
      />
    </AbsoluteFill>
  );
};
