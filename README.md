# Nghị quyết 57 — Video giải mã (Remotion)

Video giải thích Nghị quyết 57 của Bộ Chính trị về đột phá phát triển khoa học, công nghệ,
đổi mới sáng tạo và chuyển đổi số quốc gia. Dựng bằng **Remotion** (video-as-code): 3D
(Three.js), biểu đồ (Recharts), animation SVG, phụ đề karaoke 1 dòng, và giọng đọc TTS
chọn được qua 4 backend độc lập.

## Yêu cầu

- Node.js 18+ và npm
- Python 3.10+ (chỉ để sinh audio TTS)
- ffmpeg (dùng bản `ffmpeg-static` đã cài cùng dự án)

## Cài đặt

```bash
npm install
pip install edge-tts gTTS mutagen ffmpeg-static
```

## Sinh giọng đọc (TTS)

Script `gen_tts_v2.py` sinh file `public/nq57/sN.mp3` và tự cập nhật `src/nq57-data.ts`
(thời lượng + phụ đề). Chọn 1 trong 4 backend — hoàn toàn độc lập, chỉ đổi flag:

| Backend   | Lệnh                                      | Ghi chú |
|-----------|-------------------------------------------|---------|
| `edge`    | `python3 gen_tts_v2.py --backend edge`    | Free, nhanh (Microsoft edge-tts), 2 giọng có sẵn |
| `omni`    | `python3 gen_tts_v2.py --backend omni`    | OmniVoice local, giọng tùy biến (Voice Design). Cần `pip install omnivoice soundfile torch` |
| `gemini`  | `python3 gen_tts_v2.py --backend gemini`  | Google AI Studio trực tiếp. Cần `GEMINI_API_KEY` (env) |
| `proxy`   | `python3 gen_tts_v2.py --backend proxy`   | Gateway OpenAI-compatible local (vd aistudio). Cần key qua env `AISTUDIO_KEY` hoặc file `proxy_key.txt` |

- Sửa kịch bản / phụ đề: mảng `DIALOGUE` trong `gen_tts_v2.py`.
- Đổi giọng proxy: biến `PROXY_VOICE` (vd `Puck` nam, `Kore` nữ) và `PROXY_MODEL`.
- Key **không bao giờ commit** (xem `.gitignore`): dùng env hoặc file `proxy_key.txt` / `gemini_key.txt` nằm ngoài git.

## Preview workflow — HTML Storyboard → Remotion

Có một preview HTML độc lập dùng làm **visual storyboard / playground** trước khi đưa thiết kế vào Remotion:

```text
preview/nq57-storyboard.html
```

Preview này cố tình **không cần TTS, subtitle audio hay render MP4**. Nó mô phỏng 7 scene của `NghiQuyet57V2` và tập trung vào phần nhìn:

- kinetic typography và hierarchy chữ
- SVG icon / line-art motion
- Three.js hero motif nhẹ, deterministic về mặt visual
- particles/glow/grid/vignette/glass-card language
- ring/gauge và data-flow accents
- chart / infographic treatment
- cinematic crossfade / scale / blur transition giữa scene
- caption/progress-bar giả lập để duyệt bố cục

### Chạy HTML preview

Cách ổn định nhất là chạy local server:

```bash
npx serve .
```

Sau đó mở:

```text
http://localhost:3000/preview/nq57-storyboard.html
```

Có thể mở trực tiếp bằng Chrome, nhưng vì preview tải Three.js từ CDN nên local server được khuyến nghị.

Điều khiển:

- `←` / `→`: chuyển scene
- `Space`: play/pause autoplay
- nút `‹` / `›` / `▶`: điều khiển trên màn hình

### Quy trình thiết kế chính thức

```text
HTML Storyboard / Playground
        ↓
Duyệt bằng mắt + chốt visual
        ↓
Port visual đã duyệt vào NQ57ScenesV2.tsx
        ↓
Remotion Studio — kiểm tra timeline/frame
        ↓
TTS + subtitles + audio
        ↓
Render MP4
```

**Nguyên tắc:** HTML preview là nơi thử nghiệm visual nhanh; Remotion là source of truth cho video cuối cùng. Không coi preview HTML là bản render cuối.

## Xem preview (Remotion Studio)

```bash
npm run dev
```

Mở địa chỉ Studio in terminal (mặc định `http://localhost:3000`) để tua timeline từng frame.

## Render ra MP4

```bash
npx remotion render src/index.ts NghiQuyet57V2 out/nq57.mp4
```

- Composition chính: **`NghiQuyet57V2`** (7 cảnh s1–s7, phụ đề karaoke, giọng 2 người).
- Composition cũ `HabitLoop` và `NghiQuyet57` vẫn còn trong `Root.tsx` để tham khảo.

## Cấu trúc thư mục

```
src/
  index.ts                 # entry, registerRoot
  Root.tsx                 # khai báo các Composition (NghiQuyet57V2, HabitLoop, NghiQuyet57)
  NghiQuyet57VideoV2.tsx   # ghép 7 cảnh bằng TransitionSeries (cross-fade)
  nq57-data.ts             # SCENES (id/audio/caption/dur) — được gen_tts_v2.py sinh lại
  fonts-nq57.ts            # font Be Vietnam Pro
  theme-nq57.ts            # design tokens (màu, font) cho bộ NQ57
  scenes/
    NQ57ScenesV2.tsx       # 7 cảnh: Title, Quote, Roles, Pillars, Stats, Vision, End
                            # + SVG (RingDraw, UnderlineDraw, DataFlow, Gauge) + KaraokeCaption
preview/
  nq57-storyboard.html     # visual storyboard/playground, không cần render MP4
gen_tts_v2.py              # sinh TTS đa backend + cập nhật nq57-data.ts
public/nq57/               # audio mp3 (được sinh, đã gitignore)
out/                        # video xuất (đã gitignore)
```

## Lưu ý kỹ thuật (giữ nguyên khi sửa code)

- Trong mọi component nằm trong `<ThreeCanvas>`, **luôn dùng `useCurrentFrame()`** của Remotion
  để animate — **không dùng `useFrame()`** gốc của React Three Fiber (chạy theo đồng hồ thực,
  không tua được trong Studio và render sai khi xuất).
- `<Sequence>` bọc `<ThreeCanvas>` phải có `layout="none"`; `<ThreeCanvas>` khai báo rõ `width`/`height`.
- Với Recharts (và mọi lib chart/animation): tắt animation nội bộ (`isAnimationActive={false}`)
  và tự tính giá trị theo `frame` bằng `interpolate()`/`spring()` để render deterministic.
- Phụ đề: chỉ 1 dòng, tự cuộn (marquee) theo lời đang nói — xem `KaraokeCaption` trong
  `NQ57ScenesV2.tsx`. Mỗi cảnh audio được chèn 0.5s nghỉ đầu/cuối để chuyển cảnh không bị chồng tiếng.
- Font tiếng Việt: Be Vietnam Pro (`@remotion/google-fonts`), load trong `fonts-nq57.ts`.

## File sinh tự động (đã gitignore)

`out/`, `public/nq57/*.mp3`, `public/nq57/durations.json`, `*.pyc`, `node_modules/`,
và mọi file chứa key. Clone về chạy `npm install` + `gen_tts_v2.py` là có thể render lại.
