import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import * as THREE from "three";
import { theme } from "../theme";

/**
 * QUAN TRONG: trong moi component nam trong <ThreeCanvas>, TUYET DOI khong dung
 * useFrame() cua React Three Fiber (no chay theo wall-clock time, khong tua duoc).
 * Phai dung useCurrentFrame() cua Remotion de Remotion Studio scrub/tua frame
 * chinh xac va render deterministic (moi lan render ra dung 1 anh cho 1 frame).
 */
export const Icon3D: React.FC<{ startFrame?: number }> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  // Hieu ung "reveal" luc xuat hien: scale bat len bang spring vat ly
  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  // Xoay lien tuc, khong phu thuoc spring (giong orb-ring xoay trong ban HTML)
  const rotationY = interpolate(frame, [0, fps * 8], [0, Math.PI * 2], {
    extrapolateRight: "extend",
  });
  const rotationX = Math.sin(frame / 40) * 0.15;

  // 3 node ket noi nhau, dung toa do co dinh (khop voi icon SVG "brain/node" ban truoc)
  const nodePositions = useMemo(
    () =>
      [
        [-0.6, 0.25, 0],
        [0.6, 0.25, 0],
        [0, -0.55, 0],
      ] as [number, number, number][],
    []
  );

  return (
    <group scale={scale} rotation={[rotationX, rotationY, 0]}>
      {/* Vong ngoai dai dien cho "orb-ring" gradient trong ban HTML */}
      <mesh>
        <torusGeometry args={[1.15, 0.035, 16, 100]} />
        <meshStandardMaterial
          color={theme.colors.amber}
          emissive={theme.colors.amber}
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Loi kinh mo, dai dien cho "orb-core" glass card */}
      <mesh>
        <sphereGeometry args={[0.85, 48, 48]} />
        <meshPhysicalMaterial
          color={theme.colors.bg2}
          transparent
          opacity={0.35}
          roughness={0.1}
          transmission={0.5}
          thickness={0.6}
        />
      </mesh>

      {/* 3 node + duong noi, dai dien icon "brain/node" da ve bang SVG path */}
      {nodePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial
            color={theme.colors.teal}
            emissive={theme.colors.teal}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
      {nodePositions.map((pos, i) => {
        const next = nodePositions[(i + 1) % nodePositions.length];
        const mid: [number, number, number] = [
          (pos[0] + next[0]) / 2,
          (pos[1] + next[1]) / 2,
          (pos[2] + next[2]) / 2,
        ];
        const dx = next[0] - pos[0];
        const dy = next[1] - pos[1];
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        return (
          <mesh key={`edge-${i}`} position={mid} rotation={[0, 0, angle]}>
            <cylinderGeometry args={[0.02, 0.02, length, 8]} />
            <meshStandardMaterial color={theme.colors.ink} opacity={0.7} transparent />
          </mesh>
        );
      })}

      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 2]} intensity={40} color={theme.colors.amber} />
      <pointLight position={[-2, -1, 2]} intensity={20} color={theme.colors.teal} />
    </group>
  );
};
