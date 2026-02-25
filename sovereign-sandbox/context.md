# Sovereign Sandbox — Context

## What Is This?

A Bevy 2D educational RPG built in Rust, teaching "The Local AI Architect" curriculum — how to set up and use local AI tools (Ollama, open-weight models) for education. It compiles to both native desktop and WASM (for browser embedding in the React e-learning app).

## Architecture

```
sovereign-sandbox/
├── src/
│   ├── main.rs           # App entry, GameState (Boot→Playing), boot cinematic
│   ├── game_world.rs     # World map, player movement, collision, particles, fragments
│   ├── scoring.rs        # XP system, level progression, HUD bar
│   ├── puzzle.rs         # Terminal command-builder mini-game
│   ├── teacher.rs        # AI Teacher NPC logic and proximity detection
│   ├── story_mode.rs     # Dialogue box UI and narrative text
│   ├── quest_ui.rs       # Quest log panel (top-left)
│   ├── inventory.rs      # Inventory panel (top-right) and item notifications
│   ├── syllabus/mod.rs   # Quest phases from TOML, progression state machine
│   ├── ai/mod.rs         # AI request/response plumbing (Ollama integration)
│   ├── ai/memory.rs      # Vector memory store (HNSW)
│   ├── ai/moshi.rs       # Voice AI (Moshi) — stubbed in WASM
│   └── quiz.rs           # Quiz question structures
├── assets/
│   ├── *.jpg             # All sprites (player, teacher, floor, wall, terminal, etc.)
│   └── syllabus/         # module_1.toml quest definitions
└── Cargo.toml            # Bevy 0.15, wasm-bindgen, serde, hnsw_rs
```

## World Layout

Four rooms connected by corridors (~350 tiles total):

```
    ┌──────────┐         ┌──────────┐         ┌──────────┐
    │ Terminal  │─────────│ Academy  │─────────│  Server  │
    │   Lab    │ corridor │  Hall    │ corridor│   Core   │
    └──────────┘         └────┬─────┘         └──────────┘
                              │ corridor
                         ┌────┴─────┐
                         │ Archive  │
                         │  Vault   │
                         └──────────┘
```

- **Academy Hall** (center): Player spawn, Teacher NPC
- **Terminal Lab** (west): Terminal object, puzzle trigger
- **Archive Vault** (south): Archive object
- **Server Core** (east): Server object

## Key Systems

### Game States
- `Boot` → Amber text cinematic (~9s) → `Playing`
- All gameplay systems gated behind `Playing` state

### XP & Levels
- Novice (0) → Student (100) → Architect (300) → Sovereign (600) → Grandmaster (1000)
- XP sources: room discovery (+50), fragments (+25), quest advance (+75), puzzle (+100)

### Knowledge Fragments
8 gold collectibles scattered throughout, teaching real educational content (FERPA, Gagné, constructivism, quantization, etc.)

### Terminal Puzzle
Assemble `ollama run llama3` from scrambled tokens [1/2/3]. Wrong → red flash. Correct → +100XP.

### Collision
AABB wall collision with axis-independent sliding (try X, then Y separately).

### Game Juice
- Screen shake via `CameraTrauma` (quadratic decay)
- Particle bursts (ring of colored sprites)
- Floating text feedback ("+25XP" floats up, fades)

## WASM Deployment

```bash
cargo build --release --target wasm32-unknown-unknown
wasm-bindgen --out-dir forge-web/wasm --target web target/wasm32-unknown-unknown/release/sovereign-sandbox.wasm
# Copy wasm/ and assets/ to elearning public/sandbox/
```

## Known Issues

- **All asset files are JPEG** — even ones with `.png` extensions. Code must load as `.jpg`
- **Player/Teacher sprites** have gray grid backgrounds (JPG, not transparent PNG)
- **No audio** — `jfk.wav` exists but no audio systems are wired
- **AI dialogue is static** — Ollama/LM Studio integration is plumbed but not connected in WASM
- **WASM in iframe** may need UI scaling adjustments for smaller viewports
- **bevy_inspector_egui** is still a dependency but the plugin is now disabled

## LM Studio

User has LM Studio running on `localhost:1234` with a model loaded. Future: wire `ai/mod.rs` to hit this endpoint for dynamic Teacher dialogue (native build only).
