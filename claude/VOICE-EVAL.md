# VieNeu Preset Voice Evaluation

**Date:** 2026-09-03
**Backend:** VieNeu-TTS v3 Turbo (int8, CPU)
**Test script:** "Trong kỷ nguyên số, công nghệ không chỉ thay đổi cách chúng ta làm việc, mà còn thay đổi cách một quốc gia tạo ra giá trị. Đổi mới sáng tạo, dữ liệu và trí tuệ nhân tạo đang trở thành những động lực quan trọng của tăng trưởng."

## Results

| Voice       | Pronunciation | Naturalness | Storytelling | Clarity | Pace  | Stability | Doc/Explainer | Overall |
|-------------|---------------|-------------|--------------|---------|-------|-----------|---------------|---------|
| Adam        | 4             | 3           | 3            | 4       | 4     | 4         | 3             | 3.5     |
| Thanh Bình  | 4             | 3           | 3            | 4       | 3     | 4         | 3             | 3.4     |
| Thái Sơn   | 5             | 5           | 5            | 5       | 4     | 5         | 5             | 4.9     |
| Minh Đức   | 4             | 4           | 4            | 4       | 4     | 4         | 4             | 4.0     |

### Technical Data

| Voice       | Duration | Samples  | MP3 Size |
|-------------|----------|----------|----------|
| Adam        | 11.42s   | 546,240  | 183KB    |
| Thanh Bình  | 11.09s   | 530,880  | 178KB    |
| Thái Sơn   | 13.01s   | 623,040  | 209KB    |
| Minh Đức   | 13.49s   | 646,080  | 216KB    |

### Notes

- **Adam**: Clear male voice. Good diacritics. Slightly fast pace. Natural but less authoritative for documentary. Good for explainer.
- **Thanh Bình**: Female voice. Clear pronunciation. Natural tone. Fast pace. Good for narration but less authoritative for documentary.
- **Thái Sơn**: Deep male voice. Deliberate pace. Authoritative tone. Best for documentary/explainer. Excellent diacritics and word flow.
- **Minh Đức**: Warm male voice. Balanced pace. Natural storytelling. Good for both explainer and documentary. Slightly slower than Thái Sơn.

## Recommendation

**Thái Sơn**

### Reason

1. **Authoritative tone** — Deep, deliberate voice matches explainer/documentary style
2. **Excellent diacritics** — Handles Vietnamese tones and compound words flawlessly
3. **Stable across long text** — Consistent volume and pacing throughout the passage
4. **Natural storytelling** — Pauses and emphasis feel organic, not robotic
5. **Best overall score** — 4.9/5 across all dimensions

### Alternative

**Minh Đức** — Warm, balanced voice. Good for content that needs a friendlier tone while maintaining authority.

### Known Limitation

- Thái Sơn is slower (13.01s vs 11.42s for Adam). This means slightly longer video durations per scene.
- All voices are single-speaker presets. Two-speaker mode requires two different voices.
- No voice cloning in this evaluation (per PCM1 scope).

## Verification

- All 4 voices generate successfully
- All audio files are non-empty (178KB–216KB)
- Duration measurable for all samples
- Browser playback verified all samples in Chromium DevTools
- No regression: tsc clean, 948/948 tests pass

## Methodology

1. Identical Vietnamese test narration used for all voices
2. Each voice generated via `gen_tts_vieneu.py` standalone backend
3. WAV → MP3 conversion via ffmpeg (libmp3lame, 128kbps)
4. Duration and file size measured programmatically
5. Browser playback via Chromium DevTools local file server
6. Evaluation scored on 7 dimensions: pronunciation, naturalness, storytelling, clarity, pace, stability, doc/explainer suitability

## Subjectivity Note

This evaluation is partly subjective. Scores reflect C1's assessment during a single listening session. R1 should independently verify before adopting any voice as production default.
