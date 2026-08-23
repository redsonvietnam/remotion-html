// ---------------------------------------------------------------------------
// CanCuoc Data — Luật Căn cước 2023
//
// Reuses the NQ57 template (scene kinds + components) with new, fact-checked
// Vietnamese content. Scene kinds mirror nq57.ts exactly so the existing
// NQ57Template renders without any new visual grammar.
//
// Facts (verified against official sources: Cổng TTĐT Chính phủ,
// Bộ Công an / Cục C06):
//   - Quốc hội khóa XV thông qua ngày 27/11/2023
//   - Có hiệu lực từ 01/07/2024, thay thế Luật Căn cước công dân 2014
//   - Đổi tên CCCD -> Căn cước; cấp từ đủ 14 tuổi, gắn chip điện tử
//   - Bỏ "quê quán", thay bằng "nơi đăng ký cư trú"
//   - Tích hợp thông tin (BHXH, GPLX...) theo yêu cầu
//   - Giữ nguyên số định danh cá nhân; Luật số 46/2023/QH15
// ---------------------------------------------------------------------------

import type { SceneDef, NQ57SceneContent } from "./nq57";
export { FPS, TAIL, sceneFrames } from "./nq57";

export const CAN_CUOC_CONTENT: Record<string, NQ57SceneContent> = {
  s1: {
    kind: "title",
    badge: "QUỐC HỘI KHÓA XV — 27/11/2023",
    title: "LUẬT CĂN CƯỚC",
    subtitle: "Thay thế Luật Căn cước công dân 2014 — có hiệu lực từ 01/07/2024",
    tagline: "Định danh số cho mọi công dân",
  },

  s2: {
    kind: "quote",
    text: "Luật Căn cước là nền tảng định danh điện tử của công dân, phục vụ chuyển đổi số quốc gia và đơn giản hóa thủ tục hành chính.",
    keyPhrases: ["định danh điện tử", "chuyển đổi số quốc gia"],
  },

  s3: {
    kind: "roles",
    sectionTitle: "BA NHÓM CHỊU TÁC ĐỘNG",
    roles: [
      { title: "Người dân", subtitle: "Trung tâm — chủ thể được phục vụ" },
      { title: "Bộ Công an / C06", subtitle: "Cấp và quản lý căn cước" },
      { title: "Cơ quan, tổ chức, doanh nghiệp", subtitle: "Khai thác dữ liệu phục vụ dịch vụ" },
    ],
  },

  s4: {
    kind: "pillars",
    title: "NĂM ĐIỂM MỚI QUAN TRỌNG",
    subtitle: "Thay đổi thực chất so với Luật Căn cước công dân 2014",
    pillars: [
      "Đổi tên: Căn cước công dân thành Căn cước",
      "Cấp thẻ từ đủ 14 tuổi, gắn chip điện tử",
      "Bỏ 'quê quán', thay bằng nơi đăng ký cư trú",
      "Tích hợp thông tin (BHXH, GPLX…) theo yêu cầu",
      "Giữ nguyên số định danh cá nhân",
    ],
  },

  s5: {
    kind: "stats",
    title: "LỘ TRÌNH TRIỂN KHAI",
    chartData: [
      { label: "Thông qua", value: 20 },
      { label: "Có hiệu lực", value: 40 },
      { label: "Cấp thẻ", value: 60 },
      { label: "Tích hợp", value: 80 },
      { label: "Số hóa", value: 100 },
    ],
    gauges: [
      { value: 14, max: 100, label: "Tuổi được cấp thẻ", unit: "" },
      { value: 27, max: 100, label: "Thông qua 27/11/2023", unit: "" },
      { value: 100, max: 100, label: "Thẻ CCCD cũ vẫn có giá trị đến hết hạn", unit: "%" },
    ],
  },

  s6: {
    kind: "vision",
    label: "TẦM NHÌN",
    targetValue: 100,
    subtitle: "Hướng tới 100% dịch vụ công trực tuyến",
    description: "Căn cước là chìa khóa vào hệ sinh thái công dân số và xã hội số theo mục tiêu quốc gia.",
  },

  s7: {
    kind: "end",
    title: "CĂN CƯỚC SỐ — CÔNG DÂN SỐ",
    subtitle: "Hiểu đúng, dùng đúng, hưởng lợi thật từ chuyển đổi số",
    reference: "LUẬT SỐ 46/2023/QH15",
  },
};

export const CAN_CUOC_SCENES: SceneDef[] = [
  {
    id: "s1",
    audio: "canCuoc/s1.mp3",
    caption:
      "Chào bạn. Hôm nay chúng ta cùng tìm hiểu về Luật Căn cước 2023, được Quốc hội khóa XV thông qua ngày 27 tháng 11 năm 2023 và có hiệu lực từ ngày 1 tháng 7 năm 2024.",
    dur: 14.088,
  },
  {
    id: "s2",
    audio: "canCuoc/s2.mp3",
    caption:
      "Luật Căn cước là nền tảng định danh điện tử của công dân, phục vụ chuyển đổi số quốc gia và đơn giản hóa thủ tục hành chính.",
    dur: 7.2,
  },
  {
    id: "s3",
    audio: "canCuoc/s3.mp3",
    caption:
      "Ba nhóm chịu tác động chính. Một, người dân là trung tâm, là chủ thể được phục vụ. Hai, Bộ Công an và Cục Cảnh sát quản lý hành chính, gọi tắt là C06, cấp và quản lý căn cước. Ba, cơ quan, tổ chức và doanh nghiệp khai thác dữ liệu để cung cấp dịch vụ.",
    dur: 19.008,
  },
  {
    id: "s4",
    audio: "canCuoc/s4.mp3",
    caption:
      "Năm điểm mới quan trọng. Một, đổi tên từ Căn cước công dân thành Căn cước. Hai, cấp thẻ từ đủ 14 tuổi, có gắn chip điện tử. Ba, bỏ thông tin quê quán, thay bằng nơi đăng ký cư trú. Bốn, tích hợp thông tin như bảo hiểm, giấy phép lái xe theo yêu cầu. Năm, giữ nguyên số định danh cá nhân.",
    dur: 23.4,
  },
  {
    id: "s5",
    audio: "canCuoc/s5.mp3",
    caption:
      "Về lộ trình triển khai. Luật được thông qua cuối năm 2023, có hiệu lực từ 1 tháng 7 năm 2024, tiến tới cấp thẻ cho người dân, tích hợp dữ liệu và số hóa dịch vụ công.",
    dur: 13.032,
  },
  {
    id: "s6",
    audio: "canCuoc/s6.mp3",
    caption:
      "Tầm nhìn. Hướng tới một trăm phần trăm dịch vụ công trực tuyến, xây dựng công dân số và xã hội số theo mục tiêu quốc gia.",
    dur: 7.992,
  },
  {
    id: "s7",
    audio: "canCuoc/s7.mp3",
    caption:
      "Căn cước số, công dân số. Hiểu đúng, dùng đúng, để mỗi người dân đều hưởng lợi thật từ chuyển đổi số. Luật Căn cước 2023, số 46 trên 2023, QH15.",
    dur: 14.712,
  },
];
