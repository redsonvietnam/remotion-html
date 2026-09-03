/**
 * Editorial Feature Teaser — Data Layer
 * Content configuration for multi-scene editorial video template.
 */

export interface EditorialFeatureCoverData {
  category: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
}

export interface EditorialFeaturePullquoteData {
  text: string;
  attribution: string;
}

export interface EditorialFeatureTakeaway {
  num: string;
  text: string;
}

export interface EditorialFeatureOutroData {
  brand: string;
  cta: string;
  readTime: string;
}

export interface EditorialFeatureSceneContent {
  type: 'cover' | 'pullquote' | 'takeaways' | 'outro';
  data: any;
}

export interface EditorialFeatureConfig {
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
export const EDITORIAL_FEATURE_CONFIG: EditorialFeatureConfig = {
  fps: 30,
  width: 1080,
  height: 1920,
  sceneFadeFrames: 14,
  scenes: [
    { id: 'cover', durationInFrames: 70 },      // 2.3s
    { id: 'pullquote', durationInFrames: 90 },  // 3.0s
    { id: 'takeaways', durationInFrames: 150 }, // 5.0s
    { id: 'outro', durationInFrames: 70 },      // 2.3s
  ],
};

// Calculate startFrame for each scene
(() => {
  let cursor = 0;
  EDITORIAL_FEATURE_CONFIG.scenes.forEach((scene) => {
    scene.startFrame = cursor;
    cursor += scene.durationInFrames;
  });
})();

export const EDITORIAL_FEATURE_TOTAL_FRAMES = EDITORIAL_FEATURE_CONFIG.scenes.reduce(
  (sum, scene) => sum + scene.durationInFrames,
  0
);

/**
 * Default editorial feature content.
 */
export const EDITORIAL_FEATURE_CONTENT = {
  cover: {
    category: 'CÔNG NGHỆ & XÃ HỘI',
    title: 'Tại sao sự chú ý mới là tài nguyên khan hiếm nhất',
    author: 'Nguyễn Minh',
    date: '28 Th8, 2026',
    readTime: '6 phút đọc',
  } as EditorialFeatureCoverData,
  pullquote: {
    text: 'Chúng ta không thiếu thông tin. Chúng ta thiếu khả năng lựa chọn thứ đáng để chú ý.',
    attribution: '— Trích đoạn mở đầu bài viết',
  } as EditorialFeaturePullquoteData,
  takeawaysTitle: '3 điều rút ra',
  takeaways: [
    {
      num: '01',
      text: 'Sự chú ý là tài nguyên hữu hạn, không phải vô hạn như ta vẫn tưởng.',
    },
    {
      num: '02',
      text: 'Thuật toán được thiết kế để khai thác sự chú ý, không phải để phục vụ nó.',
    },
    {
      num: '03',
      text: 'Chủ động chọn lọc là một kỹ năng cần luyện tập, không tự nhiên mà có.',
    },
  ] as EditorialFeatureTakeaway[],
  outro: {
    brand: 'THE WEEKLY READ',
    cta: 'Đọc toàn bộ bài viết',
    readTime: '6 phút đọc · Miễn phí',
  } as EditorialFeatureOutroData,
};

/**
 * Scene frame helpers — compute frame ranges and local frame within scenes.
 */
export function sceneFrames(sceneId: string) {
  const scene = EDITORIAL_FEATURE_CONFIG.scenes.find((s) => s.id === sceneId);
  if (!scene) throw new Error(`Scene ${sceneId} not found`);
  return {
    startFrame: scene.startFrame!,
    endFrame: scene.startFrame! + scene.durationInFrames,
    durationInFrames: scene.durationInFrames,
  };
}
