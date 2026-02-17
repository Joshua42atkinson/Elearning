use bevy::prelude::*;
use crate::syllabus::SyllabusResource;

// ============================================================================
// Components
// ============================================================================

#[derive(Component)]
pub struct QuestLogPanel;

#[derive(Component)]
pub struct QuestTitleText;

#[derive(Component)]
pub struct QuestStepText;

#[derive(Component)]
pub struct QuestProgressBar;

// ============================================================================
// Plugin
// ============================================================================

pub struct QuestUIPlugin;

impl Plugin for QuestUIPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, setup_quest_ui)
           .add_systems(Update, (handle_quest_navigation, update_quest_ui));
    }
}

// ============================================================================
// Helper Functions
// ============================================================================

fn event_step_name(step: usize) -> &'static str {
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
// Systems
// ============================================================================

fn setup_quest_ui(mut commands: Commands) {
    // Quest Log Panel Container
    commands
        .spawn((
            Node {
                position_type: PositionType::Absolute,
                left: Val::Px(20.0),
                top: Val::Px(120.0), // Below boot text
                padding: UiRect::all(Val::Px(15.0)),
                flex_direction: FlexDirection::Column,
                row_gap: Val::Px(8.0),
                border: UiRect::all(Val::Px(2.0)),
                ..default()
            },
            BackgroundColor(Color::srgb(0.1, 0.1, 0.1)), // Deep Charcoal
            BorderColor(Color::srgb(0.702, 0.525, 0.0)), // Phosphor Dim
            QuestLogPanel,
        ))
        .with_children(|parent| {
            // Header: "QUEST LOG"
            parent.spawn((
                Text::new("═══ QUEST LOG ═══"),
                TextFont {
                    font_size: 18.0,
                    ..default()
                },
                TextColor(Color::srgb(1.0, 0.75, 0.0)), // Phosphor Amber
            ));

            // Module Title
            parent.spawn((
                Text::new("Loading..."),
                TextFont {
                    font_size: 16.0,
                    ..default()
                },
                TextColor(Color::srgb(1.0, 0.75, 0.0)), // Phosphor Amber
                QuestTitleText,
            ));

            // Current Step
            parent.spawn((
                Text::new("1/9: Gain Attention"),
                TextFont {
                    font_size: 14.0,
                    ..default()
                },
                TextColor(Color::srgb(0.8, 0.8, 0.8)),
                QuestStepText,
            ));

            // Progress Bar Container
            parent
                .spawn(Node {
                    width: Val::Px(250.0),
                    height: Val::Px(20.0),
                    border: UiRect::all(Val::Px(1.0)),
                    ..default()
                })
                .with_children(|bar_parent| {
                    // Progress Fill
                    bar_parent.spawn((
                        Node {
                            width: Val::Percent(11.11), // 1/9
                            height: Val::Percent(100.0),
                            ..default()
                        },
                        BackgroundColor(Color::srgb(1.0, 0.75, 0.0)), // Phosphor Amber
                        QuestProgressBar,
                    ));
                });

            // Controls hint
            parent.spawn((
                Text::new("Press 'N' to advance"),
                TextFont {
                    font_size: 12.0,
                    ..default()
                },
                TextColor(Color::srgb(0.6, 0.6, 0.6)),
            ));
        });
}

fn update_quest_ui(
    syllabus: Option<Res<SyllabusResource>>,
    mut title_query: Query<&mut Text, (With<QuestTitleText>, Without<QuestStepText>)>,
    mut step_query: Query<&mut Text, (With<QuestStepText>, Without<QuestTitleText>)>,
    mut progress_query: Query<&mut Node, With<QuestProgressBar>>,
) {
    if let Some(syl) = syllabus {
        if syl.is_changed() {
            // Update module title
            if let Some(quest) = syl.current_quest() {
                for mut text in &mut title_query {
                    *text = Text::new(format!("📜 {}", quest.title));
                }
            }

            // Update step text
            let step_num = syl.current_event_step + 1;
            let total_events = 9;
            let event_name = event_step_name(syl.current_event_step);
            
            for mut text in &mut step_query {
                if syl.current_module_index >= syl.syllabus.modules.len() {
                    *text = Text::new("✅ Quest Complete!");
                } else {
                    *text = Text::new(format!("{}/{}: {}", step_num, total_events, event_name));
                }
            }

            // Update progress bar
            let progress_percent = if syl.current_module_index >= syl.syllabus.modules.len() {
                100.0
            } else {
                ((syl.current_event_step + 1) as f32 / 9.0) * 100.0
            };
            
            for mut node in &mut progress_query {
                node.width = Val::Percent(progress_percent);
            }
        }
    }
}

fn handle_quest_navigation(
    keys: Res<ButtonInput<KeyCode>>,
    mut syllabus: Option<ResMut<SyllabusResource>>,
) {
    if keys.just_pressed(KeyCode::KeyN) {
        if let Some(ref mut syl) = syllabus {
            let before_module = syl.current_module_index;
            let before_step = syl.current_event_step;
            
            syl.advance_step();
            
            let after_module = syl.current_module_index;
            let after_step = syl.current_event_step;
            
            if before_module != after_module {
                info!("🎓 Advanced to Module {}", after_module + 1);
            } else {
                info!("📖 Advanced to Step {}/9: {}", after_step + 1, event_step_name(after_step));
            }
        }
    }
}
