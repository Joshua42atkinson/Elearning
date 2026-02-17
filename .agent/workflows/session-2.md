---
description: Workflow for Session 2 - The Logic Engine (Module 1 Interactive)
version: 1.0
tags: [session-2, logic-engine, setup]
---

# Session 2: The Logic Engine Workflow

This workflow guides the implementation of the Module 1 interactive elements.

## Phase 1: Interactive UI Components
1.  **Refine `index.html`**:
    -   Update structure to support the "Rent vs Own" split pane.
    -   Insert the "Air-Gap" toggle switch.
2.  **Styling Implementation (`styles.css`)**:
    -   Implement `split-pane` class.
    -   Implement `toggle-switch` using `var(--industrial-rust)` and `var(--status-green)`.
    -   Ensure `font-family` follows `styling.md`.

## Phase 2: Logic & Simulation (`script.js`)
1.  **Terminal Logic**:
    -   Create `Terminal` class.
    -   Implement `typeText()` function for simulating output.
    -   Listen for user input of `ollama run llama3`.
2.  **State Management**:
    -   Track "Air-Gap" status.
    -   Update UI elements based on status changes.

## Phase 3: Verification
1.  **Browser Check**:
    -   // turbo
    -   Use `open_browser` to view `forge-web/index.html`.
    -   Take screenshot of initial state.
    -   Take screenshot of "Air-Gap" active state.
