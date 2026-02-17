use bevy::prelude::*;
use crate::ai::AiChannel;
use crate::syllabus::SyllabusResource;

#[derive(Component)]
pub struct Teacher;

#[derive(Resource)]
pub struct TeacherState {
    pub is_speaking: bool,
    pub last_message: String,
}

impl Default for TeacherState {
    fn default() -> Self {
        Self {
            is_speaking: false,
            last_message: String::from("Waiting for Architect..."),
        }
    }
}

pub struct TeacherPlugin;

impl Plugin for TeacherPlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(TeacherState::default())
           .add_systems(Startup, spawn_teacher)
           .add_systems(Update, (teacher_interaction, update_teacher_visuals));
    }
}

fn spawn_teacher(mut commands: Commands, asset_server: Res<AssetServer>) {
    // Spawn the Teacher Entity (Visual Representation)
    // For now, it's a floating "NPC" text label.
    commands.spawn((
        Text::new("🧙 The Gamification Architect"),
        TextFont {
            font_size: 24.0,
            ..default()
        },
        TextColor(Color::srgb(0.0, 1.0, 1.0)), // Cyan / Neon Blue
        Node {
            position_type: PositionType::Absolute,
            right: Val::Px(50.0),
            top: Val::Px(50.0),
            ..default()
        },
        Teacher,
    ));

    // Spawn a bubble for what the teacher says
    commands.spawn((
        Text::new("..."),
        TextFont {
            font_size: 18.0,
            ..default()
        },
        TextColor(Color::srgb(0.8, 0.8, 0.8)),
        Node {
            position_type: PositionType::Absolute,
            right: Val::Px(50.0),
            top: Val::Px(80.0),
            max_width: Val::Px(400.0),
            ..default()
        },
        TeacherBubble,
    ));
}

#[derive(Component)]
struct TeacherBubble;

fn teacher_interaction(
    keys: Res<ButtonInput<KeyCode>>,
    mut ai_channel: ResMut<AiChannel>,
    mut teacher_state: ResMut<TeacherState>,
    syllabus: Option<Res<SyllabusResource>>,
) {
    if keys.just_pressed(KeyCode::KeyT) {
        // Build context-aware prompt using current syllabus step
        let prompt = if let Some(syl) = syllabus {
            if let (Some(quest), Some(event_text)) = (syl.current_quest(), syl.current_event_text()) {
                format!(
                    "CONTEXT: We are on '{}'. Current step: {}\n\nUser: How can I make my lesson more fun?",
                    quest.title,
                    event_text
                )
            } else {
                "How can I make my lesson more fun?".to_string()
            }
        } else {
            "How can I make my lesson more fun?".to_string()
        };
        
        let _ = ai_channel.sender.send(prompt);
        teacher_state.is_speaking = true;
        info!("Architect asked the Teacher a question.");
    }

    if keys.just_pressed(KeyCode::KeyH) {
        let _ = ai_channel.sender.send("LISTEN".to_string());
        teacher_state.is_speaking = true;
        info!("Architect is speaking to the Teacher...");
    }
}

fn update_teacher_visuals(
    mut ai_channel: ResMut<AiChannel>,
    mut query: Query<&mut Text, With<TeacherBubble>>,
) {
    if let Ok(response) = ai_channel.receiver.try_recv() {
        for mut text in &mut query {
            *text = Text::new(response.clone());
        }
    }
}
