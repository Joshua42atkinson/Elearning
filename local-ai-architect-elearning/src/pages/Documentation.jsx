import { FileText, ArrowLeft, Copyright, CheckSquare, BookOpen, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const contextMarkdown = `# Technical Bible: The Local AI Architect

## 1. Project Vision
"The Local AI Architect" is a comprehensive ecosystem designed to teach foundational AI engineering, emphasizing local-first deployment and absolute digital sovereignty. 

The core thesis is to move education from passive consumption (the "Textbook Trap") to active creation (the "Sovereign Sandbox") by utilizing air-gapped Large Language Models and AI-assisted engineering tools.

## 2. Dual Architecture
The project is built around two primary technical artifacts that interact to deliver both the curriculum and the practical assessment:

### A. The E-Learning Platform (React / Vite)
Located in \`local-ai-architect-elearning/\`, this is the interactive "frontend" module that guides the user through the curriculum.
*   **Tech Stack:** React, Vite, TailwindCSS, Lucide Icons.
*   **Aesthetic:** Premium dark mode, "glassmorphism," rich violet/fuchsia gradients, signifying the sophisticated nature of AI architecture.
*   **Curriculum Structure:**
    *   **Module 1 (Setup):** Configuring LM Studio for local inference.
    *   **Module 2 (Logic):** Integrating AI-native IDEs (Cursor/Zed).
    *   **Module 3 (Implement):** Using AI prompts to construct game logic.
    *   **Sandbox Embedded:** A React component (\`SandboxEmbed.jsx\`) that hosts the compiled Rust engine via WebAssembly within an iframe.
    *   **Knowledge Check:** End-of-module assessment.

### B. The Sovereign Sandbox (Rust / Bevy)
Located in \`sovereign-sandbox/\`, this is a fully functional 2D educational RPG acting as the practical "final exam" environment.
*   **Tech Stack:** Rust, Bevy (v0.15), WASM (\`wasm32-unknown-unknown\`).
*   **Compilation:** Designed to compile natively for desktop and to WebAssembly for browser embedding.
*   **Key Systems:**
    *   **Game States:** Boot sequences, interactive play.
    *   **Progression Model:** Novice to Grandmaster tracking via interaction and puzzle logic.
    *   **Knowledge Fragments:** In-game collectibles dispensing relevant educational theory.
    *   **Terminal Puzzles:** Interactive challenges simulating command-line interactions (e.g., triggering \`ollama run\`).
*   **Future Expansions (Native Build):** Direct API integration to a local LM Studio instance (\`localhost:1234\`) for dynamic NPC dialogue and Vector/HNSW memory stores.

## 3. The Delivery Pipeline
1. The Bevy specific code in the \`sovereign-sandbox\` is compiled to WASM.
2. The compiled \`.wasm\` output and necessary \`/assets\` are copied to the \`public/sandbox/\` directory of the React frontend.
3. The React app loads \`game.html\` securely via an \`<iframe>\` within the unified educational workflow.

## 4. The Philosophy of Sovereignty
By utilizing local models, the ecosystem guarantees a "Safe Failure Space." Students can experiment, break things, and explore code concepts without a remote corporate server logging their history, preserving complete data autonomy in the learning experience.`;

const designDocumentMarkdown = `# Design Document: The Local AI Architect (Sovereign Sandbox)
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
To appeal to an audience familiar with premium consumer software, the visual aesthetic employs Tailwind utility classes for modern, glass-morphic UI alongside a high-contrast palette (Phosphor Amber, Indigo, Dark Slate). This serves a dual purpose: it feels profoundly professional while visually separating the "magic" of the AI from standard institutional LMS interfaces.`;

const projectPlanMarkdown = `**Project Title:** The Local AI Architect: Building Educational Sandboxes for Active Imagination

**What is the problem that will be addressed?**

Modern education is stuck in the "Textbook Trap"—standardized, passive content that fails to engage student curiosity or leverage modern technology. There is a false narrative that creating immersive learning environments requires massive budgets or expert coding skills. This project addresses the lack of integration between generative technology and pedagogy by proving that the "cost of creativity" has vanished.

**Gap Analysis:**

Currently, educators function as passive consumers of vendor-locked software, limited by the "Creative Wall" of needing to know languages like C++ or Rust to build interactive worlds. The desired state is for educators to act as "Natural Language Architects" who use local AI as a bridge to turn vision into playable reality. This project bridges that gap by demonstrating a workflow that requires the same effort as writing a traditional lesson plan but results in a high-fidelity sandbox.

**Project Description:**

This project is an immersive eLearning module delivered via a curated YouTube series and a high-fidelity demonstration game. It showcases a "Local-First" workflow (Ollama/Claude) where natural language acts as the bridge between an educator's imagination and a playable sandbox. To move beyond "telling" and into "showing," the module includes a playable **Rust Bevy** game hosted at **consciousframework.com**, proving that sovereign, high-performance educational tools are now accessible to the individual creator.

**Roles and Responsibilities**

**Learning Designer:** Joshua Mark Atkinson
**Role:** Independent Educational Content Creator & Developer
**Responsibility:** Lead architect, narrator, and developer. I am responsible for the technical orchestration of the local AI Forge and the deployment of the Bevy-based "Proof of Excellence" demonstration.

**Primary Stakeholders (Audience):**

1. **K-12 Innovative Educators:** Visionaries who want to replace textbooks with "active imagination" sandboxes.  
2. **Home-School Parents:** Parents seeking private, "Social Scaffolding" environments that respect data sovereignty and focus on social engineering.  
3. **The Independent Ed-Tech Community:** Creators who need to see that the "technical barrier" to building educational games has finally been dismantled.

**Preliminary Project Details**

**Target Audience:**
Visionary educators and home-school parents ready to transition from software consumers to experience architects. This audience values active imagination and social engineering over rote memorization.

**Project Goal:**
By the end of this module, learners will be able to:
1. **Configure** a private, local AI environment (Ollama) to serve as a creative partner.  
2. **Orchestrate** "Mentor-in-the-Loop" interactions by converting natural language intent into functional NPC logic.  
3. **Validate** the efficacy of "Sovereign Ed-Tech" by interacting with a high-performance Bevy-based game demo on **consciousframework.com**.

**LMS Platform or Authoring Tool to be Used:**
* **YouTube Collection:** For "chunked" instructional delivery.  
* **consciousframework.com / ltdatkinson.com:** Hosting the Bevy WASM game and supplemental "Blueprints."  
* **Ollama / Claude-compatible Models:** The core local-AI technical stack.  
* **OBS Studio:** For "Visionary Broadcast" high-production screen capture.

**Description of Deliverables:**
1. **The "Architect's Collection" (Video Series):** Three 5-7 minute "Show, Don't Tell" videos:  
   * *Video 1: The Local Forge.* Zero-to-AI setup in under 5 minutes.  
   * *Video 2: From Intent to Logic.* Real-time prompt-to-script generation.  
   * *Video 3: The Sandbox Bridge.* Implementing logic into Minecraft and Roblox.  
2. **The "Sovereign Sandbox" Demo:** A playable Rust Bevy game (WASM) serving as the technical gold standard.  
3. **The Natural Language Blueprint:** A downloadable prompt guide for creating "Social Scaffolding."

**ID Reflection**
**How does learning about this topic apply to your future professional plans?**

I am positioning myself as a leader in "Sovereign Ed-Tech." By proving that building a game takes no more effort than writing a textbook, I am disrupting the traditional ID model. This project validates my ability to navigate high-level technical environments (Rust/Bevy) while centering the human, imaginative aspects of learning.`;

const reflectionMarkdown = `# Professional Reflection: The Sovereign Ed-Tech Architect
**Author:** Joshua Atkinson
**Course:** EDCI 56900-001-005 DIS - Merge
**Date:** February 2026

---

## 1. The Realization of an Architect & The Danger of Infinite Scope
Throughout the development of *The Local AI Architect*, a profound paradigm shift occurred in how I perceive the role of an Instructional Designer. I no longer view our field as merely organizing content for digital distribution; I recognize it as the engineering of entire cognitive environments. Learning how to fuse local, open-source AI with high-performance engines has proven a singular truth: building an interactive, personalized game now requires no more effort—and significantly less friction—than writing a traditional textbook chapter.

However, this absolute removal of the "technical wall" introduced the central conflict of my project: **Massive Scope Creep**. 

Because the AI could instantly generate boilerplate architecture, my initial, simple module spawned a massive, unintended side-tangent. I spent a significant portion of my development time building an MMO-Lit-RPG in Roblox called *Semantic Slime (The Phoenix Project)*. This tangent involved wiring up local client-server architecture, creating a "Logos Engine" that spawned elemental creatures based on Latin suffixes, and implementing an entire Gacha/Quest loop—all powered by AI generation.

While this proved my thesis—that a solo educator can now act as a AAA Game Director—it completely derailed the timeline of building a concise, 15-minute adult e-learning module. The primary lesson I learned is that when technical barriers vanish, the discipline of strict Instructional Design and rigorous "System Prompting" is more critical than ever. The ID must become the editor, cutting away the infinite possibilities the AI suggests to serve the specific learning objective.

## 2. Positioning within the Industry
As I look toward my future professional plans, this project (including the scope creep of *Semantic Slime*) serves as my manifesto and proof-of-concept for "Sovereign Ed-Tech." The current educational technology landscape is heavily reliant on vendor-locked, subscription-based, cloud-hosted platforms that treat student data as currency. My goal is to position myself as a leader who champions decentralization and data sovereignty in the classroom.

By demonstrating that complex logic and high-fidelity 3D sandbox environments can be spun up locally on off-the-shelf hardware, I am defining a niche where privacy, creativity, and pedagogy intersect. My professional trajectory will focus on empowering school districts and individual teachers to become independent creators of their own interactive worlds, unshackled from corporate software ecosystems.

## 3. The Future of Practice
This topic directly informs my next career phase: consulting for, or leading, exploratory Ed-Tech R&D teams. The specific skills acquired here—prompt-driven architecture, WASM browser compilation, and weaving educational theory (Constructivism) into game loops—will allow me to architect systems where the AI acts as a "co-teacher" rather than a replacement. The Sovereign Sandbox isn't just a final project; it is the foundational engine for my ongoing professional mission to make every educator a game designer by merely speaking their intent.

## 4. Overcoming Challenges
The most prominent challenge was not writing code, but restraining ambition. The pivot to compiling the Bevy engine into WebAssembly allowed a localized Rust back-end to execute smoothly in the browser, fulfilling the original goal of a seamless web experience. But it required me to abandon the sprawling Roblox architecture of *Semantic Slime* and return to the core competency of the EDCI 56900 assignment: delivering a focused instructional module on *how* to set up the tools, rather than just building the biggest game the tools could generate.

## 5. Evaluation of Design
If I were to evaluate this design against the initial rubric, its greatest strength is the pedagogical unity between the concept taught ("Sovereign AI Architecture") and the interactive elements used to teach it (incorporating real-time Local AI errors and autocomplete scaffolding into the React UI). 

Its glaring weakness during development was maintaining fidelity to the original Project Plan amidst the allure of AI-generated mechanics. Implementing strict COSTAR system prompts and relying heavily on the *Design Document* as a rigid constitution ensures that the learner's journey remains predictable and aligned with the learning outcomes. Continuous playtesting and disciplined project management will be my focus for future iterations.`;

const copyrightMarkdown = `# Copyright and Permissions Statement

** Project:** The Local AI Architect: Building Educational Sandboxes Without Code
    ** Author:** Joshua Atkinson
        ** Course:** EDCI 56900-001-005 DIS - Merge
            ** Date:** February 2026

This document serves as the formal copyright and permissions declaration for all visual, audio, software, and branding assets utilized within the "Local AI Architect" e - learning module and the accompanying "Sovereign Sandbox" demonstration game.

## 1. Visual Assets(Images & Textures)

All 2D textures and visual assets utilized within the Bevy game engine demo(\`forge-web/index.html\` and the Rust source code) were generated using Artificial Intelligence image generation tools.

* \`assets/floor.jpg\`: Generated via Midjourney v6. License: CC0 / Public Domain.
* \`assets/wall.jpg\`: Generated via Midjourney v6. License: CC0 / Public Domain.
* \`assets/player.jpg\`: Generated via Midjourney v6. License: CC0 / Public Domain.
* \`assets/player_walk_2.jpg\`: Generated via Midjourney v6. License: CC0 / Public Domain.
* \`assets/teacher.jpg\`: Generated via Midjourney v6. License: CC0 / Public Domain.

**Permission Status:** These images were generated specifically for this educational project. Under current US Copyright Office guidelines regarding AI-generated imagery, these assets exist in the public domain and/or are free for commercial and educational use without requirement for external attribution or royalty payments.

## 2. Audio Assets

* \`assets/jfk.wav\`: Historical speech audio of President John F. Kennedy. Source: National Archives / Public Domain.

**Permission Status:** This audio file consists of historical, public domain speech audio processed for educational demonstration within the sandbox environment. As a work of the United States federal government/historical public address, the underlying speech is in the public domain.

## 3. Software, Engines, and Libraries

The module heavily relies on open-source frameworks. No proprietary, closed-source educational software (such as standard vendor-locked LMS platforms) was used, aligning with the "Sovereign Ed-Tech" pedagogical goal.

* **Bevy Engine:** The game demonstration is built using Bevy, a data-driven game engine built in Rust.
  * **License:** Dual-licensed under MIT and Apache 2.0. Free for commercial and educational use.
* **Rust Programming Language:**
  * **License:** Dual-licensed under MIT and Apache 2.0.
* **Tailwind CSS & Lucide Icons:** Used for the frontend design of the Learning Management System wrapper (\`index.html\`).
  * **License:** MIT License (Tailwind) and ISC License (Lucide). Free for use.
* **Ollama / Moshi (Local AI Models):** Used for the natural language processing logic.
  * **License:** Open-weights licenses applicable to the specific models utilized locally; fully permissible for offline educational application.

## 4. Original Content & Branding

All instructional text, pedagogical frameworks ("Natural Language Architect", "Sovereign Sandbox"), video scripts, frontend HTML structure, and the Rust integration logic (\`src/*.rs\`) are the original work of Joshua Atkinson.

**Permission Status:** Copyright © 2026 Joshua Atkinson. All rights reserved for the original instructional design components, though the underlying code templates are shared freely for educational evaluation.`;

export default function Documentation() {
    const [activeTab, setActiveTab] = useState('design');

    const tabs = [
        { id: 'design', name: 'Design Document', icon: <FileText size={18} /> },
        { id: 'plan', name: 'Project Plan', icon: <CheckSquare size={18} /> },
        { id: 'reflection', name: 'ID Reflection', icon: <BrainCircuit size={18} /> },
        { id: 'bible', name: 'Technical Bible', icon: <BookOpen size={18} /> },
        { id: 'copyright', name: 'Copyright & Permissions', icon: <Copyright size={18} /> }
    ];

    return (
        <div className="w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">

            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-white">Project Documentation</h1>
                <p className="text-slate-300 max-w-2xl mx-auto">
                    EDCI 56900 Final Project Requirements and Reflections.
                </p>
            </div>

            <div className="flex border-b border-white/10 mb-6 overflow-x-auto hide-scrollbar whitespace-nowrap">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === tab.id
                            ? 'text-violet-400 border-b-2 border-violet-400'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        {tab.icon} {tab.name}
                    </button>
                ))}
            </div>

            <div className="glass-panel p-8 min-h-[500px] overflow-auto prose prose-invert prose-violet max-w-none">

                {activeTab === 'design' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="glass-panel p-6 bg-slate-950/50 border-violet-500/20">
                            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed font-medium">
                                {designDocumentMarkdown}
                            </pre>
                        </div>
                    </div>
                )}

                {activeTab === 'plan' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="glass-panel p-6 bg-slate-950/50 border-violet-500/20">
                            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed font-medium">
                                {projectPlanMarkdown}
                            </pre>
                        </div>
                    </div>
                )}

                {activeTab === 'reflection' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="glass-panel p-6 bg-slate-950/50 border-violet-500/20">
                            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed font-medium">
                                {reflectionMarkdown}
                            </pre>
                        </div>
                    </div>
                )}

                {activeTab === 'bible' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="glass-panel p-6 bg-slate-950/50 border-violet-500/20">
                            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed font-medium">
                                {contextMarkdown}
                            </pre>
                        </div>
                    </div>
                )}

                {activeTab === 'copyright' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="glass-panel p-6 bg-slate-950/50 border-violet-500/20">
                            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed font-medium">
                                {copyrightMarkdown}
                            </pre>
                        </div>
                    </div>
                )}

            </div>

            <div className="flex justify-start pt-8 border-t border-white/10">
                <Link to="/knowledge-check" className="glass-button text-slate-400 hover:text-white">
                    <ArrowLeft size={20} /> Back to Knowledge Check
                </Link>
            </div>

        </div>
    );
}
