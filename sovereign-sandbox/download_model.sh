#!/bin/bash
mkdir -p assets/models

echo "Downloading Tokenizer..."
curl -L -o assets/models/tokenizer.json https://huggingface.co/microsoft/Phi-3-mini-4k-instruct/resolve/main/tokenizer.json

echo "Downloading Phi-3 Mini 4k Instruct (Q4 GGUF)..."
# Using a quantized version. 
# Attempting direct link to a reliable GGUF. 
# Note: Microsoft's official repo might not have GGUF directly in root or might have specific naming.
# Using a common quantization for compatibility if official is tricky, but trying official first if available.
# Actually, Microsoft does NOT typically host GGUF in the main repo. 
# I will use a reliable mirror or the QuantFactory version which is standard.
curl -L -o assets/models/Phi-3-mini-4k-instruct-q4.gguf https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf

echo "Downloading Whisper Tiny (Safetensors + Config)..."
# Using standard non-quantized model as candle/whisper needs it.
curl -L -o assets/models/model.safetensors https://huggingface.co/openai/whisper-tiny/resolve/main/model.safetensors
curl -L -o assets/models/config.json https://huggingface.co/openai/whisper-tiny/resolve/main/config.json
curl -L -o assets/models/melfilters.bytes https://raw.githubusercontent.com/huggingface/candle/main/candle-examples/examples/whisper/melfilters.bytes
curl -L -o assets/models/whisper_tokenizer.json https://huggingface.co/openai/whisper-tiny/resolve/main/tokenizer.json
curl -L -o assets/jfk.wav https://huggingface.co/datasets/Narsil/asr_dummy/resolve/main/jfk.wav

echo "Download complete."
