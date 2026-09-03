"""
VieNeu-TTS backend for gen_tts_v2.py

Provides preset-voice TTS generation using VieNeu-TTS (local, offline).
Voice cloning is intentionally excluded from this module.

Usage as standalone:
    python gen_tts_vieneu.py --list-voices
    python gen_tts_vieneu.py --voice "Adam" --text "Xin chào" --output test.wav

Usage as import:
    from gen_tts_vieneu import VieneuBackend
    backend = VieneuBackend()
    backend.init()
    audio_numpy = backend.generate(text="Xin chào", voice_name="Adam")
    backend.save_wav(audio_numpy, "output.wav")
    backend.close()
"""

import sys
import io
import os
import subprocess
import argparse
import numpy as np

# ---------------------------------------------------------------------------
# Lazy import — only load vieneu when actually needed
# ---------------------------------------------------------------------------

_tts_instance = None


def _ensure_encoding():
    """Force UTF-8 stdout on Windows."""
    if sys.stdout.encoding != "utf-8":
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")


class VieneuBackend:
    """VieNeu-TTS preset voice backend.

    Lifecycle:
        backend = VieneuBackend()
        backend.init()           # loads model once
        audio = backend.generate(text="...", voice_name="Adam")
        backend.save_wav(audio, "out.wav")
        backend.close()          # frees resources
    """

    def __init__(self):
        self._tts = None
        self._voices_cache = None  # [(description, voice_name), ...]

    def init(self):
        """Load the VieNeu model once. Call before any generate()."""
        _ensure_encoding()
        # Set cache dir to external location to avoid C: drive space issues
        if "HF_HOME" not in os.environ:
            os.environ["HF_HOME"] = r"D:\CODE2026\VieNeu-TTS\.hf_cache"
        try:
            from vieneu import Vieneu
        except ImportError as e:
            raise SystemExit(
                "VieNeu-TTS is not installed. "
                "Install it at D:\\CODE2026\\VieNeu-TTS or set VIENEU_PATH. "
                f"Import error: {e}"
            ) from e
        self._tts = Vieneu()
        # Pre-fetch voice list
        self._voices_cache = self._tts.list_preset_voices()

    def list_voices(self):
        """Return list of (description, voice_name) tuples."""
        if self._voices_cache is None:
            self.init()
        return list(self._voices_cache)

    def resolve_voice(self, name):
        """Resolve a voice name to its preset dict.

        Args:
            name: Voice name string (e.g. "Adam", "Thanh Bình").

        Returns:
            dict suitable for tts.infer(voice=...)

        Raises:
            SystemExit if voice not found.
        """
        if self._tts is None:
            self.init()

        # Try exact match first
        voice = self._tts.get_preset_voice(name)
        if voice is not None:
            return voice

        # Fuzzy: case-insensitive partial match
        name_lower = name.lower()
        for desc, vname in self._voices_cache:
            if name_lower in vname.lower():
                return self._tts.get_preset_voice(vname)

        # Not found — print available voices and fail
        available = [vname for _, vname in self._voices_cache]
        print(f"ERROR: VieNeu voice '{name}' not found.", file=sys.stderr)
        print("Available voices:", file=sys.stderr)
        for vname in available:
            print(f"  {vname}", file=sys.stderr)
        raise SystemExit(1)

    def generate(self, text, voice_name="Adam", **infer_kwargs):
        """Generate audio from text using a preset voice.

        Args:
            text: Vietnamese text to speak.
            voice_name: Preset voice name (default: "Adam").
            **infer_kwargs: Extra kwargs passed to tts.infer().

        Returns:
            numpy.ndarray of audio samples (WAV format).
        """
        if self._tts is None:
            self.init()

        voice = self.resolve_voice(voice_name)
        # Default max_chars=128 to avoid ONNX memory errors on CPU with long texts.
        # The SDK default (256) can exceed available memory for lengthy turns.
        infer_kwargs.setdefault("max_chars", 128)
        audio = self._tts.infer(text=text, voice=voice, **infer_kwargs)
        return audio

    def save_wav(self, audio, path):
        """Save numpy audio array as WAV file.

        Args:
            audio: numpy.ndarray from generate().
            path: Output file path (.wav).
        """
        if self._tts is None:
            raise SystemExit("VieNeu backend not initialized. Call init() first.")
        self._tts.save(audio, path)

    def wav_to_mp3(self, wav_path, mp3_path, ffmpeg_path=None):
        """Convert WAV to MP3 using ffmpeg. Deletes WAV on success.

        Args:
            wav_path: Input WAV path.
            mp3_path: Output MP3 path.
            ffmpeg_path: Path to ffmpeg binary. Auto-detected if None.

        Raises:
            SystemExit on ffmpeg failure.
        """
        if ffmpeg_path is None:
            ffmpeg_path = _find_ffmpeg()

        r = subprocess.run(
            [
                ffmpeg_path, "-y",
                "-i", wav_path.replace("\\", "/"),
                "-c:a", "libmp3lame",
                "-b:a", "128k",
                mp3_path.replace("\\", "/"),
            ],
            capture_output=True,
            text=True,
        )
        if r.returncode != 0:
            print(f"FFMPEG ERROR (rc={r.returncode}):", file=sys.stderr)
            print(r.stderr[-800:] if r.stderr else "(no stderr)", file=sys.stderr)
            raise SystemExit(f"ffmpeg conversion failed: {wav_path} -> {mp3_path}")

        # Verify output
        if not os.path.exists(mp3_path) or os.path.getsize(mp3_path) == 0:
            raise SystemExit(f"ffmpeg produced empty output: {mp3_path}")

        # Remove intermediate WAV
        try:
            os.remove(wav_path)
        except OSError:
            pass

    def close(self):
        """Release model resources."""
        if self._tts is not None:
            try:
                self._tts.close()
            except Exception:
                pass
            self._tts = None
            self._voices_cache = None

    def __enter__(self):
        self.init()
        return self

    def __exit__(self, *exc):
        self.close()


# ---------------------------------------------------------------------------
# Standalone CLI
# ---------------------------------------------------------------------------

def _find_ffmpeg():
    """Locate ffmpeg binary — same logic as gen_tts_v2.py."""
    try:
        path = subprocess.check_output(
            [
                "powershell", "-c",
                ("Get-ChildItem node_modules/ffmpeg-static -Recurse -Filter ffmpeg.exe "
                 "| Select-Object -First 1 | Select-Object -ExpandProperty FullName"),
            ],
            shell=True,
        ).decode().strip()
        if path and os.path.exists(path):
            return path
    except Exception:
        pass
    # Fallback: assume ffmpeg is on PATH
    return "ffmpeg"


def main():
    _ensure_encoding()
    ap = argparse.ArgumentParser(description="VieNeu-TTS preset voice backend")
    ap.add_argument("--list-voices", action="store_true",
                    help="List all available preset voices")
    ap.add_argument("--voice", default="Adam",
                    help="Preset voice name (default: Adam)")
    ap.add_argument("--text", default=None,
                    help="Text to generate (standalone mode)")
    ap.add_argument("--output", default=None,
                    help="Output WAV path (standalone mode)")
    args = ap.parse_args()

    backend = VieneuBackend()
    backend.init()

    if args.list_voices:
        voices = backend.list_voices()
        for desc, vname in voices:
            print(vname)
        backend.close()
        return

    if args.text is None or args.output is None:
        print("ERROR: --text and --output required (or use --list-voices)", file=sys.stderr)
        backend.close()
        raise SystemExit(1)

    print(f"Generating with voice: {args.voice}")
    audio = backend.generate(text=args.text, voice_name=args.voice)
    backend.save_wav(audio, args.output)
    print(f"Saved: {args.output} ({os.path.getsize(args.output)} bytes)")
    backend.close()


if __name__ == "__main__":
    main()
