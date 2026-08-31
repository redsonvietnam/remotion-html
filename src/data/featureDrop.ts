// ---------------------------------------------------------------------------
// Feature Drop (SVG + Three.js) — Content Types
//
// 9:16 vertical video: hook (mask-reveal title + 3D icosahedron), features
// (SVG icon draw-in rows), outro (layered ghost typography + CTA pulse).
// ---------------------------------------------------------------------------

export interface FeatureDropHookContent {
  kind: "hook";
  eyebrow: string;
  title: string[];
}

export interface FeatureDropFeature {
  icon: string;
  label: string;
  sub: string;
}

export interface FeatureDropFeaturesContent {
  kind: "features";
  items: FeatureDropFeature[];
}

export interface FeatureDropOutroContent {
  kind: "outro";
  brand: string;
  cta: string;
}

export type FeatureDropSceneContent =
  | FeatureDropHookContent
  | FeatureDropFeaturesContent
  | FeatureDropOutroContent;

// ---------------------------------------------------------------------------
// Scene definitions & demo content
// ---------------------------------------------------------------------------

import type { SceneDef } from "./contract";
import { sceneFrames } from "./contract";

export { sceneFrames as featureDropSceneFrames };

export const FEATURE_DROP_SCENES: SceneDef[] = [
  { id: "s1", audio: "", caption: "Bản cập nhật mới", dur: 2.0 },
  { id: "s2", audio: "", caption: "3 tính năng nổi bật", dur: 5.83 },
  { id: "s3", audio: "", caption: "Cập nhật ngay", dur: 2.0 },
];

export const FEATURE_DROP_CONTENT: Record<string, FeatureDropSceneContent> = {
  s1: {
    kind: "hook",
    eyebrow: "BẢN CẬP NHẬT MỚI",
    title: ["3 tính năng", "bạn sẽ mê"],
  },
  s2: {
    kind: "features",
    items: [
      {
        icon: "sync",
        label: "Đồng bộ tức thì",
        sub: "Mọi thiết bị luôn khớp dữ liệu real-time",
      },
      {
        icon: "shield",
        label: "Bảo mật 2 lớp",
        sub: "Mã hoá đầu cuối, xác thực sinh trắc học",
      },
      {
        icon: "bolt",
        label: "Nhanh gấp đôi",
        sub: "Tối ưu lại toàn bộ engine xử lý",
      },
    ],
  },
  s3: {
    kind: "outro",
    brand: "NOVA",
    cta: "Cập nhật ngay →",
  },
};
