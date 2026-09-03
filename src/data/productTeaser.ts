// ---------------------------------------------------------------------------
// Product Teaser Content Data
//
// Dashboard reveal template for 1080x1920 vertical video (9:16).
// 4 scenes: hook, dashboard, features, outro
// FPS: 30, Duration: 14.1s (425 frames)
//
// Source: prototypes/product-teaser-remotion-prototype.html
// ---------------------------------------------------------------------------

export const FPS = 30;
export const TAIL = 0.2;
export const sceneFrames = (dur: number) => Math.ceil((dur + TAIL) * FPS);

// ---------------------------------------------------------------------------
// Scene Definition
// ---------------------------------------------------------------------------

export interface SceneDef {
  id: string;
  dur: number;
}

// ---------------------------------------------------------------------------
// Content Types — Scene-specific content interfaces
// ---------------------------------------------------------------------------

export interface ProductTeaserHookContent {
  kind: "hook";
  kicker: string;
  title: string;
  subtitle: string;
}

export interface KpiItem {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: string;
}

export interface LogItem {
  title: string;
  sub: string;
}

export interface ChartData {
  label: string;
  points: number[];
  currentValueLabel: string;
}

export interface ProductTeaserDashboardContent {
  kind: "dashboard";
  dashtitle: string;
  dashperiod: string;
  kpis: KpiItem[];
  chart: ChartData;
  logs: LogItem[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

export interface ProductTeaserFeaturesContent {
  kind: "features";
  title: string;
  features: FeatureItem[];
}

export interface ProductTeaserOutroContent {
  kind: "outro";
  logo: string;
  tagline: string;
  cta: string;
}

export type ProductTeaserSceneContent =
  | ProductTeaserHookContent
  | ProductTeaserDashboardContent
  | ProductTeaserFeaturesContent
  | ProductTeaserOutroContent;

// ---------------------------------------------------------------------------
// Content — Demo data matching prototype
// ---------------------------------------------------------------------------

export const PRODUCT_TEASER_CONTENT: Record<string, ProductTeaserSceneContent> = {
  hook: {
    kind: "hook",
    kicker: "RA MẮT HÔM NAY",
    title: "Gặp gỡ Pulse.",
    subtitle: "Nền tảng phân tích dữ liệu real-time cho đội ngũ hiện đại.",
  },

  dashboard: {
    kind: "dashboard",
    dashtitle: "Tổng quan",
    dashperiod: "30 ngày qua",
    kpis: [
      { label: "MRR", value: 128400, prefix: "$", change: "+18.2%" },
      { label: "Người dùng", value: 24380, change: "+9.4%" },
      { label: "Chuyển đổi", value: 4.8, suffix: "%", change: "+0.6%" },
    ],
    chart: {
      label: "Doanh thu theo ngày",
      points: [18, 22, 19, 27, 31, 26, 34, 41, 38, 47, 44, 52, 58, 54, 63],
      currentValueLabel: "$63.2K hôm nay",
    },
    logs: [
      { title: "142 sự kiện", sub: "trong giờ qua" },
      { title: "99.98%", sub: "uptime hệ thống" },
    ],
  },

  features: {
    kind: "features",
    title: "Vì sao đội ngũ chọn Pulse",
    features: [
      {
        icon: "⚡",
        title: "Real-time đến từng giây",
        desc: "Dữ liệu cập nhật tức thời, không cần refresh trang.",
      },
      {
        icon: "🔗",
        title: "Tích hợp trong 2 phút",
        desc: "Kết nối với hơn 40 công cụ bạn đang dùng sẵn.",
      },
      {
        icon: "🛡️",
        title: "Bảo mật cấp doanh nghiệp",
        desc: "Mã hoá đầu cuối, tuân thủ SOC 2 Type II.",
      },
    ],
  },

  outro: {
    kind: "outro",
    logo: "PULSE",
    tagline: "Bắt nhịp dữ liệu của bạn.",
    cta: "Dùng thử miễn phí →",
  },
};

// ---------------------------------------------------------------------------
// Scenes Configuration
// ---------------------------------------------------------------------------

export const PRODUCT_TEASER_SCENES: SceneDef[] = [
  { id: "hook", dur: 1.8 },
  { id: "dashboard", dur: 5.7 },
  { id: "features", dur: 4.3 },
  { id: "outro", dur: 2.3 },
];

// ---------------------------------------------------------------------------
// Timeline Calculation
// ---------------------------------------------------------------------------

export const PRODUCT_TEASER_TOTAL_FRAMES = PRODUCT_TEASER_SCENES.reduce(
  (sum, scene) => sum + sceneFrames(scene.dur),
  0
);
