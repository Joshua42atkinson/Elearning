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
               update_narrative_display,
               typewriter_tick,
           ));
    }
}

fn setup_story_ui(mut commands: Commands) {
    commands.spawn((
        Node {
            position_type: PositionType::Absolute,
            bottom: Val::Px(20.0),
            left: Val::Px(20.0),
            right: Val::Px(20.0),
            padding: UiRect::all(Val::Px(20.0)),
            border: UiRect::all(Val::Px(2.0)),
            flex_direction: FlexDirection::Column,
            row_gap: Val::Px(10.0),
            ..default()
        },
        BackgroundColor(Color::srgba(0.05, 0.05, 0.05, 0.95)),
        BorderColor(Color::srgb(1.0, 0.75, 0.0)),
        DialogueBox,
    ))
    .with_children(|parent| {
        parent.spawn((
            Text::new("🧙 The Gamification Architect"),
            TextFont { font_size: 18.0, ..default() },
            TextColor(Color::srgb(0.0, 1.0, 1.0)),
        ));

        parent.spawn((
            Text::new("Welcome, Architect. Walk to the Teacher to begin your quest..."),
            TextFont { font_size: 16.0, ..default() },
            TextColor(Color::srgb(1.0, 1.0, 1.0)),
            NarrativeText,
        ));

        parent.spawn((
            Text::new("Press T to interact | Press H to speak | Press SPACE for dialogue"),
            TextFont { font_size: 12.0, ..default() },
            TextColor(Color::srgb(0.6, 0.6, 0.6)),
        ));
    });
}

fn generate_dynamic_dialogue(
    keys: Res<ButtonInput<KeyCode>>,
    mut story_state: ResMut<StoryState>,
    ai_channel: Res<AiChannel>,
    syllabus: Option<Res<SyllabusResource>>,
) {
    if keys.just_pressed(KeyCode::Space) && story_state.active_dialogue.is_none() {
        let context = if let Some(syl) = syllabus {
            if let Some(quest) = syl.current_quest() {
                let phase = syl.current_phase();
                format!(
                    "You are The Gamification Architect, a wise mentor in a LitRPG world. \
                    The player is on quest '{}', currently in phase [{}]: {}. \
                    Generate a short, encouraging dialogue (2-3 sentences) that guides them. \
                    RPG mentor style. Call them 'Architect'.",
                    quest.title,
                    phase.phase_type_name(),
                    phase.display_label()
                )
            } else {
                "You are The Gamification Architect. Welcome the player to their journey.".to_string()
            }
        } else {
            "You are The Gamification Architect. Welcome the player to their journey.".to_string()
        };

        let _ = ai_channel.sender.send(AiRequest::Text(context));
        story_state.is_thinking = true;
    }
}

fn handle_dialogue_choices(
    keys: Res<ButtonInput<KeyCode>>,
    mut story_state: ResMut<StoryState>,
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
            story_state.active_dialogue = None;
        }
        if keys.just_pressed(KeyCode::Digit2) && choices.len() > 1 {
            let choice = &choices[1];
            story_state.narrative_context.push(choice.consequence.clone());
            story_state.active_dialogue = None;
        }
        if keys.just_pressed(KeyCode::Digit3) && choices.len() > 2 {
            let choice = &choices[2];
            story_state.narrative_context.push(choice.consequence.clone());
            story_state.active_dialogue = None;
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
) {
    if !typewriter.is_active { return; }
    typewriter.timer.tick(time.delta());
    if typewriter.timer.just_finished() {
        typewriter.revealed_chars += 1;
        if typewriter.revealed_chars >= typewriter.full_text.len() {
            typewriter.is_active = false;
            for mut text in &mut narrative_query {
                *text = Text::new(typewriter.full_text.clone());
            }
        } else {
            let visible: String = typewriter.full_text.chars().take(typewriter.revealed_chars).collect();
            for mut text in &mut narrative_query {
                *text = Text::new(format!("{}▌", visible));
            }
        }
    }
}
