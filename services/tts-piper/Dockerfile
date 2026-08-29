# services/tts-piper/Dockerfile
#
# Optimized multi-stage Dockerfile for Vaylo AI Piper TTS Microservice
# Runs on Linux x86_64 / ARM64 CPU instances without GPU requirements

FROM python:3.11-slim as base

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download default voice models (Ryan, Lessac, Amy, LibriTTS)
RUN mkdir -p /app/models && cd /app/models \
    && wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx \
    && wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json \
    && wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/medium/en_US-amy-medium.onnx \
    && wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/medium/en_US-amy-medium.onnx.json || true

COPY server.py .

ENV PORT=8000
ENV PIPER_MODELS_DIR=/app/models

EXPOSE 8000

CMD ["python", "server.py"]
