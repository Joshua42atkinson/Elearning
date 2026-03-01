use bevy::prelude::*;

#[derive(Resource)]
pub struct MoshiVoice {
    pub is_speaking: bool,
    pub amplitude: f32,
}


