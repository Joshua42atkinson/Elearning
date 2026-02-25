use bevy::prelude::*;
use crate::GameState;

// ============================================================================
// Title Screen — Menu → Boot → Playing
// ============================================================================

#[derive(Component)]
struct TitleScreenRoot;

pub struct TitleScreenPlugin;

impl Plugin for TitleScreenPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(OnEnter(GameState::Menu), setup_title_screen)
           .add_systems(OnExit(GameState::Menu), despawn_title_screen)
           .add_systems(Update, handle_title_input.run_if(in_state(GameState::Menu)));
    }
}

fn setup_title_screen(mut commands: Commands) {
    // Full-screen background
    commands
        .spawn((
            Node {
                width: Val::Percent(100.0),
                height: Val::Percent(100.0),
                position_type: PositionType::Absolute,
                flex_direction: FlexDirection::Column,
                align_items: AlignItems::Center,
                justify_content: JustifyContent::Center,
                row_gap: Val::Px(20.0),
                ..default()
            },
            BackgroundColor(Color::srgb(0.02, 0.02, 0.04)),
            TitleScreenRoot,
        ))
        .with_children(|root| {
            // Decorative top rule
            root.spawn((
                Node {
                    width: Val::Px(600.0),
                    height: Val::Px(2.0),
                    margin: UiRect::bottom(Val::Px(20.0)),
                    ..default()
                },
                BackgroundColor(Color::srgba(1.0, 0.75, 0.0, 0.5)),
            ));

            // Main title
            root.spawn((
                Text::new("THE SOVEREIGN SANDBOX"),
                TextFont { font_size: 52.0, ..default() },
                TextColor(Color::srgb(0.75, 0.5, 1.0)), // Violet-400 equivalent
            ));

            // Subtitle
            root.spawn((
                Text::new("An AI Academy Adventure"),
                TextFont { font_size: 22.0, ..default() },
                TextColor(Color::srgb(0.5, 0.6, 1.0)), // Indigo-300 equivalent
            ));

            // Spacer
            root.spawn(Node {
                height: Val::Px(40.0),
                ..default()
            });

            // START prompt (pulsing via animation would need a timer; static is fine)
            root.spawn((
                Text::new("[ ENTER ]  Start Game"),
                TextFont { font_size: 26.0, ..default() },
                TextColor(Color::srgb(1.0, 1.0, 1.0)),
                TitlePrompt,
            ));

            // Controls hint
            root.spawn((
                Text::new("WASD / Arrow Keys  — Move\n[T]  — Interact with objects\n[SPACE]  — Talk to the AI Architect\n[1][2][3]  — Dialogue choices"),
                TextFont { font_size: 14.0, ..default() },
                TextColor(Color::srgb(0.5, 0.5, 0.5)),
                Node {
                    margin: UiRect::top(Val::Px(24.0)),
                    ..default()
                },
            ));

            // Decorative bottom rule
            root.spawn((
                Node {
                    width: Val::Px(600.0),
                    height: Val::Px(2.0),
                    margin: UiRect::top(Val::Px(30.0)),
                    ..default()
                },
                BackgroundColor(Color::srgba(0.75, 0.5, 1.0, 0.3)), // Faint violet
            ));

            // Credits
            root.spawn((
                Text::new("Built with Rust & Bevy  |  The Local AI Architect  |  v0.2.0"),
                TextFont { font_size: 12.0, ..default() },
                TextColor(Color::srgba(0.4, 0.4, 0.4, 0.8)),
            ));
        });
}

#[derive(Component)]
struct TitlePrompt;

fn handle_title_input(
    keys: Res<ButtonInput<KeyCode>>,
    mut next_state: ResMut<NextState<GameState>>,
    time: Res<Time>,
    mut query: Query<&mut TextColor, With<TitlePrompt>>,
) {
    // Pulse the start prompt
    let t = (time.elapsed_secs() * 2.5).sin() * 0.5 + 0.5;
    for mut color in &mut query {
        *color = TextColor(Color::srgba(1.0, 1.0, 1.0, 0.4 + t * 0.6));
    }

    if keys.just_pressed(KeyCode::Enter) || keys.just_pressed(KeyCode::Space) {
        next_state.set(GameState::Boot);
    }
}

fn despawn_title_screen(
    mut commands: Commands,
    query: Query<Entity, With<TitleScreenRoot>>,
) {
    for entity in &query {
        commands.entity(entity).despawn_recursive();
    }
}
