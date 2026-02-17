use bevy::prelude::*;

#[derive(Component)]
struct BootText;

#[derive(Resource)]
struct BootTimer(Timer);

mod ai;
mod teacher;

use ai::AiPlugin;
use ai::memory::{MemoryStore, MemoryStoreResource};
use teacher::TeacherPlugin;
use std::sync::Arc;
use std::path::Path;

fn main() {
    // Initialize Memory Store
    let memory_path = Path::new("assets/memory");
    std::fs::create_dir_all(memory_path).unwrap_or_else(|e| eprintln!("Failed to create memory dir: {}", e));
    
    let memory_store = match MemoryStore::new(memory_path) {
        Ok(store) => Arc::new(store),
        Err(e) => {
            eprintln!("Failed to initialize MemoryStore: {}", e);
            // Panic or handle gracefully? For now, we panic as memory is essential.
            panic!("Critical Error: Memory Store failed to load.");
        }
    };

    App::new()
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                title: "The Sovereign Sandbox".into(),
                resolution: (1280.0, 720.0).into(),
                present_mode: bevy::window::PresentMode::AutoVsync,
                resizable: false,
                ..default()
            }),
            ..default()
        }))
        .insert_resource(MemoryStoreResource(memory_store))
        .add_plugins(AiPlugin) // Add the Brain
        .add_plugins(TeacherPlugin) // Add the Teacher Entity
        .insert_resource(ClearColor(Color::srgb(0.05, 0.05, 0.05))) // Deep Charcoal (Almost Black)
        .insert_resource(BootTimer(Timer::from_seconds(0.1, TimerMode::Repeating)))
        .add_systems(Startup, setup)
        .add_systems(Update, animate_boot_text)
        .run();
}

fn setup(mut commands: Commands) {
    commands.spawn(Camera2d);

    // Initial "Cursor"
    commands.spawn((
        Text::new("> INITIALIZING KERNEL...\n> "),
        TextFont {
            font_size: 20.0,
            ..default()
        },
        TextColor(Color::srgb(1.0, 0.75, 0.0)), // Phosphor Amber
        Node {
            position_type: PositionType::Absolute,
            top: Val::Px(20.0),
            left: Val::Px(20.0),
            ..default()
        },
        BootText,
    ));
}

fn animate_boot_text(
    time: Res<Time>,
    mut timer: ResMut<BootTimer>,
    mut query: Query<&mut Text, With<BootText>>,
) {
    timer.0.tick(time.delta());
    if timer.0.just_finished() {
        for mut text in &mut query {
            // Neon Wizard Boot Sequence
            let messages = [
                "> INITIALIZING KERNEL...",
                "> LOAD_BRAIN... [OK]",
                "> ATTUNING EARS... [OK]",
                "> CONNECTING TO THE NOOSPHERE...",
                "> WELCOME, ARCHITECT."
            ];

            // Simple state machine simulation using current text length as state
            // In a real app, use a proper State resource.
            // Just for the demo vibe:
            if text.0.contains("ARCHITECT") {
                // Done
                return;
            }
            
            // Random-ish glitch effect or simply append
            if text.0.len() % 50 == 0 {
                 text.0.push_str("\n> ");
            }
            
            // Append characters from the "source" message that matches current progress
            // Actually, let's just cycle messages based on time for simplicity in this demo keyframe
            // Clearing and rewriting lines for a terminal feel
             
             let elapsed = time.elapsed_secs();
             if elapsed < 2.0 {
                 *text = Text::new(messages[0]);
             } else if elapsed < 4.0 {
                 *text = Text::new(format!("{}\n{}", messages[0], messages[1]));
             } else if elapsed < 6.0 {
                 *text = Text::new(format!("{}\n{}\n{}", messages[0], messages[1], messages[2]));
             } else if elapsed < 8.0 {
                 *text = Text::new(format!("{}\n{}\n{}\n{}", messages[0], messages[1], messages[2], messages[3]));
             } else {
                 *text = Text::new(format!("{}\n{}\n{}\n{}\n{}", messages[0], messages[1], messages[2], messages[3], messages[4]));
             }
        }
    }
}
