use bevy::prelude::*;
use crate::ai::memory::MemoryStoreResource;

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// ============================================================================
// Tool Definitions
// ============================================================================

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum ToolId {
    OllamaCompass,   // Unlocked at step 3 (Present Content)
    LogicLens,       // Unlocked at step 6 (Provide Feedback)
    FeedbackMirror,  // Unlocked at step 9 (Enhance Retention)
    ThinkingCapPhi,  // The Tiny Beret
    ThinkingCapLlama, // The Llama Top Hat
    ThinkingCapMistral, // The Mistral Fedora
}

impl ToolId {
    pub fn name(&self) -> &'static str {
        match self {
            ToolId::OllamaCompass => "Ollama Compass",
            ToolId::LogicLens => "Logic Lens",
            ToolId::FeedbackMirror => "Feedback Mirror",
            ToolId::ThinkingCapPhi => "The Tiny Beret (Phi-3)",
            ToolId::ThinkingCapLlama => "The Llama Top Hat (Llama-3)",
            ToolId::ThinkingCapMistral => "The Mistral Fedora (Mistral)",
        }
    }

    pub fn description(&self) -> &'static str {
        match self {
            ToolId::OllamaCompass => "Navigate the local AI landscape. Shows you're connected to your sovereign assistant.",
            ToolId::LogicLens => "Translates teaching intent into game logic. The bridge between imagination and code.",
            ToolId::FeedbackMirror => "Reflects student interactions back to you. The key to iterative design.",
            ToolId::ThinkingCapPhi => "Fast, lightweight, and perfect for edge devices. A smart choice for quick thoughts.",
            ToolId::ThinkingCapLlama => "Powerful and versatile. The standard for heavy lifting and complex reasoning.",
            ToolId::ThinkingCapMistral => "Efficient and open. A balanced choice for the modern sovereign architect.",
        }
    }

    pub fn icon(&self) -> &'static str {
        match self {
            ToolId::OllamaCompass => "🧭",
            ToolId::LogicLens => "🔍",
            ToolId::FeedbackMirror => "🪞",
            ToolId::ThinkingCapPhi => "🧢",
            ToolId::ThinkingCapLlama => "🎩",
            ToolId::ThinkingCapMistral => "🕵️",
        }
    }

    pub fn unlock_step(&self) -> usize {
        match self {
            ToolId::OllamaCompass => 3,   // Present Content
            ToolId::LogicLens => 6,       // Provide Feedback
            ToolId::FeedbackMirror => 8,  // Enhance Retention
            _ => 99, // Hats don't unlock via Gagne steps, but by purchase
        }
    }
}

// ============================================================================
// Inventory Resource
// ============================================================================

#[derive(Resource, Clone, Serialize, Deserialize)]
pub struct Inventory {
    pub tools: HashMap<ToolId, bool>, // true if unlocked
    pub active_tool: Option<ToolId>,
    pub active_hat: Option<ToolId>, // Only one hat can be worn at a time
    pub newly_acquired: Option<ToolId>, // For showing acquisition animation
}

impl Default for Inventory {
    fn default() -> Self {
        let mut tools = HashMap::new();
        tools.insert(ToolId::OllamaCompass, false);
        tools.insert(ToolId::LogicLens, false);
        tools.insert(ToolId::FeedbackMirror, false);
        
        Self {
            tools,
            tools,
            active_tool: None,
            active_hat: None,
            newly_acquired: None,
        }
    }
}


impl Inventory {
    pub fn unlock_tool(&mut self, tool: ToolId) {
        if !self.tools.get(&tool).copied().unwrap_or(false) {
            self.tools.insert(tool, true);
            self.newly_acquired = Some(tool);
            info!("🎁 Tool Acquired: {} - {}", tool.icon(), tool.name());
        }
    }

    pub fn has_tool(&self, tool: ToolId) -> bool {
        self.tools.get(&tool).copied().unwrap_or(false)
    }

    pub fn clear_notification(&mut self) {
        self.newly_acquired = None;
    }
}

// ============================================================================
// UI Components
// ============================================================================

#[derive(Component)]
pub struct InventoryPanel;

#[derive(Component)]
pub struct InventorySlot {
    pub tool_id: ToolId,
}

#[derive(Component)]
pub struct AcquisitionNotification;

#[derive(Component)]
pub struct FeedbackMirrorDisplay;

// ============================================================================
// Events
// ============================================================================

#[derive(Event)]
pub struct ItemGetEvent(pub ToolId);


// ============================================================================
// Plugin
// ============================================================================

pub struct InventoryPlugin;

impl Plugin for InventoryPlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(Inventory::default())
           .add_event::<ItemGetEvent>()
           .add_systems(Startup, setup_inventory_ui)
           .add_systems(Update, (
               check_tool_unlocks, // Keeping for backward compat, but logic inside will change or we remove it
               handle_quest_rewards,
               update_inventory_ui,
               show_acquisition_notification,
               dismiss_notification,
               toggle_tools,
               update_feedback_mirror,
           ));
    }
}

// ============================================================================
// Systems
// ============================================================================

fn setup_inventory_ui(mut commands: Commands) {
    // Inventory Panel Container (Right side of screen)
    commands
        .spawn((
            Node {
                position_type: PositionType::Absolute,
                right: Val::Px(20.0),
                top: Val::Px(120.0),
                padding: UiRect::all(Val::Px(15.0)),
                flex_direction: FlexDirection::Column,
                row_gap: Val::Px(10.0),
                border: UiRect::all(Val::Px(2.0)),
                ..default()
            },
            BackgroundColor(Color::srgb(0.1, 0.1, 0.1)), // Deep Charcoal
            BorderColor(Color::srgb(0.702, 0.525, 0.0)), // Phosphor Dim
            InventoryPanel,
        ))
        .with_children(|parent| {
            // Header: "INVENTORY"
            parent.spawn((
                Text::new("═══ INVENTORY ═══"),
                TextFont {
                    font_size: 18.0,
                    ..default()
                },
                TextColor(Color::srgb(1.0, 0.75, 0.0)), // Phosphor Amber
            ));

            // Tool Slots
            for tool in [ToolId::OllamaCompass, ToolId::LogicLens, ToolId::FeedbackMirror] {
                parent.spawn((
                    Node {
                        padding: UiRect::all(Val::Px(8.0)),
                        border: UiRect::all(Val::Px(1.0)),
                        flex_direction: FlexDirection::Row,
                        column_gap: Val::Px(8.0),
                        ..default()
                    },
                    BackgroundColor(Color::srgb(0.15, 0.15, 0.15)),
                    BorderColor(Color::srgb(0.3, 0.3, 0.3)),
                    InventorySlot { tool_id: tool },
                ))
                .with_children(|slot| {
                    // Icon + Name (will be grayed out if locked)
                    slot.spawn((
                        Text::new(format!("{} ???", tool.icon())),
                        TextFont {
                            font_size: 14.0,
                            ..default()
                        },
                        TextColor(Color::srgb(0.3, 0.3, 0.3)), // Locked color
                    ));
                });
            }

            // Hint
            parent.spawn((
                Text::new("Tools unlock as you progress"),
                TextFont {
                    font_size: 11.0,
                    ..default()
                },
                TextColor(Color::srgb(0.5, 0.5, 0.5)),
            ));

             // Header: "THINKING CAPS"
             parent.spawn((
                Text::new("═══ THINKING CAPS ═══"),
                TextFont {
                    font_size: 18.0,
                    ..default()
                },
                TextColor(Color::srgb(0.0, 1.0, 1.0)), // Cyan
                Node {
                    margin: UiRect::top(Val::Px(20.0)),
                    ..default()
                }
            ));

            // Hat Slots
            for hat in [ToolId::ThinkingCapPhi, ToolId::ThinkingCapLlama, ToolId::ThinkingCapMistral] {
                parent.spawn((
                    Node {
                        padding: UiRect::all(Val::Px(8.0)),
                        border: UiRect::all(Val::Px(1.0)),
                        flex_direction: FlexDirection::Row,
                        column_gap: Val::Px(8.0),
                        ..default()
                    },
                    BackgroundColor(Color::srgb(0.15, 0.15, 0.15)),
                    BorderColor(Color::srgb(0.3, 0.3, 0.3)),
                    InventorySlot { tool_id: hat },
                ))
                .with_children(|slot| {
                    // Icon + Name (will be grayed out if locked)
                    slot.spawn((
                        Text::new(format!("{} ???", hat.icon())),
                        TextFont {
                            font_size: 14.0,
                            ..default()
                        },
                        TextColor(Color::srgb(0.3, 0.3, 0.3)), // Locked color
                    ));
                });
            }
        });
}

fn check_tool_unlocks(
    _syllabus: Option<Res<crate::syllabus::SyllabusResource>>,
    mut _inventory: ResMut<Inventory>,
) {
    // Deprecated: Logic moved to handle_quest_rewards and QuestPhase rewards
    // Keeping empty or minimalistic to avoid breaking if older systems rely on it, 
    // but effectively we want to stop using gagne_step for unlocks.
}

fn handle_quest_rewards(
    mut events: EventReader<ItemGetEvent>,
    mut inventory: ResMut<Inventory>,
) {
    for event in events.read() {
        let tool = event.0;
        if !inventory.has_tool(tool) {
            inventory.unlock_tool(tool);
        }
    }
}

fn update_inventory_ui(
    inventory: Res<Inventory>,
    slot_query: Query<(&InventorySlot, &Children)>,
    mut text_query: Query<&mut Text>,
    mut text_color_query: Query<&mut TextColor>,
    mut border_query: Query<(&InventorySlot, &mut BorderColor, &mut BackgroundColor), Without<InventoryPanel>>,
) {

    if inventory.is_changed() {
        // Update text in slots
        for (slot, children) in &slot_query {
            let is_unlocked = inventory.has_tool(slot.tool_id);
            
            for &child in children.iter() {
                if let Ok(mut text) = text_query.get_mut(child) {
                    if is_unlocked {
                        *text = Text::new(format!("{} {}", slot.tool_id.icon(), slot.tool_id.name()));
                    }
                }
                
                if let Ok(mut text_color) = text_color_query.get_mut(child) {
                    if is_unlocked {
                        *text_color = TextColor(Color::srgb(1.0, 0.75, 0.0)); // Phosphor Amber
                    }
                }
            }
        }
        
        // Update border colors and background for active tool
        for (slot, mut border_color, mut bg_color) in &mut border_query {
            let is_active = Some(slot.tool_id) == inventory.active_tool;
            let is_unlocked = inventory.has_tool(slot.tool_id);
            
            if is_active {
                *border_color = BorderColor(Color::srgb(0.0, 1.0, 1.0)); // Cyan for active
                *bg_color = BackgroundColor(Color::srgb(0.0, 0.2, 0.2));
            } else if is_unlocked {
                *border_color = BorderColor(Color::srgb(1.0, 0.75, 0.0)); // Phosphor Amber for unlocked
                *bg_color = BackgroundColor(Color::srgb(0.15, 0.15, 0.15));
            } else {
                *border_color = BorderColor(Color::srgb(0.3, 0.3, 0.3));
                *bg_color = BackgroundColor(Color::srgb(0.1, 0.1, 0.1));
            }
            
            // Special coloring for Active Hat
            if Some(slot.tool_id) == inventory.active_hat {
                 *border_color = BorderColor(Color::srgb(0.5, 0.0, 1.0)); // Purple for Active Hat
                 *bg_color = BackgroundColor(Color::srgb(0.2, 0.0, 0.4));
            }
        }
        }
    }
}


fn show_acquisition_notification(
    mut commands: Commands,
    inventory: Res<Inventory>,
    notification_query: Query<Entity, With<AcquisitionNotification>>,
) {
    // Logic handles rendering if newly_acquired is set.
    // Ideally we should base this on the event, but the Inventory resource stores the state "newly_acquired"
    // which effectively acts as the queue for the UI.
    // So the existing logic is actually fine as long as `unlock_tool` sets `newly_acquired`.
    // The previous system `handle_quest_rewards` calls `unlock_tool`, so this chain works.
    
    // Clear old notifications if no longer in state
    if inventory.newly_acquired.is_none() {
        for entity in &notification_query {
            commands.entity(entity).despawn_recursive();
        }
        return;
    }

    // Show new notification
    if let Some(tool) = inventory.newly_acquired {
        // Only spawn if not already showing
        if notification_query.is_empty() {
            commands.spawn((
                Node {
                    position_type: PositionType::Absolute,
                    left: Val::Percent(50.0),
                    top: Val::Percent(40.0),
                    padding: UiRect::all(Val::Px(20.0)),
                    border: UiRect::all(Val::Px(3.0)),
                    flex_direction: FlexDirection::Column,
                    row_gap: Val::Px(10.0),
                    ..default()
                },
                BackgroundColor(Color::srgb(0.05, 0.05, 0.05)),
                BorderColor(Color::srgb(1.0, 0.75, 0.0)), // Phosphor Amber
                AcquisitionNotification,
            ))
            .with_children(|parent| {
                parent.spawn((
                    Text::new(format!("🎁 TOOL ACQUIRED! {}", tool.icon())),
                    TextFont {
                        font_size: 24.0,
                        ..default()
                    },
                    TextColor(Color::srgb(1.0, 0.75, 0.0)),
                ));

                parent.spawn((
                    Text::new(tool.name()),
                    TextFont {
                        font_size: 20.0,
                        ..default()
                    },
                    TextColor(Color::srgb(1.0, 1.0, 1.0)),
                ));

                parent.spawn((
                    Text::new(tool.description()),
                    TextFont {
                        font_size: 14.0,
                        ..default()
                    },
                    TextColor(Color::srgb(0.8, 0.8, 0.8)),
                ));

                parent.spawn((
                    Text::new("Press any key to continue..."),
                    TextFont {
                        font_size: 12.0,
                        ..default()
                    },
                    TextColor(Color::srgb(0.6, 0.6, 0.6)),
                ));
            });
        }
    }
}

fn dismiss_notification(
    keys: Res<ButtonInput<KeyCode>>,
    mut inventory: ResMut<Inventory>,
    notification_query: Query<Entity, With<AcquisitionNotification>>,
) {
    // If there's a notification showing and any key is pressed, dismiss it
    if !notification_query.is_empty() && keys.get_just_pressed().next().is_some() {
        inventory.clear_notification();
    }
}

fn toggle_tools(
    keys: Res<ButtonInput<KeyCode>>,
    mut inventory: ResMut<Inventory>,
) {
    let mut tool_to_toggle = None;
    
    if keys.just_pressed(KeyCode::KeyC) { tool_to_toggle = Some(ToolId::OllamaCompass); }
    if keys.just_pressed(KeyCode::KeyL) { tool_to_toggle = Some(ToolId::LogicLens); }
    if keys.just_pressed(KeyCode::KeyM) { tool_to_toggle = Some(ToolId::FeedbackMirror); }
    
    if let Some(tool) = tool_to_toggle {
        if inventory.has_tool(tool) {
            if inventory.active_tool == Some(tool) {
                inventory.active_tool = None;
                info!("📴 Deactivated {}", tool.name());
            } else {
                inventory.active_tool = Some(tool);
                info!("🔋 Activated {}", tool.name());
            }
        }
    }
}

fn update_feedback_mirror(
    mut commands: Commands,
    inventory: Res<Inventory>,
    memory_store: Option<Res<MemoryStoreResource>>,
    mut display_query: Query<(Entity, &mut Text), With<FeedbackMirrorDisplay>>,
) {
    let mirror_active = inventory.active_tool == Some(ToolId::FeedbackMirror);
    
    if mirror_active {
        if let Some(store) = memory_store {
            // Fetch recent memories
            let memories = store.0.get_recent_memories(3).unwrap_or_default();
            
            let mut display_text = "🪞 FEEDBACK MIRROR (Recent Memories)\n".to_string();
            if memories.is_empty() {
                display_text.push_str("\n(No memories found in sovereign store)");
            } else {
                for mem in memories {
                    display_text.push_str(&format!("\n• [{}] {}", mem.source, mem.content));
                }
            }
            
            if let Ok((_entity, mut text)) = display_query.get_single_mut() {
                *text = Text::new(display_text);
            } else if display_query.is_empty() {
                commands.spawn((
                    Text::new(display_text),
                    TextFont {
                        font_size: 14.0,
                        ..default()
                    },
                    TextColor(Color::srgb(1.0, 0.75, 0.0)), // Phosphor Amber
                    Node {
                        position_type: PositionType::Absolute,
                        left: Val::Px(20.0),
                        bottom: Val::Px(20.0),
                        max_width: Val::Px(400.0),
                        padding: UiRect::all(Val::Px(10.0)),
                        ..default()
                    },
                    BackgroundColor(Color::srgba(0.0, 0.0, 0.0, 0.8)),
                    FeedbackMirrorDisplay,
                ));
            }
        }
    } else {
        for (entity, _) in &display_query {
            commands.entity(entity).despawn_recursive();
        }
    }
}


