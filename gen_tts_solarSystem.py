import os
import sys
import asyncio
import json
import edge_tts
from mutagen.mp3 import MP3

VOICE = "vi-VN-NamMinhNeural"
DEFAULT_OUTPUT_DIR = "public/solarSystem"
RETRY_COUNT = 3

SCENES = {
    "s1": "Hệ mặt trời của chúng ta. Tám hành tinh, hàng trăm vệ tinh, và vô số bí ẩn.",
    "s2": "Sao Thủy. Hành tinh gần mặt trời nhất. Thời gian quay quanh mặt trời chỉ tám mươi tám ngày. Bề mặt có nhiệt độ cực đoan.",
    "s3": "Sao Kim. Nóng hơn Trái Đất ba trăm bốn mươi bảy độ. Nhiệt độ bề mặt lên đến bốn trăm sáu mươi hai độ Celsius.",
    "s4": "Trái Đất. Hành tinh duy nhất được biết có sự sống. Bao phủ bảy mươi một phần trăm bởi nước lỏng.",
    "s5": "Sao Hỏa. Hành tinh đỏ. Có hai vệ tinh: Phobos và Deimos.",
    "s6": "Sao Mộc. Hành tinh khổng lồ. Bốn vệ tinh lớn: Io, Europa, Ganymede, Callisto.",
    "s7": "Sao Thổ. Hành tinh có vành đai đẹp nhất. Thời gian quay quanh mặt trời hai mươi chín rưỡi năm.",
    "s8": "Sao Thiên Vương và Sao Hải Vương. Hành tinh băng giá xa nhất trong hệ mặt trời.",
    "s9": "Hệ mặt trời tuyệt đẹp. Từ Sao Thủy nhỏ bé đến Sao Mộc khổng lồ, mỗi hành tinh đều có câu chuyện riêng."
}


async def generate_audio(scene_id, text, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"{scene_id}.mp3")

    for attempt in range(1, RETRY_COUNT + 1):
        try:
            print(f"  [{scene_id}] Attempt {attempt}/{RETRY_COUNT}...")
            communicate = edge_tts.Communicate(text, VOICE)
            await communicate.save(output_path)
            print(f"  [{scene_id}] Done -> {output_path}")
            return output_path
        except Exception as e:
            print(f"  [{scene_id}] Error: {e}")
            if attempt < RETRY_COUNT:
                await asyncio.sleep(2)
    print(f"  [{scene_id}] FAILED after {RETRY_COUNT} attempts")
    return None


def validate_output_dir(output_dir):
    """Validate output directory is project-relative and safe."""
    if not output_dir:
        return DEFAULT_OUTPUT_DIR
    
    # Reject absolute paths
    if os.path.isabs(output_dir):
        raise ValueError("Output directory must be project-relative")
    
    # Reject traversal attempts
    if ".." in output_dir.split(os.sep) or ".." in output_dir.split("/"):
        raise ValueError("Output directory must not traverse outside project")
    
    # Reject empty segments
    parts = output_dir.replace("\\", "/").split("/")
    if "" in parts:
        raise ValueError("Output directory contains empty segments")
    
    return output_dir


async def main():
    # Parse command-line arguments
    output_dir = DEFAULT_OUTPUT_DIR
    if len(sys.argv) > 1:
        output_dir = validate_output_dir(sys.argv[1])
    
    print(f"Generating TTS with voice: {VOICE}")
    print(f"Output directory: {output_dir}\n")

    results = {}
    for scene_id, text in SCENES.items():
        path = await generate_audio(scene_id, text, output_dir)
        results[scene_id] = path

    durations = {}
    for scene_id, path in results.items():
        if path and os.path.exists(path):
            audio = MP3(path)
            durations[scene_id] = round(audio.info.length, 3)
            print(f"  {scene_id}: {durations[scene_id]}s")

    durations_path = os.path.join(output_dir, "durations.json")
    with open(durations_path, "w", encoding="utf-8") as f:
        json.dump(durations, f, indent=2, ensure_ascii=False)
    print(f"\nSaved durations.json -> {durations_path}")

    print("\nGenerated files:")
    for scene_id in sorted(results):
        path = results[scene_id]
        if path and os.path.exists(path):
            size = os.path.getsize(path)
            print(f"  {scene_id}.mp3: {size:,} bytes ({durations.get(scene_id, '?')}s)")
        else:
            print(f"  {scene_id}.mp3: MISSING")


if __name__ == "__main__":
    asyncio.run(main())
