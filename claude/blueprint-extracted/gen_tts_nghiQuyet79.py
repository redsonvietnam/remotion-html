"""
Generate Nghị Quyết 79 narration audio files using edge_tts.

Single-speaker Vietnamese narration for 7 scenes.
Output: public/nghiQuyet79/s1.mp3 ... s7.mp3
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
            "Chào bạn. Hôm nay chúng ta cùng tìm hiểu về Nghị quyết bảy chín "
            "N Q slash T W của Bộ Chính trị — Phát triển kinh tế nhà nước. "
            "Ngày ký: sáu tháng một năm hai không hai sáu, bởi Tổng Bí thư Tô Lâm."
        ),
        "caption": (
            "Chào bạn. Hôm nay chúng ta cùng tìm hiểu về Nghị quyết 79-NQ/TW của Bộ Chính trị "
            "— Phát triển kinh tế nhà nước. Ngày ký: 6 tháng 1 năm 2026, bởi Tổng Bí thư Tô Lâm."
        ),
    },
    "s2": {
        "text": (
            "Kinh tế nhà nước là thành phần đặc biệt quan trọng của nền kinh tế thị trường "
            "định hướng xã hội chủ nghĩa. Nền tảng bao gồm đất đai, tài nguyên, hạ tầng, "
            "ngân sách, dự trữ quốc gia, doanh nghiệp nhà nước và đơn vị sự nghiệp công lập."
        ),
        "caption": (
            "Kinh tế nhà nước là thành phần đặc biệt quan trọng của nền kinh tế thị trường "
            "định hướng xã hội chủ nghĩa. Nền tảng bao gồm đất đai, tài nguyên, hạ tầng, "
            "ngân sách, dự trữ quốc gia, doanh nghiệp nhà nước và đơn vị sự nghiệp công lập."
        ),
    },
    "s3": {
        "text": (
            "Bốn quan điểm chỉ đạo: Kinh tế nhà nước giữ vai trò chủ đạo, bảo đảm ổn định "
            "vĩ mô, định hướng chiến lược, quốc phòng, an ninh. Bình đẳng trước pháp luật "
            "với các khu vực kinh tế khác. Khơi thông và sử dụng hiệu quả nguồn lực, "
            "chống thất thoát, lãng phí. Tiên phong kiến tạo phát triển, dẫn dắt công nghiệp "
            "hóa, hiện đại hóa, làm chủ công nghệ chiến lược."
        ),
        "caption": (
            "Bốn quan điểm chỉ đạo: Kinh tế nhà nước giữ vai trò chủ đạo, bình đẳng trước "
            "pháp luật với các khu vực kinh tế khác, khơi thông và sử dụng hiệu quả nguồn lực, "
            "tiên phong kiến tạo phát triển và làm chủ công nghệ chiến lược."
        ),
    },
    "s4": {
        "text": (
            "Năm nhóm nguồn lực của kinh tế nhà nước: Đất đai và tài nguyên khoáng sản, "
            "nước, biển, đảo. Kết cấu hạ tầng chiến lược và hạ tầng số. Ngân sách nhà nước, "
            "dự trữ quốc gia, quỹ tài chính. Doanh nghiệp nhà nước, tổ chức tín dụng nhà nước. "
            "Vốn nhà nước tại doanh nghiệp, đơn vị sự nghiệp công lập."
        ),
        "caption": (
            "Năm nhóm nguồn lực: đất đai và tài nguyên, kết cấu hạ tầng chiến lược, ngân sách "
            "và dự trữ quốc gia, doanh nghiệp và tổ chức tín dụng nhà nước, vốn nhà nước "
            "và đơn vị sự nghiệp công lập."
        ),
    },
    "s5": {
        "text": (
            "Mục tiêu đến năm hai không ba mươi: Năm mươi doanh nghiệp nhà nước vào nhóm "
            "năm trăm doanh nghiệp lớn nhất Đông Nam Á. Một đến ba doanh nghiệp nhà nước "
            "vào nhóm năm trăm doanh nghiệp lớn nhất thế giới. Trăm phần trăm doanh nghiệp "
            "nhà nước thực hiện quản trị hiện đại trên nền tảng số. Nợ công không quá sáu mươi "
            "phần trăm G D P. Chi đầu tư phát triển ba mươi lăm đến bốn mươi phần trăm tổng "
            "chi ngân sách."
        ),
        "caption": (
            "Mục tiêu 2030: 50 doanh nghiệp nhà nước vào Top 500 Đông Nam Á, 1 đến 3 vào "
            "Top 500 thế giới, 100% quản trị hiện đại trên nền tảng số, nợ công không quá "
            "60% GDP, chi đầu tư 35-40% tổng chi ngân sách."
        ),
    },
    "s6": {
        "text": (
            "Tầm nhìn năm hai không bốn năm: Dự trữ quốc gia đạt hai phần trăm G D P. "
            "Sáu mươi doanh nghiệp nhà nước vào Top 500 Đông Nam Á. Năm doanh nghiệp nhà "
            "nước vào Top 500 thế giới. Năm mươi phần trăm đơn vị sự nghiệp công lập tự bảo "
            "đảm. Kinh tế nhà nước tự chủ, tự cường, cạnh tranh toàn diện, hội nhập sâu rộng "
            "vào kinh tế toàn cầu."
        ),
        "caption": (
            "Tầm nhìn 2045: Dự trữ quốc gia 2% GDP, 60 doanh nghiệp nhà nước Top 500 Đông Nam Á, "
            "5 Top 500 thế giới, 50% đơn vị sự nghiệp công lập tự bảo đảm. Kinh tế nhà nước "
            "tự chủ, tự cường, cạnh tranh toàn diện, hội nhập sâu rộng."
        ),
    },
    "s7": {
        "text": (
            "Kinh tế nhà nước: Hiệu quả hơn, tiên phong hơn, dẫn dắt hơn. Góp phần xây dựng "
            "nền kinh tế tự chủ, tự lực, tự cường, phát triển nhanh và bền vững. "
            "Nghị quyết bảy chín N Q slash T W."
        ),
        "caption": (
            "Kinh tế nhà nước: Hiệu quả hơn, tiên phong hơn, dẫn dắt hơn. Góp phần xây dựng "
            "nền kinh tế tự chủ, tự lực, tự cường, phát triển nhanh và bền vững. "
            "Nghị quyết 79-NQ/TW."
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
    output_dir = os.path.join("public", "nghiQuyet79")
    os.makedirs(output_dir, exist_ok=True)

    durations = []

    for scene_id, script in SCRIPTS.items():
        print(f"Generating {scene_id}...")
        mp3_path = await generate_audio(scene_id, script["text"], output_dir)
        duration = measure_duration(mp3_path)
        durations.append({
            "id": scene_id,
            "audio": f"nghiQuyet79/{scene_id}.mp3",
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