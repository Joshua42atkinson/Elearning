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

impl Plugin for AiPlugin {
    fn build(&self, app: &mut App) {
        let (req_tx, req_rx) = bounded::<AiRequest>(10);
        let (_resp_tx, resp_rx) = bounded::<AiResponse>(10);

        app.insert_resource(AiChannel {
            sender: req_tx,
            receiver: resp_rx,
        });
        
        // Store the receiver privately so we can consume it
        app.insert_resource(AiReceiver(req_rx));
        
        // Initialize Moshi Voice System
        // app.add_systems(Startup, crate::ai::moshi::start_moshi_thread)
        //    .add_systems(Update, (crate::ai::moshi::update_moshi_state, process_ai_requests));
           
        // Inject Persona after startup
        app.add_systems(PostStartup, inject_persona);
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
