// ---------------------------------------------------------------------------
// Feature Drop Template Helpers — motion, Three.js, SVG, emoji primitives
// ---------------------------------------------------------------------------

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate as remotionInterpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";

// ─── Deterministic interpolation (mirrors prototype) ────────────────────────

function clamp(v: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, v));
}

type Easing = (t: number) => number;

export function interpolate(
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
  easing: Easing = (t) => t,
): number {
  const t = clamp((frame - inputRange[0]) / (inputRange[1] - inputRange[0]), 0, 1);
  return outputRange[0] + (outputRange[1] - outputRange[0]) * easing(t);
}

export const easeOutCubic: Easing = (t) => 1 - Math.pow(1 - t, 3);
export const easeOutExpo: Easing = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const easeOutBack: Easing = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const SCENE_FADE_FRAMES = 14;

export function sceneOpacity(frame: number, dur: number): number {
  return (
    interpolate(frame, [0, SCENE_FADE_FRAMES], [0, 1]) *
    interpolate(frame, [dur - SCENE_FADE_FRAMES, dur], [1, 0])
  );
}

// ─── Icosahedron3D — ThreeCanvas child (R3F-style JSX) ────────────────────

export const Icosahedron3D: React.FC = () => {
  const frame = useCurrentFrame();
  const rx = frame * 0.0065;
  const ry = frame * 0.011;

  return (
    <>
      <ambientLight intensity={0.55} color="#6644ff" />
      <directionalLight position={[2, 3, 4]} intensity={1.15} color="#ffffff" />

      {/* Solid icosahedron */}
      <mesh rotation={[rx, ry, 0]}>
        <icosahedronGeometry args={[1.25, 0]} />
        <meshStandardMaterial
          color="#7c5cff"
          flatShading
          roughness={0.35}
          metalness={0.25}
        />
      </mesh>

      {/* Wireframe icosahedron */}
      <mesh rotation={[rx * 1.02, ry * 1.02, 0]}>
        <icosahedronGeometry args={[1.3, 0]} />
        <meshBasicMaterial
          color="#3ddcff"
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
    </>
  );
};

// ─── EmojiLayer — floating parallax emoji ──────────────────────────────────

export const EmojiLayer: React.FC<{ emojis: string[] }> = ({ emojis }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
      {emojis.map((e, i) => {
        const baseX = 10 + ((i * 11) % 80);
        const baseY = 8 + ((i * 23) % 84);
        const amp = 4 + (i % 3) * 2;
        const freq = 0.01 + (i % 4) * 0.003;
        const phase = i * 1.7;
        const x = baseX + amp * Math.sin(frame * freq + phase);
        const y = baseY + amp * 0.8 * Math.cos(frame * freq * 1.3 + phase);
        const opacity = Math.max(0.06, 0.16 + 0.10 * Math.sin(frame * 0.02 + i));
        const scale = 0.8 + (i % 3) * 0.15;
        const rotate = 8 * Math.sin(frame * 0.015 + i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              fontSize: 22,
              opacity,
              transform: `scale(${scale}) rotate(${rotate}deg)`,
              filter: "drop-shadow(0 4px 10px rgba(0,0,0,.4))",
            }}
          >
            {e}
          </div>
        );
      })}
    </div>
  );
};

// ─── FeatureRow — SVG icon + label + sub ────────────────────────────────────

export const FeatureRow: React.FC<{
  iconPath: string;
  label: string;
  sub: string;
  frame: number;
  delay: number;
  accentColor: string;
}> = ({ iconPath, label, sub, frame, delay, accentColor }) => {
  const rowOp = interpolate(frame, [delay, delay + 14], [0, 1]);
  const rowX = interpolate(frame, [delay, delay + 14], [-16, 0], easeOutCubic);
  const drawProgress = interpolate(frame, [delay + 6, delay + 30], [0, 1], easeOutCubic);

  // SVG path total length — use a fixed estimate for deterministic rendering
  const pathLen = 280;
  const dashOffset = pathLen * (1 - drawProgress);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 22,
        opacity: rowOp,
        transform: `translateX(${rowX}px)`,
      }}
    >
      <div style={{ width: 56, height: 56, flex: "none" }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
          <path
            d={iconPath}
            fill="none"
            stroke={accentColor}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLen}
            strokeDashoffset={dashOffset}
          />
        </svg>
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 19, lineHeight: 1.25, color: "#f5f4fa" }}>
          {label}
        </div>
        <div style={{ fontSize: 11.5, color: "rgba(245,244,250,0.55)", marginTop: 3 }}>
          {sub}
        </div>
      </div>
    </div>
  );
};

// ─── GhostText — layered ghost typography (outro) ──────────────────────────

export const GhostText: React.FC<{
  text: string;
  frame: number;
}> = ({ text, frame }) => {
  const wrapScale = interpolate(frame, [0, 18], [0.8, 1], easeOutBack);
  const ghostX = interpolate(frame, [0, 20], [16, 6]);

  return (
    <div style={{ position: "relative", transform: `scale(${wrapScale})` }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          fontWeight: 900,
          fontSize: 56,
          letterSpacing: -1,
          color: "transparent",
          WebkitTextStroke: "1.4px rgba(245,244,250,0.18)",
          transform: `translate(${ghostX}px, 6px) scale(1.06)`,
          zIndex: 0,
        }}
      >
        {text}
      </div>
      <div
        style={{
          position: "relative",
          fontWeight: 900,
          fontSize: 56,
          letterSpacing: -1,
          zIndex: 1,
          background: "linear-gradient(90deg,#7c5cff,#3ddcff)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {text}
      </div>
    </div>
  );
};
