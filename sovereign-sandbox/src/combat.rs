use bevy::prelude::*;
use crate::game_world::{Player, Particle, FloatingText};
use crate::scoring::XpGainEvent;
use crate::audio::SfxEvent;

pub struct CombatPlugin;

impl Plugin for CombatPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Update, (
            spawn_slimes,
            slime_ai,
            player_attack_input,
            detect_hits,
            handle_player_attack_lifetime,
        ).run_if(in_state(crate::GameState::Playing)));
    }
}

// ============================================================================
// Components
// ============================================================================

#[derive(Component)]
pub struct GlitchSlime {
    pub health: i32,
    pub speed: f32,
    pub wander_timer: Timer,
    pub direction: Vec3,
}

#[derive(Component)]
pub struct PlayerAttack {
    pub lifetime: Timer,
    pub damage: i32,
}

#[derive(Component)]
pub struct Hitbox {
    pub radius: f32,
}

// ============================================================================
// Systems
// ============================================================================

fn spawn_slimes(
    mut commands: Commands,
    asset_server: Res<AssetServer>,
    time: Res<Time>,
    keys: Res<ButtonInput<KeyCode>>,
    mut spawn_timer: Local<Option<Timer>>,
    slime_query: Query<&GlitchSlime>,
    player_query: Query<&Transform, With<Player>>,
) {
    if spawn_timer.is_none() {
        *spawn_timer = Some(Timer::from_seconds(5.0, TimerMode::Repeating));
    }

    let force_spawn = keys.just_pressed(KeyCode::KeyG);

    // Only spawn a limited number of slimes (e.g., max 10)
    if slime_query.iter().count() >= 10 && !force_spawn {
        return;
    }

    let mut should_spawn = force_spawn;
    if let Some(timer) = &mut *spawn_timer {
        timer.tick(time.delta());
        if timer.just_finished() {
            should_spawn = true;
        }
    }

    if should_spawn {
        if let Ok(player_tf) = player_query.get_single() {
            // Spawn a slime near the player (but not right on top)
            use rand::Rng;
            let mut rng = rand::thread_rng();
            // Random angle and distance
            let angle: f32 = rng.gen_range(0.0..std::f32::consts::TAU);
            let distance: f32 = rng.gen_range(150.0..300.0);
            
            let x = player_tf.translation.x + angle.cos() * distance;
            let y = player_tf.translation.y + angle.sin() * distance;

            commands.spawn((
                Sprite {
                    image: asset_server.load("slime.png"),
                    custom_size: Some(Vec2::new(48.0, 48.0)),
                    ..default()
                },
                Transform::from_xyz(x, y, 1.0),
                GlitchSlime {
                    health: 10,
                    speed: 50.0,
                    wander_timer: Timer::from_seconds(2.0, TimerMode::Repeating),
                    direction: Vec3::new(rng.gen_range(-1.0..1.0), rng.gen_range(-1.0..1.0), 0.0).normalize_or_zero(),
                },
                Hitbox { radius: 24.0 },
            ));
            
            info!("Spawned Glitch Slime at ({}, {})", x, y);
        }
    }
}

fn slime_ai(
    time: Res<Time>,
    mut slimes: Query<(&mut GlitchSlime, &mut Transform)>,
) {
    for (mut slime, mut transform) in &mut slimes {
        slime.wander_timer.tick(time.delta());
        
        if slime.wander_timer.just_finished() {
            use rand::Rng;
            let mut rng = rand::thread_rng();
            // Change direction randomly
            slime.direction = Vec3::new(rng.gen_range(-1.0..1.0), rng.gen_range(-1.0..1.0), 0.0).normalize_or_zero();
        }

        let velocity = slime.direction * slime.speed * time.delta_secs();
        transform.translation += velocity;
    }
}

fn player_attack_input(
    mut commands: Commands,
    keys: Res<ButtonInput<KeyCode>>,
    asset_server: Res<AssetServer>,
    player_query: Query<(&Transform, &Player)>,
) {
    if keys.just_pressed(KeyCode::KeyF) {
        if let Ok((player_tf, player)) = player_query.get_single() {
            let facing_modifier = if player.facing_left { -1.0 } else { 1.0 };
            let attack_offset = Vec3::new(40.0 * facing_modifier, 0.0, 0.1);
            
            // Spawn the Keyboard weapon slash
            commands.spawn((
                Sprite {
                    image: asset_server.load("keyboard.png"),
                    custom_size: Some(Vec2::new(64.0, 32.0)),
                    ..default()
                },
                Transform::from_translation(player_tf.translation + attack_offset)
                    .with_rotation(Quat::from_rotation_z(if player.facing_left { std::f32::consts::PI } else { 0.0 })), // rotate if facing left
                PlayerAttack {
                    lifetime: Timer::from_seconds(0.4, TimerMode::Once),
                    damage: 10,
                },
                Hitbox { radius: 32.0 },
            ));
        }
    }
}

fn handle_player_attack_lifetime(
    mut commands: Commands,
    time: Res<Time>,
    mut attacks: Query<(Entity, &mut PlayerAttack)>,
) {
    for (entity, mut attack) in &mut attacks {
        attack.lifetime.tick(time.delta());
        if attack.lifetime.finished() {
            commands.entity(entity).despawn_recursive();
        }
    }
}

fn detect_hits(
    mut commands: Commands,
    mut xp_writer: EventWriter<XpGainEvent>,
    mut sfx_writer: EventWriter<SfxEvent>,
    attacks: Query<(&Transform, &Hitbox, &PlayerAttack)>,
    mut slimes: Query<(Entity, &Transform, &Hitbox, &mut GlitchSlime)>,
) {
    for (attack_tf, attack_hb, attack) in &attacks {
        for (slime_entity, slime_tf, slime_hb, mut slime) in &mut slimes {
            let distance = attack_tf.translation.distance(slime_tf.translation);
            
            // If the hitboxes overlap
            if distance < (attack_hb.radius + slime_hb.radius) {
                // Apply damage
                slime.health -= attack.damage;
                sfx_writer.send(SfxEvent::Hit);
                
                if slime.health <= 0 {
                    // Slime dies
                    sfx_writer.send(SfxEvent::Death);
                    commands.entity(slime_entity).despawn_recursive();
                    
                    // Spawn particle explosion
                    use rand::Rng;
                    let mut rng = rand::thread_rng();
                    for _ in 0..8 {
                        let vx = rng.gen_range(-100.0..100.0);
                        let vy = rng.gen_range(-100.0..100.0);
                        commands.spawn((
                            Sprite {
                                color: Color::srgb(0.0, 1.0, 0.5), // Hacker green
                                custom_size: Some(Vec2::new(8.0, 8.0)),
                                ..default()
                            },
                            Transform::from_translation(slime_tf.translation),
                            Particle {
                                lifetime: Timer::from_seconds(0.5, TimerMode::Once),
                                velocity: Vec3::new(vx, vy, 0.0),
                            }
                        ));
                    }
                    
                    // Spawn floating text for XP
                    commands.spawn((
                        Text::new("+20 XP"),
                        TextFont {
                            font_size: 16.0,
                            ..default()
                        },
                        TextColor(Color::srgb(1.0, 0.8, 0.0)),
                        Transform::from_translation(slime_tf.translation + Vec3::new(0.0, 20.0, 2.0)),
                        FloatingText {
                            lifetime: Timer::from_seconds(1.0, TimerMode::Once),
                            velocity: Vec3::new(0.0, 30.0, 0.0),
                        },
                    ));

                    // Award XP
                    info!("💥 Slime defeated! Gained 20 XP.");
                    xp_writer.send(XpGainEvent {
                        amount: 20,
                        reason: "Defeated Glitch Slime".to_string(),
                    });
                }
            }
        }
    }
}
