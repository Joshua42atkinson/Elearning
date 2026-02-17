use bevy::prelude::*;
use serde::Deserialize;
use std::fs;
use std::path::Path;

#[derive(Debug, Deserialize, Clone)]
pub struct Syllabus {
    pub title: String,
    pub description: String,
    pub modules: Vec<Quest>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Quest {
    pub id: String,
    pub title: String,
    pub description: String,
    pub objective: String,
    pub events: GagneEvents,
}

#[derive(Debug, Deserialize, Clone)]
pub struct GagneEvents {
    pub gain_attention: String,
    pub inform_objectives: String,
    pub recall_prior_knowledge: String,
    pub present_content: String,
    pub provide_guidance: String,
    pub elicit_performance: String,
    pub provide_feedback: String,
    pub assess_performance: String,
    pub enhance_retention: String,
}

impl Syllabus {
    pub fn load(path: &Path) -> Result<Self, String> {
        let contents = fs::read_to_string(path)
            .map_err(|e| format!("Failed to read syllabus file: {}", e))?;
        
        toml::from_str(&contents)
            .map_err(|e| format!("Failed to parse syllabus TOML: {}", e))
    }
}

#[derive(Resource, Clone)]
pub struct SyllabusResource {
    pub syllabus: Syllabus,
    pub current_module_index: usize,
    pub current_event_step: usize,
}

impl SyllabusResource {
    pub fn new(syllabus: Syllabus) -> Self {
        Self {
            syllabus,
            current_module_index: 0,
            current_event_step: 0,
        }
    }

    pub fn current_quest(&self) -> Option<&Quest> {
        self.syllabus.modules.get(self.current_module_index)
    }

    pub fn current_event_text(&self) -> Option<String> {
        let quest = self.current_quest()?;
        let event_text = match self.current_event_step {
            0 => &quest.events.gain_attention,
            1 => &quest.events.inform_objectives,
            2 => &quest.events.recall_prior_knowledge,
            3 => &quest.events.present_content,
            4 => &quest.events.provide_guidance,
            5 => &quest.events.elicit_performance,
            6 => &quest.events.provide_feedback,
            7 => &quest.events.assess_performance,
            8 => &quest.events.enhance_retention,
            _ => return None,
        };
        Some(event_text.clone())
    }

    pub fn advance_step(&mut self) {
        self.current_event_step += 1;
        if self.current_event_step >= 9 {
            // Move to next module
            self.current_event_step = 0;
            self.current_module_index += 1;
        }
    }
}

pub struct SyllabusPlugin;

impl Plugin for SyllabusPlugin {
    fn build(&self, app: &mut App) {
        // Load syllabus at startup
        let syllabus_path = Path::new("assets/syllabus/module_1.toml");
        
        match Syllabus::load(syllabus_path) {
            Ok(syllabus) => {
                info!("📚 Syllabus Loaded: {}", syllabus.title);
                app.insert_resource(SyllabusResource::new(syllabus));
            }
            Err(e) => {
                error!("Failed to load syllabus: {}", e);
                // For now, we'll panic to make it obvious during development
                panic!("Syllabus is required but failed to load!");
            }
        }
    }
}
