# HANDOFF — Pipeline tạo video code-gen (Remotion) — Chủ đề demo: Habit Loop

> File này để dán lại cho Claude (hoặc người kế nhiệm) ở phiên làm việc mới,
> phòng trường hợp phiên hiện tại hết quota giữa chừng. Đọc file này là đủ để
> hiểu toàn bộ bối cảnh, không cần đọc lại lịch sử chat.

## 1. Mục tiêu tổng của dự án

Người dùng muốn xây một **pipeline tạo video tự động** bằng Remotion (video-as-code,
React), gồm đủ: TTS, hình ảnh, phụ đề, nhạc nền. Trở ngại ban đầu: **quota tạo ảnh AI
bị giới hạn**. Hướng giải quyết đã thống nhất: **thay ảnh bằng code-gen** — vẽ
icon/hình bằng SVG/Canvas/Three.js thay vì generate ảnh, vì quota code-gen thoải mái
hơn nhiều.

## 2. Các quyết định chiến lược đã chốt (không cần bàn lại)

- **Không** scrape SVG icon từ web theo từng topic (rủi ro bản quyền, không đồng nhất
  style, chậm, dễ lỗi). Thay vào đó: dùng bộ icon offline đồng nhất (khuyến nghị:
  Iconify — gộp Lucide/Tabler/Phosphor/Heroicons, MIT/Apache license) + semantic
  search local theo keyword, không cần lên mạng mỗi lần tạo video.
- **Kinetic typography** (chữ động) là xương sống mặc định của mọi video, vì không
  cần asset ngoài, luôn code-gen 100%.
- **ASCII art** và **hiệu ứng 3D (Three.js)** là gia vị điểm xuyết, không phải giải
  pháp thay ảnh toàn diện — 3D đặc biệt cần tiết chế vì render nặng (headless
  Chromium render từng frame, scene 3D phức tạp làm render time tăng vọt).
- **Chiến lược hybrid quota**: vẫn giữ AI image-gen cho vài "hero shot" thật sự cần
  ấn tượng mạnh (thumbnail, cảnh mở đầu); ~80-90% B-roll dùng code-gen.
- **Thư viện đã chốt dùng** (đều có tích hợp chính thức từ Remotion, đã verify qua
  web search, không cần tự viết cầu nối):
  - `@remotion/three` — 3D (React Three Fiber). Rule bắt buộc: dùng `useCurrentFrame()`
    thay vì `useFrame()`; `<Sequence layout="none">` bọc quanh `<ThreeCanvas>`;
    `<ThreeCanvas>` phải có `width`/`height` tường minh.
  - **Recharts** (MVP, dễ dùng) → **Visx** (khi cần chart mang đúng "signature style"
    riêng, không giống dashboard mặc định) — cho biểu đồ số liệu.
  - **React Flow** — cho sơ đồ quy trình/flowchart nhiều bước (chưa code demo, mới
    dừng ở gợi ý).
  - `@remotion/lottie` — nhúng animation Lottie có sẵn từ LottieFiles khi cần
    animation phức tạp mà tự vẽ path tốn công. Lưu ý: một số expression phức tạp có
    thể render không đúng frame (flicker) vì Remotion dùng `.goToAndStop()` để tua.
  - `@remotion/transitions` — chuyển cảnh (đang dùng `fade()`).
  - Matter.js (vật lý) — chưa tích hợp, nếu cần thì phải "bake" simulation thành
    timeline cố định trước rồi mới đưa vào Remotion (không có integration trực tiếp).

## 3. Design system đã chốt (đừng đổi màu tuỳ tiện, đã được duyệt qua 2 vòng)

Xem `src/theme.ts`. Tóm tắt:

- Nền: `#0d0e15` (đen-chàm sâu), card phụ `#14161f`
- Accent: amber `#ffb86b`, teal `#5eead4`, pink `#ff6b9d` (mỗi accent gắn với 1 vai
  trò cố định: amber = tín hiệu/mở đầu, teal = hành động/core, pink = phần thưởng/kết)
- Chữ: display = Space Grotesk (700, headline), body = Inter (caption, sub-text)
- Ngôn ngữ thị giác: glass card (`backdrop-filter: blur`), glow/halo mềm, gradient
  ring xoay quanh icon tròn, mix phong cách icon filled/outline/glass để tránh đơn
  điệu (đã là feedback trực tiếp từ người dùng ở vòng 2).

## 4. Lịch sử tiến độ (đã làm gì, theo thứ tự)

1. **Brainstorm ban đầu** — người dùng đề xuất ý tưởng code-gen thay ảnh, Claude góp
   ý chỉnh sửa (bỏ scrape web, dùng Iconify offline, coi 3D/ASCII là gia vị).
2. **Demo v1 (HTML preview)** — `demo-video-remotion.html` — 2 scene tĩnh, circle-wipe
   transition, icon vẽ tay bằng SVG stroke-dasharray. Người dùng khen, xin tăng kích
   thước icon + đa dạng style + card/UX tốt hơn.
3. **Demo v2 (HTML preview)** — `demo-video-remotion-v2.html` — icon to hơn, orb card
   kính có ring gradient xoay, scene 2 đổi từ hàng ngang sang bố cục radial (hub +
   3 satellite card quanh, mỗi card 1 phong cách khác nhau: filled/outline/filled),
   transition đổi sang zoom+blur crossfade. Đây là **bố cục/màu sắc chuẩn cuối cùng**
   mà mọi scene Remotion về sau nên bám theo.
4. **Nghiên cứu thư viện** — search web xác nhận `@remotion/three`, Recharts/Visx,
   React Flow, `@remotion/lottie` đều là lựa chọn hợp lệ, có tích hợp chính thức.
5. **Bước hiện tại — project Remotion thật** (`remotion-demo/`) — chuyển demo v2 từ
   HTML mô phỏng sang code Remotion chạy được thật:
   - Scene 1: kinetic typography + icon 3D (torus ring + 3-node "brain" motif) bằng
     `@remotion/three`, thay cho orb card 2D của bản HTML.
   - Scene 2: **đổi hướng nội dung** so với bản HTML — thay vì lặp lại radial loop
     diagram (2D, đã làm rồi ở HTML), scene 2 trong bản Remotion là **biểu đồ
     Recharts động** ("độ bền thói quen tăng theo số lần lặp lại") để demo tích hợp
     chart thật — đúng yêu cầu "tương lai nên tích hợp cả vẽ biểu đồ, diagram".
   - Ghép 2 scene bằng `TransitionSeries` + `fade()`.
   - **CHƯA LÀM**: chưa `npm install` / chưa render thử thật (không có sandbox chạy
     headless Chromium trong môi trường hiện tại). Code viết đúng theo API chính thức
     đã verify qua docs, nhưng **chưa test end-to-end** — việc đầu tiên cần làm ở máy
     người dùng là `npm install && npm run dev` để bắt lỗi cú pháp/type nếu có.

## 5. Việc cần làm tiếp theo (ưu tiên theo thứ tự)

1. Chạy thử `npm install && npm run dev` trên máy người dùng, fix lỗi type/API nếu
   phiên bản package lệch (đã ghim version cụ thể trong `package.json`, nhưng
   Remotion ra bản mới rất nhanh — kiểm tra lại version mới nhất nếu cách xa ngày viết
   file này).
2. Nếu người dùng thích scene 2 dạng **radial loop diagram** (bản HTML v2) hơn là
   bar chart — cần viết thêm 1 scene mới `Scene2Loop.tsx` port lại đúng bố cục hub +
   3 satellite từ `demo-video-remotion-v2.html` sang JSX/inline style + `interpolate()`.
   Có thể làm **scene 3** luôn: Loop diagram + Chart trong cùng 1 video 3 cảnh.
3. Tích hợp Iconify offline (chưa làm) — cần: tải icon set cần thiết về
   `public/icons/`, viết helper load SVG theo tên, thay `Icon3D.tsx` node thủ công
   bằng icon thật khi không cần hiệu ứng 3D.
4. Tích hợp TTS thật — ghi âm/generate voiceover.mp3, đo timestamp từng câu, đồng bộ
   với `durationInFrames` của từng `TransitionSeries.Sequence` (hiện đang set cứng
   5.5s / 6.4s, cần đổi thành tính theo độ dài audio thật).
5. Viết `@remotion/captions` để phụ đề tự sinh từ SRT/VTT thay vì text tĩnh hard-code
   trong từng scene.
6. Cân nhắc thêm React Flow cho các topic có cấu trúc quy trình/flowchart phức tạp
   hơn habit loop (ví dụ: quy trình nhiều nhánh, có điều kiện rẽ nhánh).

## 6. Cách tiếp tục nếu bắt đầu phiên chat mới

Dán nguyên văn nội dung file này cho Claude, kèm câu: "Đây là handoff từ phiên trước,
tiếp tục từ mục 5". Không cần giải thích lại bối cảnh dự án.
