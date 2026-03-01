use bevy::prelude::*;

#[derive(Event)]
pub enum SfxEvent {
    Hit,
    Death,
    LevelUp,
}

#[derive(Resource)]
pub struct SfxAssets {
    pub hit: Handle<AudioSource>,
    pub death: Handle<AudioSource>,
    pub level_up: Handle<AudioSource>,
}

pub struct GameAudioPlugin;

impl Plugin for GameAudioPlugin {
    fn build(&self, app: &mut App) {
        app.add_event::<SfxEvent>()
           .add_systems(Startup, setup_audio)
           .add_systems(Update, play_sfx);
    }
}

fn setup_audio(mut commands: Commands, asset_server: Res<AssetServer>) {
    commands.spawn((
        AudioPlayer::new(asset_server.load("bgm.mp3")),
        PlaybackSettings::LOOP,
    ));

    commands.insert_resource(SfxAssets {
        hit: asset_server.load("hit.wav"),
        death: asset_server.load("death.wav"),
        level_up: asset_server.load("levelup.wav"),
    });
}

fn play_sfx(
    mut commands: Commands,
    mut sfx_events: EventReader<SfxEvent>,
    sfx_assets: Res<SfxAssets>,
) {
    for event in sfx_events.read() {
        let handle = match event {
            SfxEvent::Hit => sfx_assets.hit.clone(),
            SfxEvent::Death => sfx_assets.death.clone(),
            SfxEvent::LevelUp => sfx_assets.level_up.clone(),
        };

        commands.spawn((
            AudioPlayer::new(handle),
            PlaybackSettings::DESPAWN,
        ));
    }
}
