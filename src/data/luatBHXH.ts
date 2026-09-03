// ---------------------------------------------------------------------------
// Luật Bảo hiểm xã hội 2024 — Content Data (Blueprint template)
//
// Real production demonstrating the Blueprint template. Topic: Luật Bảo
// hiểm xã hội số 41/2024/QH15, thông qua 29/6/2024, có hiệu lực 01/07/2025.
//
// Facts verified against: Cổng TTĐT Chính phủ (xaydungchinhsach.chinhphu.vn),
// Báo Nhân Dân, Cổng TTĐT BHXH Việt Nam (baohiemxahoi.gov.vn) — August 2026.
// No fabricated figures. Every number below traces to Điều 64 (pension
// qualifying period), Điều 21/23 (social pension tier), and Điều 70 (lump-sum
// withdrawal conditions) of the law as reported by the sources above.
//
// dur values are estimated from narration word count (~2.4 words/sec,
// Vietnamese TTS pace) as placeholders. gen_tts_luatBHXH.py overwrites these
// with real measured durations once narration audio is generated — see
// README "Sinh giọng đọc (TTS)".
// ---------------------------------------------------------------------------

export const FPS = 30;
export const TAIL = 0.5;
export const sceneFrames = (dur: number) => Math.ceil((dur + TAIL) * FPS);

// ─── SceneDef — base scene metadata (audio, caption, duration) ────────────

export interface SceneDef {
  id: string;
  audio: string;
  caption: string;
  dur: number;
}

// ─── Blueprint Content Types — scene-specific content ──────────────────────

export interface BlueprintTitleContent {
  kind: "title";
  code: string;
  title: string;
  subtitle: string;
  effectiveDate: string;
}

export interface BlueprintPillarsContent {
  kind: "pillars";
  heading: string;
  pillars: { title: string; body: string }[];
}

export interface BlueprintMeasureContent {
  kind: "measure";
  heading: string;
  fromLabel: string;
  fromValue: string;
  toLabel: string;
  toValue: string;
  unit: string;
  note: string;
}

export interface BlueprintDetailContent {
  kind: "detail";
  heading: string;
  items: string[];
}

export interface BlueprintProcessContent {
  kind: "process";
  heading: string;
  steps: { date: string; label: string }[];
}

export interface BlueprintSealContent {
  kind: "seal";
  heading: string;
  lines: string[];
  closingCode: string;
}

export type BlueprintSceneContent =
  | BlueprintTitleContent
  | BlueprintPillarsContent
  | BlueprintMeasureContent
  | BlueprintDetailContent
  | BlueprintProcessContent
  | BlueprintSealContent;

// kept for reference by callers that want the ordered kind list
export const BLUEPRINT_SCENE_KINDS = [
  "title",
  "pillars",
  "measure",
  "detail",
  "process",
  "seal",
] as const;

// ─── Scenes (order + audio + narration + duration) ─────────────────────────

export const LUAT_BHXH_SCENES: SceneDef[] = [
  {
    id: "s1",
    audio: "luatBHXH/s1.mp3",
    caption:
      "Ngày 29 tháng 6 năm 2024, Quốc hội thông qua Luật Bảo hiểm xã hội số 41/2024/QH15. Đạo luật có hiệu lực từ ngày 1 tháng 7 năm 2025, thay thế Luật Bảo hiểm xã hội năm 2014.",
    dur: 17.204,
  },
  {
    id: "s2",
    audio: "luatBHXH/s2.mp3",
    caption:
      "Luật mới xây dựng trên bốn trụ cột cải cách: hệ thống an sinh đa tầng, mở rộng đối tượng tham gia, siết chặt điều kiện rút bảo hiểm một lần, và mở rộng quyền lợi cho người lao động.",
    dur: 11.132,
  },
  {
    id: "s3",
    audio: "luatBHXH/s3.mp3",
    caption:
      "Theo Điều 64, số năm đóng bảo hiểm xã hội tối thiểu để hưởng lương hưu giảm từ hai mươi năm xuống còn mười lăm năm, mở rộng cơ hội cho người có thời gian đóng ngắn hơn.",
    dur: 10.292,
  },
  {
    id: "s4",
    audio: "luatBHXH/s4.mp3",
    caption:
      "Từ ngày 1 tháng 7 năm 2025, người bắt đầu tham gia bảo hiểm xã hội chỉ được rút một lần trong một số trường hợp cụ thể: đủ tuổi hưu nhưng chưa đủ mười lăm năm đóng, ra nước ngoài định cư, hoặc mắc bệnh hiểm nghèo theo quy định.",
    dur: 14.036,
  },
  {
    id: "s5",
    audio: "luatBHXH/s5.mp3",
    caption:
      "Hành trình cải cách bắt đầu từ Nghị quyết 28 năm 2018 của Trung ương Đảng, qua việc Quốc hội thông qua luật vào tháng 6 năm 2024, và chính thức có hiệu lực từ ngày 1 tháng 7 năm 2025.",
    dur: 13.7,
  },
  {
    id: "s6",
    audio: "luatBHXH/s6.mp3",
    caption:
      "Luật Bảo hiểm xã hội 2024 đặt nền móng cho một hệ thống an sinh xã hội bền vững và bao trùm hơn cho người lao động Việt Nam.",
    dur: 8.612,
  },
];

// ─── Content (keyed by scene id) ────────────────────────────────────────────

export const LUAT_BHXH_CONTENT: Record<string, BlueprintSceneContent> = {
  s1: {
    kind: "title",
    code: "41/2024/QH15",
    title: "LUẬT BẢO HIỂM\nXÃ HỘI 2024",
    subtitle: "11 chương — 141 điều",
    effectiveDate: "HIỆU LỰC 01/07/2025",
  },
  s2: {
    kind: "pillars",
    heading: "BỐN TRỤ CỘT CẢI CÁCH",
    pillars: [
      {
        title: "Đa tầng an sinh",
        body: "Bổ sung trợ cấp hưu trí xã hội cho người cao tuổi chưa đủ điều kiện hưởng lương hưu.",
      },
      {
        title: "Mở rộng đối tượng",
        body: "Thêm lao động không trọn thời gian, chủ hộ kinh doanh vào diện đóng bảo hiểm bắt buộc.",
      },
      {
        title: "Siết rút một lần",
        body: "Thu hẹp các trường hợp được rút bảo hiểm xã hội một lần để giữ an sinh lâu dài.",
      },
      {
        title: "Bảo vệ người lao động",
        body: "Bổ sung chế độ ốm đau, thai sản cho bảo hiểm tự nguyện và cán bộ không chuyên trách.",
      },
    ],
  },
  s3: {
    kind: "measure",
    heading: "ĐIỀU KIỆN HƯỞNG LƯƠNG HƯU · ĐIỀU 64",
    fromLabel: "TRƯỚC ĐÂY",
    fromValue: "20",
    toLabel: "TỪ 01/07/2025",
    toValue: "15",
    unit: "NĂM ĐÓNG BHXH TỐI THIỂU",
    note: "Số năm đóng bảo hiểm xã hội tối thiểu để đủ điều kiện hưởng lương hưu.",
  },
  s4: {
    kind: "detail",
    heading: "ĐIỀU KIỆN RÚT BHXH MỘT LẦN · ĐIỀU 70",
    items: [
      "Đủ tuổi hưu nhưng chưa đủ 15 năm đóng BHXH",
      "Ra nước ngoài để định cư",
      "Mắc bệnh hiểm nghèo theo quy định",
      "Suy giảm khả năng lao động từ 81% trở lên",
    ],
  },
  s5: {
    kind: "process",
    heading: "LỘ TRÌNH BAN HÀNH",
    steps: [
      { date: "23/05/2018", label: "Nghị quyết 28-NQ/TW về định hướng cải cách BHXH" },
      { date: "29/06/2024", label: "Quốc hội khóa XV thông qua Luật BHXH 2024" },
      { date: "01/07/2025", label: "Luật chính thức có hiệu lực thi hành" },
    ],
  },
  s6: {
    kind: "seal",
    heading: "AN SINH BỀN VỮNG HƠN",
    lines: ["LUẬT BẢO HIỂM XÃ HỘI 2024", "SỐ 41/2024/QH15"],
    closingCode: "01/07/2025",
  },
};
