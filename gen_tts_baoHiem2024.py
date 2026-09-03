"""
Generate BaoHiem2024 narration audio files using edge_tts.

Single-speaker Vietnamese narration for 6 scenes.
Output: public/baoHiem2024/s1.mp3 ... s6.mp3
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
            "Luật Bảo hiểm Xã hội số bốn mươi mốt năm hai không hai mươi tư. "
            "Những điểm mới quan trọng mà người lao động và doanh nghiệp cần nắm rõ. "
            "Hiệu lực từ ngày một tháng bảy năm hai không hai mươi lăm."
        ),
        "caption": (
            "Luật Bảo hiểm Xã hội số 41 năm 2024 — những điểm mới quan trọng mà người lao động và doanh nghiệp cần nắm rõ."
        ),
    },
    "s2": {
        "text": (
            "Hệ thống Bảo hiểm Xã hội hoạt động theo cơ chế đóng góp ba bên: "
            "người lao động, doanh nghiệp và Nhà nước cùng xây dựng quỹ chung."
        ),
        "caption": (
            "Hệ thống BHXH hoạt động theo cơ chế đóng góp ba bên: người lao động, doanh nghiệp và Nhà nước cùng xây dựng quỹ chung."
        ),
    },
    "s3": {
        "text": (
            "Tỷ lệ đóng Bảo hiểm Xã hội bắt buộc: doanh nghiệp đóng mười bảy phẩy năm phần trăm. "
            "Người lao động đóng tám phần trăm. Tổng cộng hai mươi lăm phẩy năm phần trăm mức lương làm căn cứ."
        ),
        "caption": (
            "Tỷ lệ đóng BHXH bắt buộc: doanh nghiệp đóng 17,5% — người lao động đóng 8% — tổng cộng 25,5% mức lương làm căn cứ."
        ),
    },
    "s4": {
        "text": (
            "Người lao động tham gia Bảo hiểm Xã hội bắt buộc được hưởng sáu chế độ: "
            "ốm đau, thai sản, tai nạn lao động, hưu trí, tử tuất và thất nghiệp."
        ),
        "caption": (
            "Người lao động tham gia BHXH bắt buộc được hưởng 6 chế độ: ốm đau, thai sản, tai nạn lao động, hưu trí, tử tuất và thất nghiệp."
        ),
    },
    "s5": {
        "text": (
            "Điểm mới nổi bật: giảm điều kiện hưởng lương hưu từ hai mươi xuống còn mười lăm năm đóng. "
            "Hạn chế rút Bảo hiểm Xã hội một lần. Mở rộng đối tượng tham gia."
        ),
        "caption": (
            "Điểm mới nổi bật: giảm điều kiện hưởng lương hưu từ 20 xuống còn 15 năm đóng; hạn chế rút BHXH một lần; mở rộng đối tượng tham gia."
        ),
    },
    "s6": {
        "text": (
            "Bảo hiểm Xã hội bảo vệ tương lai của bạn. "
            "Luật bốn mươi mốt năm hai không hai mươi tư hiệu lực từ ngày một tháng bảy năm hai không hai mươi lăm."
        ),
        "caption": (
            "BHXH bảo vệ tương lai của bạn. Luật 41/2024 hiệu lực từ 01 tháng 7 năm 2025."
        ),
    },
}

OUT_DIR = os.path.join("public", "baoHiem2024")


async def generate_scene(scene_id: str, script: dict):
    out_path = os.path.join(OUT_DIR, f"{scene_id}.mp3")
    communicate = edge_tts.Communicate(script["text"], VOICE, rate=RATE, volume=VOLUME)
    await communicate.save(out_path)
    audio = MP3(out_path)
    duration = audio.info.length
    print(f"  {scene_id}: {duration:.3f}s -> {out_path}")
    return scene_id, duration, script["caption"]


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