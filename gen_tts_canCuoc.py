"""
Generate Luật Căn cước 2023 narration audio files using edge_tts.

Single-speaker Vietnamese narration for 7 scenes.
Output: public/canCuoc/s1.mp3 ... s7.mp3  +  durations.json
"""

import asyncio
import os
import json
import edge_tts
from mutagen.mp3 import MP3

# Vietnamese voice — natural, clear, suitable for civic/legal video
VOICE = "vi-VN-NamMinhNeural"
RATE = "+0%"
VOLUME = "+0%"

# Narration scripts — Vietnamese, natural spoken language.
# Tone: factual, clear, confident. Each fits its scene.
# Facts verified against Cổng TTĐT Chính phủ / Bộ Công an (Cục C06).
SCRIPTS = {
    "s1": {
        "text": (
            "Chào bạn. Hôm nay chúng ta cùng tìm hiểu về Luật Căn cước 2023, "
            "được Quốc hội khóa XV thông qua ngày 27 tháng 11 năm 2023, "
            "và có hiệu lực từ ngày 1 tháng 7 năm 2024."
        ),
        "caption": (
            "Chào bạn. Hôm nay chúng ta cùng tìm hiểu về Luật Căn cước 2023, "
            "được Quốc hội khóa XV thông qua ngày 27 tháng 11 năm 2023, "
            "và có hiệu lực từ ngày 1 tháng 7 năm 2024."
        ),
    },
    "s2": {
        "text": (
            "Luật Căn cước là nền tảng định danh điện tử của công dân, "
            "phục vụ chuyển đổi số quốc gia và đơn giản hóa thủ tục hành chính."
        ),
        "caption": (
            "Luật Căn cước là nền tảng định danh điện tử của công dân, "
            "phục vụ chuyển đổi số quốc gia và đơn giản hóa thủ tục hành chính."
        ),
    },
    "s3": {
        "text": (
            "Ba nhóm chịu tác động chính. Một, người dân là trung tâm, là chủ thể được phục vụ. "
            "Hai, Bộ Công an và Cục Cảnh sát quản lý hành chính, gọi tắt là C06, cấp và quản lý căn cước. "
            "Ba, cơ quan, tổ chức và doanh nghiệp khai thác dữ liệu để cung cấp dịch vụ."
        ),
        "caption": (
            "Ba nhóm chịu tác động chính. Một, người dân là trung tâm, là chủ thể được phục vụ. "
            "Hai, Bộ Công an và Cục Cảnh sát quản lý hành chính, gọi tắt là C06, cấp và quản lý căn cước. "
            "Ba, cơ quan, tổ chức và doanh nghiệp khai thác dữ liệu để cung cấp dịch vụ."
        ),
    },
    "s4": {
        "text": (
            "Năm điểm mới quan trọng. Một, đổi tên từ Căn cước công dân thành Căn cước. "
            "Hai, cấp thẻ từ đủ 14 tuổi, có gắn chip điện tử. "
            "Ba, bỏ thông tin quê quán, thay bằng nơi đăng ký cư trú. "
            "Bốn, tích hợp thông tin như bảo hiểm, giấy phép lái xe theo yêu cầu. "
            "Năm, giữ nguyên số định danh cá nhân."
        ),
        "caption": (
            "Năm điểm mới quan trọng. Một, đổi tên từ Căn cước công dân thành Căn cước. "
            "Hai, cấp thẻ từ đủ 14 tuổi, có gắn chip điện tử. "
            "Ba, bỏ thông tin quê quán, thay bằng nơi đăng ký cư trú. "
            "Bốn, tích hợp thông tin như bảo hiểm, giấy phép lái xe theo yêu cầu. "
            "Năm, giữ nguyên số định danh cá nhân."
        ),
    },
    "s5": {
        "text": (
            "Về lộ trình triển khai. Luật được thông qua cuối năm 2023, "
            "có hiệu lực từ 1 tháng 7 năm 2024, tiến tới cấp thẻ cho người dân, "
            "tích hợp dữ liệu và số hóa dịch vụ công."
        ),
        "caption": (
            "Về lộ trình triển khai. Luật được thông qua cuối năm 2023, "
            "có hiệu lực từ 1 tháng 7 năm 2024, tiến tới cấp thẻ cho người dân, "
            "tích hợp dữ liệu và số hóa dịch vụ công."
        ),
    },
    "s6": {
        "text": (
            "Tầm nhìn. Hướng tới một trăm phần trăm dịch vụ công trực tuyến, "
            "xây dựng công dân số và xã hội số theo mục tiêu quốc gia."
        ),
        "caption": (
            "Tầm nhìn. Hướng tới một trăm phần trăm dịch vụ công trực tuyến, "
            "xây dựng công dân số và xã hội số theo mục tiêu quốc gia."
        ),
    },
    "s7": {
        "text": (
            "Căn cước số, công dân số. Hiểu đúng, dùng đúng, "
            "để mỗi người dân đều hưởng lợi thật từ chuyển đổi số. "
            "Luật Căn cước 2023, số 46 trên 2023, QH15."
        ),
        "caption": (
            "Căn cước số, công dân số. Hiểu đúng, dùng đúng, "
            "để mỗi người dân đều hưởng lợi thật từ chuyển đổi số. "
            "Luật Căn cước 2023, số 46 trên 2023, QH15."
        ),
    },
}


async def generate_audio(scene_id: str, text: str, output_dir: str):
    """Generate audio for a single scene using edge_tts."""
    output_path = os.path.join(output_dir, f"{scene_id}.mp3")
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, volume=VOLUME)
    await communicate.save(output_path)
    return output_path


def measure_duration(mp3_path: str) -> float:
    """Measure MP3 duration in seconds."""
    audio = MP3(mp3_path)
    return audio.info.length


async def main():
    output_dir = os.path.join("public", "canCuoc")
    os.makedirs(output_dir, exist_ok=True)

    durations = []

    for scene_id, script in SCRIPTS.items():
        print(f"Generating {scene_id}...")
        mp3_path = await generate_audio(scene_id, script["text"], output_dir)
        duration = measure_duration(mp3_path)
        durations.append({
            "id": scene_id,
            "audio": f"canCuoc/{scene_id}.mp3",
            "caption": script["caption"],
            "dur": round(duration, 3),
        })
        print(f"  {scene_id}: {duration:.3f}s")

    durations_path = os.path.join(output_dir, "durations.json")
    with open(durations_path, "w", encoding="utf-8") as f:
        json.dump(durations, f, ensure_ascii=False, indent=2)
    print(f"\nDurations written to {durations_path}")

    print("\n--- Summary ---")
    for d in durations:
        print(f"  {d['id']}: {d['dur']:.3f}s (audio: {d['audio']})")


if __name__ == "__main__":
    asyncio.run(main())
