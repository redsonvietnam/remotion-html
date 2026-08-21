// ---------------------------------------------------------------------------
// StatsScene — NQ57 Stats Scene
//
// Uses: FlowLine (design/svg), KaraokeReveal (design/typography)
// Uses: fadeUp, Backdrop, Gauge (template-specific helpers)
// ---------------------------------------------------------------------------

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Audio,
} from "remotion";
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { FlowLine } from "../../../design/svg";
import { KaraokeReveal } from "../../../design/typography";
import { nq57 } from "../../../theme/nq57";
import { BV } from "../../../fonts/nq57";
import { fadeUp, Backdrop, Gauge } from "../helpers";

const GDP_DATA = [
  { year: "2024", v: 18 }, { year: "2025", v: 20 }, { year: "2026", v: 22 },
  { year: "2027", v: 24 }, { year: "2028", v: 26 }, { year: "2029", v: 28 }, { year: "2030", v: 30 },
];

const GAUGES = [
  { value: 30, max: 100, label: "Quy mô kinh tế số (% GDP)", unit: "%", c: nq57.colors.accent2 },
  { value: 80, max: 100, label: "Dịch vụ công trực tuyến", unit: "%", c: nq57.colors.accent3 },
  { value: 3, max: 10, label: "ASEAN về Trí tuệ nhân tạo", unit: " Top", c: nq57.colors.accent1 },
];

export const StatsScene: React.FC<{ audio: string; caption: string; dur: number }> = ({
  audio,
  caption,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [12, fps * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shown = GDP_DATA.slice(0, Math.max(1, Math.round(p * GDP_DATA.length)));
  const gp = spring({ frame: frame - 20, fps, config: { damping: 14, mass: 0.8 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 6% 12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ fontFamily: BV, fontWeight: 800, fontSize: 52, color: nq57.colors.ink, marginBottom: 14 }}>Mục tiêu 2030</div>
      <div style={{ width: "100%", maxWidth: 960, height: 280, background: nq57.colors.card, border: `1px solid ${nq57.colors.line}`, borderRadius: 22, padding: "18px 26px", marginBottom: 18 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={shown} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gdp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={nq57.colors.accent2} stopOpacity={0.8} />
                <stop offset="100%" stopColor={nq57.colors.accent2} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 8" stroke={nq57.colors.line} vertical={false} />
            <XAxis dataKey="year" tick={{ fill: nq57.colors.muted, fontFamily: BV, fontSize: 15 }} axisLine={{ stroke: nq57.colors.line }} tickLine={false} />
            <YAxis tick={{ fill: nq57.colors.muted, fontFamily: BV, fontSize: 13 }} axisLine={false} tickLine={false} unit="%" width={40} />
            <Area type="monotone" dataKey="v" stroke={nq57.colors.accent2} strokeWidth={3} fill="url(#gdp)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ width: 980, marginBottom: 10 }}>
        <FlowLine width={980} progress={(frame * 4) / 980} dotColor={nq57.colors.accent3} lineColor={nq57.colors.line} />
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {GAUGES.map((g, i) => {
          const e = fadeUp(frame, 16 + i * 10, fps);
          return (
            <div key={i} style={e}>
              <Gauge value={g.value} max={g.max} label={g.label} unit={g.unit} color={g.c} progress={gp} />
            </div>
          );
        })}
      </div>
      <KaraokeReveal
        text={caption}
        dur={dur}
        fontFamily={BV}
        activeColor={nq57.colors.accent2}
        revealedColor={nq57.colors.ink}
        borderColor={nq57.colors.line}
      />
    </AbsoluteFill>
  );
};
