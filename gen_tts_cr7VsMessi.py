"""
Generate CR7VsMessi narration audio files using edge_tts.

Single-speaker narration for 7 scenes.
Output: public/cr7vsMessi/s1.mp3 ... s7.mp3
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
            "Ronaldo versus Messi. The Eternal Debate. "
            "Two legends. One question. Numbers tell the story."
        ),
        "caption": "Ronaldo versus Messi — the eternal debate",
    },
    "s2": {
        "text": (
            "Career goals. Ronaldo leads with over nine hundred. "
            "Ronaldo: over nine hundred goals. Messi: over eight hundred goals. Both all-time greats."
        ),
        "caption": "Career goals — Ronaldo leads with over nine hundred",
    },
    "s3": {
        "text": (
            "Champions League. Ronaldo all-time top scorer with one hundred forty. "
            "Ronaldo: one hundred forty CL goals. Messi: one hundred twenty nine. Both dominated Europe."
        ),
        "caption": "Champions League — Ronaldo all-time top scorer",
    },
    "s4": {
        "text": (
            "Ballon d'Or. Messi holds the record with eight. "
            "Messi: eight Ballon d'Or. Ronaldo: five. Individual brilliance defined an era."
        ),
        "caption": "Ballon d'Or — Messi holds the record with eight",
    },
    "s5": {
        "text": (
            "Head to head. Two legends compared. "
            "Ronaldo: over nine hundred goals, five Ballon d'Or. "
            "Messi: over eight hundred goals, eight Ballon d'Or."
        ),
        "caption": "Head to head — two legends compared",
    },
    "s6": {
        "text": (
            "International. Ronaldo top scorer for Portugal with one hundred thirty six. "
            "Ronaldo: one hundred thirty six for Portugal. Messi: one hundred eight for Argentina."
        ),
        "caption": "International — Ronaldo top scorer for Portugal",
    },
    "s7": {
        "text": (
            "Legacy. There is no winner. "
            "Only two legends who pushed each other to greatness."
        ),
        "caption": "No winner — only two legends who pushed each other",
    },
}

OUT_DIR = os.path.join("public", "cr7vsMessi")


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
