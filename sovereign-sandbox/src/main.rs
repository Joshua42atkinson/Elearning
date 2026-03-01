use bevy::prelude::*;

#[derive(Component)]
struct BootText;

#[derive(Resource)]
struct BootTimer(Timer);

// ============================================================================
// Game States
// ============================================================================

#[derive(States, Debug, Clone, PartialEq, Eq, Hash, Default)]
pub enum GameState {
    #[default]
    Menu,
    Boot,
    Playing,
    Victory,
}

mod ai;
mod teacher;
mod syllabus;
mod quest_ui;
mod inventory;
mod game_world;
mod story_mode;
mod quiz;
mod scoring;
mod puzzle;
mod ui;
mod title_screen;
mod audio;
mod combat;

use ai::AiPlugin;
use ai::memory::{MemoryStore, MemoryStoreResource};
use teacher::TeacherPlugin;
use syllabus::SyllabusPlugin;
use quest_ui::QuestUIPlugin;
use inventory::InventoryPlugin;
use game_world::GameWorldPlugin;
use story_mode::StoryModePlugin;
use quiz::QuizPlugin;
use scoring::ScoringPlugin;
use puzzle::PuzzlePlugin;
use ui::knowledge_popup::KnowledgePopupPlugin;
use ui::victory_screen::VictoryScreenPlugin;
use title_screen::TitleScreenPlugin;
use audio::GameAudioPlugin;
use combat::CombatPlugin;
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
            #[cfg(target_arch = "wasm32")]
            {
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
        .init_state::<GameState>()
        .add_plugins(SyllabusPlugin)
        .add_plugins(AiPlugin)
        .add_plugins(TeacherPlugin)
        .add_plugins(QuestUIPlugin)
        .add_plugins(InventoryPlugin)
        .add_plugins(GameWorldPlugin)
        .add_plugins(StoryModePlugin)
        .add_plugins(QuizPlugin)
        .add_plugins(ScoringPlugin)
        .add_plugins(PuzzlePlugin)
        .add_plugins(CombatPlugin)
        .add_plugins(KnowledgePopupPlugin)
        .add_plugins(TitleScreenPlugin)
        .add_plugins(GameAudioPlugin)
        .add_plugins(VictoryScreenPlugin)
        .insert_resource(ClearColor(Color::srgb(0.02, 0.02, 0.04))) // Deep space blue-black
        .insert_resource(BootTimer(Timer::from_seconds(0.08, TimerMode::Repeating)))
        .add_systems(OnEnter(GameState::Boot), setup_boot)
        .add_systems(Update, animate_boot_text.run_if(in_state(GameState::Boot)))
        .run();
}

fn setup_boot(mut commands: Commands) {
    // Boot cinematic text
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
    mut query: Query<(&mut Text, &mut TextColor), With<BootText>>,
    mut next_state: ResMut<NextState<GameState>>,
    mut commands: Commands,
    boot_entities: Query<Entity, With<BootText>>,
    keys: Res<ButtonInput<KeyCode>>,
) {
    // Skip boot cinematic on any keypress
    if keys.get_just_pressed().next().is_some() {
        for entity in &boot_entities {
            commands.entity(entity).despawn_recursive();
        }
        next_state.set(GameState::Playing);
        return;
    }
    timer.0.tick(time.delta());
    if timer.0.just_finished() {
        let messages = [
            "> INITIALIZING KERNEL...",
            "> LOAD_BRAIN... [OK]",
            "> ATTUNING EARS... [OK]",
            "> MAPPING ACADEMY...",
            "> CONNECTING TO THE NOOSPHERE...",
            "> WELCOME, ARCHITECT."
        ];

        let elapsed = time.elapsed_secs();
        
        for (mut text, mut color) in &mut query {
            if elapsed < 1.5 {
                *text = Text::new(messages[0]);
            } else if elapsed < 3.0 {
                *text = Text::new(format!("{}\n{}", messages[0], messages[1]));
            } else if elapsed < 4.5 {
                *text = Text::new(format!("{}\n{}\n{}", messages[0], messages[1], messages[2]));
            } else if elapsed < 6.0 {
                *text = Text::new(format!("{}\n{}\n{}\n{}", messages[0], messages[1], messages[2], messages[3]));
            } else if elapsed < 7.5 {
                *text = Text::new(format!("{}\n{}\n{}\n{}\n{}", messages[0], messages[1], messages[2], messages[3], messages[4]));
            } else if elapsed < 9.0 {
                *text = Text::new(format!("{}\n{}\n{}\n{}\n{}\n{}", messages[0], messages[1], messages[2], messages[3], messages[4], messages[5]));
                // Flash to cyan for the welcome message
                *color = TextColor(Color::srgb(0.0, 1.0, 1.0));
            } else {
                // Transition to Playing state
                for entity in &boot_entities {
                    commands.entity(entity).despawn_recursive();
                }
                next_state.set(GameState::Playing);
            }
        }
    }
}
