use bevy::prelude::*;
use crate::ai::{AiChannel, AiRequest};
use crate::syllabus::SyllabusResource;

// ============================================================================
// Story Mode - LitRPG Narrative System
// ============================================================================

#[derive(Resource, Clone)]
pub struct StoryState {
    #[allow(dead_code)]
    pub current_chapter: usize,
    #[allow(dead_code)]
    pub player_name: String,
    pub narrative_context: Vec<String>,
    pub active_dialogue: Option<DialogueNode>,
    pub can_interact: bool,
    pub is_thinking: bool,
    pub player_input: String,
    pub is_typing_prompt: bool,
}

impl Default for StoryState {
    fn default() -> Self {
        Self {
            current_chapter: 1,
            player_name: "Architect".to_string(),
            narrative_context: vec![],
            active_dialogue: None,
            can_interact: false,
            is_thinking: false,
            player_input: String::new(),
            is_typing_prompt: false,
        }
    }
}

#[derive(Clone)]
pub struct DialogueNode {
    #[allow(dead_code)]
    pub speaker: String,
    #[allow(dead_code)]
    pub text: String,
    pub choices: Vec<DialogueChoice>,
}

#[derive(Clone)]
pub struct DialogueChoice {
    pub text: String,
    pub consequence: String,
}

// ============================================================================
// Typewriter Effect
// ============================================================================

#[derive(Resource)]
pub struct TypewriterState {
    pub full_text: String,
    pub revealed_chars: usize,
    pub timer: Timer,
    pub is_active: bool,
}

impl Default for TypewriterState {
    fn default() -> Self {
        Self {
            full_text: String::new(),
            revealed_chars: 0,
            timer: Timer::from_seconds(0.03, TimerMode::Repeating),
            is_active: false,
        }
    }
}

// ============================================================================
// Components
// ============================================================================

#[derive(Component)]
pub struct DialogueBox;

#[derive(Component)]
pub struct NarrativeText;

// ============================================================================
// Plugin
// ============================================================================

pub struct StoryModePlugin;

impl Plugin for StoryModePlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(StoryState::default())
           .insert_resource(TypewriterState::default())
           .add_systems(Startup, setup_story_ui)
           .add_systems(Update, (
               generate_dynamic_dialogue,
               handle_dialogue_choices,
               handle_quiz_input,
               handle_typing_input,
               update_narrative_display,
               typewriter_tick,
           ));
    }
}

fn setup_story_ui(mut commands: Commands) {
    commands.spawn((
        Node {
            position_type: PositionType::Absolute,
            bottom: Val::Px(12.0),
            left: Val::Percent(10.0),
            right: Val::Percent(10.0),
            max_height: Val::Px(180.0),
            padding: UiRect::new(Val::Px(20.0), Val::Px(20.0), Val::Px(14.0), Val::Px(14.0)),
            border: UiRect::all(Val::Px(2.0)),
            flex_direction: FlexDirection::Column,
            row_gap: Val::Px(8.0),
            overflow: Overflow::clip_y(),
            ..default()
        },
        BackgroundColor(Color::srgba(0.03, 0.03, 0.06, 0.92)),
        BorderColor(Color::srgb(0.5, 0.375, 0.0)),
        DialogueBox,
    ))
    .with_children(|parent| {
        parent.spawn((
            Text::new("🧙 The Gamification Architect"),
            TextFont { font_size: 15.0, ..default() },
            TextColor(Color::srgb(0.0, 1.0, 1.0)),
        ));

        parent.spawn((
            Text::new("Walk to the Teacher to begin your quest..."),
            TextFont { font_size: 14.0, ..default() },
            TextColor(Color::srgb(0.9, 0.9, 0.9)),
            NarrativeText,
        ));

        parent.spawn((
            Text::new("[WASD] Move  [T] Interact  [SPACE] Dialogue  [1-3] Choices"),
            TextFont { font_size: 11.0, ..default() },
            TextColor(Color::srgb(0.45, 0.45, 0.45)),
        ));
    });
}

fn generate_dynamic_dialogue(
    keys: Res<ButtonInput<KeyCode>>,
    mut story_state: ResMut<StoryState>,
    ai_channel: Res<AiChannel>,
    syllabus: Option<Res<SyllabusResource>>,
) {
    if keys.just_pressed(KeyCode::Space) && story_state.active_dialogue.is_none() && !story_state.is_typing_prompt {
        // Specific quest phase handling is now data-driven via the Syllabus

        let context = if let Some(syl) = syllabus {
            if let Some(quest) = syl.current_quest() {
                let phase = syl.current_phase();

                // Phase 2 Constructivism mechanic
                if syl.current_module_index == 0 && syl.quest_script.current_phase == 2 && !story_state.is_typing_prompt {
                    story_state.is_typing_prompt = true;
                    let text = "Architect! It is time to construct your first logic script. Type a natural language command below and press Enter:".to_string();
                    let _ = ai_channel.sender.send(AiRequest::Text(text));
                    story_state.is_thinking = true;
                    return;
                }

                format!(
                    "You are The Gamification Architect, a wise mentor in a LitRPG world. \
                    The player is on quest '{}', currently in phase [{}]: {}. \
                    Generate a short, encouraging dialogue. \
                    STRICT RULES: Reply in exactly 2 short sentences. Do not hallucinate. Do not break character. Do not use lists. Call the player 'Architect'.",
                    quest.title,
                    phase.phase_type_name(),
                    phase.display_label()
                )
            } else {
                "You are The Gamification Architect. Welcome the player to their journey. \
                STRICT RULES: Reply in exactly 2 short sentences. Do not hallucinate. Do not break character. Do not use lists.".to_string()
            }
        } else {
            "You are The Gamification Architect. Welcome the player to their journey. \
            STRICT RULES: Reply in exactly 2 short sentences. Do not hallucinate. Do not break character. Do not use lists.".to_string()
        };

        let _ = ai_channel.sender.send(AiRequest::Text(context));
        story_state.is_thinking = true;
    }
}

fn handle_dialogue_choices(
    keys: Res<ButtonInput<KeyCode>>,
    mut story_state: ResMut<StoryState>,
    ai_channel: Res<AiChannel>,
) {
    let choices_to_process = story_state.active_dialogue.as_ref().map(|dialogue| dialogue.choices.clone());
    
    if let Some(choices) = choices_to_process {
        if keys.just_pressed(KeyCode::Digit1) && !choices.is_empty() {
            let choice = &choices[0];
            story_state.narrative_context.push(choice.consequence.clone());
            let _ = ai_channel.sender.send(AiRequest::Text(format!("{} (Press Space to continue)", choice.consequence)));
            story_state.is_thinking = true;
            // Only clear active dialogue if correct, so they have to try again if wrong
            if choice.text.contains("Local LLM") {
                story_state.active_dialogue = None;
            }
        }
        if keys.just_pressed(KeyCode::Digit2) && choices.len() > 1 {
            let choice = &choices[1];
            story_state.narrative_context.push(choice.consequence.clone());
            let _ = ai_channel.sender.send(AiRequest::Text(format!("{} (Press Space to continue)", choice.consequence)));
            story_state.is_thinking = true;
            if choice.text.contains("Local LLM") {
                story_state.active_dialogue = None;
            }
        }
        if keys.just_pressed(KeyCode::Digit3) && choices.len() > 2 {
            let choice = &choices[2];
            story_state.narrative_context.push(choice.consequence.clone());
            let _ = ai_channel.sender.send(AiRequest::Text(format!("{} (Press Space to continue)", choice.consequence)));
            story_state.is_thinking = true;
            if choice.text.contains("Local LLM") {
                story_state.active_dialogue = None;
            }
        }
    }
}

fn update_narrative_display(
    time: Res<Time>,
    ai_channel: Res<AiChannel>,
    mut story_state: ResMut<StoryState>,
    mut typewriter: ResMut<TypewriterState>,
    mut narrative_query: Query<&mut Text, With<NarrativeText>>,
    // Reset teacher is_speaking when AI response arrives (teacher.rs no longer consumes the channel)
    mut teacher_state: ResMut<crate::teacher::TeacherState>,
) {
    if story_state.is_thinking {
        for mut text in &mut narrative_query {
            let dots = (time.elapsed_secs() * 5.0) as usize % 4;
            let loading_str = format!("Thinking{}", ".".repeat(dots));
            *text = Text::new(loading_str);
        }
    }

    if let Ok(response) = ai_channel.receiver.try_recv() {
        let crate::ai::AiResponse::Text(content) = response;
        story_state.is_thinking = false;
        teacher_state.is_speaking = false; // Release the speaking lock
        typewriter.full_text = content.clone();
        typewriter.revealed_chars = 0;
        typewriter.is_active = true;
        typewriter.timer.reset();
    }
}

fn typewriter_tick(
    time: Res<Time>,
    mut typewriter: ResMut<TypewriterState>,
    mut narrative_query: Query<&mut Text, With<NarrativeText>>,
    story_state: Res<StoryState>,
) {
    if !typewriter.is_active && !story_state.is_typing_prompt { return; }
    
    if story_state.is_typing_prompt && !typewriter.is_active {
        for mut text in &mut narrative_query {
            *text = Text::new(format!("{}\n\n> {}▌", typewriter.full_text, story_state.player_input));
        }
        return;
    }

    typewriter.timer.tick(time.delta());
    if typewriter.timer.just_finished() {
        typewriter.revealed_chars += 1;
        if typewriter.revealed_chars >= typewriter.full_text.len() {
            typewriter.is_active = false;
            for mut text in &mut narrative_query {
                if story_state.is_typing_prompt {
                    *text = Text::new(format!("{}\n\n> {}▌", typewriter.full_text, story_state.player_input));
                } else {
                    *text = Text::new(typewriter.full_text.clone());
                }
            }
        } else {
            let visible: String = typewriter.full_text.chars().take(typewriter.revealed_chars).collect();
            for mut text in &mut narrative_query {
                *text = Text::new(format!("{}▌", visible));
            }
        }
    }
}

fn handle_typing_input(
    mut char_evr: EventReader<bevy::input::keyboard::KeyboardInput>,
    keys: Res<ButtonInput<KeyCode>>,
    mut story_state: ResMut<StoryState>,
    ai_channel: Res<AiChannel>,
) {
    if !story_state.is_typing_prompt { return; }

    for ev in char_evr.read() {
        if ev.state.is_pressed() {
            if let bevy::input::keyboard::Key::Character(c) = &ev.logical_key {
                if c.chars().count() == 1 {
                    story_state.player_input.push_str(c.as_str());
                }
            }
        }
    }

    if keys.just_pressed(KeyCode::Backspace) {
        story_state.player_input.pop();
    }

    if keys.just_pressed(KeyCode::Enter) && !story_state.player_input.is_empty() {
        let input = story_state.player_input.clone();
        story_state.player_input.clear();
        story_state.is_typing_prompt = false;
        
        // Respond to the typed script
        let response = format!("Excellent construction! You commanded: \"{}\". The environment has absorbed your logic.", input);
        let _ = ai_channel.sender.send(AiRequest::Text(response));
        story_state.is_thinking = true;
    }
}

fn handle_quiz_input(
    keys: Res<ButtonInput<KeyCode>>,
    mut story_state: ResMut<StoryState>,
    mut syllabus: Option<ResMut<crate::syllabus::SyllabusResource>>,
    ai_channel: Res<AiChannel>,
    mut event_writer: EventWriter<crate::syllabus::QuestAdvancedEvent>,
) {
    let Some(ref mut syl) = syllabus else { return };
    
    let (_question, options, correct_index) = match syl.current_phase() {
        crate::syllabus::QuestPhase::Quiz { question, options, correct_index, .. } => {
            (question.clone(), options.clone(), *correct_index)
        }
        _ => return,
    };

    let mut selected = None;
    if keys.just_pressed(KeyCode::Digit1) { selected = Some(0); }
    if keys.just_pressed(KeyCode::Digit2) { selected = Some(1); }
    if keys.just_pressed(KeyCode::Digit3) { selected = Some(2); }

    if let Some(idx) = selected {
        if idx < options.len() {
            if idx == correct_index {
                // Correct!
                let response = "Correct! Your understanding of the sovereign grid is deepening.".to_string();
                let _ = ai_channel.sender.send(AiRequest::Text(response));
                story_state.is_thinking = true;
                
                syl.complete_current_task();
                syl.advance_phase();
                
                event_writer.send(crate::syllabus::QuestAdvancedEvent {
                    module_index: syl.current_module_index,
                    step_index: syl.quest_script.current_phase,
                });
            } else {
                // Incorrect
                let response = "Not quite, Architect. Consider the core principles again. (Try another option)".to_string();
                let _ = ai_channel.sender.send(AiRequest::Text(response));
                story_state.is_thinking = true;
            }
        }
    }
}
