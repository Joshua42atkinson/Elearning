use bevy::prelude::*;

// ============================================================================
// XP & Scoring System — The Progression Engine
// ============================================================================

#[derive(Event)]
pub struct XpGainEvent {
    pub amount: u32,
    pub reason: String,
}

#[derive(Event)]
pub struct LevelUpEvent {
    pub new_level: u32,
    pub title: String,
}

#[derive(Resource)]
pub struct PlayerScore {
    pub xp: u32,
    pub level: u32,
    pub title: String,
    pub rooms_discovered: Vec<String>,
    pub fragments_collected: u32,
    pub puzzles_solved: u32,
}

impl Default for PlayerScore {
    fn default() -> Self {
        Self {
            xp: 0,
            level: 1,
            title: "Novice".to_string(),
            rooms_discovered: vec![],
            fragments_collected: 0,
            puzzles_solved: 0,
        }
    }
}

impl PlayerScore {
    pub fn xp_for_next_level(&self) -> u32 {
        match self.level {
            1 => 100,
            2 => 300,
            3 => 600,
            4 => 1000,
            _ => 1500,
        }
    }

    pub fn level_progress(&self) -> f32 {
        let prev = match self.level {
            1 => 0,
            2 => 100,
            3 => 300,
            4 => 600,
            _ => 1000,
        };
        let next = self.xp_for_next_level();
        let current = self.xp.saturating_sub(prev);
        let range = next.saturating_sub(prev);
        if range == 0 { return 1.0; }
        (current as f32 / range as f32).clamp(0.0, 1.0)
    }

    fn title_for_level(level: u32) -> &'static str {
        match level {
            1 => "Novice",
            2 => "Student",
            3 => "Architect",
            4 => "Sovereign",
            _ => "Grandmaster",
        }
    }
}

// ============================================================================
// UI Components
// ============================================================================

#[derive(Component)]
struct XpBarContainer;

#[derive(Component)]
struct XpBarFill;

#[derive(Component)]
struct XpLevelText;

#[derive(Component)]
struct XpValueText;

// ============================================================================
// Plugin
// ============================================================================

pub struct ScoringPlugin;

impl Plugin for ScoringPlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(PlayerScore::default())
           .add_event::<XpGainEvent>()
           .add_event::<LevelUpEvent>()
           .add_systems(Startup, setup_xp_hud)
           .add_systems(Update, (
               process_xp_gains,
               update_xp_hud,
           ));
    }
}

// ============================================================================
// Systems
// ============================================================================

fn setup_xp_hud(mut commands: Commands) {
    // Top-center XP bar
    commands.spawn((
        Node {
            position_type: PositionType::Absolute,
            top: Val::Px(12.0),
            left: Val::Percent(30.0),
            right: Val::Percent(30.0),
            flex_direction: FlexDirection::Column,
            align_items: AlignItems::Center,
            row_gap: Val::Px(4.0),
            ..default()
        },
        XpBarContainer,
    )).with_children(|parent| {
        // Level title + XP text row
        parent.spawn(
            Node {
                flex_direction: FlexDirection::Row,
                column_gap: Val::Px(12.0),
                align_items: AlignItems::Center,
                ..default()
            }
        ).with_children(|row| {
            row.spawn((
                Text::new("⚡ Lv.1 Novice"),
                TextFont { font_size: 13.0, ..default() },
                TextColor(Color::srgb(1.0, 0.75, 0.0)),
                XpLevelText,
            ));

            row.spawn((
                Text::new("0 / 100 XP"),
                TextFont { font_size: 11.0, ..default() },
                TextColor(Color::srgb(0.6, 0.6, 0.6)),
                XpValueText,
            ));
        });

        // XP bar background
        parent.spawn((
            Node {
                width: Val::Percent(100.0),
                height: Val::Px(8.0),
                border: UiRect::all(Val::Px(1.0)),
                ..default()
            },
            BackgroundColor(Color::srgb(0.15, 0.15, 0.15)),
            BorderColor(Color::srgb(0.3, 0.3, 0.3)),
        )).with_children(|bar| {
            // XP fill
            bar.spawn((
                Node {
                    width: Val::Percent(0.0),
                    height: Val::Percent(100.0),
                    ..default()
                },
                BackgroundColor(Color::srgb(1.0, 0.75, 0.0)),
                XpBarFill,
            ));
        });
    });
}

fn process_xp_gains(
    mut events: EventReader<XpGainEvent>,
    mut score: ResMut<PlayerScore>,
    mut level_up_writer: EventWriter<LevelUpEvent>,
) {
    for event in events.read() {
        score.xp += event.amount;
        info!("⚡ +{} XP: {}", event.amount, event.reason);

        // Check level up
        while score.xp >= score.xp_for_next_level() {
            score.level += 1;
            score.title = PlayerScore::title_for_level(score.level).to_string();
            
            level_up_writer.send(LevelUpEvent {
                new_level: score.level,
                title: score.title.clone(),
            });

            info!("🎉 LEVEL UP! Level {} — {}", score.level, score.title);
        }
    }
}

fn update_xp_hud(
    score: Res<PlayerScore>,
    mut fill_query: Query<&mut Node, With<XpBarFill>>,
    mut level_text_query: Query<&mut Text, (With<XpLevelText>, Without<XpValueText>)>,
    mut value_text_query: Query<&mut Text, (With<XpValueText>, Without<XpLevelText>)>,
) {
    if !score.is_changed() { return; }

    let progress = score.level_progress() * 100.0;

    for mut node in &mut fill_query {
        node.width = Val::Percent(progress);
    }

    for mut text in &mut level_text_query {
        *text = Text::new(format!("⚡ Lv.{} {}", score.level, score.title));
    }

    for mut text in &mut value_text_query {
        *text = Text::new(format!("{} / {} XP", score.xp, score.xp_for_next_level()));
    }
}
