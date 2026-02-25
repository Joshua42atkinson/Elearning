use bevy::prelude::*;
use serde::Deserialize;
use std::fs;
use std::path::Path;
use crate::inventory::ToolId;

// ============================================================================
// Quest Phase State Machine
// ============================================================================

#[derive(Clone, Debug, PartialEq)]
pub enum QuestPhase {
    /// Player must walk to a target. Triggered by proximity.
    Exploration { target: String, rewards: Option<Vec<ToolId>> },
    /// NPC auto-speaks. Dialogue plays on proximity.
    Dialogue { gagne_step: usize, rewards: Option<Vec<ToolId>> },
    /// Player must perform an action (use terminal, activate tool).
    Task { description: String, completed: bool, rewards: Option<Vec<ToolId>> },
    /// Player answers a reflection question (voice or choice).
    Reflection { question: String, answered: bool, rewards: Option<Vec<ToolId>> },
    /// Module complete.
    Complete,
}

impl QuestPhase {
    /// Human-readable icon + label for the UI
    pub fn display_label(&self) -> String {
        match self {
            QuestPhase::Exploration { target, .. } => format!("🗺️ Walk to the {}", target),
            QuestPhase::Dialogue { gagne_step, .. } => format!("💬 {}", gagne_step_name(*gagne_step)),
            QuestPhase::Task { description, .. } => format!("⚡ {}", description),
            QuestPhase::Reflection { question, .. } => format!("🪞 {}", question),
            QuestPhase::Complete => "🏆 Complete!".to_string(),
        }
    }

    /// Short type label for the quest log
    pub fn phase_type_name(&self) -> &'static str {
        match self {
            QuestPhase::Exploration { .. } => "EXPLORE",
            QuestPhase::Dialogue { .. } => "LISTEN",
            QuestPhase::Task { .. } => "DO",
            QuestPhase::Reflection { .. } => "REFLECT",
            QuestPhase::Complete => "DONE",
        }
    }
}

/// Maps Gagné step index to human name
pub fn gagne_step_name(step: usize) -> &'static str {
    match step {
        0 => "Gain Attention",
        1 => "Inform Objectives",
        2 => "Recall Prior Knowledge",
        3 => "Present Content",
        4 => "Provide Guidance",
        5 => "Elicit Performance",
        6 => "Provide Feedback",
        7 => "Assess Performance",
        8 => "Enhance Retention",
        _ => "Unknown",
    }
}

// ============================================================================
// TOML Data Structures (unchanged for backward compat)
// ============================================================================

#[derive(Debug, Deserialize, Clone)]
pub struct Syllabus {
    pub title: String,
    #[allow(dead_code)]
    pub description: String,
    pub modules: Vec<Quest>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Quest {
    #[allow(dead_code)]
    pub id: String,
    pub title: String,
    #[allow(dead_code)]
    pub description: String,
    #[allow(dead_code)]
    pub objective: String,
    pub events: GagneEvents,
    /// Optional phase script — if absent, auto-generated from events
    pub phases: Option<Vec<PhaseConfig>>,
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

impl GagneEvents {
    pub fn get_step_text(&self, step: usize) -> Option<&str> {
        match step {
            0 => Some(&self.gain_attention),
            1 => Some(&self.inform_objectives),
            2 => Some(&self.recall_prior_knowledge),
            3 => Some(&self.present_content),
            4 => Some(&self.provide_guidance),
            5 => Some(&self.elicit_performance),
            6 => Some(&self.provide_feedback),
            7 => Some(&self.assess_performance),
            8 => Some(&self.enhance_retention),
            _ => None,
        }
    }
}

#[derive(Debug, Deserialize, Clone)]
pub struct PhaseConfig {
    #[serde(rename = "type")]
    pub phase_type: String,
    pub target: Option<String>,
    pub gagne_step: Option<usize>,
    pub description: Option<String>,
    pub question: Option<String>,
    pub rewards: Option<Vec<String>>,
}

impl Syllabus {
    pub fn load_from_str(contents: &str) -> Result<Self, String> {
        toml::from_str(contents)
            .map_err(|e| format!("Failed to parse syllabus TOML: {}", e))
    }
}

// ============================================================================
// Quest Script (runtime state)
// ============================================================================

#[derive(Clone, Debug)]
pub struct QuestScript {
    pub phases: Vec<QuestPhase>,
    pub current_phase: usize,
}

impl QuestScript {
    /// Build a QuestScript from a Quest definition
    pub fn from_quest(quest: &Quest) -> Self {
        let phases = if let Some(ref configs) = quest.phases {
            // Use explicit phase config from TOML
            configs.iter().map(|c| {
                let rewards = c.rewards.as_ref().map(|r_list| {
                    r_list.iter().filter_map(|r_str| {
                        match r_str.as_str() {
                            "OllamaCompass" => Some(ToolId::OllamaCompass),
                            "LogicLens" => Some(ToolId::LogicLens),
                            "FeedbackMirror" => Some(ToolId::FeedbackMirror),
                            _ => {
                                warn!("Unknown tool reward: {}", r_str);
                                None
                            }
                        }
                    }).collect()
                });

                match c.phase_type.as_str() {
                    "exploration" => QuestPhase::Exploration {
                        target: c.target.clone().unwrap_or_else(|| "Teacher".to_string()),
                        rewards,
                    },
                    "dialogue" => QuestPhase::Dialogue {
                        gagne_step: c.gagne_step.unwrap_or(0),
                        rewards,
                    },
                    "task" => QuestPhase::Task {
                        description: c.description.clone().unwrap_or_else(|| "Complete the task".to_string()),
                        completed: false,
                        rewards,
                    },
                    "reflection" => QuestPhase::Reflection {
                        question: c.question.clone().unwrap_or_else(|| "What did you learn?".to_string()),
                        answered: false,
                        rewards,
                    },
                    _ => QuestPhase::Dialogue { gagne_step: 0, rewards: None },
                }
            }).collect()
        } else {
            // Auto-generate: exploration → 9 dialogues → complete
            let mut phases = vec![
                QuestPhase::Exploration { target: "Teacher".to_string(), rewards: None },
            ];
            for step in 0..9 {
                if step == 4 {
                    // Insert a task before "Provide Guidance"
                    phases.push(QuestPhase::Task {
                        description: "Walk to the Terminal and interact with it".to_string(),
                        completed: false,
                        rewards: None,
                    });
                }
                if step == 7 {
                    // Insert a reflection at "Assess Performance"
                    phases.push(QuestPhase::Reflection {
                        question: "Can you explain why local AI matters for student privacy?".to_string(),
                        answered: false,
                        rewards: None,
                    });
                } else {
                    phases.push(QuestPhase::Dialogue { gagne_step: step, rewards: None });
                }
            }
            phases
        };

        Self {
            phases,
            current_phase: 0,
        }
    }

    pub fn current(&self) -> &QuestPhase {
        self.phases.get(self.current_phase).unwrap_or(&QuestPhase::Complete)
    }

    pub fn advance(&mut self) -> &QuestPhase {
        if self.current_phase < self.phases.len() {
            self.current_phase += 1;
        }
        self.current()
    }

    pub fn is_complete(&self) -> bool {
        self.current_phase >= self.phases.len()
    }

    pub fn progress_percent(&self) -> f32 {
        if self.phases.is_empty() {
            return 100.0;
        }
        (self.current_phase as f32 / self.phases.len() as f32) * 100.0
    }

    pub fn total_phases(&self) -> usize {
        self.phases.len()
    }
}

// ============================================================================
// Bevy Resource (backward compatible)
// ============================================================================

#[derive(Resource, Clone)]
pub struct SyllabusResource {
    pub syllabus: Syllabus,
    pub current_module_index: usize,
    /// Legacy field — kept for backward compat with inventory unlock checks
    pub current_event_step: usize,
    /// The new quest script state machine
    pub quest_script: QuestScript,
}

impl SyllabusResource {
    pub fn new(syllabus: Syllabus) -> Self {
        let quest_script = if let Some(quest) = syllabus.modules.first() {
            QuestScript::from_quest(quest)
        } else {
            QuestScript { phases: vec![], current_phase: 0 }
        };

        Self {
            syllabus,
            current_module_index: 0,
            current_event_step: 0,
            quest_script,
        }
    }

    pub fn current_quest(&self) -> Option<&Quest> {
        self.syllabus.modules.get(self.current_module_index)
    }

    pub fn current_event_text(&self) -> Option<String> {
        let quest = self.current_quest()?;
        // Derive from current phase if it's a dialogue phase
        match self.quest_script.current() {
            QuestPhase::Dialogue { gagne_step, .. } => {
                quest.events.get_step_text(*gagne_step).map(|s| s.to_string())
            }
            QuestPhase::Task { description, .. } => Some(description.clone()),
            QuestPhase::Reflection { question, .. } => Some(question.clone()),
            QuestPhase::Exploration { target, .. } => Some(format!("Walk to the {}", target)),
            QuestPhase::Complete => Some("Quest Complete!".to_string()),
        }
    }

    /// The current phase of the quest
    pub fn current_phase(&self) -> &QuestPhase {
        self.quest_script.current()
    }

    /// Advance to the next phase and return any rewards from the *completed* phase
    pub fn advance_phase(&mut self) -> Option<Vec<ToolId>> {
        let current_rewards = match self.quest_script.current() {
            QuestPhase::Exploration { rewards, .. } => rewards.clone(),
            QuestPhase::Dialogue { rewards, .. } => rewards.clone(),
            QuestPhase::Task { rewards, .. } => rewards.clone(),
            QuestPhase::Reflection { rewards, .. } => rewards.clone(),
            QuestPhase::Complete => None,
        };

        let phase = self.quest_script.advance();
        // Sync legacy step counter
        if let QuestPhase::Dialogue { gagne_step, .. } = phase {
            self.current_event_step = *gagne_step;
        }
        // Check if this module's script is complete
        if self.quest_script.is_complete() {
            self.current_module_index += 1;
            self.current_event_step = 0;
            // Load next module's script
            if let Some(next_quest) = self.syllabus.modules.get(self.current_module_index) {
                self.quest_script = QuestScript::from_quest(next_quest);
            }
        }
        
        current_rewards
    }

    /// Legacy compat: advance step (calls advance_phase)
    pub fn advance_step(&mut self) {
        self.advance_phase();
    }

    /// Mark the current task as completed (for Task phases)
    pub fn complete_current_task(&mut self) {
        if let Some(phase) = self.quest_script.phases.get_mut(self.quest_script.current_phase) {
            if let QuestPhase::Task { completed, .. } = phase {
                *completed = true;
            }
            if let QuestPhase::Reflection { answered, .. } = phase {
                *answered = true;
            }
        }
    }
}

// ============================================================================
// Events
// ============================================================================

#[derive(Event)]
pub struct QuestAdvancedEvent {
    #[allow(dead_code)]
    pub module_index: usize,
    #[allow(dead_code)]
    pub step_index: usize,
}

// ============================================================================
// Plugin
// ============================================================================

pub struct SyllabusPlugin;

impl Plugin for SyllabusPlugin {
    fn build(&self, app: &mut App) {
        app.add_event::<QuestAdvancedEvent>();
        
        // Load syllabus at startup using include_str! so it works in WASM
        let syllabus_contents = include_str!("../../assets/syllabus/module_1.toml");
        
        match Syllabus::load_from_str(syllabus_contents) {
            Ok(syllabus) => {
                info!("📚 Syllabus Loaded: {}", syllabus.title);
                let resource = SyllabusResource::new(syllabus);
                info!("🎮 Quest Script: {} phases for module 1", resource.quest_script.total_phases());
                app.insert_resource(resource);
            }
            Err(e) => {
                error!("Failed to load syllabus: {}", e);
                panic!("Syllabus is required but failed to load!");
            }
        }
    }
}
