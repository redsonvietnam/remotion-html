"""
Generate Stoic Love narration audio files using edge_tts.

Single-speaker Vietnamese narration for 10 scenes.
Output: public/stoicLove/s1.mp3 ... s10.mp3
"""

import asyncio
import os
import json
import edge_tts
from mutagen.mp3 import MP3

# Vietnamese voice — natural, clear, contemplative
VOICE = "vi-VN-NamMinhNeural"
RATE = "-5%"
VOLUME = "+0%"

# Narration scripts — Vietnamese, cinematic philosophical tone
# Tone: calm, intimate, contemplative, measured pace
SCRIPTS = {
    "s1": {
        "text": (
            "Bạn có bao giờ tự hỏi... tại sao càng yêu một người, "
            "chúng ta lại càng sợ mất họ?"
        ),
        "caption": "Bạn có bao giờ tự hỏi... tại sao càng yêu một người, chúng ta lại càng sợ mất họ?",
    },
    "s2": {
        "text": (
            "Không phải tình yêu làm ta đau. "
            "Đó là mong muốn kiểm soát tình yêu làm ta đau."
        ),
        "caption": "Không phải tình yêu làm ta đau. Đó là mong muốn kiểm soát tình yêu làm ta đau.",
    },
    "s3": {
        "text": (
            "Phân biệt Khắc kỷ. Điều gì trong tay ta? "
            "Cách ta yêu, cách ta đối xử, sự trung thực. "
            "Điều gì không? Người ấy có ở lại, họ có yêu ta, tương lai quan hệ."
        ),
        "caption": "Phân biệt Khắc kỷ: Điều gì trong tay ta? Cách ta yêu, cách ta đối xử, sự trung thực. Điều gì không? Người ấy có ở lại, họ có yêu ta, tương lai quan hệ.",
    },
    "s4": {
        "text": (
            "Bạn có thể yêu một người sâu sắc "
            "mà không coi họ là tài sản của mình."
        ),
        "caption": "Bạn có thể yêu một người sâu sắc mà không coi họ là tài sản của mình.",
    },
    "s5": {
        "text": (
            "Không kiểm soát được trái tim người khác. "
            "Nhưng kiểm soát được cách mình yêu: "
            "tử tế, trung thành, thành thật, có trách nhiệm, giữ phẩm giá."
        ),
        "caption": "Không kiểm soát được trái tim người khác. Nhưng kiểm soát được cách mình yêu: tử tế, trung thành, thành thật, có trách nhiệm, giữ phẩm giá.",
    },
    "s6": {
        "text": (
            "Người mình yêu hôm nay không phải lời hứa họ ở bên mãi. "
            "Chính vì không chắc chắn, mỗi khoảnh khắc bên nhau mới đáng trân trọng."
        ),
        "caption": "Người mình yêu hôm nay không phải lời hứa họ ở bên mãi. Chính vì không chắc chắn, mỗi khoảnh khắc bên nhau mới đáng trân trọng.",
    },
    "s7": {
        "text": (
            "Nếu một ngày họ rời đi, tình yêu trước đó không vô nghĩa. "
            "Bạn có thể đau. Nhưng không cần đánh mất chính mình."
        ),
        "caption": "Nếu một ngày họ rời đi, tình yêu trước đó không vô nghĩa. Bạn có thể đau. Nhưng không cần đánh mất chính mình.",
    },
    "s8": {
        "text": (
            "Khắc kỷ không dạy ta yêu ít hơn. "
            "Nó dạy ta yêu mà không trao toàn bộ tự do của mình cho một người khác."
        ),
        "caption": "Khắc kỷ không dạy ta yêu ít hơn. Nó dạy ta yêu mà không trao toàn bộ tự do của mình cho một người khác.",
    },
    "s9": {
        "text": (
            "Yêu sâu sắc. Trân trọng hiện tại. "
            "Và để người mình yêu được tự do. "
            "Đó có thể là một cách rất Khắc kỷ để yêu."
        ),
        "caption": "Yêu sâu sắc. Trân trọng hiện tại. Và để người mình yêu được tự do. Đó có thể là một cách rất Khắc kỷ để yêu.",
    },
    "s10": {
        "text": (
            "YÊU MÀ KHÔNG SỞ HỮU. Stoicism × Love"
        ),
        "caption": "YÊU MÀ KHÔNG SỞ HỮU. Stoicism × Love",
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
    output_dir = os.path.join("public", "stoicLove")
    os.makedirs(output_dir, exist_ok=True)

    durations = []

    for scene_id, script in SCRIPTS.items():
        print(f"Generating {scene_id}...")
        mp3_path = await generate_audio(scene_id, script["text"], output_dir)
        duration = measure_duration(mp3_path)
        durations.append({
            "id": scene_id,
            "audio": f"stoicLove/{scene_id}.mp3",
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
    total = 0
    for d in durations:
        print(f"  {d['id']}: {d['dur']:.3f}s (audio: {d['audio']})")
        total += d['dur']
    print(f"Total narration: {total:.3f}s")


if __name__ == "__main__":
    asyncio.run(main())