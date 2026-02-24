use bevy::prelude::*;
use bevy::render::render_resource::Extent3d;
use crate::syllabus::SyllabusResource;

// ============================================================================
// Components
// ============================================================================

#[derive(Component)]
pub struct Player {
    pub speed: f32,
    pub animation_timer: Timer,
    pub is_moving: bool,
    pub current_frame: usize,
    pub facing_left: bool,
}

#[derive(Component)]
pub struct Position {
    pub x: f32,
    pub y: f32,
}

#[allow(dead_code)]
#[derive(Component)]
pub struct Velocity {

    pub x: f32,
    pub y: f32,
}

#[derive(Component)]
#[allow(dead_code)]
pub struct Collider {
    pub width: f32,
    pub height: f32,
}


#[derive(Component)]
pub struct InteractionZone {
    pub radius: f32,
}

#[derive(Component)]
pub struct MemoryLink; // For Ollama Compass to detect

#[derive(Component)]
pub struct Terminal;

#[derive(Component)]
pub struct CompassGlow;

#[derive(Component)]
pub struct QuestTrigger {
    pub id: String,
    pub radius: f32,
}


// ============================================================================
// Resources & Components
// ============================================================================

#[derive(Component)]
pub struct GameCamera;

// ============================================================================
// Plugin
// ============================================================================

pub struct GameWorldPlugin;

impl Plugin for GameWorldPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, (setup_camera, spawn_player, spawn_world, spawn_tutorial))
           .add_systems(Update, (
               player_movement,
               update_transforms,
               camera_follow_player,
               check_proximity_interactions,
               show_interaction_prompt,
               hide_tutorial_on_interaction,
               animate_player,
               terminal_interaction,
               spawn_quest_reward,
               fade_out_rewards,
               reveal_memories,
               teacher_gravitational_pull,
           ));
    }
}



// ============================================================================
// Systems
// ============================================================================

fn setup_camera(mut commands: Commands) {
    // Spawn a 2D camera for the game world
    commands.spawn((
        Camera2d,
        GameCamera,
    ));
}

fn spawn_player(mut commands: Commands, asset_server: Res<AssetServer>) {
    // Spawn the player character in the center
    commands.spawn((
        Sprite {
            image: asset_server.load("player.jpg"),
            custom_size: Some(Vec2::new(64.0, 64.0)),
            ..default()
        },
        Transform::from_xyz(0.0, 0.0, 1.0),
        Player { 
            speed: 200.0,
            animation_timer: Timer::from_seconds(0.2, TimerMode::Repeating),
            is_moving: false,
            current_frame: 0,
            facing_left: false,
        },
        Collider { width: 32.0, height: 32.0 },
    ));
}


fn spawn_world(
    mut commands: Commands, 
    asset_server: Res<AssetServer>,
    mut images: ResMut<Assets<Image>>,
) {
    // 1. Generate Procedural "Cyberpunk Floor" Texture (Dark Grid)
    let floor_size = Extent3d {
        width: 64,
        height: 64,
        depth_or_array_layers: 1,
    };
    let mut floor_data = vec![0u8; 64 * 64 * 4]; // RGBA
    for y in 0..64 {
        for x in 0..64 {
            let index = (y * 64 + x) * 4;
            // Background: Dark Blue-Grey
            floor_data[index] = 10;
            floor_data[index + 1] = 15;
            floor_data[index + 2] = 20;
            floor_data[index + 3] = 255;

            // Grid Lines (Edges) - Cyan
            if x == 0 || y == 0 || x == 63 || y == 63 {
                floor_data[index] = 0;
                floor_data[index + 1] = 255;
                floor_data[index + 2] = 255;
                floor_data[index + 3] = 50; // Low opacity for subtle grid
            }
        }
    }
    let floor_image = Image::new(
        floor_size,
        bevy::render::render_resource::TextureDimension::D2,
        floor_data,
        bevy::render::render_resource::TextureFormat::Rgba8UnormSrgb,
        bevy::render::render_asset::RenderAssetUsages::RENDER_WORLD,
    );
    let floor_handle = images.add(floor_image);

    // 2. Generate Procedural "Industrial Wall" Texture
    let mut wall_data = vec![0u8; 64 * 64 * 4];
    for y in 0..64 {
        for x in 0..64 {
            let index = (y * 64 + x) * 4;
            // Base: Dark Metal
            wall_data[index] = 40;
            wall_data[index + 1] = 40;
            wall_data[index + 2] = 45;
            wall_data[index + 3] = 255;

            // Hazard Stripe at bottom
            if y < 10 {
                // Yellow/Black diagonal stripes
                if (x + y) % 20 < 10 {
                    wall_data[index] = 255;
                    wall_data[index + 1] = 200;
                    wall_data[index + 2] = 0;
                } else {
                    wall_data[index] = 10;
                    wall_data[index + 1] = 10;
                    wall_data[index + 2] = 10;
                }
            }
        }
    }
    let wall_image = Image::new(
        floor_size, // Same size
        bevy::render::render_resource::TextureDimension::D2,
        wall_data,
        bevy::render::render_resource::TextureFormat::Rgba8UnormSrgb,
        bevy::render::render_asset::RenderAssetUsages::RENDER_WORLD,
    );
    let wall_handle = images.add(wall_image);
    
    // Spawn Tiles
    let tile_size = 64.0;
    let grid_size = 50; 
    
    for x in -grid_size..grid_size {
        for y in -grid_size..grid_size {
            commands.spawn((
                Sprite {
                    image: floor_handle.clone(),
                    custom_size: Some(Vec2::new(tile_size, tile_size)), 
                    ..default()
                },
                Transform::from_xyz(x as f32 * tile_size, y as f32 * tile_size, -10.0), 
            ));
        }
    }
    
    // Spawn Walls
    let wall_positions = vec![
        (-320.0, 0.0, 640.0, 32.0),
        (320.0, 0.0, 640.0, 32.0),
        (0.0, -320.0, 32.0, 640.0),
        (0.0, 320.0, 32.0, 640.0),
    ];
    
    for (x, y, w, h) in wall_positions {
        commands.spawn((
            Sprite {
                image: wall_handle.clone(),
                custom_size: Some(Vec2::new(w, h)),
                ..default()
            },
            Transform::from_xyz(x, y, 0.5),
            Collider { width: w, height: h },
        ));
    }
    
    // 3. Generate Procedural "Terminal" Texture
    let mut terminal_data = vec![0u8; 64 * 64 * 4];
    for y in 0..64 {
        for x in 0..64 {
            let index = (y * 64 + x) * 4;
            // Case: Dark Grey
            terminal_data[index] = 50;
            terminal_data[index + 1] = 50;
            terminal_data[index + 2] = 55;
            terminal_data[index + 3] = 255;
            
            // Screen: Glowing Orange (Center)
            if x > 10 && x < 54 && y > 20 && y < 50 {
                terminal_data[index] = 255;
                terminal_data[index + 1] = 165;
                terminal_data[index + 2] = 0;
                
                // Scanlines
                if y % 4 == 0 {
                    terminal_data[index + 3] = 200;
                }
            }
            
            // Keyboard hints
            if y < 15 && x > 10 && x < 54 && x % 4 == 0 && y % 4 == 0 {
                 terminal_data[index] = 200;
                 terminal_data[index + 1] = 200;
                 terminal_data[index + 2] = 200;
            }
        }
    }
    let terminal_image = Image::new(
        floor_size,
        bevy::render::render_resource::TextureDimension::D2,
        terminal_data,
        bevy::render::render_resource::TextureFormat::Rgba8UnormSrgb,
        bevy::render::render_asset::RenderAssetUsages::RENDER_WORLD,
    );
    let terminal_handle = images.add(terminal_image);

    // 4. Generate Procedural "Archive" Texture (Holocron)
    let mut archive_data = vec![0u8; 64 * 64 * 4];
    for y in 0..64 {
        for x in 0..64 {
            let index = (y * 64 + x) * 4;
            // Transparent background
            archive_data[index + 3] = 0;

            let dx = x as f32 - 32.0;
            let dy = y as f32 - 32.0;
            let dist = (dx * dx + dy * dy).sqrt();

            // Outer Ring
            if dist > 25.0 && dist < 30.0 {
                archive_data[index] = 100;
                archive_data[index + 1] = 0;
                archive_data[index + 2] = 200; // Purple
                archive_data[index + 3] = 255;
            }
            // Inner Core
            if dist < 15.0 {
                archive_data[index] = 0;
                archive_data[index + 1] = 200; // Cyan/Blue
                archive_data[index + 2] = 255;
                archive_data[index + 3] = 200; 
            }
        }
    }
        let archive_image = Image::new(
        floor_size,
        bevy::render::render_resource::TextureDimension::D2,
        archive_data,
        bevy::render::render_resource::TextureFormat::Rgba8UnormSrgb,
        bevy::render::render_asset::RenderAssetUsages::RENDER_WORLD,
    );
    let archive_handle = images.add(archive_image);

    // 5. Generate Procedural "Server" Texture
    let mut server_data = vec![0u8; 64 * 64 * 4];
    for y in 0..64 {
        for x in 0..64 {
            let index = (y * 64 + x) * 4;
            // Rack Body
            if x > 10 && x < 54 {
                server_data[index] = 20;
                server_data[index + 1] = 20;
                server_data[index + 2] = 25;
                server_data[index + 3] = 255;
                
                // Lights
                if y % 8 == 0 && x > 15 && x < 20 {
                    server_data[index] = 0;
                    server_data[index + 1] = 255;
                    server_data[index + 2] = 0;
                }
                 if y % 8 == 0 && x > 25 && x < 30 {
                    server_data[index] = 255;
                    server_data[index + 1] = 0;
                    server_data[index + 2] = 0;
                }
            } else {
                 server_data[index + 3] = 0; // Transparent sides
            }
        }
    }
    let server_image = Image::new(
        floor_size,
        bevy::render::render_resource::TextureDimension::D2,
        server_data,
        bevy::render::render_resource::TextureFormat::Rgba8UnormSrgb,
        bevy::render::render_asset::RenderAssetUsages::RENDER_WORLD,
    );
    let server_handle = images.add(server_image);

    // Spawn Teacher NPC
    commands.spawn((
        Sprite {
            image: asset_server.load("teacher.jpg"),
            custom_size: Some(Vec2::new(64.0, 64.0)),
            ..default()
        },
        Transform::from_xyz(150.0, 150.0, 1.0),
        Collider { width: 40.0, height: 40.0 },
        InteractionZone { radius: 80.0 },
        crate::teacher::TeacherMarker,
        MemoryLink,
        QuestTrigger { id: "Teacher".to_string(), radius: 80.0 },
    ));

    // Spawn Ollama Terminal
    commands.spawn((
        Sprite {
            image: terminal_handle.clone(),
            custom_size: Some(Vec2::new(64.0, 64.0)),
            ..default()
        },
        Transform::from_xyz(-100.0, 150.0, 1.0),
        Collider { width: 40.0, height: 40.0 },
        InteractionZone { radius: 60.0 },
        MemoryLink,
        Terminal,
        QuestTrigger { id: "Terminal".to_string(), radius: 60.0 },
    )).with_children(|parent| {
        parent.spawn((
            Text::new("Terminal"),
            TextFont { font_size: 14.0, ..default() },
            TextColor(Color::WHITE),
            Transform::from_xyz(0.0, 40.0, 1.0),
        ));
    });

    // Spawn The Archive (Module 2 Target)
    commands.spawn((
        Sprite {
            image: archive_handle.clone(),
            custom_size: Some(Vec2::new(64.0, 64.0)),
            ..default()
        },
        Transform::from_xyz(-200.0, -200.0, 1.0),
        Collider { width: 40.0, height: 40.0 },
        InteractionZone { radius: 60.0 },
        MemoryLink,
        QuestTrigger { id: "Archive".to_string(), radius: 60.0 },
    )).with_children(|parent| {
        parent.spawn((
            Text::new("Archive"),
            TextFont { font_size: 14.0, ..default() },
            TextColor(Color::WHITE),
            Transform::from_xyz(0.0, 40.0, 1.0),
        ));
    });

    // Spawn The Server (Module 3 Target)
    commands.spawn((
        Sprite {
            image: server_handle.clone(),
            custom_size: Some(Vec2::new(64.0, 64.0)),
            ..default()
        },
        Transform::from_xyz(200.0, -200.0, 1.0),
        Collider { width: 40.0, height: 40.0 },
        InteractionZone { radius: 60.0 },
        MemoryLink,
        QuestTrigger { id: "Server".to_string(), radius: 60.0 },
    )).with_children(|parent| {
        parent.spawn((
            Text::new("Server"),
            TextFont { font_size: 14.0, ..default() },
            TextColor(Color::WHITE),
            Transform::from_xyz(0.0, 40.0, 1.0),
        ));
    });
}



fn player_movement(
    time: Res<Time>,
    keys: Res<ButtonInput<KeyCode>>,
    mut player_query: Query<(&mut Player, &mut Transform)>,
) {
    for (mut player, mut transform) in &mut player_query {
        let mut direction = Vec3::ZERO;
        
        if keys.pressed(KeyCode::KeyW) || keys.pressed(KeyCode::ArrowUp) {
            direction.y += 1.0;
        }
        if keys.pressed(KeyCode::KeyS) || keys.pressed(KeyCode::ArrowDown) {
            direction.y -= 1.0;
        }
        if keys.pressed(KeyCode::KeyA) || keys.pressed(KeyCode::ArrowLeft) {
            direction.x -= 1.0;
        }
        if keys.pressed(KeyCode::KeyD) || keys.pressed(KeyCode::ArrowRight) {
            direction.x += 1.0;
        }
        
        if direction.length() > 0.0 {
            direction = direction.normalize();
            transform.translation += direction * player.speed * time.delta_secs();
            player.is_moving = true;
            
            if direction.x < 0.0 {
                player.facing_left = true;
            } else if direction.x > 0.0 {
                player.facing_left = false;
            }
        } else {
            player.is_moving = false;
        }
    }
}

fn animate_player(
    time: Res<Time>,
    asset_server: Res<AssetServer>,
    mut query: Query<(&mut Player, &mut Sprite)>,
) {
    for (mut player, mut sprite) in &mut query {
        if player.is_moving {
            player.animation_timer.tick(time.delta());
            if player.animation_timer.just_finished() {
                player.current_frame = (player.current_frame + 1) % 2;
                
                let frame_path = if player.current_frame == 0 {
                    "player.jpg"
                } else {
                    "player_walk_2.jpg"
                };
                
                sprite.image = asset_server.load(frame_path);
            }
        } else {
            // Reset to idle
            if player.current_frame != 0 {
                player.current_frame = 0;
                sprite.image = asset_server.load("player.jpg");
            }
        }
        
        // Handle flipping
        if player.facing_left {
            sprite.flip_x = true;
        } else {
            sprite.flip_x = false;
        }
    }
}

fn update_transforms(
    mut query: Query<(&mut Transform, Option<&Position>)>,
) {
    for (mut transform, position) in &mut query {
        if let Some(pos) = position {
            transform.translation.x = pos.x;
            transform.translation.y = pos.y;
        }
    }
}

fn camera_follow_player(
    time: Res<Time>,
    player_query: Query<&Transform, With<Player>>,
    mut camera_query: Query<&mut Transform, (With<Camera2d>, Without<Player>)>,
) {
    if let Ok(player_transform) = player_query.get_single() {
        if let Ok(mut camera_transform) = camera_query.get_single_mut() {
            // Smooth camera follow (LERP)
            let target = player_transform.translation;
            let current = camera_transform.translation;
            let smoothness = 5.0; // Higher = faster
            
            camera_transform.translation.x = current.x + (target.x - current.x) * smoothness * time.delta_secs();
            camera_transform.translation.y = current.y + (target.y - current.y) * smoothness * time.delta_secs();
        }
    }
}

// ============================================================================
// Proximity & Interaction Systems
// ============================================================================

#[derive(Component)]
struct InteractionPrompt;

#[derive(Component)]
struct RewardGlow {
    pub timer: Timer,
}



fn check_proximity_interactions(
    player_query: Query<&Transform, With<Player>>,
    npc_query: Query<(&Transform, &InteractionZone), With<crate::teacher::TeacherMarker>>,
    trigger_query: Query<(&Transform, &QuestTrigger)>,
    mut story_state: ResMut<crate::story_mode::StoryState>,
    mut syllabus: Option<ResMut<SyllabusResource>>,
    mut event_writer: EventWriter<crate::syllabus::QuestAdvancedEvent>,
    mut reward_writer: EventWriter<crate::inventory::ItemGetEvent>,
) {
    if let Ok(player_transform) = player_query.get_single() {
        // 1. Check Generic Quest Triggers (Exploration Phase)
        if let Some(ref mut syl) = syllabus {
            if let crate::syllabus::QuestPhase::Exploration { target, .. } = syl.current_phase().clone() {
                for (trigger_transform, trigger) in &trigger_query {
                    if trigger.id == target {
                        let distance = player_transform.translation.distance(trigger_transform.translation);
                        if distance < trigger.radius {
                            // Target reached!
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
                            info!("🗺️ Exploration complete — reached target: {}", target);
                        }
                    }
                }
            }
        }

        // 2. Check Teacher Interaction (for dialogue availability)
        let mut in_range = false;
        
        for (npc_transform, zone) in &npc_query {
            let distance = player_transform.translation.distance(npc_transform.translation);
            
            if distance < zone.radius {
                in_range = true;
                break;
            }
        }
        
        // Update story state to enable/disable interaction
        let previously_can_interact = story_state.can_interact;
        story_state.can_interact = in_range;
        
        if in_range && !previously_can_interact {
            // Trigger dialogue automatically when entering range
            info!("Player entered Teacher range - triggering dialogue");
        }
    }
}

fn teacher_gravitational_pull(
    time: Res<Time>,
    player_query: Query<&Transform, With<Player>>,
    mut teacher_query: Query<(&Transform, &mut Sprite, &InteractionZone), With<crate::teacher::TeacherMarker>>,
    syllabus: Option<Res<SyllabusResource>>,
) {
    let Ok(player_transform) = player_query.get_single() else { return };
    let Some(syl) = syllabus else { return };

    // Only pulsate during Exploration phase (the "pull")
    if !matches!(syl.current_phase(), crate::syllabus::QuestPhase::Exploration { .. }) {
        for (_, mut sprite, _) in &mut teacher_query {
            sprite.color = Color::WHITE; // Reset color
        }
        return;
    }

    for (teacher_transform, mut sprite, _zone) in &mut teacher_query {
        let distance = player_transform.translation.distance(teacher_transform.translation);
        
        // Intensity increases as player gets closer
        let intensity = (400.0 - distance).max(0.0) / 400.0; 
        let pulse = (ops::sin(time.elapsed_secs() * 2.0) + 1.0) / 2.0;
        
        // Cyan beckoning pulse
        sprite.color = Color::srgb(
            0.0, 
            0.8 + 0.2 * intensity, 
            1.0 * (0.6 + 0.4 * pulse)
        );
    }
}



fn show_interaction_prompt(
    mut commands: Commands,
    player_query: Query<&Transform, With<Player>>,
    npc_query: Query<(&Transform, &InteractionZone), With<crate::teacher::TeacherMarker>>,
    prompt_query: Query<Entity, With<InteractionPrompt>>,
    syllabus: Option<Res<SyllabusResource>>,
) {
    if let Ok(player_transform) = player_query.get_single() {
        let mut should_show_prompt = false;
        
        for (npc_transform, zone) in &npc_query {
            let distance = player_transform.translation.distance(npc_transform.translation);
            
            if distance < zone.radius {
                should_show_prompt = true;
                
                // Phase-aware prompt text
                let prompt_text = if let Some(ref syl) = syllabus {
                    match syl.current_phase() {
                        crate::syllabus::QuestPhase::Exploration { .. } => "The Teacher awaits...".to_string(),
                        crate::syllabus::QuestPhase::Dialogue { .. } => "Press T to continue".to_string(),
                        crate::syllabus::QuestPhase::Task { description, .. } => format!("⚡ {}", description),
                        crate::syllabus::QuestPhase::Reflection { .. } => "Press T to answer  |  Press H to speak".to_string(),
                        crate::syllabus::QuestPhase::Complete => "🏆 Quest Complete!".to_string(),
                    }
                } else {
                    "Press T to talk".to_string()
                };

                // Spawn prompt if it doesn't exist
                if prompt_query.is_empty() {
                    commands.spawn((
                        Text::new(prompt_text),
                        TextFont {
                            font_size: 16.0,
                            ..default()
                        },
                        TextColor(Color::srgb(1.0, 0.75, 0.0)), // Phosphor Amber
                        Node {
                            position_type: PositionType::Absolute,
                            top: Val::Px(300.0),
                            left: Val::Percent(50.0),
                            ..default()
                        },
                        InteractionPrompt,
                    ));
                }
                break;
            }
        }
        
        // Remove prompt if out of range
        if !should_show_prompt {
            for entity in &prompt_query {
                commands.entity(entity).despawn_recursive();
            }
        }
    }
}

fn spawn_tutorial(mut commands: Commands) {
    commands.spawn((
        Text::new("→ Walk to the Teacher to begin"),
        TextFont {
            font_size: 24.0,
            ..default()
        },
        TextColor(Color::srgb(1.0, 1.0, 1.0)),
        Node {
            position_type: PositionType::Absolute,
            top: Val::Px(100.0),
            left: Val::Percent(50.0),
            ..default()
        },
        TutorialPrompt,
    ));
}

fn hide_tutorial_on_interaction(
    mut commands: Commands,
    story_state: Res<crate::story_mode::StoryState>,
    query: Query<Entity, With<TutorialPrompt>>,
) {
    if story_state.can_interact {
        for entity in &query {
            commands.entity(entity).despawn_recursive();
        }
    }
}
#[derive(Component)]
struct TutorialPrompt;

fn spawn_quest_reward(
    mut commands: Commands,
    mut events: EventReader<crate::syllabus::QuestAdvancedEvent>,
    player_query: Query<&Transform, With<Player>>,
) {
    for _event in events.read() {
        if let Ok(player_transform) = player_query.get_single() {
            // Spawn a golden ring at player position
            commands.spawn((
                Sprite {
                    color: Color::srgba(1.0, 0.75, 0.0, 0.8), // Phosphor Amber
                    custom_size: Some(Vec2::new(10.0, 10.0)),
                    ..default()
                },
                Transform::from_translation(player_transform.translation + Vec3::new(0.0, 0.0, 0.1)),
                RewardGlow {
                    timer: Timer::from_seconds(1.5, TimerMode::Once),
                },
            ));
        }
    }
}

fn fade_out_rewards(
    mut commands: Commands,
    time: Res<Time>,
    mut query: Query<(Entity, &mut RewardGlow, &mut Sprite)>,
) {
    for (entity, mut glow, mut sprite) in &mut query {
        glow.timer.tick(time.delta());
        
        // Expand and fade
        let t = glow.timer.fraction();
        let size = 10.0 + t * 100.0;
        sprite.custom_size = Some(Vec2::new(size, size));
        
        // Simple alpha fade
        let color = sprite.color.to_srgba();
        sprite.color = Color::srgba(color.red, color.green, color.blue, 0.8 * (1.0 - t));
        
        if glow.timer.finished() {
            commands.entity(entity).despawn_recursive();
        }
    }
}

fn reveal_memories(
    mut commands: Commands,
    inventory: Res<crate::inventory::Inventory>,
    targets_query: Query<(Entity, &Transform), (With<MemoryLink>, Without<CompassGlow>)>,
    glow_query: Query<Entity, With<CompassGlow>>,
) {
    let compass_active = inventory.active_tool == Some(crate::inventory::ToolId::OllamaCompass);
    
    if compass_active {
        // Spawn glows for all memory links that don't have one
        for (entity, transform) in &targets_query {
            let glow_id = commands.spawn((
                Sprite {
                    color: Color::srgba(0.0, 1.0, 1.0, 0.4), // Cyan Glow
                    custom_size: Some(Vec2::new(60.0, 60.0)),
                    ..default()
                },
                Transform::from_translation(transform.translation + Vec3::new(0.0, 0.0, -0.1)),
                CompassGlow,
            )).id();
            
            commands.entity(entity).add_child(glow_id);
            info!("✨ Compass revealed a semantic memory link!");
        }
    } else {
        // Remove all glows if compass is inactive
        for entity in &glow_query {
            commands.entity(entity).despawn_recursive();
        }
    }
}

fn terminal_interaction(
    keys: Res<ButtonInput<KeyCode>>,
    player_query: Query<&Transform, With<Player>>,
    trigger_query: Query<(&Transform, &QuestTrigger)>,
    mut syllabus: Option<ResMut<SyllabusResource>>,
    mut event_writer: EventWriter<crate::syllabus::QuestAdvancedEvent>,
    mut reward_writer: EventWriter<crate::inventory::ItemGetEvent>,
) {
    if keys.just_pressed(KeyCode::KeyT) {
        if let Ok(player_transform) = player_query.get_single() {
            if let Some(ref mut syl) = syllabus {
                // Only advance if current phase is a Task
                let task_desc = if let crate::syllabus::QuestPhase::Task { description, .. } = syl.current_phase() {
                    Some(description.clone())
                } else {
                    None
                };

                if let Some(description) = task_desc {
                    // Check if player is near a valid trigger for this task
                    for (trigger_transform, trigger) in &trigger_query {
                         if description.contains(&trigger.id) || (trigger.id == "Terminal" && description.contains("Terminal")) {
                            let distance = player_transform.translation.distance(trigger_transform.translation);
                            if distance < trigger.radius {
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
                                info!("💻 Task complete at {} — advanced phase", trigger.id);
                            }
                        }
                    }
                }
            }
        }
    }
}
