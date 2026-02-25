# Technical Bible: The Local AI Architect

## 1. Project Vision
"The Local AI Architect" is a comprehensive ecosystem designed to teach foundational AI engineering, emphasizing local-first deployment and absolute digital sovereignty. 

The core thesis is to move education from passive consumption (the "Textbook Trap") to active creation (the "Sovereign Sandbox") by utilizing air-gapped Large Language Models and AI-assisted engineering tools.

## 2. Dual Architecture
The project is built around two primary technical artifacts that interact to deliver both the curriculum and the practical assessment:

### A. The E-Learning Platform (React / Vite)
Located in `local-ai-architect-elearning/`, this is the interactive "frontend" module that guides the user through the curriculum.
*   **Tech Stack:** React, Vite, TailwindCSS, Lucide Icons.
*   **Aesthetic:** Premium dark mode, "glassmorphism," rich violet/fuchsia gradients, signifying the sophisticated nature of AI architecture.
*   **Curriculum Structure:**
    *   **Module 1 (Setup):** Configuring LM Studio for local inference.
    *   **Module 2 (Logic):** Integrating AI-native IDEs (Cursor/Zed).
    *   **Module 3 (Implement):** Using AI prompts to construct game logic.
    *   **Sandbox Embedded:** A React component (`SandboxEmbed.jsx`) that hosts the compiled Rust engine via WebAssembly within an iframe.
    *   **Knowledge Check:** End-of-module assessment.

### B. The Sovereign Sandbox (Rust / Bevy)
Located in `sovereign-sandbox/`, this is a fully functional 2D educational RPG acting as the practical "final exam" environment.
*   **Tech Stack:** Rust, Bevy (v0.15), WASM (`wasm32-unknown-unknown`).
*   **Compilation:** Designed to compile natively for desktop and to WebAssembly for browser embedding.
*   **Key Systems:**
    *   **Game States:** Boot sequences, interactive play.
    *   **Progression Model:** Novice to Grandmaster tracking via interaction and puzzle logic.
    *   **Knowledge Fragments:** In-game collectibles dispensing relevant educational theory.
    *   **Terminal Puzzles:** Interactive challenges simulating command-line interactions (e.g., triggering `ollama run`).
*   **Future Expansions (Native Build):** Direct API integration to a local LM Studio instance (`localhost:1234`) for dynamic NPC dialogue and Vector/HNSW memory stores.

## 3. The Delivery Pipeline
1. The Bevy specific code in the `sovereign-sandbox` is compiled to WASM.
2. The compiled `.wasm` output and necessary `/assets` are copied to the `public/sandbox/` directory of the React frontend.
3. The React app loads `game.html` securely via an `<iframe>` within the unified educational workflow.

## 4. The Philosophy of Sovereignty
By utilizing local models, the ecosystem guarantees a "Safe Failure Space." Students can experiment, break things, and explore code concepts without a remote corporate server logging their history, preserving complete data autonomy in the learning experience.
