// ---------------------------------------------------------------------------
// Product Teaser — Dashboard Scene
//
// KPI cards, chart with SVG path animation, log items
// Chart uses SVG path stroke-dashoffset for deterministic reveal
// ---------------------------------------------------------------------------

import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { ProductTeaserDashboardContent, KpiItem, LogItem } from "../../../data/productTeaser";
import { interpolate, easeOutCubic, easeOutBack, sceneOpacity, formatNumber } from "../helpers";
import type { ProductTeaserTheme } from "../../../theme/productTeaser";

interface Props {
  content: ProductTeaserDashboardContent;
  durationInFrames: number;
  theme: ProductTeaserTheme;
}

export const DashboardScene: React.FC<Props> = ({ content, durationInFrames, theme }) => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);

  // Generate chart SVG path geometry once
  const chartGeometry = useMemo(() => {
    const points = content.chart.points;
    const maxV = Math.max(...points);
    const minV = Math.min(...points);
    const chartW = 340;
    const chartH = 120;
    const padY = 10;

    const coords = points.map((v, i) => {
      const x = (i / (points.length - 1)) * chartW;
      const y = chartH - padY - ((v - minV) / (maxV - minV)) * (chartH - 2 * padY);
      return [x, y] as [number, number];
    });

    const linePath = coords.map((c, i) => (i === 0 ? "M" : "L") + c[0].toFixed(1) + "," + c[1].toFixed(1)).join(" ");

    // Create SVG element to measure path length
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${chartW} ${chartH}`);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", linePath);
    svg.appendChild(path);
    document.body.appendChild(svg);
    const pathLength = path.getTotalLength();
    document.body.removeChild(svg);

    return { linePath, pathLength, chartW, chartH };
  }, [content.chart.points]);

  // KPI value counters
  const kpiValues = content.kpis.map((kpi, i) => {
    const start = 8 + i * 8;
    const progress = interpolate(frame, [start + 6, start + 30], [0, kpi.value], easeOutCubic);
    return (kpi.prefix || "") + formatNumber(progress) + (kpi.suffix || "");
  });

  // Chart reveal animation
  const chartStart = 40;
  const chartDrawDur = 60;
  const chartReveal = interpolate(frame, [chartStart, chartStart + chartDrawDur], [0, 1], easeOutCubic);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <div
        style={{
          padding: "64px 20px 0",
          color: theme.colors.textPrimary,
          fontFamily: theme.fonts.sans,
          opacity,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "15px" }}>{content.dashtitle}</div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: "10.5px", color: theme.colors.textTertiary }}>
            {content.dashperiod}
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          {content.kpis.map((kpi, i) => {
            const start = 8 + i * 8;
            const cardOpacity = interpolate(frame, [start, start + 14], [0, 1]);
            const cardScale = interpolate(frame, [start, start + 14], [0.85, 1], easeOutBack);

            return (
              <div
                key={kpi.label}
                style={{
                  flex: 1,
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: "14px",
                  padding: "12px",
                  opacity: cardOpacity,
                  transform: `scale(${cardScale})`,
                }}
              >
                <div style={{ fontSize: "10px", color: theme.colors.textSecondary, marginBottom: "6px" }}>
                  {kpi.label}
                </div>
                <div style={{ fontWeight: 800, fontSize: "17px", letterSpacing: "-0.3px" }}>
                  {kpiValues[i]}
                </div>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: "10px", fontWeight: 600, color: theme.colors.success, marginTop: "5px" }}>
                  {kpi.change}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Card */}
        <div
          style={{
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "16px",
            padding: "16px 14px 12px",
            marginBottom: "14px",
            opacity: interpolate(frame, [34, 46], [0, 1]),
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700 }}>Doanh thu theo ngày</div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: "12px", color: theme.colors.accent, opacity: interpolate(frame, [chartStart + chartDrawDur, chartStart + chartDrawDur + 10], [0, 1]) }}>
              {content.chart.currentValueLabel}
            </div>
          </div>

          {/* SVG Chart */}
          <svg viewBox="0 0 340 120" width="100%" height="120" style={{ display: "block" }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.colors.accent} stopOpacity="0.35" />
                <stop offset="100%" stopColor={theme.colors.accent} stopOpacity="0" />
              </linearGradient>
              <clipPath id="revealClip">
                <rect x="0" y="0" width={chartGeometry.chartW * chartReveal} height={chartGeometry.chartH} />
              </clipPath>
            </defs>
            <g clipPath="url(#revealClip)">
              <path
                d={`${chartGeometry.linePath} L${chartGeometry.chartW},120 L0,120 Z`}
                fill="url(#areaGrad)"
              />
              <path
                d={chartGeometry.linePath}
                fill="none"
                stroke={theme.colors.accent}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>

        {/* Log Row */}
        <div style={{ display: "flex", gap: "10px" }}>
          {content.logs.map((log, i) => {
            const start = 116 + i * 8;
            const logOpacity = interpolate(frame, [start, start + 14], [0, 1]);
            const logTransform = interpolate(frame, [start, start + 14], [10, 0], easeOutCubic);

            return (
              <div
                key={log.title}
                style={{
                  flex: 1,
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: "12px",
                  padding: "10px 12px",
                  opacity: logOpacity,
                  transform: `translateY(${logTransform}px)`,
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 700 }}>{log.title}</div>
                <div style={{ fontSize: "9.5px", color: theme.colors.textTertiary, marginTop: "3px" }}>{log.sub}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
