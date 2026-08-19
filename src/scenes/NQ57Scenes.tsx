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
import { nq57 } from "../theme-nq57";

// ---------- shared bits ----------

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
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 120% at 50% 0%, #131b30 0%, #0a0e1a 55%, #070a12 100%)",
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 40% at ${x1}% ${y1}%, rgba(226,59,59,0.22), transparent 70%)`,
          opacity: a,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(45% 45% at 80% 85%, rgba(243,201,105,0.16), transparent 70%)`,
          opacity: a,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.5,
          maskImage: "radial-gradient(80% 80% at 50% 50%, black, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = interpolate(frame, [6, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "4.5%" }}>
      <div
        style={{
          maxWidth: "82%",
          textAlign: "center",
          fontFamily: nq57.fonts.body,
          fontWeight: 500,
          fontSize: 30,
          lineHeight: 1.45,
          color: nq57.colors.ink,
          background: "rgba(5,8,16,0.66)",
          border: `1px solid ${nq57.colors.line}`,
          borderRadius: 18,
          padding: "16px 30px",
          backdropFilter: "blur(8px)",
          opacity: op,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// ---------- scenes ----------

export const TitleScene: React.FC<{ audio: string; caption: string }> = ({ audio, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badge = fadeUp(frame, 0, fps);
  const big = fadeUp(frame, 8, fps);
  const sub = fadeUp(frame, 26, fps);
  const foot = fadeUp(frame, 44, fps);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 8%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ ...badge, fontFamily: nq57.fonts.body, fontWeight: 700, letterSpacing: 6, fontSize: 24, color: nq57.colors.gold }}>
        BỘ CHÍNH TRỊ · 22/12/2024
      </div>
      <div style={{ ...big, fontFamily: nq57.fonts.display, fontWeight: 800, fontSize: 200, lineHeight: 1, marginTop: 12,
        background: `linear-gradient(90deg, ${nq57.colors.red}, ${nq57.colors.gold})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        NGHỊ QUYẾT 57
      </div>
      <div style={{ ...sub, fontFamily: nq57.fonts.body, fontWeight: 600, fontSize: 40, color: nq57.colors.ink, textAlign: "center", maxWidth: "70%", marginTop: 18 }}>
        Đột phá phát triển Khoa học – Công nghệ – Đổi mới sáng tạo & Chuyển đổi số quốc gia
      </div>
      <div style={{ ...foot, fontFamily: nq57.fonts.body, fontWeight: 500, fontSize: 26, color: nq57.colors.muted, marginTop: 22 }}>
        Kỷ nguyên vươn mình của Dân tộc
      </div>
      <Caption text={caption} />
    </AbsoluteFill>
  );
};

export const QuoteScene: React.FC<{ audio: string; caption: string }> = ({ audio, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = fadeUp(frame, 0, fps);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 9%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ position: "absolute", top: "14%", left: "10%", fontFamily: nq57.fonts.display, fontWeight: 800, fontSize: 220, color: "rgba(226,59,59,0.18)" }}>“</div>
      <div style={{ ...q, fontFamily: nq57.fonts.display, fontWeight: 700, fontSize: 62, lineHeight: 1.35, color: nq57.colors.ink, textAlign: "center", maxWidth: "78%" }}>
        Là <span style={{ color: nq57.colors.gold }}>đột phá quan trọng hàng đầu</span>, là{" "}
        <span style={{ color: nq57.colors.teal }}>động lực chính</span> để đưa đất nước bứt phá trong kỷ nguyên mới.
      </div>
      <Caption text={caption} />
    </AbsoluteFill>
  );
};

export const RolesScene: React.FC<{ audio: string; caption: string }> = ({ audio, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const roles = [
    { t: "Người dân & Doanh nghiệp", s: "Trung tâm · Chủ thể · Động lực chính", c: nq57.colors.gold },
    { t: "Nhà khoa học", s: "Nhân tố then chốt", c: nq57.colors.teal },
    { t: "Nhà nước", s: "Dẫn dắt · Kiến tạo", c: nq57.colors.red },
  ];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 7%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ fontFamily: nq57.fonts.body, fontWeight: 700, letterSpacing: 4, fontSize: 26, color: nq57.colors.muted, marginBottom: 36 }}>
        BA CHỦ THỂ
      </div>
      <div style={{ display: "flex", gap: 36 }}>
        {roles.map((r, i) => {
          const e = fadeUp(frame, 10 + i * 14, fps);
          return (
            <div key={i} style={{ ...e, width: 460, background: nq57.colors.card, border: `1px solid ${nq57.colors.line}`, borderRadius: 24, padding: "40px 34px", textAlign: "center", boxShadow: "0 30px 60px -24px rgba(0,0,0,.55)" }}>
              <div style={{ width: 86, height: 86, borderRadius: 999, margin: "0 auto 22px", border: `3px solid ${r.c}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: nq57.fonts.display, fontWeight: 800, fontSize: 40, color: r.c }}>
                {i + 1}
              </div>
              <div style={{ fontFamily: nq57.fonts.display, fontWeight: 700, fontSize: 36, color: nq57.colors.ink }}>{r.t}</div>
              <div style={{ fontFamily: nq57.fonts.body, fontWeight: 500, fontSize: 24, color: nq57.colors.muted, marginTop: 10 }}>{r.s}</div>
            </div>
          );
        })}
      </div>
      <Caption text={caption} />
    </AbsoluteFill>
  );
};

const PILLARS = ["Thể chế", "Nhân lực", "Hạ tầng", "Dữ liệu", "Công nghệ chiến lược"];
export const PillarsScene: React.FC<{ audio: string; caption: string }> = ({ audio, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 5%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ fontFamily: nq57.fonts.display, fontWeight: 800, fontSize: 52, color: nq57.colors.ink, marginBottom: 14, textAlign: "center" }}>
        Năm trụ cột cốt lõi
      </div>
      <div style={{ fontFamily: nq57.fonts.body, fontWeight: 500, fontSize: 26, color: nq57.colors.gold, marginBottom: 44 }}>
        Thể chế là điều kiện tiên quyết — đi trước một bước
      </div>
      <div style={{ display: "flex", gap: 22, alignItems: "stretch" }}>
        {PILLARS.map((p, i) => {
          const e = fadeUp(frame, 12 + i * 10, fps);
          const c = [nq57.colors.red, nq57.colors.gold, nq57.colors.teal, nq57.colors.gold, nq57.colors.red][i];
          return (
            <div key={i} style={{ ...e, flex: 1, minWidth: 300, background: nq57.colors.card, border: `1px solid ${nq57.colors.line}`, borderTop: `4px solid ${c}`, borderRadius: 20, padding: "34px 22px", textAlign: "center" }}>
              <div style={{ fontFamily: nq57.fonts.display, fontWeight: 800, fontSize: 46, color: c }}>{i + 1}</div>
              <div style={{ fontFamily: nq57.fonts.body, fontWeight: 600, fontSize: 26, color: nq57.colors.ink, marginTop: 14, lineHeight: 1.3 }}>{p}</div>
            </div>
          );
        })}
      </div>
      <Caption text={caption} />
    </AbsoluteFill>
  );
};

const STATS = [
  { v: 30, unit: "% GDP", l: "Quy mô kinh tế số", c: nq57.colors.gold },
  { v: 80, unit: "%+", l: "Dịch vụ công trực tuyến", c: nq57.colors.teal },
  { v: 3, unit: "Top", l: "ASEAN về Trí tuệ nhân tạo", c: nq57.colors.red },
];
export const StatsScene: React.FC<{ audio: string; caption: string }> = ({ audio, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 6%" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ fontFamily: nq57.fonts.display, fontWeight: 800, fontSize: 54, color: nq57.colors.ink, marginBottom: 40 }}>
        Mục tiêu 2030
      </div>
      <div style={{ display: "flex", gap: 30 }}>
        {STATS.map((s, i) => {
          const e = fadeUp(frame, 10 + i * 12, fps);
          const p = spring({ frame: frame - (10 + i * 12), fps, config: { damping: 16, mass: 0.8 } });
          const val = Math.round(interpolate(p, [0, 1], [0, s.v]));
          return (
            <div key={i} style={{ ...e, width: 480, background: nq57.colors.card, border: `1px solid ${nq57.colors.line}`, borderRadius: 24, padding: "44px 30px", textAlign: "center" }}>
              <div style={{ fontFamily: nq57.fonts.display, fontWeight: 800, fontSize: 110, lineHeight: 1, color: s.c }}>
                {val}
                <span style={{ fontSize: 46, marginLeft: 6 }}>{s.unit}</span>
              </div>
              <div style={{ fontFamily: nq57.fonts.body, fontWeight: 600, fontSize: 28, color: nq57.colors.ink, marginTop: 18 }}>{s.l}</div>
            </div>
          );
        })}
      </div>
      <Caption text={caption} />
    </AbsoluteFill>
  );
};

export const VisionScene: React.FC<{ audio: string; caption: string }> = ({ audio, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = fadeUp(frame, 0, fps);
  const p = spring({ frame, fps, config: { damping: 16, mass: 0.9 } });
  const val = Math.round(interpolate(p, [0, 1], [0, 50]));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ ...e, textAlign: "center" }}>
        <div style={{ fontFamily: nq57.fonts.body, fontWeight: 700, letterSpacing: 8, fontSize: 30, color: nq57.colors.gold }}>TẦM NHÌN 2045</div>
        <div style={{ fontFamily: nq57.fonts.display, fontWeight: 800, fontSize: 220, lineHeight: 1, margin: "10px 0",
          background: `linear-gradient(90deg, ${nq57.colors.red}, ${nq57.colors.gold})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {val}%
        </div>
        <div style={{ fontFamily: nq57.fonts.body, fontWeight: 600, fontSize: 40, color: nq57.colors.ink }}>
          Kinh tế số · Nước phát triển, thu nhập cao
        </div>
        <div style={{ fontFamily: nq57.fonts.body, fontWeight: 500, fontSize: 28, color: nq57.colors.muted, marginTop: 12 }}>
          Top 30 thế giới về đổi mới sáng tạo & chuyển đổi số
        </div>
      </div>
      <Caption text={caption} />
    </AbsoluteFill>
  );
};

export const EndScene: React.FC<{ audio: string; caption: string }> = ({ audio, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = fadeUp(frame, 0, fps);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <Backdrop />
      <Audio src={staticFile(audio)} />
      <div style={{ ...e, textAlign: "center", padding: "0 8%" }}>
        <div style={{ fontFamily: nq57.fonts.display, fontWeight: 800, fontSize: 90, lineHeight: 1.15,
          background: `linear-gradient(90deg, ${nq57.colors.red}, ${nq57.colors.gold})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Kỷ nguyên vươn mình
        </div>
        <div style={{ fontFamily: nq57.fonts.body, fontWeight: 600, fontSize: 44, color: nq57.colors.ink, marginTop: 22 }}>
          Hành động hôm nay — Việt Nam hùng cường ngày mai
        </div>
        <div style={{ fontFamily: nq57.fonts.body, fontWeight: 700, letterSpacing: 4, fontSize: 24, color: nq57.colors.muted, marginTop: 40 }}>
          NGHỊ QUYẾT 57-NQ/TW
        </div>
      </div>
      <Caption text={caption} />
    </AbsoluteFill>
  );
};
