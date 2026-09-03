"""
Generate Champions League Scrapbook narration audio files using edge_tts.

Single-speaker narration for 8 scenes.
Output: public/championsLeague/s1.mp3 ... s8.mp3
"""

import asyncio
import os
import json
import edge_tts
from mutagen.mp3 import MP3

VOICE = "vi-VN-NamMinhNeural"
RATE = "+0%"
VOLUME = "+0%"

# Scene mapping: scene_id -> (audio_file, text)
# We'll reorder audio files sequentially for clarity.
SCENES = {
    "hero": {
        "audio": "s1.mp3",
        "text": (
            "Giải Vô địch Câu lạc bộ Châu Âu. "
            "Giải đấu lớn nhất thế giới. "
            "Từ năm một chín chín bảy đến hai nghìn lăm."
        ),
        "caption": "Champions League 1997-2005",
    },
    "match-1999": {
        "audio": "s2.mp3",
        "text": (
            "Trận chung kết năm một chín chín chín. "
            "Manchester United gặp Bayern Munich. "
            "Hai bàn thắng trong hiệp bốn — trận chung kết vĩ đại nhất."
        ),
        "caption": "Final 1999",
    },
    "history-2002": {
        "audio": "s3.mp3",
        "text": (
            "Năm hai nghìn lăm. "
            "Cú volley của Zidane. "
            "Một trong những bàn thắng vĩ đại nhất lịch sử giải."
        ),
        "caption": "Zidane 2002",
    },
    "photos": {
        "audio": "s4.mp3",
        "text": (
            "Những khoảnh khắc biểu tượng. "
            "Những khoảnh khắc định nghĩa một kỷ nguyên."
        ),
        "caption": "Iconic Moments",
    },
    "match-2003": {
        "audio": "s5.mp3",
        "text": (
            "Trận chung kết năm hai nghìn lăm ba. "
            "AC Milan gặp Juventus. "
            "Hòa không bàn thắng, Milan thắng penalty."
        ),
        "caption": "Milan Derby 2003",
    },
    "history-2005": {
        "audio": "s6.mp3",
        "text": (
            "Năm hai nghìn lăm. "
            "Phép màu Istanbul. "
            "Liverpool gỡ hòa ba bàn trong sáu phút, thắng penalty."
        ),
        "caption": "Istanbul 2005",
    },
    "timeline": {
        "audio": "s7.mp3",
        "text": (
            "Dòng thời gian giải. "
            "Dortmund một chín chín bảy. "
            "United một chín chín chín. "
            "Zidane hai nghìn lăm hai. "
            "Istanbul hai nghìn lăm."
        ),
        "caption": "Timeline",
    },
    "closing": {
        "audio": "s8.mp3",
        "text": (
            "Trò chơi đẹp. "
            "Những khoảnh khắc sống mãi trong lịch sử bóng đá."
        ),
        "caption": "The Beautiful Game",
    },
}

OUT_DIR = os.path.join("public", "championsLeague")


async def generate_scene(scene_id: str, script: dict, max_retries: int = 3):
    out_path = os.path.join(OUT_DIR, script["audio"])
    for attempt in range(max_retries):
        try:
            communicate = edge_tts.Communicate(script["text"], VOICE, rate=RATE, volume=VOLUME)
            await communicate.save(out_path)
            audio = MP3(out_path)
            duration = audio.info.length
            print(f"  {scene_id}: {duration:.3f}s -> {out_path}")
            return scene_id, duration, script["caption"]
        except Exception as e:
            print(f"  {scene_id}: attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(1)
    raise RuntimeError(f"Failed to generate {scene_id} after {max_retries} attempts")


async def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"Generating {len(SCENES)} scenes -> {OUT_DIR}/")
    results = {}
    for sid, script in SCENES.items():
        sid, dur, cap = await generate_scene(sid, script)
        results[sid] = {"dur": round(dur, 3), "caption": cap}
    durations_path = os.path.join(OUT_DIR, "durations.json")
    with open(durations_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nDurations saved to {durations_path}")
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())