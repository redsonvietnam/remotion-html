# Habit Loop — Remotion Demo (Three.js + Recharts)

Demo 2 scene chạy được thật bằng Remotion, nối tiếp 2 bản preview HTML đã duyệt trước đó.

- **Scene 1** — kinetic typography + icon 3D xoay (torus ring + node/brain) dựng bằng `@remotion/three` (React Three Fiber).
- **Scene 2** — biểu đồ cột animate bằng Recharts, giá trị được "bake" theo frame để đảm bảo render deterministic.
- Chuyển cảnh bằng `@remotion/transitions` (fade).

## Cài đặt

```bash
cd remotion-demo
npm install
```

## Xem preview (Remotion Studio)

```bash
npm run dev
```

Mở trình duyệt tại địa chỉ Studio hiện ra trong terminal (mặc định `http://localhost:3000`). Bạn có thể tua timeline, xem từng frame chính xác — không như preview HTML chỉ chạy real-time.

## Render ra MP4

```bash
npm run render
```

File xuất ra ở `out/habit-loop.mp4`.

## Thêm giọng đọc (TTS) + nhạc nền

1. Bỏ file `voiceover.mp3` và `bg-music.mp3` vào thư mục `public/`.
2. Mở `src/HabitLoopVideo.tsx`, bỏ comment 2 dòng `<Audio>` ở cuối file.
3. Nếu có file phụ đề `.srt`/`.vtt` xuất từ TTS, thay caption tĩnh trong `Scene1Orb.tsx` / `Scene2Chart.tsx` bằng component đọc caption theo timestamp (xem docs: `@remotion/captions`).

## Cấu trúc thư mục

```
src/
  index.ts              # entry, registerRoot
  Root.tsx               # khai báo Composition (id, fps, kích thước, thời lượng)
  HabitLoopVideo.tsx      # ghép 2 scene bằng TransitionSeries
  theme.ts                # design tokens (màu, font) — sửa ở đây để đổi cả bộ nhận diện
  scenes/
    Scene1Orb.tsx          # headline + icon 3D
    Scene2Chart.tsx         # chart Recharts
  components/
    Icon3D.tsx               # mesh 3D dùng lại được cho scene khác
```

## Lưu ý kỹ thuật quan trọng (đừng phá vỡ khi sửa code)

- Trong bất kỳ component nào nằm trong `<ThreeCanvas>`, **luôn dùng `useCurrentFrame()`** của Remotion để animate — **không dùng `useFrame()`** gốc của React Three Fiber, vì nó chạy theo đồng hồ thực và không tua được trong Studio, cũng không render đúng khi xuất video.
- `<Sequence>` bọc quanh `<ThreeCanvas>` phải có `layout="none"`.
- `<ThreeCanvas>` phải khai báo `width`/`height` tường minh.
- Với bất kỳ thư viện chart/animation bên thứ 3 nào (Recharts, Nivo, Lottie...), luôn **tắt animation nội bộ** của thư viện đó (`isAnimationActive={false}` với Recharts) và tự tính giá trị theo `frame` bằng `interpolate()`/`spring()`. Nếu để thư viện tự chạy animation, mỗi lần render một frame có thể ra kết quả khác nhau → video bị giật/nhòe khi xuất.

## Roadmap tiếp theo (đã thảo luận trong chat)

- [ ] Thay icon 3D tay-vẽ bằng icon từ Iconify (offline, đồng bộ style, tránh scrape web mỗi lần)
- [ ] Thêm React Flow cho các scene dạng sơ đồ quy trình nhiều bước
- [ ] Thêm `@remotion/lottie` cho animation phức tạp lấy từ LottieFiles, chỉnh màu theo `theme.ts`
- [ ] Nối với TTS thật + `@remotion/captions` để phụ đề tự sinh theo timestamp
- [ ] Viết script batch: 1 topic → tự sinh nhiều video theo template này (thay `defaultProps` của Composition)
