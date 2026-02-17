use anyhow::{Error as E, Result};
use candle_core::{Device, Tensor, DType};
use candle_transformers::models::whisper::{audio, model::Whisper, Config};
use tokenizers::Tokenizer;
use candle_nn::VarBuilder;

pub struct WhisperEar {
    model: Whisper,
    tokenizer: Tokenizer,
    mel_filters: Vec<f32>,
    device: Device,
}

impl WhisperEar {
    pub fn new(model_path: &str, tokenizer_path: &str, config_path: &str, mel_filters_path: &str) -> Result<Self> {
        let device = Device::Cpu;
        
        // Load Config
        let config: Config = serde_json::from_str(&std::fs::read_to_string(config_path)?)?;
        
        // Load Model (Safetensors)
        let vb = unsafe { VarBuilder::from_mmaped_safetensors(&[model_path], DType::F32, &device)? };
        let model = Whisper::load(&vb, config.clone())?; // Clone config because load consumes or refs? Usually clone is safe for Config.

        // Load Tokenizer
        let tokenizer = Tokenizer::from_file(tokenizer_path).map_err(E::msg)?;

        // Load Mel Filters (Raw Bytes)
        let mel_bytes = std::fs::read(mel_filters_path)?;
        let mut mel_filters = Vec::with_capacity(mel_bytes.len() / 4);
        
        // Simple manual conversion from bytes to f32 (Little Endian)
        for chunk in mel_bytes.chunks_exact(4) {
            let bytes: [u8; 4] = chunk.try_into()?;
            mel_filters.push(f32::from_le_bytes(bytes));
        }

        // Validate size
        if mel_filters.len() != 80 * 201 {
             return Err(E::msg(format!("Mel filters file size incorrect. Expected {}, got {}", 80 * 201, mel_filters.len())));
        }

        Ok(Self {
            model,
            tokenizer,
            mel_filters,
            device,
        })
    }

    pub fn listen(&mut self, audio_data: &[f32]) -> Result<String> {
        // 🔮 The Alchemical Process: Vibration -> Perception
        let mel_vec = audio::pcm_to_mel(&self.model.config, audio_data, &self.mel_filters);
        let mel_len = mel_vec.len() / 80;
        let mel = Tensor::from_vec(mel_vec, (1, 80, mel_len), &self.device)?;

        // 🧠 The Encoder's Trance
        let encoded_mel = self.model.encoder.forward(&mel, true)?;

        // Decode loop
        // Start tokens: <|startoftranscript|> <|en|> <|transcribe|> <|notimestamps|>
        // Adding <|notimestamps|> is crucial for short clips to avoid hallucinating timestamps.
        let sot_token = self.tokenizer.token_to_id("<|startoftranscript|>").unwrap();
        let trans_token = self.tokenizer.token_to_id("<|en|>").unwrap();
        let transcribe_token = self.tokenizer.token_to_id("<|transcribe|>").unwrap();
        let no_timestamps_token = self.tokenizer.token_to_id("<|notimestamps|>").unwrap();

        let mut tokens = vec![sot_token, trans_token, transcribe_token];
        let mut result = String::new();

        // 🗣️ The Oracle Speaks
        for _ in 0..100 { 
            let token_tensor = Tensor::new(tokens.as_slice(), &self.device)?.unsqueeze(0)?;
            let logits = self.model.decoder.forward(&token_tensor, &encoded_mel, true)?;
            let logits = logits.squeeze(0)?;
            let logits = logits.get(logits.dim(0)? - 1)?;
            
            let next_token = logits.argmax(0)?.to_scalar::<u32>()?;
            
            tokens.push(next_token);
            
            let decoded = self.tokenizer.decode(&[next_token], true).map_err(E::msg)?;
            result.push_str(&decoded);
            
            if next_token == self.tokenizer.token_to_id("<|endoftext|>").unwrap_or(50257) {
                 break;
            }
        }

        Ok(result)
    }
}
