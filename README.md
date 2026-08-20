# Nghi quyet 57 — Video giai thich (Remotion)

Video giai thich Nghi quyet 57 cua Bo Chinh tri ve dot phat phat trien khoa hoc, cong nghe,
doi moi sang tao va chuyen doi so quoc gia. Dung bang **Remotion** (video-as-code): 3D
(Three.js), bieu do (Recharts), animation SVG, phu de karaoke, va giong doc TTS
chon duoc qua 4 backend doc lap.

## Composition chinh

**`NghiQuyet57V2`** — 7 canh (s1–s7), phu de karaoke chay theo loi noi, giong 2 nguoi
(MC + Chuyen gia), hieu ung 3D Emblem, bieu do AreaChart, SVG Ring/Underline/DataFlow/Gauge.

## Yeu cau

- Node.js 18+ va npm
- Python 3.10+ (chi de sinh audio TTS)
- ffmpeg (dung ban `ffmpeg-static` da cai cung du an)

## Cai dat

```bash
npm install
pip install edge-tts gTTS mutagen ffmpeg-static
```

## Sinh giong doc (TTS)

Script `gen_tts_v2.py` sinh file `public/nq57/sN.mp3` va tu cap nhat `src/data/nq57.ts`
(thoi luong + phu de). Chon 1 trong 4 backend — hoan toan doc lap, chi doi flag:

| Backend   | Lenh                                       | Ghi chu |
|-----------|-------------------------------------------|---------|
| `edge`    | `python gen_tts_v2.py --backend edge`     | Free, nhanh (Microsoft edge-tts), 2 giong co san |
| `omni`    | `python gen_tts_v2.py --backend omni`     | OmniVoice local, giong tuy bien. Can `pip install omnivoice soundfile torch` |
| `gemini`  | `python gen_tts_v2.py --backend gemini`   | Google AI Studio truc tiep. Can `GEMINI_API_KEY` (env) |
| `proxy`   | `python gen_tts_v2.py --backend proxy`    | Gateway OpenAI-compatible local. Can key qua env `AISTUDIO_KEY` hoac file `proxy_key.txt` |

- Sua kich ban / phu de: mang `DIALOGUE` trong `gen_tts_v2.py`.
- Doi giong proxy: bien `PROXY_VOICE` va `PROXY_MODEL`.
- Key **khong bao gio commit** (xem `.gitignore`): dung env hoac file `proxy_key.txt` / `gemini_key.txt` nam ngoai git.

## Xem preview (Remotion Studio)

```bash
npm run dev
```

Mở dia chi Studio in terminal (mac dinh `http://localhost:3000`) de tua timeline tung frame.

## Render ra MP4

```bash
npm run render
# hoac
npx remotion render src/index.ts NghiQuyet57V2 out/nq57.mp4
```

## Cau truc thu muc

```
src/
  index.ts                           # entry, registerRoot
  Root.tsx                           # khai báo Composition NghiQuyet57V2
  compositions/
    NghiQuyet57VideoV2.tsx           # gep 7 canh bang TransitionSeries (cross-fade)
  scenes/
    NQ57ScenesV2.tsx                 # 7 canh: Title, Quote, Roles, Pillars, Stats, Vision, End
                                     # + SVG (RingDraw, UnderlineDraw, DataFlow, Gauge)
                                     # + KaraokeCaption + Three.js (Emblem3D, Bars3D)
  theme/
    nq57.ts                          # design tokens (mau, font) cho bo NQ57
  fonts/
    nq57.ts                          # font Be Vietnam Pro (Google Fonts)
  data/
    nq57.ts                          # SCENES (id/audio/caption/dur) — duoc gen_tts_v2.py sinh lai
legacy/                              # code cu HabitLoop + NQ57 V1 (tham khao lich su)
  HabitLoopVideo.tsx
  NghiQuyet57Video.tsx
  theme.ts
  gen_tts.py
  scenes/
    NQ57Scenes.tsx
    Scene1Orb.tsx
    Scene2Chart.tsx
  components/
    Icon3D.tsx
gen_tts_v2.py                        # sinh TTS da backend + cap nhat src/data/nq57.ts
remotion.config.ts                   # Remotion config (1080p, 30fps, h264, angle GL)
public/nq57/                         # audio mp3 (da sinh, da gitignore)
out/                                 # video xuat (da gitignore)
```

## Luu ky thuat (giu nguyen khi sua code)

- Trong moi component nam trong `<ThreeCanvas>`, **luon dung `useCurrentFrame()`** cua Remotion
  de animate — **khong dung `useFrame()`** goc cua React Three Fiber (chay theo dong ho thuc,
  khong tua duoc trong Studio va render sai khi xuat).
- `<Sequence>` boc `<ThreeCanvas>` phai co `layout="none"`; `<ThreeCanvas>` khai bao ro `width`/`height`.
- Voi Recharts (va moi lib chart/animation): tat animation noi bo (`isAnimationActive={false}`)
  va tu tinh gia tri theo `frame` bang `interpolate()`/`spring()` de render deterministic.
- Phu de: chi 1 dong, tu cuon (marquee) theo loi dang noi — xem `KaraokeCaption` trong
  `NQ57ScenesV2.tsx`. Moi canh audio duoc chen 0.5s nghi dau/cuoi de chuyen canh khong bi chong tieng.
- Font tieng Viet: Be Vietnam Pro (`@remotion/google-fonts`), load trong `fonts/nq57.ts`.

## File sinh tu dong (da gitignore)

`out/`, `public/nq57/*.mp3`, `public/nq57/durations.json`, `*.pyc`, `node_modules/`,
va moi file chua key. Clone ve chay `npm install` + `gen_tts_v2.py` la co the render lai.
