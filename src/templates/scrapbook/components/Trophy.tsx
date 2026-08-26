// ---------------------------------------------------------------------------
// Trophy — Editorial trophy sticker (CSS/SVG)
// ---------------------------------------------------------------------------

import React from "react";

export const Trophy: React.FC = () => {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      {/* Cup body */}
      <path
        d="M20 15 h40 v5 c0 15 -8 25 -20 30 c-12-5-20-15-20-30 z"
        fill="#d4a017"
        stroke="#1a1a1a"
        strokeWidth="2"
      />
      {/* Left handle */}
      <path
        d="M20 20 h-8 c-4 0-6 4-6 8 s2 8 6 8 h8"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="2"
      />
      {/* Right handle */}
      <path
        d="M60 20 h8 c4 0 6 4 6 8 s-2 8-6 8 h-8"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="2"
      />
      {/* Base */}
      <rect x="32" y="50" width="16" height="8" fill="#d4a017" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="26" y="58" width="28" height="6" rx="2" fill="#d4a017" stroke="#1a1a1a" strokeWidth="2" />
      {/* Star */}
      <polygon
        points="40,22 43,30 52,30 45,35 48,44 40,39 32,44 35,35 28,30 37,30"
        fill="#f5f0e8"
        stroke="#1a1a1a"
        strokeWidth="1"
      />
    </svg>
  );
};
