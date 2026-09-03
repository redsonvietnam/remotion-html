// ---------------------------------------------------------------------------
// Solar System — Cosmos Template Production
//
// Content: The 8 planets of our solar system, their characteristics,
// orbital mechanics, and key facts.
// Template: cosmos (orbital paths, constellation lines, deep space)
// ---------------------------------------------------------------------------

import { sceneFrames } from "./contract";
import type { SceneDef } from "./contract";
import type { CosmosSceneContent } from "../templates/cosmos/types";

// Re-export sceneFrames for Root.tsx
export { sceneFrames };

// ─── Scenes ──────────────────────────────────────────────────────────────────

export const SOLAR_SYSTEM_SCENES: SceneDef[] = [
  { id: "s1", audio: "solarSystem/s1.mp3", caption: "Hệ mặt trời của chúng ta", dur: 6.672 },
  { id: "s2", audio: "solarSystem/s2.mp3", caption: "Sao Thủy — Hành tinh gần mặt trời nhất", dur: 9.72 },
  { id: "s3", audio: "solarSystem/s3.mp3", caption: "Sao Kim — Hành tinh nóng nhất", dur: 8.856 },
  { id: "s4", audio: "solarSystem/s4.mp3", caption: "Trái Đất — Hành tinh của sự sống", dur: 7.536 },
  { id: "s5", audio: "solarSystem/s5.mp3", caption: "Sao Hỏa — Hành tinh đỏ", dur: 6.648 },
  { id: "s6", audio: "solarSystem/s6.mp3", caption: "Sao Mộc — Hành tinh khổng lồ", dur: 8.784 },
  { id: "s7", audio: "solarSystem/s7.mp3", caption: "Sao Thổ — Hành tinh có vành đai", dur: 7.464 },
  { id: "s8", audio: "solarSystem/s8.mp3", caption: "Sao Thiên Vương và Sao Hải Vương", dur: 6.0 },
  { id: "s9", audio: "solarSystem/s9.mp3", caption: "Kết luận — Hệ mặt trời tuyệt đẹp", dur: 7.368 },
];

// ─── Content ─────────────────────────────────────────────────────────────────

export const SOLAR_SYSTEM_CONTENT: Record<string, CosmosSceneContent> = {
  s1: {
    kind: "title",
    title: "HỆ MẶT TRỜI",
    subtitle: "8 hành tinh, hàng trăm vệ tinh, và vô số bí ẩn",
    tagline: "KHÁM PHÁ VŨ TRỤ",
  },
  s2: {
    kind: "fact",
    label: "SAO THỦY",
    bigValue: "88",
    unit: "ngày Trái Đất",
    description: "Thời gian quay quanh mặt trời",
    detail: "Hành tinh nhỏ nhất và gần mặt trời nhất. Bề mặt có nhiệt độ cực đoan: -180°C ban đêm, 430°C ban ngày.",
  },
  s3: {
    kind: "compare",
    title: "SAO KIM vs TRÁI ĐẤT",
    left: { label: "SAO KIM", value: "462°C", color: "#ef4444" },
    right: { label: "TRÁI ĐẤT", value: "15°C", color: "#3b82f6" },
    insight: "Sao Kim nóng hơn Trái Đất 347°C do hiệu ứng nhà kính cực mạnh",
  },
  s4: {
    kind: "fact",
    label: "TRÁI ĐẤT",
    bigValue: "365.25",
    unit: "ngày",
    description: "Thời gian quay quanh mặt trời",
    detail: "Hành tinh duy nhất được biết có sự sống. Bao phủ 71% bởi nước lỏng.",
  },
  s5: {
    kind: "diagram",
    title: "HỆ THỐNG SAO HỎA",
    nodes: [
      { label: "SAO HỎA", sublabel: "Hành tinh đỏ", orbit: 100 },
      { label: "PHOBOS", sublabel: "Vệ tinh lớn", orbit: 200 },
      { label: "DEIMOS", sublabel: "Vệ tinh nhỏ", orbit: 280 },
    ],
    edges: [
      { from: 0, to: 1, label: "9,376 km" },
      { from: 0, to: 2, label: "23,460 km" },
    ],
  },
  s6: {
    kind: "timeline",
    title: "CÁC VỆ TINH CỦA SAO MỘC",
    items: [
      { label: "Io", value: "Núi lửa", year: "1610" },
      { label: "Europa", value: "Băng giá", year: "1610" },
      { label: "Ganymede", value: "Lớn nhất", year: "1610" },
      { label: "Callisto", value: "Cũ nhất", year: "1610" },
    ],
  },
  s7: {
    kind: "fact",
    label: "SAO THỔ",
    bigValue: "29.5",
    unit: "năm Trái Đất",
    description: "Thời gian quay quanh mặt trời",
    detail: "Hành tinh có vành đai đẹp nhất. Bao gồm chủ yếu là băng và đá.",
  },
  s8: {
    kind: "compare",
    title: "SAO THIÊN VƯƠNG vs SAO HẢI VƯƠNG",
    left: { label: "SAO THIÊN VƯƠNG", value: "-224°C", color: "#06b6d4" },
    right: { label: "SAO HẢI VƯƠNG", value: "-214°C", color: "#3b82f6" },
    insight: "Cả hai đều là hành tinh băng giá xa nhất trong hệ mặt trời",
  },
  s9: {
    kind: "closing",
    title: "HỆ MẶT TRỜI TUYỆT ĐẸP",
    subtitle: "Từ Sao Thủy nhỏ bé đến Sao Mộc khổng lồ,\nmỗi hành tinh đều có câu chuyện riêng.",
    stats: [
      { label: "Hành tinh", value: "8" },
      { label: "Vệ tinh", value: "200+" },
      { label: "Tuổi", value: "4.6 tỷ năm" },
    ],
    reference: "Hệ Mặt Trời — Khám phá vũ trụ",
  },
};
