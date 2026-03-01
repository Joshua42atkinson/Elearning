---
description: Finalizing and deploying the Sovereign Sandbox with pedagogical relevance and technical polish.
---

// turbo-all

This workflow ensures the Bevy WASM game is built, optimized, and deployed to the E-Learning site while maintaining visual isomorphism and pedagogical alignment.

### 1. Pedagogical Relevance Audit
- [ ] Review `local-ai-architect/sovereign-sandbox/assets/syllabus/module_1.toml`
- [ ] Ensure `KnowledgeFragment` text aligns with the "Local AI" and "Privacy" themes
- [ ] Verify that the Teacher NPC dialogue introduces **Constructionism** and **ZPD** correctly

### 2. Technical Debt Relief
- [ ] Run `cargo check` in the sandbox directory
- [ ] Address all non-trivial compiler warnings (unused variables, dead code)
- [ ] Verify `Cargo.toml` has the `[profile.release]` optimizations active

### 3. Visual Isomorphism Check
- [ ] Confirm `ClearColor` in `main.rs` is Slate-900: `Color::srgb(0.02, 0.02, 0.04)`
- [ ] Confirm UI elements in `knowledge_popup.rs` and `title_screen.rs` use the Violet/Indigo palette
- [ ] Ensure `Inter-Regular.ttf` is being used for all on-screen text

### 4. Build & Transpile
- [ ] Run the production build:
  ```bash
  cargo build --release --target wasm32-unknown-unknown
  ```
- [ ] Run `wasm-bindgen` with the web target:
  ```bash
  wasm-bindgen --target web --no-typescript --out-dir wasm_out target/wasm32-unknown-unknown/release/sovereign-sandbox.wasm
  ```

### 5. Deployment Synchronization
- [ ] Copy binary to frontend: `cp wasm_out/* ../local-ai-architect-elearning/public/sandbox/wasm/`
- [ ] Copy assets to frontend: `cp -r assets/* ../local-ai-architect-elearning/public/sandbox/assets/`
- [ ] Final Vercel push: `git commit -m "deploy: Sovereign Sandbox release update [isomorphic]" && git push origin main`

### 6. Live Verification
- [ ] Open the production URL in the browser
- [ ] Navigate through the "Watch, Play, Read" sections
- [ ] Verify the "Initialize Sandbox" button loads the updated Bevy engine
