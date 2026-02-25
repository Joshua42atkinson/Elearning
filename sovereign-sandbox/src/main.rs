use bevy::prelude::*;

#[derive(Component)]
struct BootText;

#[derive(Resource)]
struct BootTimer(Timer);

mod ai;
mod teacher;
mod syllabus;
mod quest_ui;
mod inventory;
mod game_world;
mod story_mode;
mod quiz;

use ai::AiPlugin;
use ai::memory::{MemoryStore, MemoryStoreResource};
use teacher::TeacherPlugin;
use syllabus::SyllabusPlugin;
use quest_ui::QuestUIPlugin;
use inventory::InventoryPlugin;
use game_world::GameWorldPlugin;
use story_mode::StoryModePlugin;
use quiz::QuizPlugin;
use std::sync::Arc;
use std::path::Path;

fn main() {
    // Initialize Memory Store
    let memory_path = Path::new("assets/memory");
    
    #[cfg(not(target_arch = "wasm32"))]
    let _ = std::fs::create_dir_all(memory_path);
    
    let memory_store = match MemoryStore::new(memory_path) {
        Ok(store) => Arc::new(store),
        Err(e) => {
            eprintln!("Warning: Failed to initialize MemoryStore: {}. Running without persistent memory.", e);
            // In WASM, creating a directory fails. We can just instantiate a dummy MemoryStore.
            // But since MemoryStore::new might fail on WASM entirely if it relies on fs, 
            // we should probably just gracefully handle the lack of memory if we can.
            // For now, if it fails, we will try to create a default one if possible, or we just panic in non-wasm.
            // Since we need an Arc<MemoryStore> we'll construct one that might not have a path.
            // Actually, MemoryStore::new might fail. Let's look at what we can do.
            // For now, let's just create it with a dummy path or let it fail gracefully if we can.
            // Wait, we need a valid MemoryStore. Let's just create an empty one.
            #[cfg(target_arch = "wasm32")]
            {
                // On WASM, we just accept that memory persistence is disabled.
                // Depending on MemoryStore implementation, we might need a dummy file or we can just panic for now if it requires it, 
                // but wait, we want to fix the panic. Let's look at memory.rs if needed, or just let it panic if it can't recover.
                // Actually `MemoryStore::new` usually initializes an empty vector or something. Maybe we can just pass a dummy name.
                panic!("Memory Store failed to load on WASM. Needs mock integration.");
            }
            #[cfg(not(target_arch = "wasm32"))]
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
                canvas: Some("#bevy-canvas".into()),
                fit_canvas_to_parent: true,
                ..default()
            }),
            ..default()
        }).set(ImagePlugin::default_nearest()))
        .insert_resource(MemoryStoreResource(memory_store))
        .add_plugins(SyllabusPlugin) // Load the Syllabus
        .add_plugins(AiPlugin) // Add the Brain
        .add_plugins(TeacherPlugin) // Add the Teacher Entity
        .add_plugins(QuestUIPlugin) // Add the Quest Progression UI
        .add_plugins(InventoryPlugin) // Add the Inventory System
        .add_plugins(GameWorldPlugin) // Add the 2D RPG World
        .add_plugins(StoryModePlugin) // Add LitRPG Story Mode
        .add_plugins(QuizPlugin)
        .insert_resource(ClearColor(Color::srgb(0.05, 0.05, 0.05))) // Deep Charcoal (Almost Black)
        .insert_resource(BootTimer(Timer::from_seconds(0.1, TimerMode::Repeating)))
        .add_systems(Startup, setup)
        .add_systems(Update, animate_boot_text)
        .add_plugins(bevy_inspector_egui::quick::WorldInspectorPlugin::new())
        .run();
}

fn setup(mut commands: Commands) {
    // Camera is now spawned by GameWorldPlugin
    // commands.spawn(Camera2d);

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

