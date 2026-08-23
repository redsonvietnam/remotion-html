"""
Generate Luật GTDB narration audio files using edge_tts.

Single-speaker Vietnamese narration for 7 scenes.
Output: public/luatGTDB/s1.mp3 ... s7.mp3
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
            "Luật ba mươi sáu. Trật tự, an toàn giao thông đường bộ. "
            "Luật số ba mươi sáu năm hai không hai mươi tư, Quốc hội khóa mười lăm. "
            "Có hiệu lực thi hành từ ngày một tháng một năm hai không hai mươi lăm."
        ),
        "caption": (
            "Chào bạn. Hôm nay chúng ta cùng tìm hiểu về Luật Trật tự, an toàn giao thông đường bộ — "
            "Luật số 36/2024/QH15, có hiệu lực từ ngày 1 tháng 1 năm 2025."
        ),
    },
    "s2": {
        "text": (
            "Luật ba mươi sáu năm hai không hai mươi tư thay thế Luật Giao thông đường bộ năm hai không "
            "tám. Quy định toàn diện về trật tự, an toàn giao thông đường bộ, bao gồm tổ chức giao "
            "thông, phương tiện, người lái xe và trách nhiệm của các cơ quan quản lý."
        ),
        "caption": (
            "Luật 36/2024/QH15 thay thế Luật Giao thông đường bộ 2008, quy định toàn diện về trật tự, "
            "an toàn giao thông đường bộ, bao gồm tổ chức giao thông, phương tiện, người lái xe và "
            "trách nhiệm của các cơ quan quản lý."
        ),
    },
    "s3": {
        "text": (
            "Năm nhóm quy định mới nổi bật: Bằng lái xe có điểm, An toàn trẻ em trên xe, "
            "Xe đưa đón học sinh, Biển số định danh và Phân hạng giấy phép lái xe."
        ),
        "caption": (
            "Năm nhóm quy định mới nổi bật: Bằng lái xe có điểm, An toàn trẻ em trên xe, "
            "Xe đưa đón học sinh, Biển số định danh và Phân hạng giấy phép lái xe."
        ),
    },
    "s4": {
        "text": (
            "Hệ thống bằng lái xe mười hai điểm. Khi mới cấp có mười hai điểm, bị trừ theo mức "
            "độ vi phạm. Mất hết mười hai điểm phải ngừng lái xe, sau sáu tháng mới được thi lại "
            "để khôi phục."
        ),
        "caption": (
            "Hệ thống bằng lái xe 12 điểm: Khi mới cấp có 12 điểm, bị trừ theo mức độ vi phạm. "
            "Mất hết 12 điểm phải ngừng lái xe, sau 6 tháng mới được thi lại để khôi phục."
        ),
    },
    "s5": {
        "text": (
            "Điểm mới quan trọng. Trẻ em dưới mười tuổi không được ngồi hàng ghế trước trên ô tô. "
            "Xe đưa đón học sinh phải có camera và thiết bị cảnh báo quên trẻ. "
            "Xe máy được chở hai người trong trường hợp đặc biệt."
        ),
        "caption": (
            "Điểm mới quan trọng: Trẻ em dưới 10 tuổi không được ngồi hàng ghế trước trên ô tô. "
            "Xe đưa đón học sinh phải có camera và thiết bị cảnh báo quên trẻ. "
            "Xe máy được chở 2 người trong trường hợp đặc biệt."
        ),
    },
    "s6": {
        "text": (
            "Nghị định một trăm sáu mươi tám năm hai không hai mươi tư quy định mức phạt mới. "
            "Từ bốn trăm nghìn đồng cho vi phạm nhẹ đến năm mươi triệu đồng cho các hành vi "
            "vi phạm nghiêm trọng như đua xe, sử dụng chân điều khiển vô lăng."
        ),
        "caption": (
            "Nghị định 168/2024/NĐ-CP quy định mức phạt mới: từ 400.000 đồng cho vi phạm nhẹ "
            "đến 50.000.000 đồng cho các hành vi vi phạm nghiêm trọng như đua xe, sử dụng chân "
            "điều khiển vô lăng."
        ),
    },
    "s7": {
        "text": (
            "Luật ba mươi sáu năm hai không hai mươi tư. Vì sự an toàn của mỗi người. "
            "Tuân thủ pháp luật, bảo vệ tính mạng chính mình và cộng đồng."
        ),
        "caption": (
            "Luật 36/2024/QH15 — Vì sự an toàn của mỗi người. Tuân thủ pháp luật, bảo vệ "
            "tính mạng chính mình và cộng đồng."
        ),
    },
}

OUT_DIR = os.path.join("public", "luatGTDB")

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
