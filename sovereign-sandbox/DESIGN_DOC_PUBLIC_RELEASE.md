# The Sovereign Sandbox — Public Release Design Document

> **Purpose:** Roadmap to bring the Bevy WASM game from prototype to public-worthy quality.
> **Author:** Code audit session, 2026-02-25
> **Status:** Ready for implementation

---

## Current State

The game has solid architecture: 4-room tilemap world, AABB collision, quest phases driven by TOML syllabus (Gagné's 9 Events), a terminal command-builder puzzle, knowledge fragment collectibles, XP/leveling, inventory tools, typewriter dialogue, camera shake, and particles. It compiles to both native desktop and WASM for browser embedding.

### Already Fixed (Session 2026-02-25)
- ✅ WASM AI dialogue fallback (responses no longer silently dropped)
- ✅ Boot cinematic skippable with any keypress
- ✅ On-screen controls HUD (bottom-right)
- ✅ Interaction prompts for all interactable objects (not just Teacher)
- ✅ Dialogue hints cleaned up (removed non-functional `[H] Speak`)
- ✅ Quiz phase added to interaction prompt match arm
- ✅ SandboxEmbed.jsx updated with Controls + How to Play

---

## Phase 1 — Visual Polish (High Impact, Low Risk)

### 1.1 Fix Sprite Backgrounds
**Files:** `assets/*.jpg`, `game_world.rs`

All sprites (player, teacher, terminal, archive, server) are JPEGs with visible gray grid/checkerboard backgrounds. This is the single biggest visual quality issue.

**Options (pick one):**
- **A) Regenerate assets as PNGs with transparency** — Use the `generate_image` tool to create clean sprites on transparent backgrounds. Replace `.jpg` with `.png` and update all `asset_server.load()` calls.
- **B) Add a color-key system** — Detect the gray background color and render it as transparent via a custom shader or Bevy's `Sprite::color` alpha channel. More complex, less reliable.

**Recommendation:** Option A. Generate new sprites with clear, non-grid backgrounds, save as `.jpg` (Bevy's JPEG support is already configured). Focus on:
- `player.jpg` / `player_walk_2.jpg` — character sprite (64×64)
- `teacher.jpg` — NPC mentor (64×64)
- `terminal.jpg` — computer terminal (96×96)
- `archive.jpg` — library/archive (96×96)
- `server.jpg` — server rack (96×96)

### 1.2 Load a Custom Font
**Files:** `main.rs` or each UI spawn site, `assets/`

Download a pixel-art or clean monospace font (e.g., **Press Start 2P**, **JetBrains Mono**, or **Silkscreen**) and load it via Bevy's `asset_server.load("fonts/game_font.ttf")`. Apply it globally to all `TextFont` structures.

```rust
// Example: Create a shared font handle resource
#[derive(Resource)]
struct GameFont(Handle<Font>);

fn load_font(mut commands: Commands, asset_server: Res<AssetServer>) {
    commands.insert_resource(GameFont(asset_server.load("fonts/silkscreen.ttf")));
}
```

### 1.3 Add a Title Screen
**Files:** `main.rs` (new `GameState::Menu` variant)

Add a `Menu` state before `Boot`:
```
Menu → Boot → Playing
```

Title screen should show:
- Game title: **"The Sovereign Sandbox"**
- Subtitle: *"An AI Academy Adventure"*
- `[ENTER] Start Game` button
- `[?] How to Play` — shows controls overlay
- Credits: *"Built with Rust & Bevy | The Local AI Architect"*
- Version number

### 1.4 Minimap or Compass Indicator
**Files:** `game_world.rs` (new UI system)

Add a small minimap (top-right or bottom-left) showing:
- Room outlines as colored rectangles
- Player position as a blinking dot
- Current quest target as an arrow/beacon

**Simpler alternative:** Add a directional arrow HUD element that points toward the current quest target (Terminal, Archive, Server, or Teacher depending on the active phase).

---

## Phase 2 — Audio (Transforms the Experience)

### 2.1 Background Music
**Files:** `main.rs` or new `audio.rs` module

Add an ambient soundtrack. Bevy supports `.ogg` and `.wav`:
```rust
fn start_bgm(mut commands: Commands, asset_server: Res<AssetServer>) {
    commands.spawn((
        AudioPlayer::new(asset_server.load("audio/ambient.ogg")),
        PlaybackSettings::LOOP,
    ));
}
```

**Sources for free music:** OpenGameArt, Pixabay, or generate with AI music tools. Aim for a calm, slightly mysterious cyberpunk ambient track.

### 2.2 Sound Effects
**Files:** `game_world.rs`, `puzzle.rs`, `scoring.rs`

Priority SFX:
| Event | Sound | File |
|-------|-------|------|
| Knowledge Fragment collected | Chime / sparkle | `sfx_collect.ogg` |
| Quest advanced | Achievement fanfare | `sfx_quest.ogg` |
| XP gained | Soft ding | `sfx_xp.ogg` |
| Puzzle correct | Success chord | `sfx_correct.ogg` |
| Puzzle wrong | Error buzz | `sfx_wrong.ogg` |
| Level up | Triumphant jingle | `sfx_levelup.ogg` |
| Footsteps | Soft tap (2 variations) | `sfx_step1.ogg`, `sfx_step2.ogg` |

---

## Phase 3 — Gameplay Clarity (Educational Impact)

### 3.1 Knowledge Fragment Popup Overlay
**Files:** `game_world.rs` (modify `collect_knowledge_fragments`)

**Critical educational fix.** Currently, fragment content only goes to `info!()` (console log). Players never see the actual educational text on screen.

Add a popup overlay when a fragment is collected:
```
╔════════════════════════════════════════╗
║  📜 KNOWLEDGE FRAGMENT                ║
║                                        ║
║  "Data Sovereignty"                    ║
║                                        ║
║  FERPA requires student data to stay   ║
║  on school premises. Local AI means    ║
║  zero data leaves your network.        ║
║                                        ║
║  +25 XP                               ║
║                                        ║
║  [Press any key to continue]           ║
╚════════════════════════════════════════╝
```

Implementation: Pause movement, spawn a full-screen overlay with the fragment title + content, dismiss on keypress. Reuse the same pattern as `AcquisitionNotification` in `inventory.rs`.

### 3.2 Unify Dialogue Display
**Files:** `teacher.rs`, `story_mode.rs`

**Problem:** Both `update_teacher_visuals` (teacher bubble, top-right) and `update_narrative_display` (dialogue box, bottom) read from the same `ai_channel.receiver` via `try_recv()`. This creates a race condition — whichever system runs first "steals" the response.

**Fix:** Remove the teacher bubble system (`TeacherBubble` component + `update_teacher_visuals`). Route all AI responses through the story_mode dialogue box only. The dialogue box is better positioned, has typewriter effect, and is more visible.

Alternatively, use **two separate channels**: one for the teacher bubble (short status) and one for the narrative (full dialogue). But this adds complexity.

**Recommendation:** Remove the teacher bubble. The dialogue box at the bottom is the primary storytelling surface.

### 3.3 Interactive Quest Objective Arrows
**Files:** `game_world.rs`

When the current phase is `Exploration`, spawn a floating arrow above the player that points toward the target:
```rust
fn draw_quest_arrow(
    player: Query<&Transform, With<Player>>,
    triggers: Query<(&Transform, &QuestTrigger)>,
    syllabus: Option<Res<SyllabusResource>>,
    // ...
) {
    // Calculate angle from player to active target
    // Spawn/update a rotated arrow sprite above the player
}
```

### 3.4 Phase Transition Overlay
**Files:** `quest_ui.rs`

When the quest phase changes, show a brief full-width banner:
```
━━━━ PHASE 3/10: [DO] Walk to the Terminal ━━━━
```
This already partially exists as `QuestNotification` but shows a generic "NEW OBJECTIVE" text at font size 42. Improve by:
- Showing the actual phase type + objective text
- Reducing font size to 28
- Adding a slide-in animation

---

## Phase 4 — Gameplay Mechanics

### 4.1 Pause Menu
**Files:** `main.rs` (add `GameState::Paused`), new `pause_menu.rs`

Press `ESC` → overlay with:
- **Resume** (close overlay)
- **Controls** (show keybindings)
- **Restart** (reset all state, return to Boot)
- **Quit** (only relevant for native builds)

### 4.2 Module-Specific Mechanics for Archives & Server
**Files:** `game_world.rs`, potentially new `archive_puzzle.rs`

Currently Modules 2 and 3 reference "Interact with the Logic Archive" and "Use the Logic Lens near the Teacher" — but these don't have unique interactive mechanics. They're just proximity triggers.

**Proposals:**
- **Archive Vault:** Add a "Logic Template" reading minigame — display a code snippet and ask the player to identify the pattern (multiple choice).
- **Server Core:** Add a "Deploy to Edge" minigame — drag-and-drop a model file to the correct server slot.

These are stretch goals. At minimum, add unique **visual feedback** when the player interacts with these objects (glow effect, text popup showing what the object represents).

### 4.3 Remove or Soften the 20-Minute Timer
**Files:** `quest_ui.rs`

The countdown timer creates unnecessary anxiety for a learning experience. Options:
- **A) Remove it entirely** — Let players explore at their own pace
- **B) Change to elapsed time** — Show "Time: 03:42" counting up, not down
- **C) Make it informational** — "Estimated: 20 min" as static text, no countdown

**Recommendation:** Option B (elapsed time). It still gives a sense of progress without creating pressure.

### 4.4 Victory Screen Enhancement
**Files:** `quest_ui.rs`

Current victory screen is minimal. Enhance with:
- Total XP earned
- Fragments collected (X/8)
- Rooms discovered (X/4)
- Puzzles solved
- Time elapsed
- A "Return to E-Learning" button (for WASM, navigate parent frame)

---

## Phase 5 — Technical Debt

### 5.1 Remove `bevy-inspector-egui` Dependency
**Files:** `Cargo.toml`

The inspector plugin is imported but never used (the `add_plugins` call is removed). Removing it from `Cargo.toml` reduces WASM bundle size.

### 5.2 Clean Up Dead Code Warnings
**Files:** Multiple

Run `cargo fix` to address the 25 warnings (unused fields, dead code). This improves maintainability.

### 5.3 Optimize WASM Bundle Size
**Files:** `Cargo.toml`

Add WASM-specific optimizations:
```toml
[profile.release]
opt-level = "z"      # Optimize for size
lto = true           # Link-time optimization
strip = true         # Strip debug symbols
```

Consider using `wasm-opt` post-build for further size reduction.

---

## Implementation Priority

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| 🔴 P0 | 3.1 Knowledge Fragment popup | 1 hr | **Critical** — educational content invisible |
| 🔴 P0 | 3.2 Unify dialogue display | 30 min | Fixes race condition |
| 🟠 P1 | 1.1 Fix sprite backgrounds | 1 hr | First impression |
| 🟠 P1 | 2.1 Background music | 30 min | Transforms experience |
| 🟠 P1 | 1.3 Title screen | 1 hr | Professional feel |
| 🟡 P2 | 4.3 Remove countdown timer | 15 min | Reduces anxiety |
| 🟡 P2 | 4.4 Victory screen stats | 45 min | Satisfying completion |
| 🟡 P2 | 1.2 Custom font | 30 min | Visual polish |
| 🟡 P2 | 2.2 Sound effects | 1 hr | Game juice |
| 🟡 P2 | 3.4 Phase transition overlay | 30 min | Clarity |
| 🟢 P3 | 1.4 Minimap/compass | 2 hr | Navigation aid |
| 🟢 P3 | 3.3 Quest objective arrows | 1 hr | Wayfinding |
| 🟢 P3 | 4.1 Pause menu | 1 hr | Standard feature |
| 🟢 P3 | 4.2 Archive/Server mechanics | 3 hr | Depth |
| 🟢 P3 | 5.1-5.3 Technical debt | 1 hr | Bundle size + clean code |

**Estimated total:** ~14 hours across all phases.
**Minimum viable public release (P0 + P1):** ~4 hours.

---

## File Map

```
sovereign-sandbox/
├── src/
│   ├── main.rs              ← Title screen, GameState::Menu
│   ├── game_world.rs        ← Fragment popup, quest arrows, minimap
│   ├── story_mode.rs        ← Primary dialogue surface (keep)
│   ├── teacher.rs           ← Remove teacher bubble (merge into story_mode)
│   ├── quest_ui.rs          ← Timer fix, phase transitions, victory stats
│   ├── puzzle.rs            ← SFX hooks
│   ├── scoring.rs           ← SFX hooks, level-up fanfare
│   ├── inventory.rs         ← (no changes needed)
│   ├── syllabus/mod.rs      ← (no changes needed)
│   ├── ai/mod.rs            ← (already fixed)
│   ├── audio.rs             ← NEW: BGM + SFX management
│   └── pause_menu.rs        ← NEW: Pause overlay
├── assets/
│   ├── fonts/               ← NEW: Custom game font
│   ├── audio/               ← NEW: BGM + SFX files
│   ├── player.jpg           ← Regenerate with clean background
│   ├── teacher.jpg          ← Regenerate with clean background
│   └── ...
└── Cargo.toml               ← Remove bevy-inspector-egui, add release opts
```
