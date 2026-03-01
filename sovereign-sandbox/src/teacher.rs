use bevy::prelude::*;
use crate::ai::AiChannel;
use crate::syllabus::{SyllabusResource, QuestPhase};
use crate::scoring::PlayerScore;

#[derive(Component)]
pub struct Teacher;

#[derive(Component)]
pub struct TeacherMarker; // For the 2D game world sprite

#[derive(Resource)]
pub struct TeacherState {
    pub is_speaking: bool,
    #[allow(dead_code)]
    pub last_message: String,
    /// Prevents re-triggering auto-dialogue while already in conversation
    pub auto_dialogue_sent: bool,
    /// Timer for proactive "nudges" during exploration
    pub nudge_timer: Timer,
}

impl Default for TeacherState {
    fn default() -> Self {
        Self {
            is_speaking: false,
            last_message: String::from("Waiting for Architect..."),
            auto_dialogue_sent: false,
            nudge_timer: Timer::from_seconds(45.0, TimerMode::Repeating),
        }
    }
}

pub struct TeacherPlugin;

impl Plugin for TeacherPlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(TeacherState::default())
           .add_systems(Startup, spawn_teacher)
           .add_systems(Update, (
                teacher_interaction, 
                auto_dialogue_on_proximity,
                teacher_nudge_system,
                // NOTE: update_teacher_visuals removed — AI responses flow exclusively
                // through story_mode::update_narrative_display to prevent race condition.
                update_moshi_visuals,
                update_logic_lens,
                animate_logic_lens_scanline,
            ));
    }
}

fn teacher_nudge_system(
    time: Res<Time>,
    ai_channel: Res<AiChannel>,
    mut teacher_state: ResMut<TeacherState>,
    syllabus: Option<Res<SyllabusResource>>,
) {
    let Some(syl) = syllabus else { return };

    // Only nudge during Exploration phases
    if !matches!(syl.current_phase(), QuestPhase::Exploration { .. }) {
        teacher_state.nudge_timer.reset();
        return;
    }

    if teacher_state.is_speaking {
        return;
    }

    teacher_state.nudge_timer.tick(time.delta());

    if teacher_state.nudge_timer.just_finished() {
        if let Some(quest) = syl.current_quest() {
            let prompt = format!(
                "ROLE: Pedagogical Orchestrator. \
                STATUS: The Architect is drifting in the world during the exploration phase for quest '{}'. \
                MANAGED FREE WILL: Provide a gentle, 1-sentence 'nudge' that acknowledges their freedom but pulls them toward the chalkboard (the Teacher's location). Keep it very brief. \
                Call them 'Architect'.",
                quest.title
            );
            let _ = ai_channel.sender.send(crate::ai::AiRequest::Text(prompt));
            teacher_state.is_speaking = true;
            info!("💡 Teacher sending proactive nudge");
        }
    }
}

fn spawn_teacher(mut commands: Commands, _asset_server: Res<AssetServer>) {
    // Teacher entity (used for Moshi visual pulsing — no visible UI bubble;
    // AI dialogue is displayed via story_mode DialogueBox at the bottom)
    commands.spawn((
        Text::new(""),
        TextFont {
            font_size: 24.0,
            ..default()
        },
        TextColor(Color::srgb(0.0, 1.0, 1.0)),
        Node {
            display: Display::None, // Hidden — kept only so Moshi visuals have a target
            ..default()
        },
        Teacher,
    ));
}

// TeacherBubble removed — all AI text routes through story_mode DialogueBox.

#[derive(Component)]
struct LogicLensDisplay;

#[derive(Component)]
struct LogicLensScanline;

// ============================================================================
// Auto-Dialogue System (Pokémon-style: NPC talks when you walk up)
// ============================================================================

fn auto_dialogue_on_proximity(
    ai_channel: ResMut<AiChannel>,
    mut teacher_state: ResMut<TeacherState>,
    story_state: Res<crate::story_mode::StoryState>,
    mut syllabus: Option<ResMut<SyllabusResource>>,
    mut event_writer: EventWriter<crate::syllabus::QuestAdvancedEvent>,
) {
    // Only trigger when player enters Teacher range
    if !story_state.can_interact {
        // Reset the flag when player leaves range
        teacher_state.auto_dialogue_sent = false;
        return;
    }

    // Don't re-trigger if already sent
    if teacher_state.auto_dialogue_sent || teacher_state.is_speaking {
        return;
    }

    if let Some(ref mut syl) = syllabus {
        match syl.current_phase().clone() {
            QuestPhase::Exploration { .. } => {
                // Player arrived! Advance past exploration and auto-speak
                syl.advance_phase();
                event_writer.send(crate::syllabus::QuestAdvancedEvent {
                    module_index: syl.current_module_index,
                    step_index: syl.quest_script.current_phase,
                });
                info!("🗺️ Exploration complete — player reached Teacher");
                teacher_state.auto_dialogue_sent = false; // Let the next phase (Dialogue) trigger
            }
            QuestPhase::Dialogue { gagne_step, .. } => {
                // Auto-speak the dialogue for this Gagné step
                if let Some(quest) = syl.current_quest() {
                    let event_text = quest.events.get_step_text(gagne_step)
                        .unwrap_or("Welcome, Architect.");

                    let prompt = format!(
                        "ROLE: You are the Gamification Architect, acting as a Pedagogical Orchestrator.\n\
                        CONTEXT: The Architect (the player) is currently on the quest '{}', and has just approached you.\n\
                        CURRENT LESSON (Gagné Event '{}'): {}\n\n\
                        INSTRUCTION: Deliver this lesson step to the Architect in 2 short sentences. Speak with a cyberpunk mentor tone. Focus intensely on the educational value of local, sovereign AI. Be concise.",
                        quest.title,
                        crate::syllabus::gagne_step_name(gagne_step),
                        event_text
                    );

                    let _ = ai_channel.sender.send(crate::ai::AiRequest::Text(prompt));
                    teacher_state.is_speaking = true;
                    teacher_state.auto_dialogue_sent = true;
                }
            }
            QuestPhase::Reflection { ref question, .. } => {
                // Ask the reflection question
                let _ = ai_channel.sender.send(crate::ai::AiRequest::Text(format!(
                    "ROLE: Pedagogical Orchestrator. \
                    MANAGED FREE WILL: 'Yes-And' any student curiosity while maintaining the gravitational pull of this question. \
                    Ask the Architect this reflection question (2 sentences max): '{}'",
                    question
                )));
                teacher_state.is_speaking = true;
                teacher_state.auto_dialogue_sent = true;
            }
            QuestPhase::Quiz { ref question, ref options, .. } => {
                // Ask the quiz question and list options
                let options_str = options.iter().enumerate()
                    .map(|(i, opt)| format!("{}. {}", i+1, opt))
                    .collect::<Vec<_>>().join("\n");
                
                let prompt = format!(
                    "ROLE: Pedagogical Orchestrator. \
                    Ask the Architect this quiz question: '{}'\n\nOptions:\n{}\n\nInstruction: Present the question and options clearly. Call them 'Architect'. Limit your response to 2 short sentences plus the options.",
                    question,
                    options_str
                );
                let _ = ai_channel.sender.send(crate::ai::AiRequest::Text(prompt));
                teacher_state.is_speaking = true;
                teacher_state.auto_dialogue_sent = true;
            }
            _ => {
                // Task phases or Complete — Teacher stays silent
            }
        }
    }
}

// ============================================================================
// Manual Interaction (Press T — advances dialogue phases)
// ============================================================================

fn teacher_interaction(
    keys: Res<ButtonInput<KeyCode>>,
    ai_channel: Res<AiChannel>,
    mut teacher_state: ResMut<TeacherState>,
    mut syllabus: Option<ResMut<SyllabusResource>>,
    story_state: Res<crate::story_mode::StoryState>,
    score: Res<PlayerScore>,
    mut event_writer: EventWriter<crate::syllabus::QuestAdvancedEvent>,
) {
    if keys.just_pressed(KeyCode::KeyT) && story_state.can_interact {
        if let Some(ref mut syl) = syllabus {
            // Level Gate Check: Cannot advance to Module 2 without being Level 2
            if syl.current_module_index == 0 && syl.quest_script.current_phase == 5 && score.level < 2 {
                let _ = ai_channel.sender.send(crate::ai::AiRequest::Text(
                    "Architect, your understanding is still novice. You must engage the Glitch Slimes in the hall to grind until you reach Level 2 before we proceed.".to_string()
                ));
                teacher_state.is_speaking = true;
                return;
            }
            match syl.current_phase().clone() {
                QuestPhase::Dialogue { .. } => {
                    // Player presses T to advance past current dialogue
                    syl.advance_phase();
                    event_writer.send(crate::syllabus::QuestAdvancedEvent {
                        module_index: syl.current_module_index,
                        step_index: syl.quest_script.current_phase,
                    });
                    teacher_state.auto_dialogue_sent = false; // Allow next auto-dialogue
                    teacher_state.is_speaking = false;
                    info!("✨ Player advanced dialogue to phase {}", syl.quest_script.current_phase);
                }
                QuestPhase::Reflection { .. } => {
                    // Player confirms reflection answer
                    syl.complete_current_task();
                    syl.advance_phase();
                    event_writer.send(crate::syllabus::QuestAdvancedEvent {
                        module_index: syl.current_module_index,
                        step_index: syl.quest_script.current_phase,
                    });
                    teacher_state.auto_dialogue_sent = false;
                    teacher_state.is_speaking = false;
                    info!("🪞 Reflection complete — advancing");
                }
                QuestPhase::Exploration { .. } => {
                    // If standing near teacher, just prompt
                    let _ = ai_channel.sender.send(crate::ai::AiRequest::Text(
                        "ROLE: You are The Gamification Architect mentor NPC. \
                        The player just walked up to you. Greet them warmly in 1-2 sentences, RPG style. \
                        Call them 'Architect'.".to_string()
                    ));
                    teacher_state.is_speaking = true;
                }
                _ => {}
            }
        }
    }
}

// update_teacher_visuals removed — was consuming from AI channel causing a race
// condition with story_mode::update_narrative_display. All AI responses now
// flow exclusively through the bottom DialogueBox in story_mode.rs.

fn update_logic_lens(
    mut commands: Commands,
    inventory: Res<crate::inventory::Inventory>,
    story_state: Res<crate::story_mode::StoryState>,
    syllabus: Option<Res<SyllabusResource>>,
    mut display_query: Query<(Entity, &mut Text), With<LogicLensDisplay>>,
) {
    let lens_active = inventory.active_tool == Some(crate::inventory::ToolId::LogicLens);
    let can_see = lens_active && story_state.can_interact;
    
    if can_see {
        let context_text = if let Some(syl) = syllabus {
            let phase = syl.current_phase();
            if let Some(quest) = syl.current_quest() {
                format!(
                    "🔍 LOGIC LENS\nQUEST: {}\nPHASE: [{}] {}\nINTENT: Gagné Event Protocol",
                    quest.title,
                    phase.phase_type_name(),
                    phase.display_label()
                )
            } else {
                "🔍 LOGIC LENS\nSearching for intent...".to_string()
            }
        } else {
            "🔍 LOGIC LENS\nNo syllabus context found.".to_string()
        };
        
        if let Ok((_entity, mut text)) = display_query.get_single_mut() {
            *text = Text::new(context_text);
        } else if display_query.is_empty() {
            // Spawn the main display box
            commands.spawn((
                Node {
                    position_type: PositionType::Absolute,
                    left: Val::Px(20.0),
                    bottom: Val::Px(200.0),
                    padding: UiRect::all(Val::Px(15.0)),
                    flex_direction: FlexDirection::Column,
                    border: UiRect::all(Val::Px(1.0)),
                    max_width: Val::Px(320.0),
                    overflow: Overflow::clip(),
                    ..default()
                },
                BackgroundColor(Color::srgba(0.1, 0.0, 0.1, 0.6)), // Transparent Fuchsia tint
                BorderColor(Color::srgb(1.0, 0.0, 1.0)), // Pure Fuchsia
                LogicLensDisplay,
            )).with_children(|parent| {
                // Header
                parent.spawn((
                    Text::new("SCANNING LOGIC..."),
                    TextFont {
                        font_size: 10.0,
                        ..default()
                    },
                    TextColor(Color::srgb(1.0, 0.0, 1.0)),
                ));

                // Main Text
                parent.spawn((
                    Text::new(context_text),
                    TextFont {
                        font_size: 14.0,
                        ..default()
                    },
                    TextColor(Color::srgb(1.0, 0.6, 1.0)), // Light Fuchsia
                ));

                // Scanline effect
                parent.spawn((
                    Node {
                        position_type: PositionType::Absolute,
                        left: Val::Px(0.0),
                        right: Val::Px(0.0),
                        top: Val::Px(0.0),
                        height: Val::Px(2.0),
                        ..default()
                    },
                    BackgroundColor(Color::srgba(1.0, 0.0, 1.0, 0.4)),
                    LogicLensScanline,
                ));
            });
        }
    } else {
        for (entity, _) in &display_query {
            commands.entity(entity).despawn_recursive();
        }
    }
}

fn update_moshi_visuals(
    moshi: Option<Res<crate::ai::moshi::MoshiVoice>>,
    mut query: Query<(&mut TextFont, &mut TextColor), With<Teacher>>,
) {
    let Some(moshi) = moshi else { return };
    
    for (mut font, mut color) in &mut query {
        if moshi.is_speaking {
            // Pulse size and color
            let base_size = 24.0;
            let amp = moshi.amplitude.clamp(0.0, 1.0);
            font.font_size = base_size + (amp * 10.0);
            
            // Pulse color from Cyan to White
            let t = amp;
            *color = TextColor(Color::srgb(t, 1.0, 1.0));
        } else {
            font.font_size = 24.0;
            *color = TextColor(Color::srgb(0.0, 1.0, 1.0));
        }
    }
}

fn animate_logic_lens_scanline(
    time: Res<Time>,
    mut query: Query<&mut Node, With<LogicLensScanline>>,
) {
    let t = (time.elapsed_secs() * 1.5) % 1.0;
    for mut node in &mut query {
        node.top = Val::Percent(t * 100.0);
    }
}
