use bevy::prelude::*;
use crate::syllabus::SyllabusResource;
use crate::scoring::XpGainEvent;

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

#[derive(Component)]
struct AmbientGlow {
    base_alpha: f32,
    speed: f32,
}

#[derive(Component)]
struct RoomLabel;

#[derive(Component)]
struct DoorGuide;

#[derive(Component)]
pub struct KnowledgeFragment {
    pub title: String,
    pub content: String,
    pub xp_value: u32,
}

#[derive(Component)]
struct FloatingText {
    lifetime: Timer,
    velocity: Vec3,
}

#[derive(Component)]
struct Particle {
    lifetime: Timer,
    velocity: Vec3,
}

#[derive(Resource)]
pub struct CameraTrauma {
    pub intensity: f32, // 0.0 to 1.0
}

impl Default for CameraTrauma {
    fn default() -> Self {
        Self { intensity: 0.0 }
    }
}

#[derive(Resource)]
struct RoomDiscovery(Vec<String>);

// ============================================================================
// Map Data — The Academy
// ============================================================================

const TILE: f32 = 64.0;

/// Room definition: origin (top-left in tile coords), width, height in tiles
#[allow(dead_code)]
struct RoomDef {
    name: &'static str,
    ox: i32,
    oy: i32,
    w: i32,
    h: i32,
}

/// A doorway between two rooms — position and orientation
#[allow(dead_code)]
struct DoorDef {
    x: i32,
    y: i32,
    horizontal: bool, // true = horizontal passage (opening in top/bottom wall)
}

fn rooms() -> Vec<RoomDef> {
    vec![
        // Academy Hall — center, 12×10 tiles
        RoomDef { name: "Academy Hall",   ox: -6, oy: -5, w: 12, h: 10 },
        // Terminal Lab — west, 8×8 tiles
        RoomDef { name: "Terminal Lab",   ox: -18, oy: -4, w: 8,  h: 8 },
        // Archive Vault — south, 8×8 tiles
        RoomDef { name: "Archive Vault",  ox: -4, oy: -17, w: 8,  h: 8 },
        // Server Core — east, 8×8 tiles
        RoomDef { name: "Server Core",    ox: 10, oy: -4, w: 8,  h: 8 },
    ]
}

fn doors() -> Vec<DoorDef> {
    vec![
        // West corridor: Academy Hall west wall to Terminal Lab east wall
        // Passage at y=-1..1 (3 tiles tall), from x=-10 to x=-6
        DoorDef { x: -7, y: -1, horizontal: false },
        DoorDef { x: -8, y: -1, horizontal: false },
        DoorDef { x: -9, y: -1, horizontal: false },
        DoorDef { x: -10, y: -1, horizontal: false },
        DoorDef { x: -7, y: 0,  horizontal: false },
        DoorDef { x: -8, y: 0,  horizontal: false },
        DoorDef { x: -9, y: 0,  horizontal: false },
        DoorDef { x: -10, y: 0,  horizontal: false },
        // South corridor: Academy Hall south wall to Archive Vault north wall
        // Passage at x=-1..1 (3 tiles wide), from y=-5 to y=-9
        DoorDef { x: -1, y: -6,  horizontal: true },
        DoorDef { x: 0,  y: -6,  horizontal: true },
        DoorDef { x: 1,  y: -6,  horizontal: true },
        DoorDef { x: -1, y: -7,  horizontal: true },
        DoorDef { x: 0,  y: -7,  horizontal: true },
        DoorDef { x: 1,  y: -7,  horizontal: true },
        DoorDef { x: -1, y: -8,  horizontal: true },
        DoorDef { x: 0,  y: -8,  horizontal: true },
        DoorDef { x: 1,  y: -8,  horizontal: true },
        DoorDef { x: -1, y: -9,  horizontal: true },
        DoorDef { x: 0,  y: -9,  horizontal: true },
        DoorDef { x: 1,  y: -9,  horizontal: true },
        // East corridor: Academy Hall east wall to Server Core west wall
        // Passage at y=-1..1 (3 tiles tall), from x=6 to x=10
        DoorDef { x: 6,  y: -1, horizontal: false },
        DoorDef { x: 7,  y: -1, horizontal: false },
        DoorDef { x: 8,  y: -1, horizontal: false },
        DoorDef { x: 9,  y: -1, horizontal: false },
        DoorDef { x: 6,  y: 0,  horizontal: false },
        DoorDef { x: 7,  y: 0,  horizontal: false },
        DoorDef { x: 8,  y: 0,  horizontal: false },
        DoorDef { x: 9,  y: 0,  horizontal: false },
    ]
}

// ============================================================================
// Plugin
// ============================================================================

pub struct GameWorldPlugin;

impl Plugin for GameWorldPlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(CameraTrauma::default())
           .insert_resource(RoomDiscovery(vec![]))
           .add_systems(Startup, (setup_camera, spawn_player, spawn_world, spawn_tutorial))
           .add_systems(Update, (
               player_movement,
               update_transforms,
               camera_follow_player,
               camera_shake,
               check_proximity_interactions,
               show_interaction_prompt,
               hide_tutorial_on_interaction,
               animate_player,
               terminal_interaction,
               spawn_quest_reward,
               fade_out_rewards,
               reveal_memories,
               teacher_gravitational_pull,
               animate_ambient_glows,
               collect_knowledge_fragments,
               update_floating_text,
               update_particles,
               check_room_discovery,
               spawn_particles_on_quest_advance,
           ));
    }
}

// ============================================================================
// Systems
// ============================================================================

fn setup_camera(mut commands: Commands) {
    commands.spawn((
        Camera2d,
        GameCamera,
    ));
}

fn spawn_player(mut commands: Commands, asset_server: Res<AssetServer>) {
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
) {
    let floor_handle = asset_server.load("floor.jpg");
    let wall_handle = asset_server.load("wall.jpg");

    // Collect all door tile positions for quick lookup
    let door_tiles: Vec<(i32, i32)> = doors().iter().map(|d| (d.x, d.y)).collect();

    // --- Spawn room floors ---
    for room in &rooms() {
        for x in room.ox..(room.ox + room.w) {
            for y in room.oy..(room.oy + room.h) {
                commands.spawn((
                    Sprite {
                        image: floor_handle.clone(),
                        custom_size: Some(Vec2::new(TILE, TILE)),
                        ..default()
                    },
                    Transform::from_xyz(x as f32 * TILE, y as f32 * TILE, -10.0),
                ));
            }
        }
    }

    // --- Spawn corridor floors ---
    for door in &doors() {
        commands.spawn((
            Sprite {
                image: floor_handle.clone(),
                custom_size: Some(Vec2::new(TILE, TILE)),
                ..default()
            },
            Transform::from_xyz(door.x as f32 * TILE, door.y as f32 * TILE, -10.0),
        ));
    }

    // --- Spawn walls (room perimeters minus doorways) ---
    for room in &rooms() {
        for x in (room.ox - 1)..=(room.ox + room.w) {
            for y in (room.oy - 1)..=(room.oy + room.h) {
                // Only spawn wall on the perimeter
                let on_perimeter = x == room.ox - 1 || x == room.ox + room.w
                    || y == room.oy - 1 || y == room.oy + room.h;
                if !on_perimeter {
                    continue;
                }

                // Skip if this tile is a doorway
                if door_tiles.contains(&(x, y)) {
                    continue;
                }
                // Skip if this tile is inside another room's floor
                let inside_another_room = rooms().iter().any(|r| {
                    x >= r.ox && x < r.ox + r.w && y >= r.oy && y < r.oy + r.h
                });
                if inside_another_room {
                    continue;
                }

                commands.spawn((
                    Sprite {
                        image: wall_handle.clone(),
                        custom_size: Some(Vec2::new(TILE, TILE)),
                        ..default()
                    },
                    Transform::from_xyz(x as f32 * TILE, y as f32 * TILE, 0.5),
                    Collider { width: TILE, height: TILE },
                ));
            }
        }
    }

    // --- Spawn corridor walls (sides of corridors) ---
    // West corridor walls (top and bottom edges)
    for x in -10..=-7 {
        for &y in &[-2, 1] {
            if !door_tiles.contains(&(x, y)) {
                commands.spawn((
                    Sprite {
                        image: wall_handle.clone(),
                        custom_size: Some(Vec2::new(TILE, TILE)),
                        ..default()
                    },
                    Transform::from_xyz(x as f32 * TILE, y as f32 * TILE, 0.5),
                    Collider { width: TILE, height: TILE },
                ));
            }
        }
    }
    // East corridor walls
    for x in 6..=9 {
        for &y in &[-2, 1] {
            if !door_tiles.contains(&(x, y)) {
                commands.spawn((
                    Sprite {
                        image: wall_handle.clone(),
                        custom_size: Some(Vec2::new(TILE, TILE)),
                        ..default()
                    },
                    Transform::from_xyz(x as f32 * TILE, y as f32 * TILE, 0.5),
                    Collider { width: TILE, height: TILE },
                ));
            }
        }
    }
    // South corridor walls (left and right edges)
    for y in -9..=-6 {
        for &x in &[-2, 2] {
            if !door_tiles.contains(&(x, y)) {
                commands.spawn((
                    Sprite {
                        image: wall_handle.clone(),
                        custom_size: Some(Vec2::new(TILE, TILE)),
                        ..default()
                    },
                    Transform::from_xyz(x as f32 * TILE, y as f32 * TILE, 0.5),
                    Collider { width: TILE, height: TILE },
                ));
            }
        }
    }

    // --- Spawn Interactable Entities ---

    // Teacher NPC — in Academy Hall
    let teacher_pos = Vec3::new(2.0 * TILE, 2.0 * TILE, 1.0);
    commands.spawn((
        Sprite {
            image: asset_server.load("teacher.jpg"),
            custom_size: Some(Vec2::new(64.0, 64.0)),
            ..default()
        },
        Transform::from_translation(teacher_pos),
        Collider { width: 40.0, height: 40.0 },
        InteractionZone { radius: 100.0 },
        crate::teacher::TeacherMarker,
        MemoryLink,
        QuestTrigger { id: "Teacher".to_string(), radius: 100.0 },
    )).with_children(|parent| {
        // Name label
        parent.spawn((
            Text::new("The Architect"),
            TextFont { font_size: 14.0, ..default() },
            TextColor(Color::srgb(0.0, 1.0, 1.0)),
            Transform::from_xyz(0.0, 50.0, 1.0),
        ));
        // Ambient glow
        parent.spawn((
            Sprite {
                color: Color::srgba(0.0, 1.0, 1.0, 0.15),
                custom_size: Some(Vec2::new(96.0, 96.0)),
                ..default()
            },
            Transform::from_xyz(0.0, 0.0, -0.1),
            AmbientGlow { base_alpha: 0.15, speed: 2.0 },
        ));
    });

    // Terminal — in Terminal Lab
    let terminal_pos = Vec3::new(-14.0 * TILE, 0.0 * TILE, 1.0);
    commands.spawn((
        Sprite {
            image: asset_server.load("terminal.jpg"),
            custom_size: Some(Vec2::new(96.0, 96.0)),
            ..default()
        },
        Transform::from_translation(terminal_pos),
        Collider { width: 40.0, height: 40.0 },
        InteractionZone { radius: 80.0 },
        MemoryLink,
        Terminal,
        QuestTrigger { id: "Terminal".to_string(), radius: 80.0 },
    )).with_children(|parent| {
        parent.spawn((
            Text::new("Ollama Terminal"),
            TextFont { font_size: 14.0, ..default() },
            TextColor(Color::srgb(0.0, 1.0, 0.5)),
            Transform::from_xyz(0.0, 50.0, 1.0),
        ));
        parent.spawn((
            Sprite {
                color: Color::srgba(0.0, 1.0, 0.5, 0.12),
                custom_size: Some(Vec2::new(96.0, 96.0)),
                ..default()
            },
            Transform::from_xyz(0.0, 0.0, -0.1),
            AmbientGlow { base_alpha: 0.12, speed: 1.5 },
        ));
    });

    // Archive — in Archive Vault
    let archive_pos = Vec3::new(0.0 * TILE, -13.0 * TILE, 1.0);
    commands.spawn((
        Sprite {
            image: asset_server.load("archive.jpg"),
            custom_size: Some(Vec2::new(96.0, 96.0)),
            ..default()
        },
        Transform::from_translation(archive_pos),
        Collider { width: 40.0, height: 40.0 },
        InteractionZone { radius: 80.0 },
        MemoryLink,
        QuestTrigger { id: "Archive".to_string(), radius: 80.0 },
    )).with_children(|parent| {
        parent.spawn((
            Text::new("The Archive"),
            TextFont { font_size: 14.0, ..default() },
            TextColor(Color::srgb(1.0, 0.75, 0.0)),
            Transform::from_xyz(0.0, 50.0, 1.0),
        ));
        parent.spawn((
            Sprite {
                color: Color::srgba(1.0, 0.75, 0.0, 0.12),
                custom_size: Some(Vec2::new(96.0, 96.0)),
                ..default()
            },
            Transform::from_xyz(0.0, 0.0, -0.1),
            AmbientGlow { base_alpha: 0.12, speed: 1.8 },
        ));
    });

    // Server — in Server Core
    let server_pos = Vec3::new(14.0 * TILE, 0.0 * TILE, 1.0);
    commands.spawn((
        Sprite {
            image: asset_server.load("server.jpg"),
            custom_size: Some(Vec2::new(96.0, 96.0)),
            ..default()
        },
        Transform::from_translation(server_pos),
        Collider { width: 40.0, height: 40.0 },
        InteractionZone { radius: 80.0 },
        MemoryLink,
        QuestTrigger { id: "Server".to_string(), radius: 80.0 },
    )).with_children(|parent| {
        parent.spawn((
            Text::new("Server Core"),
            TextFont { font_size: 14.0, ..default() },
            TextColor(Color::srgb(1.0, 0.3, 0.3)),
            Transform::from_xyz(0.0, 50.0, 1.0),
        ));
        parent.spawn((
            Sprite {
                color: Color::srgba(1.0, 0.3, 0.3, 0.12),
                custom_size: Some(Vec2::new(96.0, 96.0)),
                ..default()
            },
            Transform::from_xyz(0.0, 0.0, -0.1),
            AmbientGlow { base_alpha: 0.12, speed: 2.5 },
        ));
    });

    // --- Room Labels (floating text at room entrances) ---
    let room_labels = [
        ("⟐ Academy Hall ⟐", 0.0, 3.0 * TILE, Color::srgb(1.0, 1.0, 1.0)),
        ("⟐ Terminal Lab ⟐", -14.0 * TILE, 3.0 * TILE, Color::srgb(0.0, 1.0, 0.5)),
        ("⟐ Archive Vault ⟐", 0.0, -10.0 * TILE, Color::srgb(1.0, 0.75, 0.0)),
        ("⟐ Server Core ⟐", 14.0 * TILE, 3.0 * TILE, Color::srgb(1.0, 0.3, 0.3)),
    ];

    for (label, lx, ly, color) in room_labels {
        commands.spawn((
            Text::new(label),
            TextFont { font_size: 18.0, ..default() },
            TextColor(color),
            Transform::from_xyz(lx, ly, 2.0),
            RoomLabel,
        ));
    }

    // --- Door guide strips (subtle glow at corridor openings) ---
    let guide_positions: Vec<(f32, f32)> = vec![
        // West corridor entrance
        (-6.0 * TILE, -0.5 * TILE),
        // East corridor entrance
        (5.5 * TILE, -0.5 * TILE),
        // South corridor entrance
        (-0.5 * TILE, -5.5 * TILE),
    ];

    for (gx, gy) in guide_positions {
        commands.spawn((
            Sprite {
                color: Color::srgba(1.0, 0.75, 0.0, 0.2),
                custom_size: Some(Vec2::new(TILE * 2.0, 8.0)),
                ..default()
            },
            Transform::from_xyz(gx, gy, 0.3),
            DoorGuide,
            AmbientGlow { base_alpha: 0.2, speed: 1.0 },
        ));
    }

    // --- Knowledge Fragments (educational collectibles) ---
    let fragments = [
        (-8.0, -1.0, "Data Sovereignty", "FERPA requires student data to stay on school premises. Local AI means zero data leaves your network."),
        (-9.0, 0.0, "Open Weights", "Open-weight models like Llama can run entirely offline — no API keys, no cloud bills, no privacy concerns."),
        (-1.0, -7.0, "Gagné's First Event", "Gagné's 9 Events start with 'Gain Attention' — hook the learner before teaching begins."),
        (0.0, -8.0, "Constructivism", "Constructivist learning: knowledge is built, not received. Every puzzle you solve builds understanding."),
        (7.0, -1.0, "Edge Computing", "Running AI on the 'edge' (local device) means instant responses — no network latency, no downtime."),
        (8.0, 0.0, "Model Quantization", "Quantization shrinks AI models by 75% with minimal quality loss — making local deployment practical."),
        (3.0, 3.0, "Socratic Method", "The Socratic method asks questions instead of giving answers. Great teachers guide discovery, not memorization."),
        (-3.0, 3.0, "Flow State", "Mihaly Csikszentmihalyi's Flow: the sweet spot between challenge and skill where learning feels effortless."),
    ];

    for (fx, fy, title, content) in fragments {
        commands.spawn((
            Sprite {
                color: Color::srgba(1.0, 0.85, 0.0, 0.7),
                custom_size: Some(Vec2::new(20.0, 20.0)),
                ..default()
            },
            Transform::from_xyz(fx * TILE, fy * TILE, 0.8),
            KnowledgeFragment {
                title: title.to_string(),
                content: content.to_string(),
                xp_value: 25,
            },
            AmbientGlow { base_alpha: 0.7, speed: 3.0 },
        )).with_children(|parent| {
            parent.spawn((
                Text::new("?"),
                TextFont { font_size: 16.0, ..default() },
                TextColor(Color::srgb(1.0, 0.85, 0.0)),
                Transform::from_xyz(0.0, 18.0, 0.1),
            ));
        });
    }

    // --- Vignette overlay (atmosphere) ---
    commands.spawn((
        Sprite {
            color: Color::srgba(0.0, 0.0, 0.0, 0.0),
            custom_size: Some(Vec2::new(1280.0 * 2.0, 720.0 * 2.0)),
            ..default()
        },
        Transform::from_xyz(0.0, 0.0, 50.0),
    ));
}

// ============================================================================
// Movement with Wall Collision
// ============================================================================

fn player_movement(
    time: Res<Time>,
    keys: Res<ButtonInput<KeyCode>>,
    mut player_query: Query<(&mut Player, &mut Transform, &Collider), Without<Terminal>>,
    wall_query: Query<(&Transform, &Collider), (Without<Player>, Without<Terminal>, Without<crate::teacher::TeacherMarker>)>,
) {
    for (mut player, mut transform, player_col) in &mut player_query {
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
            let velocity = direction * player.speed * time.delta_secs();
            player.is_moving = true;
            
            if direction.x < 0.0 {
                player.facing_left = true;
            } else if direction.x > 0.0 {
                player.facing_left = false;
            }

            let half_pw = player_col.width / 2.0;
            let half_ph = player_col.height / 2.0;

            // Try X movement
            let new_x = transform.translation.x + velocity.x;
            let mut x_blocked = false;
            for (wall_tf, wall_col) in &wall_query {
                let half_ww = wall_col.width / 2.0;
                let half_wh = wall_col.height / 2.0;
                if (new_x - wall_tf.translation.x).abs() < half_pw + half_ww
                    && (transform.translation.y - wall_tf.translation.y).abs() < half_ph + half_wh
                {
                    x_blocked = true;
                    break;
                }
            }
            if !x_blocked {
                transform.translation.x = new_x;
            }

            // Try Y movement
            let new_y = transform.translation.y + velocity.y;
            let mut y_blocked = false;
            for (wall_tf, wall_col) in &wall_query {
                let half_ww = wall_col.width / 2.0;
                let half_wh = wall_col.height / 2.0;
                if (transform.translation.x - wall_tf.translation.x).abs() < half_pw + half_ww
                    && (new_y - wall_tf.translation.y).abs() < half_ph + half_wh
                {
                    y_blocked = true;
                    break;
                }
            }
            if !y_blocked {
                transform.translation.y = new_y;
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
            if player.current_frame != 0 {
                player.current_frame = 0;
                sprite.image = asset_server.load("player.jpg");
            }
        }
        
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
            let target = player_transform.translation;
            let current = camera_transform.translation;
            let smoothness = 5.0;
            
            camera_transform.translation.x = current.x + (target.x - current.x) * smoothness * time.delta_secs();
            camera_transform.translation.y = current.y + (target.y - current.y) * smoothness * time.delta_secs();
        }
    }
}

// ============================================================================
// Camera Shake
// ============================================================================

fn camera_shake(
    time: Res<Time>,
    mut trauma: ResMut<CameraTrauma>,
    mut camera_query: Query<&mut Transform, With<Camera2d>>,
) {
    if trauma.intensity <= 0.0 { return; }

    // Decay trauma
    trauma.intensity = (trauma.intensity - time.delta_secs() * 3.0).max(0.0);
    
    let shake = trauma.intensity * trauma.intensity; // Quadratic for nicer feel
    let offset_x = (ops::sin(time.elapsed_secs() * 37.0)) * shake * 8.0;
    let offset_y = (ops::sin(time.elapsed_secs() * 53.0)) * shake * 6.0;
    
    for mut transform in &mut camera_query {
        transform.translation.x += offset_x;
        transform.translation.y += offset_y;
    }
}

// ============================================================================
// Ambient Glow Animation
// ============================================================================

fn animate_ambient_glows(
    time: Res<Time>,
    mut query: Query<(&AmbientGlow, &mut Sprite)>,
) {
    for (glow, mut sprite) in &mut query {
        let pulse = (ops::sin(time.elapsed_secs() * glow.speed) + 1.0) / 2.0;
        let alpha = glow.base_alpha * (0.5 + 0.5 * pulse);
        let c = sprite.color.to_srgba();
        sprite.color = Color::srgba(c.red, c.green, c.blue, alpha);
    }
}

// ============================================================================
// Knowledge Fragment Collection
// ============================================================================

fn collect_knowledge_fragments(
    mut commands: Commands,
    player_query: Query<&Transform, With<Player>>,
    fragment_query: Query<(Entity, &Transform, &KnowledgeFragment)>,
    mut xp_writer: EventWriter<XpGainEvent>,
    mut trauma: ResMut<CameraTrauma>,
    mut score: ResMut<crate::scoring::PlayerScore>,
) {
    let Ok(player_tf) = player_query.get_single() else { return };

    for (entity, frag_tf, fragment) in &fragment_query {
        let distance = player_tf.translation.distance(frag_tf.translation);
        if distance < 40.0 {
            // Collect!
            info!("📜 Knowledge Fragment: {} — {}", fragment.title, fragment.content);
            
            // Award XP
            xp_writer.send(XpGainEvent {
                amount: fragment.xp_value,
                reason: format!("Knowledge: {}", fragment.title),
            });

            // Small screen shake
            trauma.intensity = 0.15;

            // Spawn floating text
            let pos = frag_tf.translation;
            spawn_floating_text(
                &mut commands,
                pos,
                &format!("📜 {} +{}XP", fragment.title, fragment.xp_value),
                Color::srgb(1.0, 0.85, 0.0),
            );

            // Spawn particles
            spawn_particle_burst(&mut commands, pos, Color::srgb(1.0, 0.85, 0.0), 8);

            score.fragments_collected += 1;

            // Despawn the fragment
            commands.entity(entity).despawn_recursive();
        }
    }
}

// ============================================================================
// Room Discovery
// ============================================================================

fn check_room_discovery(
    mut commands: Commands,
    player_query: Query<&Transform, With<Player>>,
    mut discovery: ResMut<RoomDiscovery>,
    mut xp_writer: EventWriter<XpGainEvent>,
    mut trauma: ResMut<CameraTrauma>,
) {
    let Ok(player_tf) = player_query.get_single() else { return };
    let px = player_tf.translation.x;
    let py = player_tf.translation.y;

    // Check which room the player is in
    let current_room = if px > -6.0 * TILE && px < 6.0 * TILE && py > -5.0 * TILE && py < 5.0 * TILE {
        Some("Academy Hall")
    } else if px < -10.0 * TILE && px > -18.0 * TILE {
        Some("Terminal Lab")
    } else if py < -9.0 * TILE && py > -17.0 * TILE {
        Some("Archive Vault")
    } else if px > 10.0 * TILE && px < 18.0 * TILE {
        Some("Server Core")
    } else {
        None
    };

    if let Some(room_name) = current_room {
        if !discovery.0.contains(&room_name.to_string()) {
            discovery.0.push(room_name.to_string());
            
            xp_writer.send(XpGainEvent {
                amount: 50,
                reason: format!("Discovered {}", room_name),
            });

            trauma.intensity = 0.1;

            spawn_floating_text(
                &mut commands,
                player_tf.translation,
                &format!("🗺️ {} Discovered! +50XP", room_name),
                Color::srgb(0.0, 1.0, 1.0),
            );

            spawn_particle_burst(&mut commands, player_tf.translation, Color::srgb(0.0, 1.0, 1.0), 12);
            
            info!("🗺️ New room discovered: {}", room_name);
        }
    }
}

// ============================================================================
// Particles on Quest Advance
// ============================================================================

fn spawn_particles_on_quest_advance(
    mut commands: Commands,
    mut events: EventReader<crate::syllabus::QuestAdvancedEvent>,
    player_query: Query<&Transform, With<Player>>,
    mut trauma: ResMut<CameraTrauma>,
    mut xp_writer: EventWriter<XpGainEvent>,
) {
    for _event in events.read() {
        if let Ok(player_tf) = player_query.get_single() {
            // Medium shake
            trauma.intensity = 0.35;

            // Amber particle burst
            spawn_particle_burst(&mut commands, player_tf.translation, Color::srgb(1.0, 0.75, 0.0), 16);

            // XP for quest progress
            xp_writer.send(XpGainEvent {
                amount: 75,
                reason: "Quest Progress".to_string(),
            });

            spawn_floating_text(
                &mut commands,
                player_tf.translation,
                "⚡ Quest Advanced! +75XP",
                Color::srgb(1.0, 0.75, 0.0),
            );
        }
    }
}

// ============================================================================
// Floating Text System
// ============================================================================

fn spawn_floating_text(commands: &mut Commands, position: Vec3, text: &str, color: Color) {
    commands.spawn((
        Text::new(text),
        TextFont { font_size: 16.0, ..default() },
        TextColor(color),
        Transform::from_translation(position + Vec3::new(0.0, 30.0, 10.0)),
        FloatingText {
            lifetime: Timer::from_seconds(2.0, TimerMode::Once),
            velocity: Vec3::new(0.0, 50.0, 0.0),
        },
    ));
}

fn update_floating_text(
    mut commands: Commands,
    time: Res<Time>,
    mut query: Query<(Entity, &mut FloatingText, &mut Transform, &mut TextColor)>,
) {
    for (entity, mut ft, mut transform, mut color) in &mut query {
        ft.lifetime.tick(time.delta());
        
        // Float upward
        transform.translation += ft.velocity * time.delta_secs();
        
        // Fade out
        let t = ft.lifetime.fraction();
        let c = color.0.to_srgba();
        color.0 = Color::srgba(c.red, c.green, c.blue, 1.0 - t);
        
        if ft.lifetime.finished() {
            commands.entity(entity).despawn_recursive();
        }
    }
}

// ============================================================================
// Particle System
// ============================================================================

fn spawn_particle_burst(commands: &mut Commands, position: Vec3, color: Color, count: usize) {
    for i in 0..count {
        let angle = (i as f32 / count as f32) * std::f32::consts::TAU;
        let speed = 80.0 + (i as f32 * 10.0) % 40.0;
        let vel = Vec3::new(ops::cos(angle) * speed, ops::sin(angle) * speed, 0.0);
        
        commands.spawn((
            Sprite {
                color,
                custom_size: Some(Vec2::new(6.0, 6.0)),
                ..default()
            },
            Transform::from_translation(position + Vec3::new(0.0, 0.0, 5.0)),
            Particle {
                lifetime: Timer::from_seconds(0.8, TimerMode::Once),
                velocity: vel,
            },
        ));
    }
}

fn update_particles(
    mut commands: Commands,
    time: Res<Time>,
    mut query: Query<(Entity, &mut Particle, &mut Transform, &mut Sprite)>,
) {
    for (entity, mut particle, mut transform, mut sprite) in &mut query {
        particle.lifetime.tick(time.delta());
        
        // Move
        transform.translation += particle.velocity * time.delta_secs();
        // Slow down
        particle.velocity *= 0.95;
        
        // Fade and shrink
        let t = particle.lifetime.fraction();
        let c = sprite.color.to_srgba();
        sprite.color = Color::srgba(c.red, c.green, c.blue, 1.0 - t);
        let size = 6.0 * (1.0 - t * 0.5);
        sprite.custom_size = Some(Vec2::new(size, size));
        
        if particle.lifetime.finished() {
            commands.entity(entity).despawn_recursive();
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

        // 2. Check Teacher Interaction
        let mut in_range = false;
        
        for (npc_transform, zone) in &npc_query {
            let distance = player_transform.translation.distance(npc_transform.translation);
            
            if distance < zone.radius {
                in_range = true;
                break;
            }
        }
        
        let previously_can_interact = story_state.can_interact;
        story_state.can_interact = in_range;
        
        if in_range && !previously_can_interact {
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

    if !matches!(syl.current_phase(), crate::syllabus::QuestPhase::Exploration { .. }) {
        for (_, mut sprite, _) in &mut teacher_query {
            sprite.color = Color::WHITE;
        }
        return;
    }

    for (teacher_transform, mut sprite, _zone) in &mut teacher_query {
        let distance = player_transform.translation.distance(teacher_transform.translation);
        let intensity = (400.0 - distance).max(0.0) / 400.0; 
        let pulse = (ops::sin(time.elapsed_secs() * 2.0) + 1.0) / 2.0;
        
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

                if prompt_query.is_empty() {
                    commands.spawn((
                        Text::new(prompt_text),
                        TextFont {
                            font_size: 18.0,
                            ..default()
                        },
                        TextColor(Color::srgb(1.0, 0.75, 0.0)),
                        Node {
                            position_type: PositionType::Absolute,
                            bottom: Val::Px(200.0),
                            left: Val::Percent(35.0),
                            ..default()
                        },
                        InteractionPrompt,
                    ));
                }
                break;
            }
        }
        
        if !should_show_prompt {
            for entity in &prompt_query {
                commands.entity(entity).despawn_recursive();
            }
        }
    }
}

fn spawn_tutorial(mut commands: Commands) {
    commands.spawn((
        Text::new("→ Walk to the Teacher to begin your quest"),
        TextFont {
            font_size: 22.0,
            ..default()
        },
        TextColor(Color::srgb(1.0, 1.0, 1.0)),
        Node {
            position_type: PositionType::Absolute,
            bottom: Val::Px(240.0),
            left: Val::Percent(25.0),
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
            commands.spawn((
                Sprite {
                    color: Color::srgba(1.0, 0.75, 0.0, 0.8),
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
        
        let t = glow.timer.fraction();
        let size = 10.0 + t * 100.0;
        sprite.custom_size = Some(Vec2::new(size, size));
        
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
        for (entity, transform) in &targets_query {
            let glow_id = commands.spawn((
                Sprite {
                    color: Color::srgba(0.0, 1.0, 1.0, 0.4),
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
    puzzle_state: Res<crate::puzzle::PuzzleState>,
) {
    // Don't process terminal interaction if puzzle system will handle it
    if puzzle_state.is_active || puzzle_state.solved { return; }

    if keys.just_pressed(KeyCode::KeyT) {
        if let Ok(player_transform) = player_query.get_single() {
            if let Some(ref mut syl) = syllabus {
                let task_desc = if let crate::syllabus::QuestPhase::Task { description, .. } = syl.current_phase() {
                    // Skip Terminal tasks — those are handled by puzzle.rs
                    if description.contains("Terminal") { return; }
                    Some(description.clone())
                } else {
                    None
                };

                if let Some(description) = task_desc {
                    for (trigger_transform, trigger) in &trigger_query {
                         if description.contains(&trigger.id) {
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
