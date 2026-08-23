// ---------------------------------------------------------------------------
// NQ57 Content Data
//
// All visual content for NQ57 scenes. No colors, no fonts, no positions.
// Scene components consume this data and handle presentation.
// ---------------------------------------------------------------------------

export { FPS, TAIL, sceneFrames } from "./contract";
import type { SceneDef } from "./contract";
export type { SceneDef } from "./contract";

// ---------------------------------------------------------------------------
// NQ57 Content Types — scene-specific content (no presentation)
// ---------------------------------------------------------------------------

export interface NQ57TitleContent {
  kind: "title";
  badge: string;
  title: string;
  subtitle: string;
  tagline: string;
}

export interface NQ57QuoteContent {
  kind: "quote";
  text: string;
  keyPhrases: string[];
}

export interface NQ57RolesContent {
  kind: "roles";
  sectionTitle: string;
  roles: { title: string; subtitle: string }[];
}

export interface NQ57PillarsContent {
  kind: "pillars";
  title: string;
  subtitle: string;
  pillars: string[];
}

export interface NQ57StatsContent {
  kind: "stats";
  title: string;
  chartData: { label: string; value: number }[];
  gauges: { value: number; max: number; label: string; unit: string }[];
}

export interface NQ57VisionContent {
  kind: "vision";
  label: string;
  targetValue: number;
  subtitle: string;
  description: string;
}

export interface NQ57EndContent {
  kind: "end";
  title: string;
  subtitle: string;
  reference: string;
}

export type NQ57SceneContent =
  | NQ57TitleContent
  | NQ57QuoteContent
  | NQ57RolesContent
  | NQ57PillarsContent
  | NQ57StatsContent
  | NQ57VisionContent
  | NQ57EndContent;

// ---------------------------------------------------------------------------
// NQ57 Content — all scene content, keyed by scene ID
// ---------------------------------------------------------------------------

export const NQ57_CONTENT: Record<string, NQ57SceneContent> = {
  s1: {
    kind: "title",
    badge: "BỘ CHÍNH TRỊ · 22/12/2024",
    title: "NGHỊ QUYẾT 57",
    subtitle: "Đột phá phát triển Khoa học – Công nghệ – Đổi mới sáng tạo & Chuyển đổi số quốc gia",
    tagline: "Kỷ nguyên vươn mình của Dân tộc",
  },

  s2: {
    kind: "quote",
    text: "Là đột phá quan trọng hàng đầu, là động lực chính để đưa đất nước bứt phá trong kỷ nguyên mới.",
    keyPhrases: ["đột phá quan trọng hàng đầu", "động lực chính"],
  },

  s3: {
    kind: "roles",
    sectionTitle: "BA CHỦ THỂ",
    roles: [
      { title: "Người dân & Doanh nghiệp", subtitle: "Trung tâm · Chủ thể · Động lực chính" },
      { title: "Nhà khoa học", subtitle: "Nhân tố then chốt" },
      { title: "Nhà nước", subtitle: "Dẫn dắt · Kiến tạo" },
    ],
  },

  s4: {
    kind: "pillars",
    title: "Năm trụ cột cốt lõi",
    subtitle: "Thể chế là điều kiện tiên quyết — đi trước một bước",
    pillars: ["Thể chế", "Nhân lực", "Hạ tầng", "Dữ liệu", "Công nghệ chiến lược"],
  },

  s5: {
    kind: "stats",
    title: "Mục tiêu 2030",
    chartData: [
      { label: "2024", value: 18 },
      { label: "2025", value: 20 },
      { label: "2026", value: 22 },
      { label: "2027", value: 24 },
      { label: "2028", value: 26 },
      { label: "2029", value: 28 },
      { label: "2030", value: 30 },
    ],
    gauges: [
      { value: 30, max: 100, label: "Quy mô kinh tế số (% GDP)", unit: "%" },
      { value: 80, max: 100, label: "Dịch vụ công trực tuyến", unit: "%" },
      { value: 3, max: 10, label: "ASEAN về Trí tuệ nhân tạo", unit: " Top" },
    ],
  },

  s6: {
    kind: "vision",
    label: "TẦM NHÌN 2045",
    targetValue: 50,
    subtitle: "Kinh tế số · Nước phát triển, thu nhập cao",
    description: "Top 30 thế giới về đổi mới sáng tạo & chuyển đổi số",
  },

  s7: {
    kind: "end",
    title: "Kỷ nguyên vươn mình",
    subtitle: "Hành động hôm nay — Việt Nam hùng cường ngày mai",
    reference: "NGHỊ QUYẾT 57-NQ/TW",
  },
};

// ---------------------------------------------------------------------------
// Scene definitions — ordered scene list with audio + timing
// ---------------------------------------------------------------------------

export const SCENES: SceneDef[] = [
  {
    id: "s1",
    audio: "nq57/s1.mp3",
    caption: `MC: Chào bạn. Hôm nay chúng ta cùng giải mã một văn kiện đang làm thay đổi cuộc chơi: Nghị quyết 57 của Bộ Chính trị, ban hành ngày 22 tháng 12 năm 2024.
Chuyên gia: Đúng vậy. Đó là Nghị quyết về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia.`,
    dur: 20.232,
  },
  {
    id: "s2",
    audio: "nq57/s2.mp3",
    caption: `MC: Tại sao nó lại được gọi là đột phá?
Chuyên gia: Vì Nghị quyết xác định đây là đột phá quan trọng hàng đầu, là động lực chính để đưa đất nước bứt phá trong kỷ nguyên mới.`,
    dur: 10.704,
  },
  {
    id: "s3",
    audio: "nq57/s3.mp3",
    caption: `MC: Vậy ai là người làm nên cuộc cách mạng này?
Chuyên gia: Người dân và doanh nghiệp là trung tâm, là chủ thể và động lực chính. Nhà khoa học là nhân tố then chốt. Và Nhà nước giữ vai trò dẫn dắt.`,
    dur: 14.616,
  },
  {
    id: "s4",
    audio: "nq57/s4.mp3",
    caption: `MC: Có những trụ cột nào?
Chuyên gia: Năm trụ cột cốt lõi: Thể chế, Nhân lực, Hạ tầng, Dữ liệu và Công nghệ chiến lược. Trong đó, thể chế là điều kiện tiên quyết, đi trước một bước.`,
    dur: 13.944,
  },
  {
    id: "s5",
    audio: "nq57/s5.mp3",
    caption: `MC: Đích đến cụ thể là gì?
Chuyên gia: Đến năm 2030, quy mô kinh tế số đạt tối thiểu 30% GDP. Trên 80% giao dịch với cơ quan nhà nước thực hiện trực tuyến. Và Việt Nam nằm trong nhóm 3 nước dẫn đầu Đông Nam Á về trí tuệ nhân tạo.`,
    dur: 18.408,
  },
  {
    id: "s6",
    audio: "nq57/s6.mp3",
    caption: `MC: Còn xa hơn, năm 2045?
Chuyên gia: Đến 2045, Việt Nam trở thành nước phát triển, thu nhập cao. Kinh tế số đạt tối thiểu 50% GDP, thuộc nhóm 30 nước dẫn đầu thế giới về đổi mới sáng tạo.`,
    dur: 17.088,
  },
  {
    id: "s7",
    audio: "nq57/s7.mp3",
    caption: `MC: Một tầm nhìn tham vọng.
Chuyên gia: Và nó chỉ thành hiện thực nếu chúng ta hành động ngay hôm nay.
MC: Nghị quyết 57 — khởi động kỷ nguyên vươn mình của dân tộc. Hành động hôm nay, để Việt Nam hùng cường ngày mai.`,
    dur: 15.624,
  },
];
