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

#[derive(Component)]
pub struct QuestNotification;

#[derive(Component)]
pub struct QuestNotificationText;

#[derive(Resource)]
pub struct NotificationTimer(pub Timer);

// ============================================================================
// Plugin
// ============================================================================

pub struct QuestUIPlugin;

impl Plugin for QuestUIPlugin {
   fn build(&self, app: &mut App) {
        app.insert_resource(MissionTimer(Timer::from_seconds(0.0, TimerMode::Once))) // elapsed time
           .insert_resource(NotificationTimer(Timer::from_seconds(3.0, TimerMode::Once)))
           .add_systems(Startup, setup_quest_ui)
           .add_systems(Update, (
               handle_quest_navigation, 
               update_quest_notification,
               update_quest_log,
               update_mission_timer,
               show_victory_screen,
               manage_notifications,
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
                left: Val::Px(12.0),
                top: Val::Px(12.0),
                padding: UiRect::all(Val::Px(12.0)),
                flex_direction: FlexDirection::Column,
                row_gap: Val::Px(8.0),
                border: UiRect::all(Val::Px(1.0)),
                max_width: Val::Px(280.0),
                ..default()
            },
            BackgroundColor(Color::srgba(0.05, 0.05, 0.08, 0.85)), // Glassier Deep Indigo
            BorderColor(Color::srgb(0.55, 0.36, 0.96)), // Sharp Violet
            QuestLogPanel,
        ))
        .with_children(|parent| {
            // Header: "QUEST LOG"
            parent.spawn((
                Text::new("═══ QUEST LOG ═══"),
                TextFont {
                    font_size: 13.0,
                    ..default()
                },
                TextColor(Color::srgb(0.5, 0.5, 0.5)), // Subdued gray
            ));

            // Module Title
            parent.spawn((
                Text::new("Loading..."),
                TextFont {
                    font_size: 16.0,
                    ..default()
                },
                TextColor(Color::srgb(0.55, 0.36, 0.96)), // Neon Violet
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
                    font_size: 13.0,
                    ..default()
                },
                TextColor(Color::srgb(0.9, 0.9, 0.9)), // White/Light Gray for focal point
                QuestObjectiveText,
            ));

            // Progress Bar Container
            parent
                .spawn(Node {
                    width: Val::Px(220.0),
                    height: Val::Px(14.0),
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
                        BackgroundColor(Color::srgb(0.55, 0.36, 0.96)), // Neon Violet
                        QuestProgressBar,
                    ));
                });

            // Timer display (elapsed time, counting up)
            parent.spawn((
                Text::new("⏱ 00:00"),
                TextFont {
                    font_size: 14.0,
                    ..default()
                },
                TextColor(Color::srgb(0.6, 0.6, 0.6)),
                QuestTimerText,
            ));
        });

    // Center Notification — phase transition banner
    commands.spawn((
        Node {
            position_type: PositionType::Absolute,
            top: Val::Percent(20.0),
            left: Val::Percent(0.0),
            right: Val::Percent(0.0),
            justify_content: JustifyContent::Center,
            align_items: AlignItems::Center,
            display: Display::None,
            ..default()
        },
        QuestNotification,
    )).with_children(|parent| {
        parent.spawn((
            Text::new("NEW OBJECTIVE"),
            TextFont {
                font_size: 28.0,
                ..default()
            },
            TextColor(Color::srgb(1.0, 0.9, 0.4)),
            Node {
                padding: UiRect::px(32.0, 32.0, 10.0, 10.0),
                border: UiRect::vertical(Val::Px(2.0)),
                ..default()
            },
            BackgroundColor(Color::srgba(0.05, 0.02, 0.1, 0.88)),
            BorderColor(Color::srgb(0.39, 0.40, 0.95)),
            QuestNotificationText,
        ));
    });
}

fn update_quest_notification(
    syllabus: Option<Res<SyllabusResource>>,
    mut notification_timer: ResMut<NotificationTimer>,
    mut notification_query: Query<&mut Node, (With<QuestNotification>, Without<QuestProgressBar>)>,
    mut notif_text_query: Query<&mut Text, With<QuestNotificationText>>,
) {
    if let Some(syl) = syllabus {
        if syl.is_changed() {
            notification_timer.0.reset();
            for mut node in &mut notification_query {
                node.display = Display::Flex;
            }

            let phase = syl.current_phase();
            let phase_num = syl.quest_script.current_phase + 1;
            let total = syl.quest_script.total_phases();
            let phase_type = phase.phase_type_name();
            let goal = phase.display_label();

            for mut text in &mut notif_text_query {
                if syl.quest_script.is_complete() {
                    *text = Text::new("━━  QUEST COMPLETE  ━━");
                } else {
                    *text = Text::new(format!("━━  [{phase_type}]  {phase_num}/{total}: {goal}  ━━"));
                }
            }
        }
    }
}

type TitleQueryFilter = (With<QuestTitleText>, Without<QuestStepText>, Without<QuestObjectiveText>, Without<QuestNotificationText>);
type StepQueryFilter = (With<QuestStepText>, Without<QuestTitleText>, Without<QuestObjectiveText>, Without<QuestNotificationText>);
type ObjectiveQueryFilter = (With<QuestObjectiveText>, Without<QuestTitleText>, Without<QuestStepText>, Without<QuestNotificationText>);

fn update_quest_log(
    syllabus: Option<Res<SyllabusResource>>,
    mut title_query: Query<&mut Text, TitleQueryFilter>,
    mut step_query: Query<&mut Text, StepQueryFilter>,
    mut objective_query: Query<&mut Text, ObjectiveQueryFilter>,
    mut progress_query: Query<&mut Node, With<QuestProgressBar>>,
) {
    if let Some(syl) = syllabus {
        if syl.is_changed() {
            let phase = syl.current_phase();
            let phase_num = syl.quest_script.current_phase + 1;
            let total = syl.quest_script.total_phases();
            let phase_type = phase.phase_type_name();
            let goal = phase.display_label();

            // Update module title
            if let Some(quest) = syl.current_quest() {
                for mut text in &mut title_query {
                    *text = Text::new(format!("📜 {}", quest.title));
                }
            }

            // Update phase display
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
                    *text = Text::new(format!("GOAL: {}", goal));
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

fn manage_notifications(
    time: Res<Time>,
    mut timer: ResMut<NotificationTimer>,
    mut query: Query<&mut Node, With<QuestNotification>>,
) {
    timer.0.tick(time.delta());
    if timer.0.finished() {
        for mut node in &mut query {
            node.display = Display::None;
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
    // Count up (elapsed time) instead of down — reduces anxiety in learning contexts
    timer.0.tick(time.delta());
    let elapsed = timer.0.elapsed_secs();
    let minutes = (elapsed / 60.0) as usize;
    let seconds = (elapsed % 60.0) as usize;
    
    for mut text in &mut query {
        *text = Text::new(format!("⏱ {:02}:{:02}", minutes, seconds));
    }
}

fn show_victory_screen(
    mut commands: Commands,
    syllabus: Option<Res<SyllabusResource>>,
    victory_query: Query<Entity, With<VictoryScreen>>,
    timer: Res<MissionTimer>,
    score: Res<crate::scoring::PlayerScore>,
) {
    if let Some(syl) = syllabus {
        if syl.current_module_index >= syl.syllabus.modules.len() && victory_query.is_empty() {
            let elapsed = timer.0.elapsed_secs();
            let mins = (elapsed / 60.0) as usize;
            let secs = (elapsed % 60.0) as usize;

            // Spawn victory screen
            commands.spawn((
                Node {
                    position_type: PositionType::Absolute,
                    left: Val::Percent(8.0),
                    right: Val::Percent(8.0),
                    top: Val::Percent(8.0),
                    bottom: Val::Percent(8.0),
                    padding: UiRect::all(Val::Px(50.0)),
                    flex_direction: FlexDirection::Column,
                    align_items: AlignItems::Center,
                    justify_content: JustifyContent::Center,
                    row_gap: Val::Px(18.0),
                    border: UiRect::all(Val::Px(2.0)),
                    ..default()
                },
                BackgroundColor(Color::srgba(0.02, 0.02, 0.04, 0.96)),
                BorderColor(Color::srgb(0.55, 0.36, 0.96)),
                VictoryScreen,
            ))
            .with_children(|parent| {
                parent.spawn((
                    Text::new("🏆  MISSION COMPLETE"),
                    TextFont { font_size: 48.0, ..default() },
                    TextColor(Color::srgb(0.55, 0.36, 0.96)),
                ));

                parent.spawn((
                    Text::new("The Sovereign Sandbox"),
                    TextFont { font_size: 20.0, ..default() },
                    TextColor(Color::srgb(0.39, 0.40, 0.95)),
                ));

                // Thin divider
                parent.spawn((
                    Node {
                        width: Val::Px(480.0),
                        height: Val::Px(1.0),
                        margin: UiRect::vertical(Val::Px(8.0)),
                        ..default()
                    },
                    BackgroundColor(Color::srgba(0.55, 0.36, 0.96, 0.4)),
                ));

                // Stats grid
                let stats = [
                    ("⏱  Time",      format!("{:02}:{:02}", mins, secs)),
                    ("⚡  XP Earned", format!("{}", score.xp)),
                    ("📜  Fragments", format!("{}/8", score.fragments_collected)),
                    ("🗺️  Rooms",     format!("{}/4", score.rooms_discovered.len())),
                    ("🧩  Puzzles",   format!("{}", score.puzzles_solved)),
                    ("⭐  Level",     format!("Lv.{} — {}", score.level, score.title)),
                ];

                for (label, value) in &stats {
                    parent.spawn(
                        Node {
                            flex_direction: FlexDirection::Row,
                            column_gap: Val::Px(16.0),
                            align_items: AlignItems::Center,
                            ..default()
                        }
                    ).with_children(|row| {
                        row.spawn((
                            Text::new(*label),
                            TextFont { font_size: 17.0, ..default() },
                            TextColor(Color::srgb(0.7, 0.7, 0.7)),
                            Node { width: Val::Px(180.0), ..default() },
                        ));
                        row.spawn((
                            Text::new(value.clone()),
                            TextFont { font_size: 17.0, ..default() },
                            TextColor(Color::srgb(1.0, 0.9, 0.5)),
                        ));
                    });
                }

                // Thin divider
                parent.spawn((
                    Node {
                        width: Val::Px(480.0),
                        height: Val::Px(1.0),
                        margin: UiRect::vertical(Val::Px(8.0)),
                        ..default()
                    },
                    BackgroundColor(Color::srgba(0.55, 0.36, 0.96, 0.4)),
                ));

                parent.spawn((
                    Text::new("You have demonstrated mastery over local AI tools.\nThe sovereign classroom is yours to shape."),
                    TextFont { font_size: 16.0, ..default() },
                    TextColor(Color::srgb(0.75, 0.75, 0.75)),
                ));

                parent.spawn((
                    Text::new("← Return to the E-Learning Module to continue your journey"),
                    TextFont { font_size: 14.0, ..default() },
                    TextColor(Color::srgb(0.39, 0.40, 0.95)),
                ));
            });
        }
    }
}
