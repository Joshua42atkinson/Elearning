# Design Document: The Local AI Architect (Sovereign Sandbox)
**Author:** Joshua Atkinson
**Course:** EDCI 56900-001-005 DIS - Merge
**Date:** February 2026

---

## 1. Executive Summary
This design document outlines the pedagogical framework, visual design decisions, and system architecture for *The Local AI Architect*. This e-learning module introduces educators to "Sovereign Ed-Tech"—the practice of utilizing locally hosted, off-grid Artificial Intelligence (LLMs like Ollama) to translate natural language into interactive educational sandbox logic without writing manual code.

## 2. Front-End Analysis & The Technical Wall
Based on the Front-End Analysis identifying a profound lack of coding skills among general educators, this project was designed to bypass traditional syntax requirements entirely. The analysis concluded that the primary barrier to immersive, game-based learning (like Roblox or custom engines) is the steep learning curve of programming languages (Lua, C#, Rust). 

**The Solution:** Initially conceived as a module for Articulate Rise 360 or Google Sites, this project pivoted to a fully integrated Bevy/WASM game environment wrapper. The Bevy engine was specifically integrated with a local AI layer (Ollama) to allow educators to dictate rules, interactions, and logic using natural language (the "Natural Language Blueprint"), delivering an immersive learning experience directly comparable to the technical ecosystems they will use in the field.

## 3. Pedagogical Grounding

### A. Constructivism & Constructionism
The module embraces a Papertian Constructionist approach: learning happens most effectively when the learner is engaged in constructing a public entity (a game or model). Instead of the "Textbook Trap" of passive consumption, the Sovereign Sandbox requires educators to actively build their environments, shifting them from consumers of Ed-Tech to architects of their own tools.

### B. Self-Determination Theory (SDT)
To maximize intrinsic motivation within the 15-20 minute learning flow, the module supports the three pillars of SDT:
* **Autonomy:** The sandbox environment allows complete freedom to define rules and behaviors via open-text AI prompts.
* **Competence:** The zero-to-AI setup removes complex code compilation steps, providing immediate visual feedback in the browser and fostering a rapid sense of mastery.
* **Relatedness:** The underlying narrative structure of "The Mentor-in-the-Loop" ensures learners feel connected to a structured, human-centric teaching process, even while partnering with AI.

## 4. Technical & Visual Architecture

### A. The LMS Wrapper (forge-web)
The web wrapper was engineered not just as a host, but as a deliberate instructional progression. The user path is divided strictly into Watch, Play, and Read segments to satisfy the asynchronous, self-paced requirement without instructor intervention.

### B. The Sovereign Sandbox (Bevy WASM Engine)
The core assessment block utilizes the Bevy engine compiled to WebAssembly. This allows a high-performance Rust game loop to execute directly in the browser, fulfilling the requirement for immediate, frictionless access. 

### C. Design Aesthetics & "The Matrix-Rust Cyberpunk"
To appeal to an audience familiar with premium consumer software, the visual aesthetic employs Tailwind utility classes for modern, glass-morphic UI alongside a high-contrast palette (Phosphor Amber, Indigo, Dark Slate). This serves a dual purpose: it feels profoundly professional while visually separating the "magic" of the AI from standard institutional LMS interfaces.
