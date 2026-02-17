# Project Context: The Local AI Architect
**"To teach the game, you must play the game."**

## 1. The Vision: The Sovereign Syllabus
We are building a **Gamified Teacher Training Academy**.
*   **The Problem**: Teachers are becoming consumers of AI, not creators.
*   **The Solution**: An RPG-style platform where teachers play as "Architects," learning to build their own gamified curricula using local AI tools.
*   **The Philosophy**: Constructionism + Sovereignty. "If you don't own the server, you don't own the gradebook."

## 2. The Architecture: Two Worlds
The platform consists of two distinct but connected environments:

### World 1: The Quest Log (Web App)
*   **Role**: The Learning Management System (LMS) and Tooling Hub.
*   **Stack**: HTML5, Vanilla CSS, JavaScript.
*   **Key Modules**:
    *   **Module 1 (The Forge)**: Terminal/Ollama Interface (Safe Sandbox).
    *   **Module 2 (The Logic Engine)**: Prompt Engineering & Intent/Code Translation.
    *   **Module 3 (The Web Runtime)**: Instant feedback visualization (Canvas).
*   **Aesthetic**: "Daydream Matrix-Rust" (Phosphor Amber `#FFBF00` on Deep Charcoal `#1A1A1A`).

### World 2: The Sovereign Sandbox (The Engine)
*   **Role**: The "Final Project" engine where teachers build high-fidelity simulations.
*   **Stack**: **Rust** & **Bevy ECS**.
*   **Scripting**: **Rhai** (Sandboxed Logic).

*   **AI**: **Candle** (Hugging Face Rust Inference).
    *   **Brain**: Phi-3-Mini (4k Instruct).
    *   **Ears**: Whisper (Architecture Stub).
*   **Location**: `/sovereign-sandbox`.
*   **Design**: Isomorphic/Dimetric Projection (2:1 Ratio).

## 3. The Rules (The Genome)
These rules are non-negotiable and define the project's soul.
*   **Aesthetics**: Follow `.agent/rules/aesthetics.md`. High information density, terminal motifs, scanlines.
*   **Technical**: Follow `.agent/rules/bevy.md`. Use `Required Components`, `Entity Relationships`, and `Rhai` for logic.
*   **Pedagogy**: Follow Gagné's 9 Events of Instruction. Every interaction must have immediate visual feedback.
*   **Documentation Protocol**: This `context.md` file MUST be updated after every major accomplishment to ensure continuity across sessions.

## 4. Current State (Session 7: "The Glass Bead Game")
*   **Web App (World 1)**: **COMPLETE**.
*   **Rust Engine (World 2)**: **SYLLABUS INTEGRATED**.
    *   **The Brain**: Phi-3-Mini-4k-Instruct optimized with `wgpu`.
    *   **The Ears**: **COMPLETE**. Integrated Whisper (Tiny).
    *   **The Memory**: **COMPLETE**. Trinity Sled semantic vector store.
    *   **The Syllabus**: **COMPLETE**. Quest Definition Language (QDL) with `module_1.toml`.
    *   **The Teacher**: **ACTIVE** with syllabus context.
        *   **Persona**: "The Gamification Architect" (Socratic Guide).
        *   **Visuals**: Basic Entity spawned.
        *   **Interaction**: Press 'T' to Chat (context-aware), 'H' to Listen.
    *   **UI**: "Neon Wizard" boot sequence implemented.
    *   **NEXT**: Visual Quest Progression UI (Quest Log panel, progress indicators).

## 5. The Production Roadmap (The Pentagram)
1.  **The Silicon Cortex (AI Robustness)**: Structured JSON outputs, Context Caching, Safety Rails.
2.  **The Akashic Records (Persistence)**: **INTEGRATED (Trinity Sled)**. Semantic vector memory system with `sled` + `hnsw_rs`.
3.  **The Glass Bead Game (UI/UX)**: Diegetic interface, Quest Log, Visual Novel dialogue.
4.  **The Syllabus (Content Engine)**: **INTEGRATED (QDL)**. Quest Definition Language using TOML. `module_1.toml` contains 20min e-learning storyboard mapped to Gagné's 9 Events.
5.  **The Construct (Distribution)**: Bundled inference binaries and cross-platform installers.

## 6. How to Contribute
*   **Web Changes**: Edit `forge-web/`. Open `index.html` to test.
*   **Rust Changes**: Edit `sovereign-sandbox/`. Run `cargo run` to test.
*   **Documentation**: Update `syllabus.md` for pedagogical changes, `context.md` for architectural changes.
