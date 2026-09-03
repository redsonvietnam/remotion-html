"""
Generate Luat BHXH narration audio files using edge_tts.

Single-speaker Vietnamese narration for 5 scenes (Blueprint template).
Output: public/luatBHXH/s1.mp3 ... s5.mp3

NOTE: this script requires network access to Microsoft's edge-tts endpoint.
It was written but NOT executed in the environment that authored this
template (no outbound network access to TTS backends there) — run it
yourself, then re-run `node scripts/validate.mjs --project luatBHXH
--check-assets --check-durations` before rendering.
"""

import asyncio
import os
import json
import edge_tts
from mutagen.mp3 import MP3

# Vietnamese voice — clear, neutral, explanatory register (matches the
# "technical drafting" tone of the Blueprint template; not the softer
# NamMinh voice used for StoicLove).
VOICE = "vi-VN-HoaiMyNeural"
RATE = "-3%"
VOLUME = "+0%"

# Narration scripts — must stay word-for-word identical to the `caption`
# fields in src/data/luatBHXH.ts (the karaoke captions are generated from
# this same text).
SCRIPTS = {
    "s1": {
        "text": (
            "Ngày 29 tháng 6 năm 2024, Quốc hội thông qua Luật Bảo hiểm xã hội "
            "số 41 trên 2024. Đạo luật có hiệu lực từ ngày 1 tháng 7 năm 2025, "
            "thay thế Luật Bảo hiểm xã hội năm 2014."
        ),
    },
    "s2": {
        "text": (
            "Luật mới xây dựng trên bốn trụ cột cải cách: hệ thống an sinh đa tầng, "
            "mở rộng đối tượng tham gia, siết chặt điều kiện rút bảo hiểm một lần, "
            "và mở rộng quyền lợi cho người lao động."
        ),
    },
    "s3": {
        "text": (
            "Theo Điều 64, số năm đóng bảo hiểm xã hội tối thiểu để hưởng lương hưu "
            "giảm từ hai mươi năm xuống còn mười lăm năm, mở rộng cơ hội cho người "
            "có thời gian đóng ngắn hơn."
        ),
    },
    "s4": {
        "text": (
            "Từ ngày 1 tháng 7 năm 2025, người bắt đầu tham gia bảo hiểm xã hội "
            "chỉ được rút một lần trong một số trường hợp cụ thể: đủ tuổi hưu nhưng "
            "chưa đủ mười lăm năm đóng, ra nước ngoài định cư, hoặc mắc bệnh hiểm "
            "nghèo theo quy định."
        ),
    },
    "s5": {
        "text": (
            "Hành trình cải cách bắt đầu từ Nghị quyết 28 năm 2018 của Trung ương Đảng, "
            "qua việc Quốc hội thông qua luật vào tháng 6 năm 2024, và chính thức có "
            "hiệu lực từ ngày 1 tháng 7 năm 2025."
        ),
    },
    "s6": {
        "text": (
            "Luật Bảo hiểm xã hội 2024 đặt nền móng cho một hệ thống an sinh xã hội "
            "bền vững và bao trùm hơn cho người lao động Việt Nam."
        ),
    },
}


async def generate_audio(scene_id: str, text: str, output_dir: str):
    output_path = os.path.join(output_dir, f"{scene_id}.mp3")
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, volume=VOLUME)
    await communicate.save(output_path)
    return output_path


def measure_duration(mp3_path: str) -> float:
    audio = MP3(mp3_path)
    return audio.info.length


async def main():
    output_dir = os.path.join("public", "luatBHXH")
    os.makedirs(output_dir, exist_ok=True)

    durations = []

    for scene_id, script in SCRIPTS.items():
        print(f"Generating {scene_id}...")
        mp3_path = await generate_audio(scene_id, script["text"], output_dir)
        duration = measure_duration(mp3_path)
        durations.append({
            "id": scene_id,
            "audio": f"luatBHXH/{scene_id}.mp3",
            "dur": round(duration, 3),
        })
        print(f"  {scene_id}: {duration:.3f}s")

    durations_path = os.path.join(output_dir, "durations.json")
    with open(durations_path, "w", encoding="utf-8") as f:
        json.dump(durations, f, ensure_ascii=False, indent=2)
    print(f"\nDurations written to {durations_path}")
    print("\n--- Summary ---")
    total = 0.0
    for d in durations:
        print(f"  {d['id']}: {d['dur']:.3f}s (audio: {d['audio']})")
        total += d["dur"]
    print(f"Total narration: {total:.3f}s")
    print(
        "\nNext: update the `dur` fields in src/data/luatBHXH.ts to match the "
        "measured durations above (they are currently word-count estimates), "
        "then run: node scripts/validate.mjs --project luatBHXH --check-assets --check-durations"
    )


if __name__ == "__main__":
    asyncio.run(main())
