use anyhow::{Error as E, Result};
use candle_core::{DType, Device, Tensor};
use candle_transformers::generation::LogitsProcessor;
use candle_transformers::models::quantized_phi3::ModelWeights as Phi3;
use candle_transformers::utils::apply_repeat_penalty;
use tokenizers::Tokenizer;

pub struct OmniBrain {
    model: Phi3,
    tokenizer: Tokenizer,
    logits_processor: LogitsProcessor,
    device: Device,
}

impl OmniBrain {
    pub fn new(model_path: &str, tokenizer_path: &str) -> Result<Self> {
        let device = Device::Cpu;
        let mut file = std::fs::File::open(model_path)?;
        let content = candle_core::quantized::gguf_file::Content::read(&mut file)?;
        let model = Phi3::from_gguf(false, content, &mut file, &device)?;
        
        let tokenizer = Tokenizer::from_file(tokenizer_path).map_err(E::msg)?;
        let logits_processor = LogitsProcessor::new(299792458, None, None); // Seed

        Ok(Self {
            model,
            tokenizer,
            logits_processor,
            device,
        })
    }

    /// 🔮 The Oracle's Voice: Generating Thought
    pub fn generate(&mut self, prompt: &str, max_tokens: usize) -> Result<String> {
        // Enforce the ritual of encoding
        let tokens = self.tokenizer.encode(prompt, true).map_err(E::msg)?;
        let mut tokens = tokens.get_ids().to_vec();
        let mut generated_text = String::new();

        // 🌀 The Spiraling Loop of Creation
        for _ in 0..max_tokens {
            let context_size = if tokens.len() > 4096 { 4096 } else { tokens.len() };
            let start_pos = tokens.len().saturating_sub(context_size);
            
            // Manifest tensor from the void
            let input = Tensor::new(&tokens[start_pos..], &self.device)?.unsqueeze(0)?;
            
            // Forward pass through the neural pathways
            let logits = self.model.forward(&input, start_pos)?;
            let logits = logits.squeeze(0)?.to_dtype(DType::F32)?;
            
            // Sampling from the distribution of possibilities
            let next_token = self.logits_processor.sample(&logits)?;
            tokens.push(next_token);
            
            // Decode the digital glyph back to human language
            if let Some(text) = self.tokenizer.decode(&[next_token], true).ok() {
                generated_text.push_str(&text);
            }
            
            // Check for the "End of Thought" sigil
            if next_token == self.tokenizer.token_to_id("<|end|>").unwrap_or(32000) {
                break;
            }
        }

        Ok(generated_text)
    }
}
