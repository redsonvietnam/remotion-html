# NQ57 Visual Storyboard Workflow

## Mục đích

`preview/nq57-storyboard.html` là **visual playground** độc lập cho video `NghiQuyet57V2`.
Nó tồn tại để duyệt bố cục, typography, icon/SVG, Three.js motif, glow, glass, infographic
và chuyển cảnh **trước khi** đưa visual đã chốt vào Remotion.

HTML preview không phải source of truth của timing/audio. `NQ57ScenesV2.tsx` vẫn là source of truth
cho video Remotion cuối cùng.

## Hai tầng preview

### 1. HTML Storyboard — duyệt visual nhanh

```bash
npx serve .
```

Mở `http://localhost:3000/preview/nq57-storyboard.html`.

Mục tiêu:

- nhìn toàn cảnh 7 scene mà không cần TTS
- thử hierarchy chữ và khoảng trống
- kiểm tra icon/SVG có đủ sức khỏa lấp vùng thiếu hình ảnh không
- thử Three.js hero motif nhẹ
- thử glass-card, particles, ring, gauge, data-flow, glow
- kiểm tra transition cảm giác điện ảnh
- phát hiện sớm overflow, chữ quá dài, card quá chật hoặc visual quá nặng

### 2. Remotion Studio — duyệt frame/timeline

```bash
npm run dev
```

Mục tiêu:

- kiểm tra `useCurrentFrame()` và deterministic animation
- kiểm tra scene duration / transition
- kiểm tra audio/TTS/subtitle
- kiểm tra ThreeCanvas thực tế trong Remotion

## Design contract

Preview và Remotion nên chia sẻ cùng một ngôn ngữ thị giác:

- nền navy sâu + red/gold chủ đạo + teal làm accent
- Be Vietnam Pro cho typography NQ57
- kinetic typography là lớp thông tin chính
- SVG/icon motion dùng để tạo visual density thay cho ảnh khi quota thấp
- Three.js chỉ dùng cho hero/anchor visual, không lạm dụng ở mọi scene
- glass card + soft glow + vignette + grid tạo chiều sâu nhưng không được che nội dung
- infographic/chart phải có hierarchy rõ, không biến thành dashboard UI
- transition ưu tiên scale/blur/crossfade nhẹ, không lạm dụng hiệu ứng

## Quy trình port visual

```text
1. Ý tưởng scene
      ↓
2. HTML storyboard
      ↓
3. Duyệt bằng mắt
      ↓
4. Chốt bố cục + motion language
      ↓
5. Port sang NQ57ScenesV2.tsx
      ↓
6. Remotion Studio
      ↓
7. TTS / captions / audio
      ↓
8. Render MP4
```

## Nguyên tắc đồng bộ

Khi một visual được duyệt trong HTML:

1. Giữ **semantic layout** giống nhau khi port sang Remotion.
2. Có thể thay implementation: CSS/SVG/Three.js thuần trong HTML → React/Remotion/
   `@remotion/three` trong video.
3. Animation trong Remotion phải phụ thuộc vào `useCurrentFrame()`, không phụ thuộc clock thực.
4. Không copy nguyên xi CSS animation theo thời gian thực vào Remotion nếu nó làm animation
   không deterministic.
5. HTML preview được phép đơn giản hóa audio, TTS và subtitle; không được giả vờ rằng nó
   đã kiểm chứng render MP4.

## Hiện trạng

Preview hiện mô phỏng 7 cảnh:

1. Title — typography + Three.js emblem + orbital rings
2. Quote — kinetic quote / underline
3. Roles — glass cards + shine sweep
4. Pillars — SVG icons + data-flow connectors
5. Stats — infographic area chart
6. Vision — gauge/ring + large percentage typography
7. End — cinematic typography + orbital ring

Đây là baseline để tiếp tục thử nghiệm visual. Khi visual được chốt, implementation tương ứng
phải được port và kiểm tra lại trong `src/scenes/NQ57ScenesV2.tsx`.
