# CONTEXT — VieNeu-TTS Integration for Remotion

## Overview

Replace `edge_tts` (Microsoft) with **VieNeu-TTS** (Vietnamese-first, open-source) for all narration generation. VieNeu-TTS supports **voice cloning** — feed a 3-5s reference audio sample and the model replicates that voice for any text output.

**Goal:** All future videos use a single consistent narrator voice (Japanese-Phong's voice sample) instead of generic Microsoft neural voices.

---

## Current Architecture (TTS Pipeline)

```
gen_tts_*.py  →  edge_tts / omni / gemini / proxy  →  public/<project>/s{N}.mp3
                                                            ↓
                                              src/data/<project>.ts  (SCENES[].dur)
                                                            ↓
                                              Remotion Composition (Audio + Caption)
```

**Key files:**
- `gen_tts_v2.py` — 4 backends (edge, omni, gemini, proxy), outputs MP3 + durations.json + auto-updates `src/data/nq57.ts`
- `gen_tts_stoicLove.py` — single-speaker edge_tts, same pattern
- `src/data/contract.ts` — `SceneDef` interface: `{ id, audio, caption, dur }`
- `src/data/*.ts` — per-project content + scene definitions

---

## VieNeu-TTS Setup (Already Done)

**Location:** `D:\CODE2026\VieNeu-TTS`
**Python env:** `.venv` (uv-managed, Python 3.12)
**Model:** VieNeu-TTS-v3-Turbo (int8) — loaded on CPU

### Key SDK Pattern

```python
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from vieneu import Vieneu

tts = Vieneu()

# --- Option A: Preset voice (20 voices available) ---
voices = tts.list_preset_voices()  # [(description, voice_id), ...]
audio = tts.infer(text="Xin chào")

# --- Option B: Voice cloning (zero-shot, 3-5s reference) ---
ref_codes = tts.encode_reference("path/to/reference.mp3")
audio = tts.infer(
    text="Any text to speak",
    ref_codes=ref_codes,
    ref_text="EXACT transcription of what was said in reference.mp3",  # MUST match exactly
)

tts.save(audio, "output.wav")
tts.close()
```

### Voice Cloning Requirements

| Parameter | Requirement |
|-----------|-------------|
| `ref_audio` | 3-5 seconds, clean audio, no background noise |
| `ref_text` | **Exact transcription** of what was said in the reference audio |
| Language | Vietnamese audio works best |

### Reference Voice File

**Location:** `D:\CODE2026\voice_preview_nhật phong - narrative & compelling.mp3`

⚠️ **CRITICAL:** The `ref_text` parameter must contain the **exact words spoken** in this MP3 file. The user must listen and transcribe it manually. Until then, voice cloning will not produce accurate results.

---

## Integration Plan

### Phase 1: Create `gen_tts_vieneu.py` (New Backend)

Add VieNeu-TTS as backend option alongside existing backends. Pattern:

```python
# gen_tts_vieneu.py
REF_AUDIO = r"D:\CODE2026\voice_preview_nhật phong - narrative & compelling.mp3"
REF_TEXT = "EXACT TRANSCRIPTION HERE"  # User must fill this in

def vieneu_turn(text, tts, ref_codes, ref_text, output_path):
    """Generate single turn with voice cloning."""
    audio = tts.infer(text=text, ref_codes=ref_codes, ref_text=ref_text)
    # VieNeu outputs WAV — convert to MP3 for consistency
    tts.save(output_path.replace(".mp3", ".wav"))
    subprocess.run([FF, "-y", "-i", wav, "-c:a", "libmp3lame", "-b:a", "128k", output_path])
    os.remove(wav)
```

### Phase 2: Integrate into Existing Scripts

Modify `gen_tts_v2.py` to add `--backend vieneu`:

```bash
# Usage
python gen_tts_v2.py --backend vieneu
```

The script already supports multiple backends — add vieneu alongside edge/omni/gemini/proxy.

### Phase 3: Auto-update `src/data/*.ts`

The existing pipeline already auto-generates TypeScript data files with durations. VieNeu-TTS output follows the same `SceneDef` contract — no changes needed to Remotion compositions.

---

## Output Contract (Unchanged)

```typescript
// src/data/contract.ts
interface SceneDef {
  id: string;       // "s1", "s2", ...
  audio: string;    // "stoicLove/s1.mp3" (relative to public/)
  caption: string;  // on-screen narration text
  dur: number;      // seconds
}
```

VieNeu-TTS generates WAV → convert to MP3 → same output path → same data contract.

---

## Differences from edge_tts

| Aspect | edge_tts | VieNeu-TTS |
|--------|----------|------------|
| Voice quality | Good (Microsoft neural) | Better (Vietnamese-native) |
| Voice cloning | ❌ Not supported | ✅ Zero-shot cloning |
| Speed | Fast (cloud API) | Slower (local CPU, ~1x realtime) |
| Voices | 2 Vietnamese voices | 20 preset + any cloned voice |
| Dependencies | `edge_tts` pip package | `vieneu` (full model, ~500MB) |
| Offline | ❌ Requires internet | ✅ Fully offline |
| Output | MP3 direct | WAV (need ffmpeg convert) |

---

## Preset Voices Available

```
Minh Đức   — Nam · Bắc · Phong cách tin tức
Phạm Tuyên — Nam · Bắc · Phong cách tự nhiên
Thái Sơn  — Nam · Nam · Phong cách kể chuyện
Xuân Vĩnh  — Nam · Nam · Phong cách tự nhiên
Thanh Bình — Nam · Bắc · Phong cách kể chuyện
Trúc Ly   — Nữ · Bắc · Phong cách tự nhiên
Ngọc Linh  — Nữ · Bắc · Phong cách kể chuyện
Đoan Trang — Nữ · Bắc · Phong cách tự nhiên
Mai Anh    — Nữ · Bắc · Phong cách tin tức
Thục Đoan  — Nữ · Nam · Phong cách kể chuyện
Minh Triết — Nam · Nam · Phong cách tin tức
Thùy Dung  — Nữ · Nam · Phong cách tin tức
Quang Sơn  — Nam · Trung · Phong cách tự nhiên
Ngọc Trân  — Nữ · Trung · Phong cách tự nhiên
Mỹ Duyên   — Nữ · Nam · Phong cách đọc truyện
Quỳnh Anh  — Nữ · Bắc · Phong cách đọc truyện
Đức Trí    — Nam · Nam · Phong cách đọc truyện
Kim Thanh  — Nữ · Nam · Phong cách đọc truyện
Ngọc Huyền — Nữ · Bắc · Giọng đọc tự nhiên
Adam       — Nam · Nam · Giọng đọc tự nhiên
```

---

## Render Considerations

- VieNeu-TTS runs on CPU (no GPU on this machine) — generation speed ~1x realtime
- For a 60s video, expect ~60s generation time
- Model loads once, then reuse for all turns in a session
- `encode_reference()` should be called once per session (cached)
- WAV→MP3 conversion adds ~0.5s per file (ffmpeg)

---

## Action Items for Architect

1. **Listen to** `voice_preview_nhật phong - narrative & compelling.mp3` and write down the exact transcription → set as `REF_TEXT`
2. **Create** `gen_tts_vieneu.py` following the pattern in `gen_tts_v2.py`
3. **Test** with one project (e.g., stoicLove) before rolling out to all
4. **Decide:** Use voice cloning (ref_audio + ref_text) OR use a preset voice like "Adam" or "Thanh Bình"
5. **Update** `gen_tts_v2.py` to support `--backend vieneu` flag
6. **No changes** needed to Remotion compositions — same `SceneDef` contract

---

## Quick Test Command

```bash
cd D:\CODE2026\VieNeu-TTS
$env:HF_HOME = "D:\CODE2026\VieNeu-TTS\.hf_cache"
uv run python -c "
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from vieneu import Vieneu
tts = Vieneu()
audio = tts.infer('Xin chào, đây là giọng nói mẫu.')
tts.save(audio, 'test_quick.wav')
print('OK')
tts.close()
"
```

---

## File Reference

| File | Purpose |
|------|---------|
| `D:\CODE2026\VieNeu-TTS\` | VieNeu-TTS installation + venv |
| `D:\CODE2026\VieNeu-TTS\clone_voice.py` | Voice cloning test script |
| `D:\CODE2026\voice_preview_*.mp3` | Reference voice sample |
| `remotion-html-project\gen_tts_v2.py` | Existing TTS pipeline (4 backends) |
| `remotion-html-project\gen_tts_stoicLove.py` | Existing stoicLove TTS |
| `remotion-html-project\src\data\contract.ts` | SceneDef interface |
| `remotion-html-project\src\data\*.ts` | Per-project content data |
