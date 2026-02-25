use bevy::prelude::*;
use crate::scoring::XpGainEvent;

// ============================================================================
// Terminal Command-Builder Puzzle
// ============================================================================
// Instead of "press T to complete", the player must assemble a command
// from scrambled tokens. This teaches CLI syntax through gameplay.

#[derive(Resource)]
pub struct PuzzleState {
    pub is_active: bool,
    pub tokens: Vec<&'static str>,
    pub correct_order: Vec<&'static str>,
    pub player_sequence: Vec<usize>,
    pub solved: bool,
    pub error_flash: f32, // Timer for red flash on wrong answer
}

impl Default for PuzzleState {
    fn default() -> Self {
        Self {
            is_active: false,
            tokens: vec!["llama3", "run", "ollama"],
            correct_order: vec!["ollama", "run", "llama3"],
            player_sequence: vec![],
            solved: false,
            error_flash: 0.0,
        }
    }
}

// ============================================================================
// Components
// ============================================================================

#[derive(Component)]
pub struct PuzzleOverlay;

#[derive(Component)]
pub struct PuzzleTokenSlot {
    pub index: usize,
}

#[derive(Component)]
pub struct PuzzleInputDisplay;

#[derive(Component)]
pub struct PuzzleStatusText;

// ============================================================================
// Plugin
// ============================================================================

pub struct PuzzlePlugin;

impl Plugin for PuzzlePlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(PuzzleState::default())
           .add_systems(Update, (
               activate_puzzle,
               handle_puzzle_input,
               update_puzzle_ui,
               close_puzzle_on_solve,
           ));
    }
}

// ============================================================================
// Systems
// ============================================================================

/// Activate puzzle when player is near Terminal and quest requires a task
fn activate_puzzle(
    keys: Res<ButtonInput<KeyCode>>,
    player_query: Query<&Transform, With<crate::game_world::Player>>,
    trigger_query: Query<(&Transform, &crate::game_world::QuestTrigger)>,
    syllabus: Option<Res<crate::syllabus::SyllabusResource>>,
    mut puzzle: ResMut<PuzzleState>,
    mut commands: Commands,
    overlay_query: Query<Entity, With<PuzzleOverlay>>,
) {
    if puzzle.is_active || puzzle.solved { return; }

    if !keys.just_pressed(KeyCode::KeyT) { return; }

    let Ok(player_tf) = player_query.get_single() else { return };
    let Some(syl) = &syllabus else { return };

    // Only activate during Task phases that mention Terminal
    let is_terminal_task = matches!(syl.current_phase(), 
        crate::syllabus::QuestPhase::Task { description, .. } if description.contains("Terminal")
    );
    if !is_terminal_task { return; }

    // Check if player is near the Terminal
    for (trigger_tf, trigger) in &trigger_query {
        if trigger.id == "Terminal" {
            let distance = player_tf.translation.distance(trigger_tf.translation);
            if distance < trigger.radius {
                // Activate puzzle!
                puzzle.is_active = true;
                puzzle.player_sequence.clear();
                puzzle.error_flash = 0.0;
                
                // Spawn puzzle UI overlay
                spawn_puzzle_ui(&mut commands, &puzzle);
                info!("🧩 Terminal Puzzle activated!");
                return;
            }
        }
    }
}

fn spawn_puzzle_ui(commands: &mut Commands, puzzle: &PuzzleState) {
    commands.spawn((
        Node {
            position_type: PositionType::Absolute,
            left: Val::Percent(15.0),
            right: Val::Percent(15.0),
            top: Val::Percent(20.0),
            bottom: Val::Percent(20.0),
            padding: UiRect::all(Val::Px(30.0)),
            border: UiRect::all(Val::Px(3.0)),
            flex_direction: FlexDirection::Column,
            align_items: AlignItems::Center,
            justify_content: JustifyContent::Center,
            row_gap: Val::Px(20.0),
            ..default()
        },
        BackgroundColor(Color::srgba(0.02, 0.02, 0.05, 0.95)),
        BorderColor(Color::srgb(0.0, 1.0, 0.5)),
        PuzzleOverlay,
    )).with_children(|parent| {
        // Title
        parent.spawn((
            Text::new("💻 TERMINAL PUZZLE"),
            TextFont { font_size: 24.0, ..default() },
            TextColor(Color::srgb(0.0, 1.0, 0.5)),
        ));

        // Instruction
        parent.spawn((
            Text::new("Build the correct command to start your local AI.\nPress 1, 2, or 3 to select tokens in order."),
            TextFont { font_size: 14.0, ..default() },
            TextColor(Color::srgb(0.7, 0.7, 0.7)),
        ));

        // Token buttons row
        parent.spawn(
            Node {
                flex_direction: FlexDirection::Row,
                column_gap: Val::Px(20.0),
                ..default()
            }
        ).with_children(|row| {
            for (i, token) in puzzle.tokens.iter().enumerate() {
                row.spawn((
                    Node {
                        padding: UiRect::new(Val::Px(20.0), Val::Px(20.0), Val::Px(12.0), Val::Px(12.0)),
                        border: UiRect::all(Val::Px(2.0)),
                        ..default()
                    },
                    BackgroundColor(Color::srgb(0.1, 0.15, 0.1)),
                    BorderColor(Color::srgb(0.0, 0.8, 0.4)),
                    PuzzleTokenSlot { index: i },
                )).with_children(|slot| {
                    slot.spawn((
                        Text::new(format!("[{}] {}", i + 1, token)),
                        TextFont { font_size: 18.0, ..default() },
                        TextColor(Color::srgb(0.0, 1.0, 0.5)),
                    ));
                });
            }
        });

        // Current input display
        parent.spawn((
            Text::new("> $ _"),
            TextFont { font_size: 20.0, ..default() },
            TextColor(Color::srgb(1.0, 1.0, 1.0)),
            PuzzleInputDisplay,
        ));

        // Status text
        parent.spawn((
            Text::new(""),
            TextFont { font_size: 16.0, ..default() },
            TextColor(Color::srgb(1.0, 0.3, 0.3)),
            PuzzleStatusText,
        ));
    });
}

fn handle_puzzle_input(
    keys: Res<ButtonInput<KeyCode>>,
    mut puzzle: ResMut<PuzzleState>,
    mut xp_writer: EventWriter<XpGainEvent>,
    mut syllabus: Option<ResMut<crate::syllabus::SyllabusResource>>,
    mut event_writer: EventWriter<crate::syllabus::QuestAdvancedEvent>,
    mut reward_writer: EventWriter<crate::inventory::ItemGetEvent>,
) {
    if !puzzle.is_active || puzzle.solved { return; }

    let mut selected = None;
    if keys.just_pressed(KeyCode::Digit1) { selected = Some(0); }
    if keys.just_pressed(KeyCode::Digit2) { selected = Some(1); }
    if keys.just_pressed(KeyCode::Digit3) { selected = Some(2); }

    // ESC to cancel
    if keys.just_pressed(KeyCode::Escape) {
        puzzle.is_active = false;
        return;
    }

    if let Some(idx) = selected {
        if idx < puzzle.tokens.len() && !puzzle.player_sequence.contains(&idx) {
            puzzle.player_sequence.push(idx);

            // Check if sequence is complete
            if puzzle.player_sequence.len() == puzzle.correct_order.len() {
                // Verify correctness
                let player_cmd: Vec<&str> = puzzle.player_sequence.iter()
                    .map(|&i| puzzle.tokens[i])
                    .collect();

                if player_cmd == puzzle.correct_order {
                    // CORRECT!
                    puzzle.solved = true;
                    info!("✅ Terminal Puzzle SOLVED! Command: {}", player_cmd.join(" "));

                    // Award XP
                    xp_writer.send(XpGainEvent {
                        amount: 100,
                        reason: "Terminal Puzzle Solved".to_string(),
                    });

                    // Advance quest
                    if let Some(ref mut syl) = syllabus {
                        syl.complete_current_task();
                        let rewards = syl.advance_phase();
                        if let Some(tools) = rewards {
                            for tool in tools {
                                reward_writer.send(crate::inventory::ItemGetEvent(tool));
                            }
                        }
                        event_writer.send(crate::syllabus::QuestAdvancedEvent {
                            module_index: syl.current_module_index,
                            step_index: syl.quest_script.current_phase,
                        });
                    }
                } else {
                    // WRONG — reset
                    puzzle.player_sequence.clear();
                    puzzle.error_flash = 1.0;
                    info!("❌ Wrong command order! Try again.");
                }
            }
        }
    }
}

fn update_puzzle_ui(
    time: Res<Time>,
    mut puzzle: ResMut<PuzzleState>,
    mut input_query: Query<&mut Text, (With<PuzzleInputDisplay>, Without<PuzzleStatusText>)>,
    mut status_query: Query<&mut Text, (With<PuzzleStatusText>, Without<PuzzleInputDisplay>)>,
    mut slot_query: Query<(&PuzzleTokenSlot, &mut BackgroundColor)>,
) {
    if !puzzle.is_active { return; }

    // Build current command string
    let cmd_parts: Vec<&str> = puzzle.player_sequence.iter()
        .map(|&i| puzzle.tokens[i])
        .collect();

    let display = if puzzle.solved {
        format!("> $ {} ✓", cmd_parts.join(" "))
    } else if cmd_parts.is_empty() {
        "> $ _".to_string()
    } else {
        format!("> $ {} _", cmd_parts.join(" "))
    };

    for mut text in &mut input_query {
        *text = Text::new(display.clone());
    }

    // Update status text
    if puzzle.error_flash > 0.0 {
        puzzle.error_flash -= time.delta_secs() * 2.0;
        for mut text in &mut status_query {
            *text = Text::new("⚠ Wrong order! Try again...");
        }
    } else if puzzle.solved {
        for mut text in &mut status_query {
            *text = Text::new("✅ COMPILED! +100 XP");
        }
    } else {
        for mut text in &mut status_query {
            *text = Text::new("");
        }
    }

    // Highlight used tokens
    for (slot, mut bg) in &mut slot_query {
        if puzzle.player_sequence.contains(&slot.index) {
            *bg = BackgroundColor(Color::srgb(0.0, 0.3, 0.15));
        } else {
            *bg = BackgroundColor(Color::srgb(0.1, 0.15, 0.1));
        }
    }
}

fn close_puzzle_on_solve(
    time: Res<Time>,
    puzzle: Res<PuzzleState>,
    mut commands: Commands,
    overlay_query: Query<Entity, With<PuzzleOverlay>>,
    mut close_timer: Local<Option<Timer>>,
) {
    if puzzle.solved {
        // Start a close timer
        if close_timer.is_none() {
            *close_timer = Some(Timer::from_seconds(2.5, TimerMode::Once));
        }
        
        if let Some(ref mut timer) = *close_timer {
            timer.tick(time.delta());
            if timer.finished() {
                for entity in &overlay_query {
                    commands.entity(entity).despawn_recursive();
                }
                *close_timer = None;
            }
        }
    } else if !puzzle.is_active {
        // Clean up if cancelled
        for entity in &overlay_query {
            commands.entity(entity).despawn_recursive();
        }
    }
}
