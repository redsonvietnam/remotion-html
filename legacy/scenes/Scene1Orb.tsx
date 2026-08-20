import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Icon3D } from "../components/Icon3D";
import { theme } from "../theme";

const WORDS_LINE1 = ["Não", "bộ", "yêu", "thói", "quen,"];
const WORDS_LINE2 = ["không", "yêu", "ý", "chí."];

const Word: React.FC<{ text: string; delayFrames: number }> = ({ text, delayFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 14 },
  });
  const y = interpolate(progress, [0, 1], [40, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <span
      style={{
        display: "inline-block",
        transform: `translateY(${y}px)`,
        opacity,
        marginRight: "0.28em",
      }}
    >
      {text}
    </span>
  );
};

export const Scene1Orb: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Background gradient "troi" nhe theo thoi gian, dong bo Config drift keyframes
  const bgShift = interpolate(frame, [0, fps * 8], [0, 40], {
    extrapolateRight: "extend",
  });

  const subOpacity = interpolate(frame, [fps * 1.6, fps * 2.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(circle at ${18 + bgShift * 0.3}% 22%, rgba(255,184,107,.22), transparent 45%),
          radial-gradient(circle at ${82 - bgShift * 0.3}% 28%, rgba(94,234,212,.17), transparent 50%),
          radial-gradient(circle at 50% 88%, rgba(255,107,157,.16), transparent 50%),
          ${theme.colors.bg}
        `,
      }}
    >
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "6% 8% 12%",
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: theme.colors.teal,
            marginBottom: 20,
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          — Tại sao ta lặp lại
        </div>

        <h1
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 700,
            fontSize: 68,
            lineHeight: 1.15,
            textAlign: "center",
            color: theme.colors.ink,
            maxWidth: "78%",
            margin: 0,
          }}
        >
          <div>
            {WORDS_LINE1.map((w, i) => (
              <Word key={w} text={w} delayFrames={8 + i * 4} />
            ))}
          </div>
          <div>
            {WORDS_LINE2.map((w, i) => (
              <Word key={w} text={w} delayFrames={8 + (WORDS_LINE1.length + i) * 4} />
            ))}
          </div>
        </h1>

        {/* ThreeCanvas PHAI khai bao width/height ro rang (yeu cau bat buoc cua @remotion/three) */}
        <div style={{ width: 320, height: 320, marginTop: 10 }}>
          <Sequence layout="none">
            <ThreeCanvas width={320} height={320} camera={{ position: [0, 0, 3.2], fov: 40 }}>
              <Icon3D startFrame={20} />
            </ThreeCanvas>
          </Sequence>
        </div>

        <p
          style={{
            marginTop: 4,
            fontSize: 24,
            color: theme.colors.muted,
            textAlign: "center",
            maxWidth: "56%",
            opacity: subOpacity,
            fontFamily: theme.fonts.body,
          }}
        >
          Mỗi lần lặp lại một hành vi, não khắc sâu thêm một đường mòn thần kinh.
        </p>
      </AbsoluteFill>

      {/* Caption bar - khop TTS, thay text nay bang du lieu SRT/VTT thuc te khi co audio */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "6%" }}>
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontWeight: 600,
            fontSize: 26,
            background: "rgba(5,6,10,.6)",
            border: `1px solid ${theme.colors.line}`,
            padding: "10px 26px",
            borderRadius: 999,
            color: theme.colors.ink,
            opacity: interpolate(frame, [fps * 0.5, fps * 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          não bộ yêu thói quen, không yêu ý chí
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
