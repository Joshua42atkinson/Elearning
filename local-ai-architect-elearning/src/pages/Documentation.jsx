import { FileText, ArrowLeft, Copyright, CheckSquare, BookOpen, BrainCircuit, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import StoryboardView from '../components/StoryboardView';

const contextMarkdown = `# Technical Bible: The Local AI Forge

## 1. Project Vision
"The Local AI Forge" is a comprehensive ecosystem designed to teach foundational AI engineering, emphasizing local-first deployment and absolute digital sovereignty. 

The core thesis is to move education from passive consumption (the "Textbook Trap") to active creation (the "Sovereign Sandbox") by utilizing air-gapped Large Language Models as a private "Scaffolding" layer.

## 2. Dual Architecture
The project is built around two primary technical artifacts that interact to deliver both the curriculum and the practical assessment:

### A. The E-Learning Platform (React / Vite)
Located in \`local-ai-architect-elearning/\`, this is the interactive "frontend" module that guides the user through the curriculum.
*   **Tech Stack:** React, Vite, TailwindCSS, Lucide Icons.
*   **Branding:** Premium dark mode, "glassmorphism," rich violet/fuchsia gradients.
*   **Curriculum Structure:**
    *   **Module 1 (The Forge):** Configuring LM Studio and the JS Sandbox.
    *   **Module 2 (The Loop):** IDE Integration, the Technical Bible, and the Evaluative Loop.
    *   **Module 3 (The Archetype):** COSTAR prompting and Jungian Archetype NPCs.
    *   **The Architect's Gallery:** Museum of Mechanics showcasing open-source Rust engines.
    *   **Sandbox Embedded:** Hosting the compiled Rust engine via WebAssembly.

### B. The Sovereign Sandbox (Rust / Bevy)
Located in \`sovereign-sandbox/\`, this is a fully functional 2D educational RPG acting as the practical "final exam" environment.
*   **Tech Stack:** Rust, Bevy (v0.15), WASM (\`wasm32-unknown-unknown\`).
*   **Key Systems:**
    *   **The Secure Loop:** Local-first inference ensuring zero data leakage.
    *   **Archetypal NPCs:** 12 NPCs based on Jungian archetypes providing social scaffolding.
    *   **The Natural Language Blueprint:** Using the Technical Bible to delegate logic to AI.

## 3. The Master Prompting Blueprint (COSTAR)
To maintain consistency across the architecture, all AI interactions follow the COSTAR protocol:
*   **Context:** Establishing the pedagogical intent and the 2D sandbox environment.
*   **Objective:** Clear, measurable learning goals (e.g., "Student must explain mutualism").
*   **Style:** Mentor-based instructional delivery.
*   **Tone:** Encouraging, supportive, and intellectually curious.
*   **Audience:** K-12 students (primarily middle/high school).
*   **Response:** Specific data formats (JSON/Markdown) for engine integration.

## 4. The Pedagogical Matrix
| Phase | Theory | Implementation |
| :--- | :--- | :--- |
| **Setup** | Data Sovereignty | Local LM Studio Instance |
| **Logic** | ZPD / Scaffolding | AI-Native IDE (Zed/Cursor) |
| **Impact** | Constructionism | Sovereign Sandbox (Bevy WASM) |
| **Refinement** | Evaluative Loop | Testing in Roblox Studio |

## 5. The Philosophy of Sovereignty
By utilizing local models, the ecosystem guarantees a "Safe Failure Space." Students can experiment, break things, and explore code concepts without a remote corporate server logging their history, preserving complete data autonomy in the learning experience.`;

const designDocumentMarkdown = `# Design Document: The Local AI Forge (Sovereign Sandbox)
**Author:** Joshua Atkinson
**Course:** EDCI 56900-001-005 DIS - Merge
**Date:** February 2026

---

## 1. Executive Summary
This design document outlines the pedagogical framework, visual design decisions, and system architecture for *The Local AI Forge*. This module introduces educators to "Sovereign Ed-Tech"—the practice of utilizing locally hosted, off-grid Artificial Intelligence (LM Studio) to translate natural language into interactive educational sandbox logic.

## 2. Front-End Analysis & The Technical Wall
Analysis identified a profound lack of coding skills among general educators. The solution pivots from traditional syntax to a fully integrated **Bevy/WASM** engine.

**The Solution:** The Local AI Forge allows educators to act as **Experience Architects**. By delegating the heavy lifting of code (Rust/Bevy) to a local AI assistant via a **Technical Bible**, they can focus on pedagogy, lore, and student engagement rather than debugging syntax.

## 3. Pedagogical Grounding

### A. Constructivism & Constructionism
The module embraces a Papertian Constructionist approach: learning happens most effectively when building public entities. The **Sovereign Sandbox** requires educators to actively build their environments, shifting from consumers to designers.

### B. Self-Determination Theory (SDT)
* **Autonomy:** Complete freedom to define rules via open-text AI prompts and the **COSTAR** framework.
* **Competence:** The zero-setup "JS Sandbox" in LM Studio provides immediate feedback, fostering rapid mastery.
* **Relatedness:** Utilizing **Jungian Archetypes** for NPCs creates a social scaffold, connecting individual choice to communal narrative.

## 4. Technical & Visual Architecture

### A. The Evaluative Loop
A central design decision was the implementation of the **Evaluative Loop**. We move from code generation to testing in **Roblox Studio**, where the architect evaluates if the output meets the pedagogical intent. 

### B. Aesthetic: The High-Fidelity Forge
The visual design uses glass-morphic UI and high-contrast palettes (Indigo/Violet/Fuchsia) to differentiate this premium "Forge" from standard institutional LMS interfaces. The design itself is **isomorphic**, demonstrating the theories (like Scaffolding) through interactive UI elements.`;

const projectPlanMarkdown = `**Project Title:** The Local AI Forge: Building Educational Sandboxes for Active Imagination

**The Problem:**
Modern education is stuck in the "Textbook Trap"—passive content that fails to engage curiosity. Educators are often software consumers, limited by the "Creative Wall."

**The Solution:**
This project bridges the gap by proving that the "cost of creativity" has vanished. Educators act as **Experience Architects**, using local AI to turn vision into playable reality.

**Project Goal:**
By the end of this module, learners will:
1.  **Configure** a private, local AI "Forge" (LM Studio) with a JS Sandbox.
2.  **Orchestrate** "Mentor-in-the-Loop" interactions via a **Technical Bible**.
3.  **Validate** "Sovereign Ed-Tech" via the **Sovereign Sandbox** (Bevy WASM) and the **Evaluative Loop** (Roblox Studio).

**Deliverables:**
1.  **The Architect's Collection (Video Series):** Three "Show, Don't Tell" broadcasts.
2.  **The Sovereign Sandbox Demo:** A high-performance Rust Bevy game (WASM).
3.  **The Teacher Toolkit:** Hardware checklists, Admin scripts, and COSTAR Cheat Sheets.

**ID Reflection:**
I am positioning myself as a leader in "Sovereign Ed-Tech." By proving that building a game takes no more effort than writing a textbook, I am disrupting the traditional ID model, centering the human, imaginative aspects of learning.`;

const reflectionMarkdown = `# Professional Reflection: The Sovereign Ed-Tech Architect

## 1. The Realization of an Architect
Throughout the development of *The Local AI Forge*, I recognized that Instructional Design is the engineering of cognitive environments. Learning how to fuse local AI with high-performance engines proves that building an interactive game now requires less friction than writing a traditional textbook chapter.

## 2. Managing Scope & The Archetype Pivot
Removal of the "technical wall" introduced significant scope considerations. My initial module evolved with the inclusion of **Jungian Archetypes** for NPC logic, creating a "social scaffold." I learned that as barriers vanish, the discipline of strict ID and rigorous **COSTAR** prompting is more critical than ever. The ID must become the editor, cutting away infinite possibilities to serve the specific objective.

## 3. Position: Sovereign Ed-Tech
This project is my manifesto for decentralization. While the industry relies on vendor-locked, subscription-based cloud platforms, I champion **Local-First** sovereignty. By demonstrating that high-fidelity sandboxes can be spun up on off-the-shelf hardware, I am defining a niche where privacy, creativity, and pedagogy intersect.

## 4. The Evaluative Loop
The most prominent technical challenge was closing the **Evaluative Loop**. Moving between the Bevy WASM engine and Roblox Studio testing allowed me to refine my pedagogical intent. The "Sovereign Sandbox" isn't just a final project; it's the foundational engine for my mission to make every educator a game designer by merely speaking their intent.`;

const copyrightMarkdown = `# Copyright and Permissions Statement

**Project:** The Local AI Forge
**Author:** Joshua Atkinson

## 1. Visual Assets
All 2D textures and visual assets within the Bevy demo and the React frontend were generated using AI tools (Midjourney v6). Under current guidelines, these exist in the public domain and are free for educational use.

## 2. Software & Engines
- **Bevy Engine:** MIT / Apache 2.0.
- **Rust Language:** MIT / Apache 2.0.
- **Tailwind & Lucide:** MIT / ISC License.
- **LM Studio:** Open-weights licenses applicable to local models.

## 3. Original Content
All instructional text, pedagogical frameworks (**Local AI Forge**, **Evaluative Loop**, **Technical Bible**), video scripts, and integration logic are the original work of Joshua Atkinson.

**Permission Status:** Copyright © 2026 Joshua Atkinson. All rights reserved for instructional components. Shared freely for educational evaluation.`;

export default function Documentation() {
    const [activeTab, setActiveTab] = useState('design');

    const tabs = [
        { id: 'design', name: 'Design Document', icon: <FileText size={18} /> },
        { id: 'storyboard', name: 'Storyboard', icon: <Film size={18} /> },
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
                        <div className="glass-panel p-6 bg-slate-950/50 border-violet-500/20 prose prose-invert prose-violet max-w-none prose-sm">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {designDocumentMarkdown}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

                {activeTab === 'storyboard' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        <StoryboardView />
                    </div>
                )}

                {activeTab === 'plan' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="glass-panel p-6 bg-slate-950/50 border-violet-500/20 prose prose-invert prose-violet max-w-none prose-sm">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {projectPlanMarkdown}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

                {activeTab === 'reflection' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="glass-panel p-6 bg-slate-950/50 border-violet-500/20 prose prose-invert prose-violet max-w-none prose-sm">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {reflectionMarkdown}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

                {activeTab === 'bible' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="glass-panel p-6 bg-slate-950/50 border-violet-500/20 prose prose-invert prose-violet max-w-none prose-sm">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {contextMarkdown}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

                {activeTab === 'copyright' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="glass-panel p-6 bg-slate-950/50 border-violet-500/20 prose prose-invert prose-violet max-w-none prose-sm">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {copyrightMarkdown}
                            </ReactMarkdown>
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
