"""
Generate CR7Records narration audio files using edge_tts.

Single-speaker narration for 7 scenes.
Output: public/cr7/s1.mp3 ... s7.mp3
"""

import asyncio
import os
import json
import edge_tts
from mutagen.mp3 import MP3

VOICE = "vi-VN-NamMinhNeural"
RATE = "+0%"
VOLUME = "+0%"

SCRIPTS = {
    "s1": {
        "text": (
            "Cristiano Ronaldo. The Records. "
            "A career defined by numbers that speak for themselves."
        ),
        "caption": "Cristiano Ronaldo — The Records",
    },
    "s2": {
        "text": (
            "Career goals. Over nine hundred. "
            "The first player in football history to score over nine hundred official career goals."
        ),
        "caption": "Over nine hundred career goals",
    },
    "s3": {
        "text": (
            "Champions League. One hundred forty goals. "
            "More goals than any other player in the history of the competition."
        ),
        "caption": "Champions League all-time top scorer",
    },
    "s4": {
        "text": (
            "International goals. One hundred thirty six. "
            "More goals for Portugal than any other male player in history."
        ),
        "caption": "International top scorer for Portugal",
    },
    "s5": {
        "text": (
            "Major honours. Five Ballon d'Or. Five Champions League titles. "
            "One European Championship. Seven league titles across four countries."
        ),
        "caption": "Major honours across two decades",
    },
    "s6": {
        "text": (
            "Career span. Over twenty years. "
            "From Sporting CP in two thousand two to Al Nassr. Two decades of elite performance."
        ),
        "caption": "Twenty plus years at the highest level",
    },
    "s7": {
        "text": (
            "Legacy. Records are made to be broken. "
            "Some records may never be broken."
        ),
        "caption": "A legacy that may never be matched",
    },
}

OUT_DIR = os.path.join("public", "cr7")


async def generate_scene(scene_id: str, script: dict, max_retries: int = 3):
    out_path = os.path.join(OUT_DIR, f"{scene_id}.mp3")
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
    print(f"Generating {len(SCRIPTS)} scenes -> {OUT_DIR}/")
    results = {}
    for sid, script in SCRIPTS.items():
        sid, dur, cap = await generate_scene(sid, script)
        results[sid] = {"dur": round(dur, 3), "caption": cap}
    durations_path = os.path.join(OUT_DIR, "durations.json")
    with open(durations_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nDurations saved to {durations_path}")
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
