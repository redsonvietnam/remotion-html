/**
 * Real Estate Listing — Data Layer
 * Content configuration for real estate property reveal template.
 */

export interface RealEstateListingCoverData {
  tag: string;
  type: string;
  price: number;
  address: string;
}

export interface RealEstateListingSpec {
  icon: string;
  value: number;
  suffix: string;
  label: string;
}

export interface RealEstateListingAgentData {
  name: string;
  role: string;
  phone: string;
  cta: string;
}

export interface RealEstateListingConfig {
  fps: number;
  width: number;
  height: number;
  sceneFadeFrames: number;
  scenes: Array<{
    id: string;
    durationInFrames: number;
    startFrame?: number;
  }>;
}

/**
 * Scene definitions with frame timings (30fps).
 * Total: 380 frames @ 30fps ≈ 12.7s
 */
export const REAL_ESTATE_LISTING_CONFIG: RealEstateListingConfig = {
  fps: 30,
  width: 1080,
  height: 1920,
  sceneFadeFrames: 14,
  scenes: [
    { id: 'cover', durationInFrames: 70 },      // 2.3s
    { id: 'specs', durationInFrames: 100 },     // 3.3s
    { id: 'highlights', durationInFrames: 130 }, // 4.3s
    { id: 'outro', durationInFrames: 80 },      // 2.7s
  ],
};

// Calculate startFrame for each scene
(() => {
  let cursor = 0;
  REAL_ESTATE_LISTING_CONFIG.scenes.forEach((scene) => {
    scene.startFrame = cursor;
    cursor += scene.durationInFrames;
  });
})();

export const REAL_ESTATE_LISTING_TOTAL_FRAMES = REAL_ESTATE_LISTING_CONFIG.scenes.reduce(
  (sum, scene) => sum + scene.durationInFrames,
  0
);

/**
 * Format Vietnamese Dong currency.
 */
export function formatVND(value: number): string {
  return Math.round(value).toLocaleString('vi-VN') + '₫';
}

/**
 * Default real estate listing content.
 */
export const REAL_ESTATE_LISTING_CONTENT = {
  cover: {
    tag: 'MỚI NIÊM YẾT',
    type: 'Căn hộ cao cấp · 3 phòng ngủ',
    price: 4200000000,
    address: '12 Nguyễn Huệ, Quận 1, TP.HCM',
  } as RealEstateListingCoverData,
  specs: [
    { icon: '🛏️', value: 3, suffix: '', label: 'Phòng ngủ' },
    { icon: '🛁', value: 2, suffix: '', label: 'Phòng tắm' },
    { icon: '📐', value: 120, suffix: 'm²', label: 'Diện tích' },
  ] as RealEstateListingSpec[],
  highlightsTitle: 'Điểm nổi bật',
  highlights: [
    'View sông thoáng đãng, ban công rộng',
    'Nội thất cao cấp, đầy đủ tiện nghi',
    'Gần trường quốc tế, trung tâm thương mại',
    'Sổ hồng riêng, sẵn sàng bàn giao',
  ] as string[],
  agent: {
    name: 'Trần Thị Lan',
    role: 'Chuyên viên tư vấn · Lan Real Estate',
    phone: '090 123 4567',
    cta: 'Liên hệ xem nhà ngay',
  } as RealEstateListingAgentData,
};

/**
 * Scene frame helpers — compute frame ranges and local frame within scenes.
 */
export function sceneFrames(sceneId: string) {
  const scene = REAL_ESTATE_LISTING_CONFIG.scenes.find((s) => s.id === sceneId);
  if (!scene) throw new Error(`Scene ${sceneId} not found`);
  return {
    startFrame: scene.startFrame!,
    endFrame: scene.startFrame! + scene.durationInFrames,
    durationInFrames: scene.durationInFrames,
  };
}
