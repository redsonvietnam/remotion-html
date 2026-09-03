// ---------------------------------------------------------------------------
// Bento Grid Showcase — Content Types
//
// 9:16 vertical video: hook (mask-reveal kinetic type), bento (glassmorphism
// grid with stat/feature/chart/quote/palette cards), outro (brand + CTA).
// ---------------------------------------------------------------------------

export interface BentoGridHookContent {
  kind: "hook";
  line1: string;
  line2: string;
}

export interface BentoGridStat {
  value: number;
  suffix: string;
  label: string;
}

export interface BentoGridFeature {
  icon: string;
  title: string;
}

export interface BentoGridChart {
  points: number[];
}

export interface BentoGridQuote {
  text: string;
  author: string;
}

export interface BentoGridBentoContent {
  kind: "bento";
  title: string;
  stat: BentoGridStat;
  feature1: BentoGridFeature;
  feature2: BentoGridFeature;
  chart: BentoGridChart;
  quote: BentoGridQuote;
  palette: string[];
}

export interface BentoGridOutroContent {
  kind: "outro";
  brand: string;
  tagline: string;
  cta: string;
}

export type BentoGridSceneContent =
  | BentoGridHookContent
  | BentoGridBentoContent
  | BentoGridOutroContent;

// ---------------------------------------------------------------------------
// Scene definitions & demo content
// ---------------------------------------------------------------------------

import type { SceneDef } from "./contract";
import { sceneFrames } from "./contract";

export { sceneFrames as bentoGridSceneFrames };

export const BENTO_GRID_SCENES: SceneDef[] = [
  { id: "s1", audio: "", caption: "Thiết kế đẹp", dur: 2.0 },
  { id: "s2", audio: "", caption: "Tại sao chọn AURA", dur: 7.0 },
  { id: "s3", audio: "", caption: "Khám phá ngay", dur: 2.3 },
];

export const BENTO_GRID_CONTENT: Record<string, BentoGridSceneContent> = {
  s1: {
    kind: "hook",
    line1: "Thiết kế đẹp.",
    line2: "Chuyển động mượt.",
  },
  s2: {
    kind: "bento",
    title: "TẠI SAO CHỌN AURA",
    stat: { value: 98, suffix: "%", label: "khách hàng hài lòng sau 30 ngày" },
    feature1: { icon: "⚡", title: "Tải trang dưới 100ms" },
    feature2: { icon: "🎨", title: "" },
    chart: { points: [3, 5, 4, 7, 9, 8, 12, 10, 14] },
    quote: {
      text: "Sản phẩm đẹp và mượt nhất tôi từng dùng trong năm nay.",
      author: "— Chị Mai, Product Designer",
    },
    palette: ["#7c5cff", "#ff6bd6", "#3ddcff", "#ffb84d"],
  },
  s3: {
    kind: "outro",
    brand: "AURA",
    tagline: "Thiết kế cho những ai để ý từng chi tiết nhỏ.",
    cta: "Khám phá ngay →",
  },
};
