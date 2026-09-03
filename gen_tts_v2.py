import asyncio, io, os, json, subprocess, sys, argparse

# Force UTF-8 on Windows (VieNeu venv may default to cp1252)
os.environ.setdefault("PYTHONUTF8", "1")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from mutagen.mp3 import MP3
import edge_tts

OUT = "public/nq57"
os.makedirs(OUT, exist_ok=True)
FF = subprocess.check_output(
    ["powershell", "-c",
     "Get-ChildItem node_modules/ffmpeg-static -Recurse -Filter ffmpeg.exe | Select-Object -First 1 | Select-Object -ExpandProperty FullName"],
    shell=True).decode().strip()

VOICE = {"A": "vi-VN-NamMinhNeural", "B": "vi-VN-HoaiMyNeural"}
ROLE = {"A": "MC", "B": "Chuyên gia"}

# VieNeu-TTS backend (lazy-loaded)
_VIENEU_BACKEND = None


def _get_vieneu_backend():
    """Lazy-init VieNeu backend (model loads once).

    HF_HOME resolution order:
      1. Existing HF_HOME env var (honored as-is)
      2. VIENEU_HF_HOME env var (VieNeu-specific override)
      3. Not set — let the SDK use its own default (~/.cache/huggingface)
    """
    global _VIENEU_BACKEND
    if _VIENEU_BACKEND is None:
        if sys.stdout.encoding != "utf-8":
            sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
        # Honor existing HF_HOME; allow VIENEU_HF_HOME as a VieNeu-specific override.
        # Never hardcode a machine-specific path.
        if "HF_HOME" not in os.environ and "VIENEU_HF_HOME" in os.environ:
            os.environ["HF_HOME"] = os.environ["VIENEU_HF_HOME"]
        try:
            from gen_tts_vieneu import VieneuBackend
        except ImportError:
            raise SystemExit(
                "gen_tts_vieneu.py not found. "
                "Ensure it is in the same directory as gen_tts_v2.py."
            )
        _VIENEU_BACKEND = VieneuBackend()
        _VIENEU_BACKEND.init()
    return _VIENEU_BACKEND


def _close_vieneu():
    global _VIENEU_BACKEND
    if _VIENEU_BACKEND is not None:
        _VIENEU_BACKEND.close()
        _VIENEU_BACKEND = None

# (speaker, text) per scene; alternating voices => NotebookLM-style 2-speaker
DIALOGUE = [
    ("s1", [
        ("A", "Chào bạn. Hôm nay chúng ta cùng giải mã một văn kiện đang làm thay đổi cuộc chơi: Nghị quyết 57 của Bộ Chính trị, ban hành ngày 22 tháng 12 năm 2024."),
        ("B", "Đúng vậy. Đó là Nghị quyết về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia."),
    ]),
    ("s2", [
        ("A", "Tại sao nó lại được gọi là đột phá?"),
        ("B", "Vì Nghị quyết xác định đây là đột phá quan trọng hàng đầu, là động lực chính để đưa đất nước bứt phá trong kỷ nguyên mới."),
    ]),
    ("s3", [
        ("A", "Vậy ai là người làm nên cuộc cách mạng này?"),
        ("B", "Người dân và doanh nghiệp là trung tâm, là chủ thể và động lực chính. Nhà khoa học là nhân tố then chốt. Và Nhà nước giữ vai trò dẫn dắt."),
    ]),
    ("s4", [
        ("A", "Có những trụ cột nào?"),
        ("B", "Năm trụ cột cốt lõi: Thể chế, Nhân lực, Hạ tầng, Dữ liệu và Công nghệ chiến lược. Trong đó, thể chế là điều kiện tiên quyết, đi trước một bước."),
    ]),
    ("s5", [
        ("A", "Đích đến cụ thể là gì?"),
        ("B", "Đến năm 2030, quy mô kinh tế số đạt tối thiểu 30% GDP. Trên 80% giao dịch với cơ quan nhà nước thực hiện trực tuyến. Và Việt Nam nằm trong nhóm 3 nước dẫn đầu Đông Nam Á về trí tuệ nhân tạo."),
    ]),
    ("s6", [
        ("A", "Còn xa hơn, năm 2045?"),
        ("B", "Đến 2045, Việt Nam trở thành nước phát triển, thu nhập cao. Kinh tế số đạt tối thiểu 50% GDP, thuộc nhóm 30 nước dẫn đầu thế giới về đổi mới sáng tạo."),
    ]),
    ("s7", [
        ("A", "Một tầm nhìn tham vọng."),
        ("B", "Và nó chỉ thành hiện thực nếu chúng ta hành động ngay hôm nay."),
        ("A", "Nghị quyết 57 — khởi động kỷ nguyên vươn mình của dân tộc. Hành động hôm nay, để Việt Nam hùng cường ngày mai."),
    ]),
]


def edge_turn(text, voice, path):
    last = None
    for attempt in range(4):
        try:
            comm = edge_tts.Communicate(text, voice)
            with open(path, "wb") as f:
                async def _dump():
                    async for ch in comm.stream():
                        if ch["type"] == "audio":
                            f.write(ch["data"])
                asyncio.run(_dump())
            if os.path.getsize(path) > 0:
                return
        except Exception as e:
            last = e
            asyncio.sleep(1.5 * (attempt + 1))
    raise last or RuntimeError("edge-tts failed")


_OMNI_MODEL = None


def omni_turn(text, spk, path):
    global _OMNI_MODEL
    try:
        import torch
        from omnivoice.models.omnivoice import OmniVoice
        import soundfile as sf
    except Exception as e:
        raise SystemExit("OmniVoice chưa cài. Chạy: pip install omnivoice soundfile torch.") from e
    if _OMNI_MODEL is None:
        _OMNI_MODEL = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
    # Voice Design: giong tuy bien (khong can audio tham chieu).
    # language="Vietnamese" + instruct chi nhan tu vung co dinh (male/female, pitch, age...).
    instruct = "male, low pitch, middle-aged" if spk == "A" else "female, moderate pitch, young adult"
    audios = _OMNI_MODEL.generate(
        text=text, language="Vietnamese", instruct=instruct,
        num_step=32, guidance_scale=2.0, speed=1.0, denoise=True, postprocess_output=True,
    )
    wav = path.replace(".mp3", ".wav")
    sf.write(wav, audios[0], _OMNI_MODEL.sampling_rate)
    subprocess.run([FF, "-y", "-i", wav, "-c:a", "libmp3lame", "-b:a", "128k", path.replace("\\", "/")],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    os.remove(wav)


def tts_for(backend, spk, text, path, voice_map=None):
    if backend == "omni":
        omni_turn(text, spk, path)
    elif backend == "proxy":
        proxy_turn(text, spk, path)
    elif backend == "vieneu":
        vieneu_turn(text, spk, path, voice_map)
    else:
        edge_turn(text, VOICE[spk], path)


def vieneu_turn(text, spk, path, voice_map=None):
    """Generate a single turn using VieNeu-TTS preset voice.

    Args:
        text: Text to speak.
        spk: Speaker key ("A" or "B").
        path: Output MP3 path.
        voice_map: dict mapping speaker -> voice name, e.g. {"A": "Adam", "B": "Thanh Bình"}.
    """
    backend = _get_vieneu_backend()
    voice_name = (voice_map or {}).get(spk, "Thái Sơn")
    wav_path = path.replace(".mp3", ".wav")
    audio = backend.generate(text=text, voice_name=voice_name)
    backend.save_wav(audio, wav_path)
    backend.wav_to_mp3(wav_path, path, ffmpeg_path=FF)


def gemini_turn(transcript, path, key):
    import base64, urllib.request, wave, struct

    if not key:
        raise SystemExit("Thieu Gemini API key. Cach 1: $env:GEMINI_API_KEY='...' | Cach 2: tao file gemini_key.txt | Cach 3: --key AIza...")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key={key}"
    body = {
        "contents": [{"parts": [{"text": transcript}]}],
        "generationConfig": {
            "speechConfig": {
                "multiSpeakerVoiceConfig": {
                    "speakerVoiceConfigs": [
                        {"speaker": "Speaker 1", "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Kore"}}},
                        {"speaker": "Speaker 2", "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Puck"}}},
                    ]
                }
            }
        },
    }
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode())
    part = data["candidates"][0]["content"]["parts"][0]["inlineData"]
    mime = part.get("mimeType", "audio/L16;codec=pcm;rate=24000")
    raw = base64.b64decode(part["data"])
    rate = 24000
    if "rate=" in mime:
        rate = int(mime.split("rate=")[1].split(";")[0])
    # Gemini tra ve raw PCM 16-bit; viet thanh WAV roi chuyen mp3
    wav = path.replace(".mp3", ".wav")
    with wave.open(wav, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(rate)
        wf.writeframes(raw)
    subprocess.run([FF, "-y", "-i", wav, "-c:a", "libmp3lame", "-b:a", "128k", path.replace("\\", "/")],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    os.remove(wav)


# ---------- backend 4: proxy OpenAI-compatible local (aistudio gateway) ----------
PROXY_URL = os.environ.get("TTS_PROXY_URL", "http://localhost:20128/v1/audio/speech")
PROXY_MODEL = "gemini/gemini-3.1-flash-tts-preview"
PROXY_VOICE = {"A": "Puck", "B": "Kore"}


def _proxy_key():
    if os.environ.get("AISTUDIO_KEY"):
        return os.environ["AISTUDIO_KEY"].strip()
    kf = "proxy_key.txt"
    if os.path.exists(kf):
        return open(kf, encoding="utf-8").read().strip()
    raise SystemExit("Thieu proxy key: dat env AISTUDIO_KEY hoac tao file proxy_key.txt (khong commit file nay len git).")


def proxy_turn(text, spk, path):
    import urllib.request, time

    key = _proxy_key()
    model = f"{PROXY_MODEL}/{PROXY_VOICE[spk]}"
    body = json.dumps({
        "model": model,
        "input": text,
        "language": "vi",
        "response_format": "mp3",
    }).encode("utf-8")
    last = None
    for attempt in range(4):
        try:
            req = urllib.request.Request(
                PROXY_URL,
                data=body,
                headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=180) as resp:
                data = resp.read()
            break
        except Exception as e:
            last = e
            print(f"  proxy error (thu {attempt+1}): {e}")
            time.sleep(2 * (attempt + 1))
    else:
        raise last or RuntimeError("proxy failed")
    raw = path + ".raw"
    with open(raw, "wb") as f:
        f.write(data)
    # proxy tra ve WAV hoac MP3 tuy truong hop -> lay ffmpeg chuyen ve mp3
    subprocess.run([FF, "-y", "-i", raw, "-c:a", "libmp3lame", "-b:a", "128k", path.replace("\\", "/")],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    os.remove(raw)


def pad_silence(path, lead, tail):
    # chen khoang nghi dau/cuoi de cac canh khong bi chem tieng vao nhau
    tmp = path + ".pad.mp3"
    os.replace(path, tmp)
    flt = f"adelay={int(round(lead * 1000))},apad=pad_dur={tail}"
    r = subprocess.run(
        [FF, "-y", "-i", tmp, "-af", flt, "-c:a", "libmp3lame", "-b:a", "128k", path.replace("\\", "/")],
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        raise SystemExit("pad_silence failed: " + (r.stderr or "")[-800:])
    os.remove(tmp)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--backend", choices=["edge", "omni", "gemini", "proxy", "vieneu"], default="edge")
    ap.add_argument("--key", default=None, help="Gemini API key (hoac file gemini_key.txt / env GEMINI_API_KEY)")
    ap.add_argument("--voice", default=None,
                    help="VieNeu single-speaker voice name (default: Thái Sơn)")
    ap.add_argument("--voice-a", default=None,
                    help="VieNeu voice for speaker A (two-speaker mode)")
    ap.add_argument("--voice-b", default=None,
                    help="VieNeu voice for speaker B (two-speaker mode)")
    ap.add_argument("--list-voices", action="store_true",
                    help="List available VieNeu preset voices and exit")
    args = ap.parse_args()
    backend = args.backend

    # --list-voices: show VieNeu voices and exit
    if args.list_voices:
        if backend != "vieneu":
            print("--list-voices requires --backend vieneu", file=sys.stderr)
            raise SystemExit(1)
        be = _get_vieneu_backend()
        for desc, vname in be.list_voices():
            print(vname)
        _close_vieneu()
        return

    # Resolve voice map for vieneu
    voice_map = None
    if backend == "vieneu":
        # Validate: --voice-a and --voice-b must be supplied together
        if bool(args.voice_a) != bool(args.voice_b):
            print("ERROR: --voice-a and --voice-b must be supplied together", file=sys.stderr)
            raise SystemExit(1)
        if args.voice_a and args.voice_b:
            voice_map = {"A": args.voice_a, "B": args.voice_b}
        elif args.voice:
            voice_map = {"A": args.voice, "B": args.voice}
        else:
            voice_map = {"A": "Thái Sơn", "B": "Thái Sơn"}

    gemini_key = args.key or os.environ.get("GEMINI_API_KEY")
    if backend == "gemini" and not gemini_key:
        kf = "gemini_key.txt"
        if os.path.exists(kf):
            gemini_key = open(kf, encoding="utf-8").read().strip()

    scenes = []
    try:
        if backend == "gemini":
            for sid, turns in DIALOGUE:
                transcript = "\n".join(f"Speaker {1 if spk == 'A' else 2}: {text}" for spk, text in turns)
                out_path = os.path.join(OUT, f"{sid}.mp3").replace("\\", "/")
                gemini_turn(transcript, out_path, gemini_key)
                pad_silence(out_path, 0.5, 0.5)
                total = MP3(out_path).info.length
                caption = "\n".join(f"{ROLE[spk]}: {text}" for spk, text in turns)
                scenes.append({"id": sid, "audio": f"nq57/{sid}.mp3", "caption": caption, "dur": round(total, 3)})
                print(f"{sid}: {total:.2f}s ({len(turns)} turns) [gemini]")
        else:
            for sid, turns in DIALOGUE:
                tmp_files, durations, caption_lines = [], [], []
                for i, (spk, text) in enumerate(turns):
                    tp = os.path.join(OUT, f"_{sid}_{i}.mp3")
                    tts_for(backend, spk, text, tp, voice_map=voice_map)
                    tmp_files.append(tp)
                    durations.append(MP3(tp).info.length)
                    caption_lines.append(f"{ROLE[spk]}: {text}")
                out_path = os.path.join(OUT, f"{sid}.mp3").replace("\\", "/")
                inputs = []
                for tp in tmp_files:
                    inputs += ["-i", tp.replace("\\", "/")]
                fd = "".join(f"[{j}:a]" for j in range(len(tmp_files))) + f"concat=n={len(tmp_files)}:v=0:a=1[a]"
                r = subprocess.run([FF, "-y"] + inputs + ["-filter_complex", fd, "-map", "[a]", "-c:a", "mp3", "-b:a", "128k", out_path],
                                   capture_output=True, text=True)
                if r.returncode != 0:
                    print("FFPATH:", repr(FF))
                    print("RC:", r.returncode)
                    print("ERR:", r.stderr[-1200:])
                    raise SystemExit(1)
                for tp in tmp_files:
                    os.remove(tp)
                pad_silence(out_path, 0.5, 0.5)
                total = MP3(out_path).info.length
                scenes.append({"id": sid, "audio": f"nq57/{sid}.mp3", "caption": "\n".join(caption_lines), "dur": round(total, 3)})
                print(f"{sid}: {total:.2f}s ({len(turns)} turns) [{backend}]")
    finally:
        # Ensure VieNeu model is released even on failure
        _close_vieneu()

    with open(os.path.join(OUT, "durations.json"), "w", encoding="utf-8") as f:
        json.dump(scenes, f, ensure_ascii=False, indent=2)

    # Build new SCENES array block
    scenes_block = []
    scenes_block.append("export const SCENES: SceneDef[] = [")
    for sc in scenes:
        cap = sc["caption"].replace("\\", "\\\\").replace("`", "\\`")
        scenes_block.append("  {")
        scenes_block.append(f'    id: "{sc["id"]}",')
        scenes_block.append(f'    audio: "{sc["audio"]}",')
        scenes_block.append(f'    caption: `{cap}`,')
        scenes_block.append(f'    dur: {sc["dur"]},')
        scenes_block.append("  },")
    scenes_block.append("];")
    new_block = "\n".join(scenes_block)

    # Try to patch existing nq57.ts (preserve imports, types, NQ57_CONTENT etc.)
    nq57_path = "src/data/nq57.ts"
    patched = False
    if os.path.exists(nq57_path):
        with open(nq57_path, "r", encoding="utf-8") as f:
            existing = f.read()
        import re
        # Replace everything from "export const SCENES" to the matching "];"
        pattern = r"export const SCENES.*?\];"
        match = re.search(pattern, existing, re.DOTALL)
        if match:
            updated = existing[:match.start()] + new_block + existing[match.end():]
            with open(nq57_path, "w", encoding="utf-8") as f:
                f.write(updated)
            patched = True
            print("Patched src/data/nq57.ts (preserved imports + NQ57_CONTENT)")

    if not patched:
        # Fallback: write full standalone file
        lines = []
        lines.append("export const FPS = 30;")
        lines.append("")
        lines.append("export interface SceneDef {")
        lines.append("  id: string;")
        lines.append("  audio: string;")
        lines.append("  caption: string;")
        lines.append("  dur: number;")
        lines.append("}")
        lines.append("")
        lines.append(new_block)
        lines.append("")
        lines.append("// moi scene cong them 0.5s de khong cat mat tieng cuoi")
        lines.append("export const TAIL = 0.5;")
        lines.append("export const sceneFrames = (dur: number) => Math.ceil((dur + TAIL) * FPS);")
        with open(nq57_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")
        print("Wrote src/data/nq57.ts (standalone fallback)")


if __name__ == "__main__":
    main()
