"""
Generate De An 06 narration audio files using edge_tts.

Single-speaker Vietnamese narration for 7 scenes.
Output: public/deAn06/s1.mp3 ... s7.mp3
"""

import asyncio
import os
import json
import edge_tts
from mutagen.mp3 import MP3

# Vietnamese voice — natural, clear, suitable for government video
VOICE = "vi-VN-NamMinhNeural"
RATE = "+0%"
VOLUME = "+0%"

# Narration scripts — Vietnamese, natural spoken language
# Tone: official, modern, clear, confident
# Each fits within scene duration (with 0.5s padding)
SCRIPTS = {
    "s1": {
        "text": (
            "Đề án sáu. Phát triển ứng dụng dữ liệu về dân cư, định danh và xác thực "
            "điện tử phục vụ chuyển đổi số quốc gia. Giai đoạn hai không hai hai đến hai không hai "
            "năm, tầm nhìn đến năm hai không ba mươi."
        ),
        "caption": (
            "Chào bạn. Hôm nay chúng ta cùng tìm hiểu về Đề án 06 — Phát triển ứng dụng "
            "dữ liệu về dân cư, định danh và xác thực điện tử phục vụ chuyển đổi số quốc gia."
        ),
    },
    "s2": {
        "text": (
            "Đề án quy định việc ứng dụng cơ sở dữ liệu quốc gia về dân cư, hệ thống định "
            "danh và xác thực điện tử, cùng thẻ Căn cước công dân gắn chip trong chuyển đổi "
            "số quốc gia."
        ),
        "caption": (
            "Đề án quy định việc ứng dụng cơ sở dữ liệu quốc gia về dân cư, hệ thống định danh "
            "và xác thực điện tử, thẻ Căn cước công dân gắn chip trong cuộc cuộc chuyển đổi số quốc gia."
        ),
    },
    "s3": {
        "text": (
            "Bộ Công an chủ trì quản lý dữ liệu dân cư và định danh. "
            "Bộ Thông tin và Truyền thông phối hợp. "
            "Các bộ, ngành và địa phương kết nối và khai thác dữ liệu."
        ),
        "caption": (
            "Bộ Công an chủ nhiệm quản lý cơ sở dữ liệu dân cư và hệ thống định danh. "
            "Bộ TT&TT phối hợp xây dựng cổng dịch vụ công quốc gia. "
            "Các bộ, ngành và địa phương kết nối, tích hợp chia sẻ dữ liệu."
        ),
    },
    "s4": {
        "text": (
            "Năm nhóm tiện ích: giải quyết thủ tục hành chính, phát triển kinh tế xã hội, "
            "phục vụ công dân số, kết nối dữ liệu, và chỉ đạo điều hành."
        ),
        "caption": (
            "Năm nhóm tiện ích cốt lõi: Giải quyết thủ tục hành chính, Phát triển kinh tế xã hội, "
            "Công dân số, Kết nối dữ liệu dân cư, Chỉ đạo điều hành của lãnh đạo các cấp."
        ),
    },
    "s5": {
        "text": (
            "Kết quả đạt được. Tám mươi bảy triệu thẻ Căn cước công dân gắn chip đã được cấp. "
            "Sáu mươi bảy triệu tài khoản VNeID đã kích hoạt. Năm mươi tiện ích trên VNeID, "
            "với khoảng ba triệu lượt truy cập mỗi ngày."
        ),
        "caption": (
            "Kết quả: 87 triệu thẻ Căn cước công dân gắn chip đã cấp. 67 triệu tài khoản VNeID "
            "đã kích hoạt. 50 tiện ích điện tử trên VNeID, trung bình 3 triệu lượt truy cập mỗi ngày."
        ),
    },
    "s6": {
        "text": (
            "Tầm nhìn đến năm hai không ba mươi. Mỗi người dân có một tài khoản định danh điện tử "
            "VNeID. Định danh toàn dân, tạo nền tảng thống nhất phục vụ chuyển đổi số quốc gia."
        ),
        "caption": (
            "Tầm nhìn 2030: Mỗi người dân có một tài khoản định danh điện tử VNeID. "
            "Định danh toàn dân, phục vụ chuyển đổi số toàn diện."
        ),
    },
    "s7": {
        "text": (
            "Đề án sáu, nền tảng số cho mỗi người dân. Định danh điện tử, "
            "chia sẻ một lần, sử dụng ở mọi nơi."
        ),
        "caption": (
            "Đề án 06 — Nền tảng số cho mỗi người dân. Định danh điện tử, chia sẻ một lần, "
            "sử dụng ở mọi nơi."
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
    output_dir = os.path.join("public", "deAn06")
    os.makedirs(output_dir, exist_ok=True)

    durations = []

    for scene_id, script in SCRIPTS.items():
        print(f"Generating {scene_id}...")
        mp3_path = await generate_audio(scene_id, script["text"], output_dir)
        duration = measure_duration(mp3_path)
        durations.append({
            "id": scene_id,
            "audio": f"deAn06/{scene_id}.mp3",
            "caption": script["caption"],
            "dur": round(duration, 3),
        })
        print(f"  {scene_id}: {duration:.3f}s")

    # Write durations.json
    durations_path = os.path.join(output_dir, "durations.json")
    with open(durations_path, "w", encoding="utf-8") as f:
        json.dump(durations, f, ensure_ascii=False, indent=2)
    print(f"\nDurations written to {durations_path}")

    # Print summary
    print("\n--- Summary ---")
    for d in durations:
        print(f"  {d['id']}: {d['dur']:.3f}s (audio: {d['audio']})")


if __name__ == "__main__":
    asyncio.run(main())
