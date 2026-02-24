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
 
#[derive(Component)]
pub struct QuestTimerText;

#[derive(Component)]
pub struct QuestObjectiveText;

#[derive(Resource)]
pub struct MissionTimer(pub Timer);

#[derive(Component)]
pub struct VictoryScreen;

// ============================================================================
// Plugin
// ============================================================================

pub struct QuestUIPlugin;

impl Plugin for QuestUIPlugin {
   fn build(&self, app: &mut App) {
        app.insert_resource(MissionTimer(Timer::from_seconds(1200.0, TimerMode::Once))) // 20 minutes
           .add_systems(Startup, setup_quest_ui)
           .add_systems(Update, (
               handle_quest_navigation, 
               update_quest_ui, 
               update_mission_timer,
               show_victory_screen,
           ));
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

            // Current Phase / Step
            parent.spawn((
                Text::new("🗺️ Walk to the Teacher"),
                TextFont {
                    font_size: 14.0,
                    ..default()
                },
                TextColor(Color::srgb(0.8, 0.8, 0.8)),
                QuestStepText,
            ));

            // Active Objective
            parent.spawn((
                Text::new(""),
                TextFont {
                    font_size: 12.0,
                    ..default()
                },
                TextColor(Color::srgb(0.0, 1.0, 1.0)), // Cyan
                QuestObjectiveText,
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
                            width: Val::Percent(0.0),
                            height: Val::Percent(100.0),
                            ..default()
                        },
                        BackgroundColor(Color::srgb(1.0, 0.75, 0.0)), // Phosphor Amber
                        QuestProgressBar,
                    ));
                });

            // Timer display
            parent.spawn((
                Text::new("⏱️ 20:00"),
                TextFont {
                    font_size: 14.0,
                    ..default()
                },
                TextColor(Color::srgb(0.0, 1.0, 1.0)), // Cyan
                QuestTimerText,
            ));
        });
}

fn update_quest_ui(
    syllabus: Option<Res<SyllabusResource>>,
    mut title_query: Query<&mut Text, (With<QuestTitleText>, Without<QuestStepText>, Without<QuestObjectiveText>)>,
    mut step_query: Query<&mut Text, (With<QuestStepText>, Without<QuestTitleText>, Without<QuestObjectiveText>)>,
    mut objective_query: Query<&mut Text, (With<QuestObjectiveText>, Without<QuestTitleText>, Without<QuestStepText>)>,
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

            // Update phase display
            let phase = syl.current_phase();
            let phase_num = syl.quest_script.current_phase + 1;
            let total = syl.quest_script.total_phases();
            let phase_type = phase.phase_type_name();

            for mut text in &mut step_query {
                if syl.quest_script.is_complete() {
                    *text = Text::new("✅ Quest Complete!");
                } else {
                    *text = Text::new(format!("[{}] {}/{}", phase_type, phase_num, total));
                }
            }

            // Update objective text
            for mut text in &mut objective_query {
                if syl.quest_script.is_complete() {
                    *text = Text::new("");
                } else {
                    *text = Text::new(phase.display_label());
                }
            }

            // Update progress bar
            let progress_percent = syl.quest_script.progress_percent();
            for mut node in &mut progress_query {
                node.width = Val::Percent(progress_percent);
            }
        }
    }
}

fn handle_quest_navigation(
    keys: Res<ButtonInput<KeyCode>>,
    mut syllabus: Option<ResMut<SyllabusResource>>,
    mut event_writer: EventWriter<crate::syllabus::QuestAdvancedEvent>,
) {
    // Hidden Debug Key: Shift + N
    if keys.pressed(KeyCode::ShiftLeft) && keys.just_pressed(KeyCode::KeyN) {
        if let Some(ref mut syl) = syllabus {
            let before_module = syl.current_module_index;

            syl.advance_phase();
            
            event_writer.send(crate::syllabus::QuestAdvancedEvent {
                module_index: syl.current_module_index,
                step_index: syl.quest_script.current_phase,
            });
            
            if before_module != syl.current_module_index {
                info!("🎓 Advanced to Module {}", syl.current_module_index + 1);
            } else {
                let phase = syl.current_phase();
                info!("📖 Advanced to Phase {}: {}", syl.quest_script.current_phase + 1, phase.display_label());
            }
        }
    }
}

fn update_mission_timer(
    time: Res<Time>,
    mut timer: ResMut<MissionTimer>,
    mut query: Query<&mut Text, With<QuestTimerText>>,
) {
    timer.0.tick(time.delta());
    let remaining = timer.0.remaining_secs();
    let minutes = (remaining / 60.0) as usize;
    let seconds = (remaining % 60.0) as usize;
    
    for mut text in &mut query {
        *text = Text::new(format!("⏱️ {:02}:{:02}", minutes, seconds));
    }
}

fn show_victory_screen(
    mut commands: Commands,
    syllabus: Option<Res<SyllabusResource>>,
    victory_query: Query<Entity, With<VictoryScreen>>,
    timer: Res<MissionTimer>,
) {
    if let Some(syl) = syllabus {
        if syl.current_module_index >= syl.syllabus.modules.len() && victory_query.is_empty() {
            // Spawn victory screen
            commands.spawn((
                Node {
                    position_type: PositionType::Absolute,
                    left: Val::Percent(10.0),
                    right: Val::Percent(10.0),
                    top: Val::Percent(10.0),
                    bottom: Val::Percent(10.0),
                    padding: UiRect::all(Val::Px(50.0)),
                    flex_direction: FlexDirection::Column,
                    align_items: AlignItems::Center,
                    justify_content: JustifyContent::Center,
                    row_gap: Val::Px(20.0),
                    ..default()
                },
                BackgroundColor(Color::srgba(0.0, 0.0, 0.0, 0.9)),
                BorderColor(Color::srgb(1.0, 0.75, 0.0)), // Phosphor Amber
                VictoryScreen,
            ))
            .with_children(|parent| {
                parent.spawn((
                    Text::new("🏆 VICTORY ARCHITECT!"),
                    TextFont {
                        font_size: 48.0,
                        ..default()
                    },
                    TextColor(Color::srgb(1.0, 0.75, 0.0)),
                ));

                let elapsed = timer.0.elapsed_secs();
                let mins = (elapsed / 60.0) as usize;
                let secs = (elapsed % 60.0) as usize;

                parent.spawn((
                    Text::new(format!("Module Completed in {:02}:{:02}", mins, secs)),
                    TextFont {
                        font_size: 24.0,
                        ..default()
                    },
                    TextColor(Color::srgb(1.0, 1.0, 1.0)),
                ));

                parent.spawn((
                    Text::new("You have demonstrated mastery over local AI tools.\nThe sovereign classroom is yours to shape."),
                    TextFont {
                        font_size: 18.0,
                        ..default()
                    },
                    TextColor(Color::srgb(0.8, 0.8, 0.8)),
                ));

                parent.spawn((
                    Text::new("NEXT STEPS: Build your first gamified curriculum."),
                    TextFont {
                        font_size: 16.0,
                        ..default()
                    },
                    TextColor(Color::srgb(0.0, 1.0, 1.0)),
                ));
            });
        }
    }
}
