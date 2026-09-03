// ---------------------------------------------------------------------------
// Polaroid — Photo card with tape effect
// ---------------------------------------------------------------------------

import React from "react";
import { polaroidIn, tapeIn } from "../helpers";

type PolaroidProps = {
  label: string;
  sublabel?: string;
  frame: number;
  fps: number;
  delay: number;
  rotation?: number;
};

export const Polaroid: React.FC<PolaroidProps> = ({
  label,
  sublabel,
  frame,
  fps,
  delay,
  rotation = 0,
}) => {
  const cardAnim = polaroidIn(frame, delay, fps, rotation);
  const tapeAnim = tapeIn(frame, delay + 5, fps);

  return (
    <div
      style={{
        ...cardAnim,
        width: 220,
        background: "#ffffff",
        padding: "12px 12px 40px 12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        position: "relative",
      }}
    >
      {/* Tape */}
      <div
        style={{
          ...tapeAnim,
          position: "absolute",
          top: -10,
          left: "50%",
          transform: "translateX(-50%) rotate(-2deg)",
          width: 60,
          height: 20,
          background: "rgba(200, 184, 150, 0.7)",
          borderRadius: 2,
        }}
      />

      {/* Photo placeholder */}
      <div
        style={{
          width: "100%",
          height: 160,
          background: "linear-gradient(135deg, #d0c8b8, #e8e0d0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: 12,
            color: "#666666",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {label}
        </div>
      </div>

      {/* Caption */}
      <div
        style={{
          fontFamily: "Segoe Script, cursive",
          fontSize: 14,
          color: "#1a1a1a",
          textAlign: "center",
          marginTop: 12,
        }}
      >
        {label}
      </div>
      {sublabel && (
        <div
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: 10,
            color: "#666666",
            textAlign: "center",
            marginTop: 4,
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
};
