use anyhow::Result;
use bevy::prelude::*;
use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use std::sync::{Arc, Mutex};
use std::thread;
use std::collections::VecDeque;
use crossbeam_channel::{bounded, Receiver, Sender};

// Moshi / Candle Imports
use candle_core::{DType, Device, Tensor, IndexOp};
use moshi::lm_generate_multistream::State;

#[derive(Resource)]
pub struct MoshiVoice {
    pub is_speaking: bool,
    pub amplitude: f32,
    pub command_tx: Sender<MoshiCommand>,
    pub state_rx: Arc<Mutex<(bool, f32)>>,
}

pub enum MoshiCommand {
    Start,
    Stop,
    Context(String),
}

type AudioBuffer = Arc<Mutex<VecDeque<f32>>>;

// Wrapper struct for the Moshi components
struct Moshi {
    mimi: moshi::mimi::Mimi, 
    state: State,
    device: Device,
    #[allow(dead_code)]
    text_tokenizer: sentencepiece::SentencePieceProcessor,
    generated_audio_codebooks: usize,
    prev_text_token: u32,
}

impl Moshi {
    fn new() -> Result<Self> {
        let model_dir = std::path::PathBuf::from("/home/joshua-atkinson/antigravity/local-ai-architect/moshi");
        let mimi_file = model_dir.join("tokenizer-e351c8d8-checkpoint125.safetensors");
        let lm_file = model_dir.join("model.q8.gguf");
        // config.json not present, using default v0_1 config as per README/code inference
        let text_tokenizer_file = model_dir.join("tokenizer_spm_32k_3.model");

        if !lm_file.exists() {
             anyhow::bail!("Moshi model not found at {}", lm_file.display());
        }

        let device = Device::new_cuda(0).unwrap_or(Device::Cpu);
        // GGUF loading usually handles dtype internally or uses F32 for computations
        let dtype = if device.is_cuda() { DType::BF16 } else { DType::F32 };

        // Load Config
        // We assume v0_1_streaming to support duplex (16 codebooks: 8 gen + 8 input)
        // This matches the panic fix where input_audio_tokens were out of bounds
        let lm_config = moshi::lm::Config::v0_1_streaming(8);
        
        // Load Mimi
        let mimi = moshi::mimi::load(mimi_file.to_str().unwrap(), Some(8), &device)?;
        
        // Load LM
        // moshi-core detects .gguf extension and loads appropriately
        let lm_model = moshi::lm::load_lm_model(lm_config.clone(), lm_file.to_str().unwrap(), dtype, &device)?;

        // Load Tokenizer
        let text_tokenizer = sentencepiece::SentencePieceProcessor::open(text_tokenizer_file.to_str().unwrap())?;
        
        // Logits
        let audio_lp = candle_transformers::generation::LogitsProcessor::from_sampling(
            42, candle_transformers::generation::Sampling::TopK { k: 250, temperature: 0.8 }
        );
        let text_lp = candle_transformers::generation::LogitsProcessor::from_sampling(
            42, candle_transformers::generation::Sampling::TopK { k: 250, temperature: 0.8 }
        );

        let generated_audio_codebooks = lm_config.depformer.as_ref().map_or(8, |v| v.num_slices);

        // State
        let config_gen = moshi::lm_generate_multistream::Config {
            acoustic_delay: 2,
            audio_vocab_size: lm_config.audio_vocab_size,
            generated_audio_codebooks,
            input_audio_codebooks: lm_config.audio_codebooks - generated_audio_codebooks,
            text_start_token: lm_config.text_out_vocab_size as u32,
            text_eop_token: 0,
            text_pad_token: 3,
        };
        
        let state = State::new(
            lm_model,
            100000, 
            audio_lp,
            text_lp,
            None,
            None,
            None,
            config_gen,
        );

        let prev_text_token = state.config().text_start_token;

        Ok(Self {
            mimi,
            state,
            device,
            text_tokenizer,
            generated_audio_codebooks,
            prev_text_token,
        })
    }

    fn step(&mut self, pcm_data: &[f32], context_text: Option<&str>) -> Result<Vec<f32>> {
        // Handle context injection
        if let Some(text) = context_text {
             info!("🧠 Injecting Context: \"{}\"", text);
             // 1. Tokenize the text
             let tokens = self.text_tokenizer.encode(text)?;
             
             // 2. Feed tokens into the model state
             // We need to simulate time steps for each token to "write" it into memory
             // We'll use silence for the audio channel during this priming phase
             let silence_pcm = vec![0.0f32; 1920]; 
             let silence_tensor = Tensor::from_slice(&silence_pcm, (1, 1, 1920), &self.device)?;
             let silence_codes = self.mimi.encode_step(&silence_tensor.into(), &().into())?;
             
             if let Some(codes) = silence_codes.as_option() {
                 let (_b, _codebooks, _steps) = codes.dims3()?;
                 
                 // We reuse the same silence code for each text token step
                 let codes_step = codes.i((.., .., 0..1))?;
                 let codes_vec = codes_step.i((0, .., 0))?.to_vec1::<u32>()?;
                 
                 for token in &tokens {
                      // Step with forced text token
                      // We ignore the output as we are just priming state
                      self.prev_text_token = self.state.step_(
                          Some(self.prev_text_token), 
                          &codes_vec, 
                          Some(token.id), // FORCE THIS TOKEN
                          None, 
                          None
                      )?;
                 }
             }
             info!("✅ Context Injected ({} tokens)", tokens.len());
        }

        // 1. Encode Audio (Normal Step)
        let pcm_tensor = Tensor::from_slice(pcm_data, (1, 1, pcm_data.len()), &self.device)?;
        let codes = self.mimi.encode_step(&pcm_tensor.into(), &().into())?;
        
        let mut out_pcm_accum = vec![];

        if let Some(codes) = codes.as_option() {
            let (_b, _codebooks, steps) = codes.dims3()?;
            for step in 0..steps {
                let codes_step = codes.i((.., .., step..step + 1))?;
                let codes_vec = codes_step.i((0, .., 0))?.to_vec1::<u32>()?;
                
                // 2. LM Step
                self.prev_text_token = self.state.step_(Some(self.prev_text_token), &codes_vec, None, None, None)?;
                 
                 // 3. Decode Audio
                 if let Some(audio_tokens) = self.state.last_audio_tokens() {
                    let audio_tokens = Tensor::new(&audio_tokens[..self.generated_audio_codebooks], &self.device)?
                            .reshape((1, 1, ()))?
                            .t()?;
                    let out_pcm = self.mimi.decode_step(&audio_tokens.into(), &().into())?;
                     if let Some(out_pcm) = out_pcm.as_option() {
                        let pcm_vec = out_pcm.i((0, 0))?.to_vec1::<f32>()?;
                        out_pcm_accum.extend(pcm_vec);
                     }
                 }
            }
        }
        
        Ok(out_pcm_accum)
    }
}

pub fn start_moshi_thread(mut commands: Commands) {
    // DISABLED PER USER REQUEST to focus on Visuals first
    return; 
    
    let (tx, rx) = bounded::<MoshiCommand>(10);
    let state = Arc::new(Mutex::new((false, 0.0f32)));
    let state_clone = state.clone();

    // Buffers
    let input_buffer: AudioBuffer = Arc::new(Mutex::new(VecDeque::new()));
    let output_buffer: AudioBuffer = Arc::new(Mutex::new(VecDeque::new()));

    commands.insert_resource(MoshiVoice {
        is_speaking: false,
        amplitude: 0.0,
        command_tx: tx,
        state_rx: state.clone(),
    });

    let input_buf_clone = input_buffer.clone();
    let output_buf_clone = output_buffer.clone();

    thread::spawn(move || {
        // Init Audio
        let host = cpal::default_host();
        let input_device = host.default_input_device().expect("No Input Device");
        let output_device = host.default_output_device().expect("No Output Device");
        let config: cpal::StreamConfig = input_device.default_input_config().unwrap().into();

        let in_buf = input_buf_clone.clone();
        let input_stream = input_device.build_input_stream(
            &config,
            move |data: &[f32], _: &_| {
                let mut buf = in_buf.lock().unwrap();
                buf.extend(data.iter().cloned());
            },
            |err| eprintln!("Mic Error: {}", err),
            None
        ).unwrap();
        input_stream.play().unwrap();

        let out_buf = output_buf_clone.clone();
        let output_stream = output_device.build_output_stream(
            &config,
            move |data: &mut [f32], _: &_| {
                let mut buf = out_buf.lock().unwrap();
                for sample in data.iter_mut() {
                    *sample = buf.pop_front().unwrap_or(0.0);
                }
            },
            |err| eprintln!("Speaker Error: {}", err),
            None
        ).unwrap();
        output_stream.play().unwrap();

        // Init Model
        info!("⏳ Loading Moshi...");
        let mut moshi = match Moshi::new() {
            Ok(m) => { info!("✅ Moshi Loaded"); Some(m) },
            Err(e) => { error!("Failed to load Moshi: {}", e); None }
        };

        // Initialize Resampler Helper
        let local_resample_fn = |input: &[f32], from_rate: u32, to_rate: u32| -> Vec<f32> {
             if from_rate == to_rate { return input.to_vec(); }
             let ratio = to_rate as f32 / from_rate as f32;
             let new_len = (input.len() as f32 * ratio) as usize;
             let mut output = Vec::with_capacity(new_len);
             for i in 0..new_len {
                 let old_idx = i as f32 / ratio;
                 let idx_floor = old_idx.floor() as usize;
                 let idx_ceil = (idx_floor + 1).min(input.len() - 1);
                 let t = old_idx - idx_floor as f32;
                 let val = input[idx_floor] * (1.0 - t) + input[idx_ceil] * t;
                 output.push(val);
             }
             output
        };
        
        let chunk_size = 1920; 
        
        // We need to accumulate enough input samples (at native rate) to get 'chunk_size' at 24k
        // e.g. if 48k, we need 3840 input samples to get 1920 downsampled samples.
        let input_rate = config.sample_rate.0;
        let required_input_frames = (chunk_size as f32 * (input_rate as f32 / 24000.0)) as usize;

        loop {
            let mut context_queue = None;
            while let Ok(cmd) = rx.try_recv() {
                match cmd {
                    MoshiCommand::Stop => return,
                    MoshiCommand::Context(text) => context_queue = Some(text),
                    _ => {}
                }
            }

            if let Some(ref mut m) = moshi {
                let mut in_buf = input_buf_clone.lock().unwrap();
                if in_buf.len() >= required_input_frames {
                    let input_chunk: Vec<f32> = in_buf.drain(0..required_input_frames).collect();
                    drop(in_buf);

                    // 1. Resample Input (Mic Native -> 24k)
                    let downsampled = local_resample_fn(&input_chunk, input_rate, 24000);
                    
                    let res = m.step(&downsampled, context_queue.as_deref());
                    context_queue = None; // Consumed

                    if let Ok(output_chunk) = res {
                        if !output_chunk.is_empty() {
                            let amp = (output_chunk.iter().map(|s| (*s).abs()).sum::<f32>() / output_chunk.len() as f32).clamp(0.0, 1.0);
                            *state_clone.lock().unwrap() = (true, amp * 5.0);
                            
                            // 2. Resample Output (24k -> Speaker Native)
                            let upsampled = local_resample_fn(&output_chunk, 24000, input_rate);
                            
                            output_buf_clone.lock().unwrap().extend(upsampled);
                        } else {
                            *state_clone.lock().unwrap() = (false, 0.0);
                        }
                    } else {
                        // Error logic
                    }
                } else {
                    thread::sleep(std::time::Duration::from_millis(5));
                }
            } else {
                thread::sleep(std::time::Duration::from_millis(100));
            }
        }
    });
}

pub fn update_moshi_state(mut mv: ResMut<MoshiVoice>) {
    let (speaking, amp) = if let Ok(guard) = mv.state_rx.lock() {
        (guard.0, guard.1)
    } else {
        (false, 0.0)
    };
    mv.is_speaking = speaking;
    mv.amplitude = amp;
}
