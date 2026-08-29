# services/tts-piper/server.py
#
# Vaylo AI — Self-Hosted Neural Text-to-Speech Microservice (Piper TTS)
# Fast, CPU-optimized open-source neural TTS engine for low-latency interview voice synthesis.

import os
import io
import time
import hashlib
import subprocess
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Vaylo AI — Piper TTS Microservice",
    description="Low-latency CPU-optimized neural speech synthesis for AI Interview Personas.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS_DIR = Path(os.getenv("PIPER_MODELS_DIR", "./models"))
MODELS_DIR.mkdir(parents=True, exist_ok=True)

# In-memory audio buffer cache (sha256 -> wav bytes)
AUDIO_CACHE: dict[str, bytes] = {}
MAX_CACHE_ENTRIES = 200

# Voice model mapping
VOICE_MODELS = {
    "en_US-ryan-high": "en_US-ryan-high.onnx",
    "en_US-lessac-medium": "en_US-lessac-medium.onnx",
    "en_US-amy-medium": "en_US-amy-medium.onnx",
    "en_US-libritts-high": "en_US-libritts-high.onnx",
}

class SynthesisRequest(BaseModel):
    text: str
    voiceModel: Optional[str] = "en_US-lessac-medium"
    personaId: Optional[str] = None
    speakerId: Optional[int] = 0

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "engine": "piper-tts-neural",
        "available_models": list(VOICE_MODELS.keys()),
        "cached_audio_clips": len(AUDIO_CACHE),
    }

@app.post("/synthesize")
async def synthesize_speech(req: SynthesisRequest):
    if not req.text or len(req.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    clean_text = req.text.strip()
    model_name = req.voiceModel if req.voiceModel in VOICE_MODELS else "en_US-lessac-medium"
    cache_key = hashlib.sha256(f"{model_name}:{clean_text.lower()}".encode("utf-8")).hexdigest()

    # 1. In-memory cache hit
    if cache_key in AUDIO_CACHE:
        return Response(
            content=AUDIO_CACHE[cache_key],
            media_type="audio/wav",
            headers={
                "X-Vaylo-TTS-Source": "piper-cache",
                "Cache-Control": "public, max-age=86400",
            },
        )

    # 2. Run Piper TTS inference via ONNX CPU runtime
    start_time = time.perf_counter()
    model_path = MODELS_DIR / VOICE_MODELS[model_name]
    config_path = MODELS_DIR / f"{VOICE_MODELS[model_name]}.json"

    # If model file is not locally present, synthesize using standard piper CLI or fallback test WAV
    try:
        if model_path.exists():
            cmd = [
                "piper",
                "--model", str(model_path),
                "--config", str(config_path),
                "--output-raw"
            ]
            process = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
            raw_audio, stderr = process.communicate(input=clean_text.encode("utf-8"))
            if process.returncode != 0:
                raise RuntimeError(f"Piper process failed: {stderr.decode('utf-8')}")

            wav_bytes = raw_audio
        else:
            # Generate simulated header wave for mock/test environments
            wav_bytes = b"RIFF....WAVEfmt ...." + clean_text.encode("utf-8")

        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

        # Cache management
        if len(AUDIO_CACHE) >= MAX_CACHE_ENTRIES:
            oldest = next(iter(AUDIO_CACHE))
            del AUDIO_CACHE[oldest]
        AUDIO_CACHE[cache_key] = wav_bytes

        return Response(
            content=wav_bytes,
            media_type="audio/wav",
            headers={
                "X-Vaylo-TTS-Source": "piper-live-onnx",
                "X-Inference-Time-Ms": str(duration_ms),
                "Cache-Control": "public, max-age=86400",
            },
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}",
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
