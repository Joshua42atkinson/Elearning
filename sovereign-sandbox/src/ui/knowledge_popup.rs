// Knowledge Fragment Popup UI — Bevy 0.15

use bevy::prelude::*;

/// Event emitted when a knowledge fragment is collected.
#[derive(Event)]
pub struct KnowledgeCollectedEvent {
    pub title: String,
    pub content: String,
    pub xp: u32,
}

/// Component marking the popup UI root entity.
#[derive(Component)]
struct KnowledgePopupRoot;

/// Resource to block player movement while popup is active.
#[derive(Resource, Default)]
pub struct PopupActive(pub bool);

pub struct KnowledgePopupPlugin;

impl Plugin for KnowledgePopupPlugin {
    fn build(&self, app: &mut App) {
        app
            .init_resource::<PopupActive>()
            .add_event::<KnowledgeCollectedEvent>()
            .add_systems(Update, spawn_knowledge_popup.run_if(in_state(crate::GameState::Playing)))
            .add_systems(Update, dismiss_knowledge_popup.run_if(in_state(crate::GameState::Playing)));
    }
}

/// Spawns the popup UI when a KnowledgeCollectedEvent is received.
fn spawn_knowledge_popup(
    mut commands: Commands,
    mut ev_reader: EventReader<KnowledgeCollectedEvent>,
    mut popup_active: ResMut<PopupActive>,
) {
    for ev in ev_reader.read() {
        popup_active.0 = true;

        // Full-screen semi-transparent overlay
        commands
            .spawn((
                Node {
                    width: Val::Percent(100.0),
                    height: Val::Percent(100.0),
                    position_type: PositionType::Absolute,
                    justify_content: JustifyContent::Center,
                    align_items: AlignItems::Center,
                    ..default()
                },
                BackgroundColor(Color::srgba(0.0, 0.0, 0.0, 0.78)),
                // Ensure this renders above game world but below nothing
                GlobalZIndex(100),
                KnowledgePopupRoot,
            ))
            .with_children(|overlay| {
                // Central panel
                overlay
                    .spawn((
                        Node {
                            width: Val::Px(520.0),
                            flex_direction: FlexDirection::Column,
                            align_items: AlignItems::Center,
                            padding: UiRect::all(Val::Px(32.0)),
                            row_gap: Val::Px(16.0),
                            border: UiRect::all(Val::Px(2.0)),
                            ..default()
                        },
                        BackgroundColor(Color::srgba(0.05, 0.05, 0.09, 0.97)),
                        BorderColor(Color::srgb(1.0, 0.85, 0.0)),
                    ))
                    .with_children(|panel| {
                        // Header badge
                        panel.spawn((
                            Text::new("📜  KNOWLEDGE FRAGMENT"),
                            TextFont { font_size: 22.0, ..default() },
                            TextColor(Color::srgb(1.0, 0.85, 0.0)),
                        ));

                        // Divider (thin amber line via zero-height node)
                        panel.spawn((
                            Node {
                                width: Val::Percent(80.0),
                                height: Val::Px(1.0),
                                ..default()
                            },
                            BackgroundColor(Color::srgba(1.0, 0.85, 0.0, 0.4)),
                        ));

                        // Fragment title
                        panel.spawn((
                            Text::new(format!("\"{}\"", ev.title)),
                            TextFont { font_size: 18.0, ..default() },
                            TextColor(Color::srgb(0.9, 0.9, 1.0)),
                        ));

                        // Content text
                        panel.spawn((
                            Text::new(ev.content.clone()),
                            TextFont { font_size: 15.0, ..default() },
                            TextColor(Color::srgb(0.75, 0.75, 0.75)),
                            Node {
                                max_width: Val::Px(420.0),
                                ..default()
                            },
                        ));

                        // XP reward
                        panel.spawn((
                            Text::new(format!("+{} XP", ev.xp)),
                            TextFont { font_size: 20.0, ..default() },
                            TextColor(Color::srgb(0.3, 1.0, 0.4)),
                        ));

                        // Divider
                        panel.spawn((
                            Node {
                                width: Val::Percent(60.0),
                                height: Val::Px(1.0),
                                ..default()
                            },
                            BackgroundColor(Color::srgba(1.0, 1.0, 1.0, 0.15)),
                        ));

                        // Dismiss prompt
                        panel.spawn((
                            Text::new("[Press any key to continue]"),
                            TextFont { font_size: 13.0, ..default() },
                            TextColor(Color::srgba(0.6, 0.6, 0.6, 0.8)),
                        ));
                    });
            });
    }
}

/// Dismisses the popup when any key is pressed.
fn dismiss_knowledge_popup(
    mut commands: Commands,
    keys: Res<ButtonInput<KeyCode>>,
    popup_query: Query<Entity, With<KnowledgePopupRoot>>,
    mut popup_active: ResMut<PopupActive>,
) {
    if !popup_query.is_empty() && keys.get_just_pressed().next().is_some() {
        for entity in popup_query.iter() {
            commands.entity(entity).despawn_recursive();
        }
        popup_active.0 = false;
    }
}
