// ---------------------------------------------------------------------------
// StatsScene — De An 06 Stats Scene
//
// Uses: FlowLine (design/svg), KaraokeReveal (design/typography)
// Uses: slideUp, fadeIn, Backdrop, Gauge (template-specific helpers)
// Theme: consumed via useTheme() — not imported directly
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
import { useTheme } from "../../../design/theme";
import { slideUp, fadeIn, Backdrop, Gauge } from "../helpers";
import type { NQ57StatsContent } from "../../../data/nq57";

type Props = { audio: string; caption: string; dur: number } & NQ57StatsContent;

export const StatsScene: React.FC<Props> = ({
  audio,
  caption,
  dur,
  title,
  chartData,
  gauges,
}) => {
  const theme = useTheme();
  const BV = theme.fonts.display;
  const GAUGE_COLORS = [theme.colors.accent1, theme.colors.accent2, theme.colors.accent3];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = slideUp(frame, 0, fps, 30);
  const chartAnim = slideUp(frame, 10, fps, 35);
  const lineAnim = fadeIn(frame, 50, fps, 30);
  const p = interpolate(frame, [15, fps * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shown = chartData.slice(0, Math.max(1, Math.round(p * chartData.length)));
  const gp = spring({ frame: frame - 25, fps, config: { damping: 16, mass: 0.7 } });
  const gaugeAnims = gauges.map((_, i) => slideUp(frame, 55 + i * 10, fps, 30));

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 4% 10%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ ...titleAnim, fontFamily: BV, fontWeight: 800, fontSize: 56, color: theme.colors.ink, marginBottom: 20, textAlign: "center" }}>{title}</div>
      <div style={{ ...chartAnim, width: "100%", maxWidth: 1000, height: 300, background: theme.colors.card, border: `1px solid ${theme.colors.line}`, borderRadius: 24, padding: "24px 30px", marginBottom: 24, boxShadow: `0 20px 60px -20px ${theme.colors.accent1}20` }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={shown} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gdp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.colors.accent1} stopOpacity={0.9} />
                <stop offset="50%" stopColor={theme.colors.accent2} stopOpacity={0.4} />
                <stop offset="100%" stopColor={theme.colors.accent3} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={theme.colors.accent1} />
                <stop offset="100%" stopColor={theme.colors.accent3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="6 10" stroke={theme.colors.line} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: theme.colors.muted, fontFamily: BV, fontSize: 16 }}
              axisLine={{ stroke: theme.colors.line }}
              tickLine={false}
            />
            <YAxis tick={{ fill: theme.colors.muted, fontFamily: BV, fontSize: 14 }} axisLine={false} tickLine={false} unit="%" width={50} />
            <Area type="monotone" dataKey="value" stroke="url(#strokeGrad)" strokeWidth={4} fill="url(#gdp)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ width: 1020, marginBottom: 14, opacity: lineAnim.opacity }}>
        <FlowLine width={1020} progress={(frame * 2.5) / 1020} dotColor={theme.colors.accent2} lineColor={theme.colors.line} dotRadius={3.5} dotCount={6} />
      </div>
      <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap" }}>
        {gauges.map((g, i) => {
          const e = gaugeAnims[i];
          return (
            <div key={i} style={e}>
              <Gauge value={g.value} max={g.max} label={g.label} unit={g.unit} color={GAUGE_COLORS[i % GAUGE_COLORS.length]} progress={gp} />
            </div>
          );
        })}
      </div>
      <KaraokeReveal
        text={caption}
        dur={dur}
        fontFamily={BV}
        activeColor={theme.colors.accent1}
        revealedColor={theme.colors.ink}
        borderColor={theme.colors.line}
        fontSize={20}
      />
    </AbsoluteFill>
  );
};