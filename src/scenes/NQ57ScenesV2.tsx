import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Audio,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { nq57 } from "../theme/nq57";
import { BV } from "../fonts/nq57";

// ---------- shared ----------
const fadeUp = (frame: number, delay: number, fps: number) => {
  const t = spring({ frame: frame - delay, fps, config: { damping: 18, mass: 0.6 } });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`,
  };
};

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 200], [0, 1], { extrapolateRight: "clamp" });
  const x1 = interpolate(frame, [0, 300], [20, 40]);
  const y1 = interpolate(frame, [0, 300], [30, 20]);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 120% at 50% 0%, #131b30 0%, #0a0e1a 55%, #070a12 100%)" }}>
      <AbsoluteFill style={{ background: `radial-gradient(40% 40% at ${x1}% ${y1}%, rgba(226,59,59,0.22), transparent 70%)`, opacity: a }} />
      <AbsoluteFill style={{ background: `radial-gradient(45% 45% at 80% 85%, rgba(243,201,105,0.16), transparent 70%)`, opacity: a }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "64px 64px", opacity: 0.5, maskImage: "radial-gradient(80% 80% at 50% 50%, black, transparent 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------- svg animations ----------
const RingDraw: React.FC<{ progress: number; size?: number; color?: string; stroke?: number }> = ({
  progress,
  size = 520,
  color = nq57.colors.gold,
  stroke = 2,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, margin: "auto", pointerEvents: "none", overflow: "visible" }}>
    <circle cx="50" cy="50" r="47" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} transform="rotate(-90 50 50)" opacity={0.85} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const ang = (i * Math.PI * 2) / 8 - Math.PI / 2;
      const x1 = 50 + Math.cos(ang) * 51;
      const y1 = 50 + Math.sin(ang) * 51;
      const x2 = 50 + Math.cos(ang) * 55;
      const y2 = 50 + Math.sin(ang) * 55;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} opacity={0.6} />;
    })}
  </svg>
);

const UnderlineDraw: React.FC<{ progress: number; width?: number; color?: string }> = ({
  progress,
  width = 420,
  color = nq57.colors.gold,
}) => (
  <svg width={width} height={10} viewBox="0 0 100 10" style={{ display: "block", margin: "16px auto 0" }}>
    <line x1="0" y1="5" x2="100" y2="5" stroke={color} strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
  </svg>
);

const DataFlow: React.FC<{ width: number; color?: string }> = ({ width, color = nq57.colors.teal }) => {
  const frame = useCurrentFrame();
  const dots = [0, 1, 2, 3, 4];
  return (
    <svg width={width} height={36} viewBox={`0 0 ${width} 36`} style={{ display: "block" }}>
      <line x1="0" y1="18" x2={width} y2="18" stroke={nq57.colors.line} strokeWidth={2} />
      {dots.map((i) => {
        const x = (frame * 4 + (i * width) / 5) % width;
        return <circle key={i} cx={x} cy="18" r={4.5} fill={color} opacity={0.9} />;
      })}
    </svg>
  );
};

const Gauge: React.FC<{ value: number; max: number; label: string; unit: string; color: string; progress: number }> = ({
  value,
  max,
  label,
  unit,
  color,
  progress,
}) => {
  const r = 42;
  const pct = value / max;
  const shown = Math.round(value * progress);
  return (
    <div style={{ textAlign: "center", width: 300 }}>
      <svg width={170} height={170} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pct * progress} transform="rotate(-90 50 50)" />
        <text x="50" y="52" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="24" fontWeight={800} fontFamily={BV}>
          {shown}
          <tspan fontSize="12" fill={nq57.colors.ink}>{unit}</tspan>
        </text>
      </svg>
      <div style={{ fontFamily: BV, fontWeight: 600, fontSize: 16, color: nq57.colors.ink, marginTop: 4, lineHeight: 1.3, maxWidth: 280, margin: "4px auto 0" }}>{label}</div>
    </div>
  );
};

// ---------- karaoke subtitle (chữ chạy) ----------
const KaraokeCaption: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const endF = Math.max(10, Math.round(dur * fps) - 8);
  const prog = interpolate(frame, [6, endF], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // chi hien 1 dong (cuon marquee): dong cua nguoi dang noi
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const counts = lines.map((l) => l.split(/\s+/).filter(Boolean).length);
  const totalWords = counts.reduce((a, b) => a + b, 0);
  const revealed = Math.round(prog * totalWords);
  let acc = 0;
  let active = 0;
  for (let i = 0; i < counts.length; i++) {
    if (revealed <= acc + counts[i]) { active = i; break; }
    acc += counts[i];
    active = i;
  }
  const beforeWords = counts.slice(0, active).reduce((a, b) => a + b, 0);
  const activeWords = counts[active] || 1;
  const localRevealed = revealed - beforeWords;
  const localProg = activeWords ? localRevealed / activeWords : 0;
  const activeLine = lines[active] || "";
  const fontSize = 30;
  const estW = activeLine.length * fontSize * 0.52;
  const contW = 0.92 * 1920;
  const maxScroll = Math.max(0, estW - contW);
  const tx = maxScroll > 0 ? -Math.max(0, Math.min(maxScroll, localProg * estW - contW / 2)) : 0;
  const tokens = activeLine.split(/(\s+)/);
  let wi = 0;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "4.5%" }}>
      <div style={{ maxWidth: "92%", display: "flex", justifyContent: maxScroll > 0 ? "flex-start" : "center", overflow: "hidden", whiteSpace: "nowrap", fontFamily: BV, fontWeight: 600, fontSize, lineHeight: 1.25, background: "rgba(5,8,16,0.72)", border: `1px solid ${nq57.colors.line}`, borderRadius: 14, padding: "10px 26px", backdropFilter: "blur(8px)" }}>
        <span style={{ display: "inline-block", whiteSpace: "nowrap", transform: `translateX(${tx}px)` }}>
          {tokens.map((tok, ti) => {
            if (/^\s+$/.test(tok)) return " ";
            const idx = wi++;
            const on = idx < localRevealed;
            const cur = idx === localRevealed - 1;
            return (
              <span key={ti} style={{ opacity: on ? 1 : 0.2, color: cur ? nq57.colors.gold : nq57.colors.ink, fontWeight: cur ? 700 : 600 }}>
                {tok}
              </span>
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- three.js emblem ----------
const Emblem3D: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const nodes = [0, 1, 2, 3, 4];
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 3, 3]} intensity={1.3} color="#ffd27f" />
      <pointLight position={[-3, -2, 2]} intensity={0.9} color="#5eead4" />
      <mesh rotation={[0.5, t * 0.6, 0]}>
        <torusGeometry args={[1.5, 0.12, 18, 90]} />
        <meshStandardMaterial color={nq57.colors.red} emissive={nq57.colors.red} emissiveIntensity={0.45} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh rotation={[t * 0.5, t * 0.8, 0]}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial color={nq57.colors.gold} wireframe emissive={nq57.colors.gold} emissiveIntensity={0.35} />
      </mesh>
      {nodes.map((i) => {
        const a = t * 0.8 + (i * Math.PI * 2) / 5;
        const r = 2.15;
        return (
          <mesh key={i} position={[Math.cos(a) * r, Math.sin(a * 1.3) * 0.5, Math.sin(a) * r]}>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color={nq57.colors.teal} emissive={nq57.colors.teal} emissiveIntensity={0.6} />
          </mesh>
        );
      })}
    </>
  );
};

const EmblemBox: React.FC<{ size?: number }> = ({ size = 460 }) => (
  <div style={{ width: size, height: size }}>
    <Sequence layout="none">
      <ThreeCanvas width={size} height={size} camera={{ position: [0, 0, 5.2], fov: 45 }}>
        <Emblem3D />
      </ThreeCanvas>
    </Sequence>
  </div>
);

const Bars3D: React.FC<{ count: number }> = ({ count }) => {
  const frame = useCurrentFrame();
  const fps = useVideoConfig().fps;
  const colors = [nq57.colors.red, nq57.colors.gold, nq57.colors.teal, nq57.colors.gold, nq57.colors.red];
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 6, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-4, 2, 3]} intensity={0.8} color="#5eead4" />
      <gridHelper args={[10, 10, "#2a3350", "#1a2138"]} position={[0, -1.6, 0]} />
      {Array.from({ length: count }).map((_, i) => {
        const p = spring({ frame: frame - 12 - i * 7, fps, config: { damping: 12, mass: 1 } });
        const h = 0.4 + p * (1.1 + i * 0.35);
        return (
          <mesh key={i} position={[(i - (count - 1) / 2) * 1.25, -1.6 + h / 2, 0]}>
            <boxGeometry args={[0.8, h, 0.8]} />
            <meshStandardMaterial color={colors[i % colors.length]} emissive={colors[i % colors.length]} emissiveIntensity={0.25} metalness={0.4} roughness={0.4} />
          </mesh>
        );
      })}
    </>
  );
};

// ---------- scenes ----------
export const TitleSceneV2: React.FC<{ audio: string; caption: string; dur: number }> = ({ audio, caption, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badge = fadeUp(frame, 0, fps);
  const big = fadeUp(frame, 8, fps);
  const sub = fadeUp(frame, 26, fps);
  const foot = fadeUp(frame, 44, fps);
  const ring = interpolate(frame, [0, 70], [0, 1], { extrapolateRight: "clamp" });
  const ul = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 8% 12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <RingDraw progress={ring} size={520} />
      <div style={{ ...badge, fontFamily: BV, fontWeight: 700, letterSpacing: 6, fontSize: 22, color: nq57.colors.gold }}>BỘ CHÍNH TRỊ · 22/12/2024</div>
      <EmblemBox size={430} />
      <div style={{ ...big, fontFamily: BV, fontWeight: 800, fontSize: 150, lineHeight: 1, marginTop: -10,
        background: `linear-gradient(90deg, ${nq57.colors.red}, ${nq57.colors.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        NGHỊ QUYẾT 57
      </div>
      <div style={{ ...sub, fontFamily: BV, fontWeight: 600, fontSize: 34, color: nq57.colors.ink, textAlign: "center", maxWidth: "72%", marginTop: 14 }}>
        Đột phá phát triển Khoa học – Công nghệ – Đổi mới sáng tạo & Chuyển đổi số quốc gia
      </div>
      <UnderlineDraw progress={ul} width={460} />
      <div style={{ ...foot, fontFamily: BV, fontWeight: 500, fontSize: 24, color: nq57.colors.muted, marginTop: 14 }}>Kỷ nguyên vươn mình của Dân tộc</div>
      <KaraokeCaption text={caption} dur={dur} />
    </AbsoluteFill>
  );
};

export const QuoteSceneV2: React.FC<{ audio: string; caption: string; dur: number }> = ({ audio, caption, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = fadeUp(frame, 0, fps);
  const ul = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 9% 12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ position: "absolute", top: "12%", left: "9%", fontFamily: BV, fontWeight: 800, fontSize: 200, color: "rgba(226,59,59,0.16)" }}>“</div>
      <div style={{ ...q, fontFamily: BV, fontWeight: 700, fontSize: 60, lineHeight: 1.35, color: nq57.colors.ink, textAlign: "center", maxWidth: "80%" }}>
        Là <span style={{ color: nq57.colors.gold }}>đột phá quan trọng hàng đầu</span>, là{" "}
        <span style={{ color: nq57.colors.teal }}>động lực chính</span> để đưa đất nước bứt phá trong kỷ nguyên mới.
      </div>
      <UnderlineDraw progress={ul} width={520} color={nq57.colors.teal} />
      <KaraokeCaption text={caption} dur={dur} />
    </AbsoluteFill>
  );
};

export const RolesSceneV2: React.FC<{ audio: string; caption: string; dur: number }> = ({ audio, caption, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const roles = [
    { t: "Người dân & Doanh nghiệp", s: "Trung tâm · Chủ thể · Động lực chính", c: nq57.colors.gold },
    { t: "Nhà khoa học", s: "Nhân tố then chốt", c: nq57.colors.teal },
    { t: "Nhà nước", s: "Dẫn dắt · Kiến tạo", c: nq57.colors.red },
  ];
  return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 7% 12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ fontFamily: BV, fontWeight: 700, letterSpacing: 4, fontSize: 26, color: nq57.colors.muted, marginBottom: 30 }}>BA CHỦ THỂ</div>
      <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {roles.map((r, i) => {
          const e = fadeUp(frame, 10 + i * 14, fps);
          return (
            <div key={i} style={{ ...e, width: 420, background: nq57.colors.card, border: `1px solid ${nq57.colors.line}`, borderRadius: 24, padding: "40px 34px", textAlign: "center", boxShadow: "0 30px 60px -24px rgba(0,0,0,.55)" }}>
              <div style={{ width: 86, height: 86, borderRadius: 999, margin: "0 auto 22px", border: `3px solid ${r.c}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BV, fontWeight: 800, fontSize: 40, color: r.c }}>{i + 1}</div>
              <div style={{ fontFamily: BV, fontWeight: 700, fontSize: 34, color: nq57.colors.ink }}>{r.t}</div>
              <div style={{ fontFamily: BV, fontWeight: 500, fontSize: 22, color: nq57.colors.muted, marginTop: 10 }}>{r.s}</div>
            </div>
          );
        })}
      </div>
      <div style={{ width: 1100, marginTop: 24 }}>
        <DataFlow width={1100} color={nq57.colors.gold} />
      </div>
      <KaraokeCaption text={caption} dur={dur} />
    </AbsoluteFill>
  );
};

const PILLARS = ["Thể chế", "Nhân lực", "Hạ tầng", "Dữ liệu", "Công nghệ chiến lược"];
export const PillarsSceneV2: React.FC<{ audio: string; caption: string; dur: number }> = ({ audio, caption, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ul = interpolate(frame, [16, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 5% 12%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ fontFamily: BV, fontWeight: 800, fontSize: 50, color: nq57.colors.ink, marginTop: 16 }}>Năm trụ cột cốt lõi</div>
      <div style={{ fontFamily: BV, fontWeight: 500, fontSize: 26, color: nq57.colors.gold, marginBottom: 6 }}>Thể chế là điều kiện tiên quyết — đi trước một bước</div>
      <UnderlineDraw progress={ul} width={420} />
      <div style={{ width: "70%", height: 500, marginTop: 6 }}>
        <Sequence layout="none">
          <ThreeCanvas width={Math.round(1920 * 0.7)} height={500} camera={{ position: [0, 1.2, 7], fov: 42 }}>
            <Bars3D count={PILLARS.length} />
          </ThreeCanvas>
        </Sequence>
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 6 }}>
        {PILLARS.map((p, i) => {
          const e = fadeUp(frame, 20 + i * 8, fps);
          const c = [nq57.colors.red, nq57.colors.gold, nq57.colors.teal, nq57.colors.gold, nq57.colors.red][i];
          return (
            <div key={i} style={{ ...e, width: 200, textAlign: "center", fontFamily: BV, fontWeight: 600, fontSize: 22, color: nq57.colors.ink }}>
              <span style={{ color: c, fontWeight: 800, marginRight: 6 }}>{i + 1}.</span>
              {p}
            </div>
          );
        })}
      </div>
      <KaraokeCaption text={caption} dur={dur} />
    </AbsoluteFill>
  );
};

const GDP_DATA = [
  { year: "2024", v: 18 }, { year: "2025", v: 20 }, { year: "2026", v: 22 },
  { year: "2027", v: 24 }, { year: "2028", v: 26 }, { year: "2029", v: 28 }, { year: "2030", v: 30 },
];
const GAUGES = [
  { value: 30, max: 100, label: "Quy mô kinh tế số (% GDP)", unit: "%", c: nq57.colors.gold },
  { value: 80, max: 100, label: "Dịch vụ công trực tuyến", unit: "%", c: nq57.colors.teal },
  { value: 3, max: 10, label: "ASEAN về Trí tuệ nhân tạo", unit: " Top", c: nq57.colors.red },
];
export const StatsSceneV2: React.FC<{ audio: string; caption: string; dur: number }> = ({ audio, caption, dur }) => {
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
                <stop offset="0%" stopColor={nq57.colors.gold} stopOpacity={0.8} />
                <stop offset="100%" stopColor={nq57.colors.gold} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 8" stroke={nq57.colors.line} vertical={false} />
            <XAxis dataKey="year" tick={{ fill: nq57.colors.muted, fontFamily: BV, fontSize: 15 }} axisLine={{ stroke: nq57.colors.line }} tickLine={false} />
            <YAxis tick={{ fill: nq57.colors.muted, fontFamily: BV, fontSize: 13 }} axisLine={false} tickLine={false} unit="%" width={40} />
            <Area type="monotone" dataKey="v" stroke={nq57.colors.gold} strokeWidth={3} fill="url(#gdp)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ width: 980, marginBottom: 10 }}>
        <DataFlow width={980} />
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {GAUGES.map((g, i) => {
          const e = fadeUp(frame, 16 + i * 10, fps);
          return (
            <div key={i} style={{ ...e }}>
              <Gauge value={g.value} max={g.max} label={g.label} unit={g.unit} color={g.c} progress={gp} />
            </div>
          );
        })}
      </div>
      <KaraokeCaption text={caption} dur={dur} />
    </AbsoluteFill>
  );
};

export const VisionSceneV2: React.FC<{ audio: string; caption: string; dur: number }> = ({ audio, caption, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = fadeUp(frame, 0, fps);
  const ring = interpolate(frame, [10, 70], [0, 1], { extrapolateRight: "clamp" });
  const p = spring({ frame, fps, config: { damping: 16, mass: 0.9 } });
  const val = Math.round(interpolate(p, [0, 1], [0, 50]));
  return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", paddingBottom: "12%" }}>
        <Backdrop />
        <Audio src={staticFile(audio)} />
        <div style={{ position: "relative" }}>
          <RingDraw progress={ring} size={460} color={nq57.colors.red} />
        <div style={{ ...e, textAlign: "center", padding: "0 6%" }}>
          <div style={{ fontFamily: BV, fontWeight: 700, letterSpacing: 8, fontSize: 30, color: nq57.colors.gold }}>TẦM NHÌN 2045</div>
          <div style={{ fontFamily: BV, fontWeight: 800, fontSize: 168, lineHeight: 1, margin: "6px 0",
            background: `linear-gradient(90deg, ${nq57.colors.red}, ${nq57.colors.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{val}%</div>
        </div>
      </div>
      <div style={{ fontFamily: BV, fontWeight: 600, fontSize: 38, color: nq57.colors.ink, marginTop: 10 }}>Kinh tế số · Nước phát triển, thu nhập cao</div>
      <div style={{ fontFamily: BV, fontWeight: 500, fontSize: 26, color: nq57.colors.muted, marginTop: 10 }}>Top 30 thế giới về đổi mới sáng tạo & chuyển đổi số</div>
      <KaraokeCaption text={caption} dur={dur} />
    </AbsoluteFill>
  );
};

export const EndSceneV2: React.FC<{ audio: string; caption: string; dur: number }> = ({ audio, caption, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = fadeUp(frame, 0, fps);
  const ring = interpolate(frame, [0, 70], [0, 1], { extrapolateRight: "clamp" });
  return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", paddingBottom: "12%" }}>
        <Backdrop />
        <Audio src={staticFile(audio)} />
        <div style={{ position: "relative" }}>
          <RingDraw progress={ring} size={420} />
        <EmblemBox size={360} />
      </div>
      <div style={{ ...e, textAlign: "center", padding: "0 8%", marginTop: -10 }}>
        <div style={{ fontFamily: BV, fontWeight: 800, fontSize: 82, lineHeight: 1.15,
          background: `linear-gradient(90deg, ${nq57.colors.red}, ${nq57.colors.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Kỷ nguyên vươn mình</div>
        <div style={{ fontFamily: BV, fontWeight: 600, fontSize: 38, color: nq57.colors.ink, marginTop: 18 }}>Hành động hôm nay — Việt Nam hùng cường ngày mai</div>
        <div style={{ fontFamily: BV, fontWeight: 700, letterSpacing: 4, fontSize: 24, color: nq57.colors.muted, marginTop: 34 }}>NGHỊ QUYẾT 57-NQ/TW</div>
      </div>
      <KaraokeCaption text={caption} dur={dur} />
    </AbsoluteFill>
  );
};
