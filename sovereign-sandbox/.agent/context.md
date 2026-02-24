# Sovereign Sandbox Project Context

## Current Phase: Session 3 — The Living World
We have successfully transitioned the sandbox from a linear prototype to a dynamic RPG world driven by a quest state machine and live AI interaction.

### Core Systems Implemented
- **Quest State Machine (`QuestPhase`)**: Exploration, Dialogue, Task, and Reflection phases. Defined in `syllabus/mod.rs` and scripted via `module_1.toml`.
- **Proactive NPC Interaction**: Teacher NPC initiates dialogue on proximity (Pokémon-style).
- **Typewriter FX**: Character-by-character text reveal in `story_mode.rs`.
- **Live Voice Input**: Whisper integration using `cpal` for real-time microphone capture ("Press H to speak").

## Design Rules & Principles
- **Aesthetic**: Retro-cyberpunk phosphor amber (#FFC000) and cyan (#00FFFF).
- **AAA Feel**: Audio-visual feedback for every interaction.
- **AI-First**: All dialogue and quest context is processed by local Phi-3 and Whisper models.
- **Privacy**: No external API calls; all inference is local (Candle).

## Next Session Goals
- [ ] **Implementation of TTS (Text-to-Speech)**: Give the Teacher NPC a literal voice.
- [x] **Advanced Quest Triggers**: Implement spatial triggers (Archive, Server).
- [ ] **Inventory System Refactor**: Migrate tool unlocks to the `QuestPhase` system.
- [ ] **Performance Optimization**: Evaluate CUDA/Metal acceleration for the AI thread.
- [ ] **Save/Load System**: Persist progress between sessions.

## Handover Notes
- **Voice Input**: Use the `H` key to record. The recording stops when `H` is released. Transcription happens in the background AI thread.
- **Quest Advancement**: Arriving at the NPC advances `Exploration`. Pressing `T` advances `Dialogue` and `Reflection`. Completing the terminal interaction (press `T` near it) advances `Task`.
- **Codebase**: `cargo check` is clean. See `walkthrough.md` for detailed system architecture.
