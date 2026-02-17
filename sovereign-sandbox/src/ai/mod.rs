use bevy::prelude::*;
use std::thread;
use crossbeam_channel::{bounded, Receiver, Sender};
use crate::ai::candle_integration::OmniBrain;

pub mod persona;
pub mod memory;
pub mod candle_integration;
pub mod hearing;

use hearing::WhisperEar;
use persona::TeacherPersona;

#[derive(Resource)]
pub struct AiChannel {
    pub sender: Sender<String>,
    pub receiver: Receiver<String>,
}

pub struct AiPlugin;

use memory::MemoryStoreResource;

impl Plugin for AiPlugin {
    fn build(&self, app: &mut App) {
        let (req_tx, req_rx) = bounded::<String>(1);
        let (resp_tx, resp_rx) = bounded::<String>(1);

        app.insert_resource(AiChannel {
            sender: req_tx,
            receiver: resp_rx,
        });

        // Get Memory Store (Must be initialized in main.rs before this plugin)
        let memory = app.world().get_resource::<MemoryStoreResource>()
            .expect("MemoryStoreResource must be inserted before AiPlugin")
            .clone();

        // Spawn AI thread (Brain + Ears + Memory)
        thread::spawn(move || {
            // Need to handle paths correctly in real app
            let model_path = "assets/models/Phi-3-mini-4k-instruct-q4.gguf";
            let tokenizer_path = "assets/models/tokenizer.json";
            
            let whisper_model = "assets/models/model.safetensors";
            let whisper_config = "assets/models/config.json";
            let whisper_mels = "assets/models/melfilters.bytes";
            let whisper_tokenizer = "assets/models/whisper_tokenizer.json";
            
            let mut brain = match OmniBrain::new(model_path, tokenizer_path) {
                Ok(b) => {
                    println!("🧠 Brain Initialized.");
                    b
                },
                Err(e) => {
                    eprintln!("❌ Failed to initialize Brain: {}", e);
                    return;
                }
            };
            
            let mut ears = match WhisperEar::new(whisper_model, whisper_tokenizer, whisper_config, whisper_mels) {
                Ok(e) => {
                    println!("👂 Ears Initialized.");
                    e
                },
                Err(e) => {
                    eprintln!("❌ Failed to initialize Ears: {}", e);
                    return;
                }
            };

            let teacher_persona = TeacherPersona::new();
            let store = memory.0; // Unpack Arc

            // Main Thinking Loop
            while let Ok(msg) = req_rx.recv() {
                // Check if it's a "LISTEN" command
                let user_input = if msg == "LISTEN" {
                    // Load sample audio from file
                    let audio_data = if let Ok(mut reader) = hound::WavReader::open("assets/jfk.wav") {
                        let spec = reader.spec();
                        info!("🔮 Attuning Ears to Artifact: {:?} ({} Hz, {} channels)", "assets/jfk.wav", spec.sample_rate, spec.channels);
                        
                        // Read simple samples
                        let samples: Vec<f32> = reader.samples::<i16>()
                            .map(|x| x.unwrap_or(0) as f32 / 32768.0)
                            .collect();
                            
                        // If stereo, take only first channel (naive downmix/select)
                        if spec.channels == 2 {
                            debug!("Stereo detected, taking channel 1");
                            samples.into_iter().step_by(2).collect()
                        } else {
                            samples
                        }
                    } else {
                        warn!("Failed to load assets/jfk.wav, using silence.");
                        vec![0.0; 16000] 
                    };
                    
                    if let Ok(transcript) = ears.listen(&audio_data) {
                        println!("User said (Voice): {}", transcript);
                        transcript
                    } else {
                        "ERROR: Hearing failed.".to_string()
                    }
                } else {
                    println!("User said (Text): {}", msg);
                    msg
                };

                // 1. Recall Context
                let context_fragments = store.recall(&user_input, 3, None).unwrap_or_default();
                let context_str = context_fragments.iter()
                    .map(|f| format!("- {}", f.content))
                    .collect::<Vec<_>>()
                    .join("\n");
                
                if !context_str.is_empty() {
                    println!("🧠 Recalled Context:\n{}", context_str);
                }

                // 2. Format Prompt with Context
                // We inject context into the user message for now for simplicity
                let augmented_input = if !context_str.is_empty() {
                    format!("Context:\n{}\n\nUser: {}", context_str, user_input)
                } else {
                    user_input.clone()
                };

                // 3. Generate Response
                let formatted_prompt = teacher_persona.format(&augmented_input);
                let response = brain.generate(&formatted_prompt, 200).unwrap_or_else(|e| format!("Error: {}", e));
                
                // 4. Store Interactions
                let _ = store.store(&user_input, Some("user"), None, None);
                let _ = store.store(&response, Some("teacher"), None, None);

                let _ = resp_tx.send(response);
            }
        });
    }
}


