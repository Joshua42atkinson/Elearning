use bevy::prelude::*;
use crate::GameState;
use crate::syllabus::SyllabusResource;

pub struct VictoryScreenPlugin;

impl Plugin for VictoryScreenPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(OnEnter(GameState::Victory), setup_victory_screen)
           .add_systems(Update, handle_victory_input.run_if(in_state(GameState::Victory)))
           .add_systems(OnExit(GameState::Victory), cleanup_victory_screen);
    }
}

#[derive(Component)]
struct VictoryScreenEntity;

fn setup_victory_screen(mut commands: Commands) {
    commands.spawn((
        Node {
            width: Val::Percent(100.0),
            height: Val::Percent(100.0),
            flex_direction: FlexDirection::Column,
            justify_content: JustifyContent::Center,
            align_items: AlignItems::Center,
            row_gap: Val::Px(20.0),
            ..default()
        },
        BackgroundColor(Color::srgba(0.02, 0.02, 0.04, 0.95)), // Semi-transparent dark bg
        VictoryScreenEntity,
    ))
    .with_children(|parent| {
        parent.spawn((
            Text::new("MODULE COMPLETE"),
            TextFont {
                font_size: 60.0,
                ..default()
            },
            TextColor(Color::srgb(0.5, 0.0, 1.0)), // Fuchsia/Violet
        ));
        
        parent.spawn((
            Text::new("You have successfully architected the Sovereign Sandbox.\nThe Textbook Trap has been dismantled."),
            TextFont {
                font_size: 24.0,
                ..default()
            },
            TextColor(Color::srgb(0.8, 0.8, 0.8)),
            TextLayout::new_with_justify(JustifyText::Center),
        ));

        parent.spawn((
            Text::new("Press [ENTER] to Restart"),
            TextFont {
                font_size: 16.0,
                ..default()
            },
            TextColor(Color::srgb(0.4, 0.4, 0.4)),
        ));
    });
}

fn handle_victory_input(
    keys: Res<ButtonInput<KeyCode>>,
    mut next_state: ResMut<NextState<GameState>>,
    mut syllabus: Option<ResMut<SyllabusResource>>,
) {
    if keys.just_pressed(KeyCode::Enter) {
        // Reset syllabus progress
        if let Some(ref mut syl) = syllabus {
            syl.current_module_index = 0;
            syl.current_event_step = 0;
            if let Some(first_quest) = syl.syllabus.modules.first() {
                syl.quest_script = crate::syllabus::QuestScript::from_quest(first_quest);
            }
        }
        next_state.set(GameState::Menu); // Or Title Screen, we'll use Title Screen (Menu)
    }
}

fn cleanup_victory_screen(
    mut commands: Commands,
    query: Query<Entity, With<VictoryScreenEntity>>
) {
    for entity in query.iter() {
        commands.entity(entity).despawn_recursive();
    }
}
