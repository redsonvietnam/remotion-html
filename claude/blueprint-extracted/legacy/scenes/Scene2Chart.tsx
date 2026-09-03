import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer } from "recharts";
import { theme } from "../theme";

// Du lieu minh hoa: "do ben" cua thoi quen tang dan theo so lan lap lai
// (lay cam hung tu nghien cuu quen thuoc ve ~66 ngay de hinh thanh thoi quen).
const RAW_DATA = [
  { name: "Lần 1", target: 8 },
  { name: "Lần 7", target: 28 },
  { name: "Lần 30", target: 62 },
  { name: "Lần 66", target: 94 },
];

const COLORS = [theme.colors.pink, theme.colors.amber, theme.colors.teal, theme.colors.teal];

export const Scene2Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // QUAN TRONG: KHONG dung isAnimationActive mac dinh cua Recharts (chay theo
  // requestAnimationFrame ngoai tam kiem soat cua Remotion -> render se khong
  // deterministic, moi lan render frame co the ra gia tri khac nhau).
  // Thay vao do: tat animation noi bo (isAnimationActive={false}) va tu tinh
  // gia tri moi bar bang spring() theo frame hien tai, giong ky thuat "bake"
  // duoc khuyen nghi trong tai lieu Remotion cho cac thu vien third-party.
  const data = RAW_DATA.map((d, i) => {
    const delay = 10 + i * 8;
    const progress = spring({
      frame: frame - delay,
      fps,
      config: { damping: 14, mass: 0.7 },
    });
    return { ...d, value: Math.max(0, d.target * progress) };
  });

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "6% 10% 10%",
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: 700,
          fontSize: 40,
          color: theme.colors.ink,
          opacity: titleOpacity,
          marginBottom: 28,
          textAlign: "center",
        }}
      >
        Thói quen mạnh lên theo từng lần lặp lại
      </div>

      {/* Card kinh bao quanh chart, dong bo ngon ngu thiet ke voi Scene 1 */}
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          height: 420,
          background: "rgba(255,255,255,.035)",
          border: `1px solid ${theme.colors.line}`,
          borderRadius: 24,
          padding: "32px 40px",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,.5)",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="4 8" stroke={theme.colors.line} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: theme.colors.muted, fontFamily: theme.fonts.body, fontSize: 18 }}
              axisLine={{ stroke: theme.colors.line }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: theme.colors.muted, fontFamily: theme.fonts.body, fontSize: 16 }}
              axisLine={false}
              tickLine={false}
              unit="%"
              width={50}
            />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} isAnimationActive={false} maxBarSize={90}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "5%" }}>
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
            opacity: interpolate(frame, [fps * 1.2, fps * 1.7], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          lặp đủ lâu → vòng lặp tự vận hành
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
