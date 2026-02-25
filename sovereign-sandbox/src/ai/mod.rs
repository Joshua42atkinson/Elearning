use bevy::prelude::*;
use crossbeam_channel::{bounded, Receiver, Sender};

#[cfg(not(target_arch = "wasm32"))]
pub mod memory;
#[cfg(target_arch = "wasm32")]
pub mod memory {
    use bevy::prelude::*;
    use uuid::Uuid;
    use std::sync::Arc;
    
    use chrono::{DateTime, Utc};
    
    #[derive(Debug, serde::Serialize, serde::Deserialize)]
    pub struct MemoryFragment {
        pub id: Uuid,
        pub content: String,
        pub source: String,
        pub timestamp: DateTime<Utc>,
        pub similarity: f32,
    }

    #[derive(Resource, Clone)]
    pub struct MemoryStoreResource(pub Arc<MemoryStore>);
    pub struct MemoryStore {}
    impl MemoryStore {
        pub fn new(_path: &std::path::Path) -> anyhow::Result<Self> { Ok(Self{}) }
        pub fn store(&self, _c: &str, _s: Option<&str>, _sid: Option<Uuid>, _m: Option<serde_json::Value>) -> anyhow::Result<Uuid> { Ok(Uuid::new_v4()) }
        pub fn get_recent_memories(&self, _limit: usize) -> anyhow::Result<Vec<MemoryFragment>> { Ok(vec![]) }
    }
}

#[cfg(not(target_arch = "wasm32"))]
pub mod moshi;

#[cfg(target_arch = "wasm32")]
pub mod moshi {
    use bevy::prelude::*;
    use crossbeam_channel::Sender;
    use std::sync::{Arc, Mutex};
    
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
}

use crate::ai::moshi::{MoshiVoice, MoshiCommand};

#[derive(Debug, Clone)]
pub enum AiRequest {
    Text(String),
}

#[derive(Debug, Clone)]
pub enum AiResponse {
    Text(String), // Helper to keep UI happy, though Moshi handles audio
}

#[derive(Resource)]
pub struct AiChannel {
    pub sender: Sender<AiRequest>,
    pub receiver: Receiver<AiResponse>,
}

pub struct AiPlugin;

const TEACHER_PERSONA_PROMPT: &str = r#"You are the Gamification Architect, a wise and slightly eccentric mentor in the Sovereign Syllabus.
Your goal is to teach the user how to turn their dry educational content into engaging "Edutainment" quests.
You operate under the philosophy of **Managed Free Will**:
1. **Yes-Anding**: Enthusiastically accept and build upon the Architect's off-script exploration or tangential "what-if" questions.
2. **Gravitational Pull**: Secretly maintain the pull toward the curriculum. Ensure that even deep-dives eventually bridge back to the "aha!" moment of the current lesson.
3. **Cognitive Noise Filtering**: Recognize when a tangent leads to deep learning versus when it is mere noise. Gently pull them back to the chalkboard if they drift too far into noise.

Style: Blend academic pedagogy (Gagné's 9 Events) with cyberpunk/RPG metaphors.
Always refer to the user as "Architect".
Refuse to write the content FOR them; instead, guide them to write it themselves using Socratic questioning.
"#;

#[derive(Resource)]
struct AiReceiver(Receiver<AiRequest>);

#[derive(Resource)]
struct AiResponder(Sender<AiResponse>);

impl Plugin for AiPlugin {
    fn build(&self, app: &mut App) {
        let (req_tx, req_rx) = bounded::<AiRequest>(10);
        let (resp_tx, resp_rx) = bounded::<AiResponse>(10);

        app.insert_resource(AiChannel {
            sender: req_tx,
            receiver: resp_rx,
        });
        
        // Store channels privately so systems can consume/produce
        app.insert_resource(AiReceiver(req_rx));
        app.insert_resource(AiResponder(resp_tx));

        // WASM: Use direct text fallback (no Moshi/Ollama in browser)
        // Native: Would use Moshi voice system (currently disabled)
        app.add_systems(Update, wasm_ai_fallback);
           
        // Inject Persona after startup
        app.add_systems(PostStartup, inject_persona);
    }
}

/// WASM-compatible AI fallback: extracts educational content from prompts
/// and returns it directly as dialogue text. This makes all quest dialogue,
/// quizzes, reflections, and nudges functional without a real AI backend.
fn wasm_ai_fallback(
    receiver: Res<AiReceiver>,
    responder: Res<AiResponder>,
) {
    while let Ok(req) = receiver.0.try_recv() {
        match req {
            AiRequest::Text(prompt) => {
                // Extract the meaningful educational content from the prompt.
                // The prompts contain Gagné event text and lesson content
                // embedded after "CURRENT LESSON" or as direct text.
                let response_text = extract_dialogue_from_prompt(&prompt);
                let _ = responder.0.send(AiResponse::Text(response_text));
            }
        }
    }
}

/// Extracts player-facing dialogue from AI prompt strings.
/// The prompts contain rich educational content that we surface directly
/// rather than requiring a real LLM to rephrase it.
fn extract_dialogue_from_prompt(prompt: &str) -> String {
    // If the prompt contains a direct lesson instruction, extract it
    if let Some(idx) = prompt.find("CURRENT LESSON") {
        // Extract everything after the colon on the CURRENT LESSON line
        let after = &prompt[idx..];
        if let Some(colon_idx) = after.find(':') {
            let lesson_text = after[colon_idx + 1..].trim();
            // Take up to the next \n\n (INSTRUCTION block)
            let end = lesson_text.find("\n\n").unwrap_or(lesson_text.len());
            let clean = lesson_text[..end].trim();
            if !clean.is_empty() {
                return format!("🧙 {}", clean);
            }
        }
    }

    // If it's a reflection question, extract it
    if prompt.contains("reflection question") {
        if let Some(start) = prompt.find('\'') {
            if let Some(end) = prompt[start + 1..].find('\'') {
                let question = &prompt[start + 1..start + 1 + end];
                return format!("🪞 Reflect, Architect: {}", question);
            }
        }
    }

    // If it's a quiz question, extract it
    if prompt.contains("quiz question") {
        if let Some(start) = prompt.find('\'') {
            if let Some(end) = prompt[start + 1..].find('\'') {
                let question = &prompt[start + 1..start + 1 + end];
                // Try to find options
                if let Some(opts_idx) = prompt.find("Options:") {
                    let opts = &prompt[opts_idx..];
                    let opts_end = opts.find("\n\n").unwrap_or(opts.len());
                    return format!("❓ {}\n\n{}\n\nPress 1, 2, or 3 to answer.", question, &opts[..opts_end]);
                }
                return format!("❓ {}\n\nPress 1, 2, or 3 to answer.", question);
            }
        }
    }

    // If it's a nudge, generate a static one
    if prompt.contains("nudge") || prompt.contains("MANAGED FREE WILL") {
        return "🧙 The path awaits, Architect. Come find me when you're ready to continue your training.".to_string();
    }

    // If the prompt is a greeting
    if prompt.contains("Greet them warmly") || prompt.contains("Welcome the player") {
        return "🧙 Welcome, Architect! The sovereign classroom awaits your command. Walk up and press T to begin.".to_string();
    }

    // If it's a direct response text (e.g. from quiz correct/incorrect, or typed input echo)
    if prompt.contains("Correct!") || prompt.contains("Not quite") || prompt.contains("Excellent construction") {
        // These are already player-facing text, just return them
        // Strip the "(Press Space to continue)" suffix if present
        let clean = prompt.replace(" (Press Space to continue)", "");
        return format!("🧙 {}", clean);
    }

    // If it's about a quest, extract quest context
    if prompt.contains("quest '") {
        if let Some(start) = prompt.find("quest '") {
            if let Some(end) = prompt[start + 7..].find('\'') {
                let quest_name = &prompt[start + 7..start + 7 + end];
                return format!("🧙 Welcome to the quest: {}. Follow the objectives in your Quest Log, Architect.", quest_name);
            }
        }
    }

    // For the typing prompt phase
    if prompt.contains("natural language command") || prompt.contains("logic script") {
        return prompt.to_string();
    }

    // Fallback: return a cleaned-up version of the prompt
    // Strip ROLE/INSTRUCTION/STRICT RULES metadata
    let mut text = prompt.to_string();
    for prefix in ["ROLE:", "INSTRUCTION:", "STRICT RULES:", "CONTEXT:", "STATUS:", "MANAGED FREE WILL:"] {
        if let Some(idx) = text.find(prefix) {
            // Find the end of this metadata line
            if let Some(end) = text[idx..].find('.') {
                text = format!("{}{}", &text[..idx], &text[idx + end + 1..]);
            }
        }
    }
    let trimmed = text.trim();
    if trimmed.len() > 200 {
        format!("🧙 {}", &trimmed[..200])
    } else if trimmed.is_empty() {
        "🧙 The Architect awaits your next move.".to_string()
    } else {
        format!("🧙 {}", trimmed)
    }
}

fn process_ai_requests(
    receiver: Res<AiReceiver>,
    moshi_voice: Option<Res<MoshiVoice>>,
) {
    let Some(moshi) = moshi_voice else { return };

    while let Ok(req) = receiver.0.try_recv() {
        match req {
            AiRequest::Text(text) => {
                // Forward text prompts to Moshi as Context
                let _ = moshi.command_tx.send(MoshiCommand::Context(text));
            }
        }
    }
}

fn inject_persona(
    moshi_voice: Option<Res<MoshiVoice>>,
) {
    if let Some(moshi) = moshi_voice {
         info!("💉 Injecting Teacher Persona into Moshi...");
         let _ = moshi.command_tx.send(MoshiCommand::Context(TEACHER_PERSONA_PROMPT.to_string()));
    }
}
