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
            Text::new("[T] Talk  [H] Speak  [SPACE] Dialogue  [WASD] Move"),
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
        // Intercept specific quest phases for the Knowledge Check
        if let Some(syl) = &syllabus {
            if syl.current_module_index == 0 && syl.quest_script.current_phase == 1 {
                // Hardcoded Knowledge Check dialogue
                story_state.active_dialogue = Some(DialogueNode {
                    speaker: "The Gamification Architect".to_string(),
                    text: "Before we proceed, Architect, tell me: Which model architecture guarantees student data never leaves this machine?".to_string(),
                    choices: vec![
                        DialogueChoice {
                            text: "1. Cloud-based API (OpenAI)".to_string(),
                            consequence: "Incorrect. Cloud APIs send data off-site. Try again.".to_string(),
                        },
                        DialogueChoice {
                            text: "2. Local LLM (Ollama/Moshi)".to_string(),
                            consequence: "Correct! Local AI ensures absolute data privacy.".to_string(),
                        },
                        DialogueChoice {
                            text: "3. Distributed Blockchain".to_string(),
                            consequence: "Incorrect. Blockchain is public and immutable. Try again.".to_string(),
                        },
                    ]
                });
                
                // Immediately display the knowledge check text
                if let Some(dialogue) = story_state.active_dialogue.clone() {
                     story_state.narrative_context.push(dialogue.text);
                     for choice in dialogue.choices {
                         story_state.narrative_context.push(choice.text);
                     }
                }
                
                // Construct a fallback formatted string for the typewriter (simulating AI response)
                let fallback_text = "Before we proceed, Architect, tell me: Which model architecture guarantees student data never leaves this machine?\n\n1. Cloud-based API (OpenAI)\n2. Local LLM (Ollama/Moshi)\n3. Distributed Blockchain".to_string();
                
                let _ = ai_channel.sender.send(AiRequest::Text(fallback_text)); // Dummy request to trigger typewriter
                story_state.is_thinking = true;
                return;
            }
        }

        let context = if let Some(syl) = syllabus {
            if let Some(quest) = syl.current_quest() {
                let phase = syl.current_phase();

                // Phase 2 Constructivism mechanic
                if syl.current_module_index == 0 && syl.quest_script.current_phase == 2 {
                    if !story_state.is_typing_prompt {
                        story_state.is_typing_prompt = true;
                        let text = "Architect! It is time to construct your first logic script. Type a natural language command below and press Enter:".to_string();
                        let _ = ai_channel.sender.send(AiRequest::Text(text));
                        story_state.is_thinking = true;
                        return;
                    }
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
    let choices_to_process = if let Some(dialogue) = &story_state.active_dialogue {
        Some(dialogue.choices.clone())
    } else {
        None
    };
    
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
