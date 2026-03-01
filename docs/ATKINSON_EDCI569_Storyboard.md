# E-Learning Storyboard: The Local AI Architect

**Student:** Joshua Atkinson  
**Course:** EDCI 56900-001-005 — DIS Merge  
**Date:** February 2026  
**Project:** The Local AI Architect: Building Educational Sandboxes Without Code

---

## Table of Contents

1. [Video Storyboards](#part-1-video-storyboards)
   - [Video 1: The Local Forge (Setup)](#video-1-the-local-forge-setup)
   - [Video 2: From Intent to Logic](#video-2-from-intent-to-logic)
   - [Video 3: The Sandbox Bridge (Implementation)](#video-3-the-sandbox-bridge-implementation)
2. [E-Learning System Storyboard](#part-2-e-learning-system-storyboard)
3. [The Interaction Blueprint](#part-3-the-interaction-blueprint)
4. [ID Reflection](#part-4-id-reflection)

---

## Part 1: Video Storyboards

### Video 1: The Local Forge (Setup)

**Duration:** 5–7 minutes  
**Focus:** Zero-to-AI setup — downloading and configuring LM Studio for private, local inference.  
**Tone:** Calm, helpful, and straightforward.  
**Tools Demonstrated:** LM Studio, OBS Studio (screen capture)  
**Delivery:** YouTube with closed captions + downloadable transcript (ADA 508)

#### Learning Objectives (Module 1)

By the end of this video, learners will be able to:

1. **Explain** why running AI locally protects student data privacy.
2. **Download and configure** LM Studio on their own computer.
3. **Demonstrate** that the AI works offline — without internet.

#### Scene-by-Scene Storyboard

| Scene | Time | Visual / Screen Capture | Audio / Narration Script | Gagné's Instructional Event | Pedagogical Theory |
|:------|:-----|:------------------------|:-------------------------|:---------------------------|:-------------------|
| **01: The Goal** | 0:00–0:45 | The e-learning landing page is visible. A contrast is shown: a static worksheet vs. a student engaged in an interactive game world. | *"We all want our students to be active participants in their learning, not just passive readers. Today, we're going to set up a private assistant that helps you build those active experiences — right from your own computer."* | **Gain Attention** | Constructionism — framing the shift from passive consumption to active creation. |
| **02: The Tool** | 0:45–1:45 | Browser navigates to [lmstudio.ai](https://lmstudio.ai). The homepage is shown briefly. LM Studio is opened (pre-installed). The model search/download screen is displayed with a model already downloaded (e.g., Llama 3 8B or Mistral 7B). | *"Our first tool is called LM Studio. It's a free, visual application that lets you download and run AI models directly on your own machine. No accounts, no subscriptions, no cloud. Think of it as downloading any other app — it's that simple."* | **Inform Objective** | Cognitive Load Theory — the GUI removes the intimidation of terminal commands, reducing extraneous cognitive load. |
| **03: The First Conversation** | 1:45–3:15 | LM Studio's chat tab is open. A model is loaded. The instructor types an educator-relevant prompt: *"How can I explain the water cycle to a 4th grader using a fun analogy?"* The response streams in. | *"Once it's set up, we just start talking. I'll ask it something any teacher might ask. Watch — it's thinking, and now it's responding. This entire conversation is happening right here, on this computer. No data is going anywhere."* | **Stimulate Recall** | Self-Determination Theory (Competence) — immediate feedback loop builds a rapid sense of mastery. |
| **04: The Offline Proof** | 3:15–4:45 | The instructor visibly navigates to Wi-Fi/network settings and **disconnects**. Returns to LM Studio and types a new prompt: *"Write a short story about a brave rabbit who learns about gravity."* The AI responds normally. | *"Now here's the part that changes everything. I'm turning off my Wi-Fi. Watch — no internet. I'll ask something new. And look: it still works. Your ideas, your students' data — none of it ever leaves this machine. It's safe, it's private, and it's yours."* | **Present Stimulus** | Self-Determination Theory (Autonomy) — the "Wi-Fi off" moment is the proof of ownership and control. Data Sovereignty in action. |
| **05: Looking Ahead** | 4:45–5:30 | Transition back to the e-learning platform showing the Module 2 preview. Wi-Fi is casually reconnected in the background. | *"Now that your private assistant is ready and running, we've completed the hardest part — the setup. In the next module, we'll start connecting this AI to professional tools so it can help you build logic for interactive experiences. See you there."* | **Enhance Retention** | Previewing the next module reinforces the learning path and motivates continued engagement. |

#### Key Production Notes

- **OBS Scenes:** Two pre-configured scenes — (1) Full desktop for browser/download shots, (2) LM Studio window capture for the chat demo. Switch with hotkey.
- **Critical:** The AI model must be **fully loaded** before disconnecting Wi-Fi. LM Studio cannot reload a model without the filesystem being ready.
- **Prompt Choice:** Select prompts the target audience (K-12 educators) would genuinely find useful. This builds relatedness to their daily work.
- **ADA 508:** Closed captions generated via YouTube auto-caption + manual review. Downloadable transcript linked on Module 1 page.

---

### Video 2: From Intent to Logic

**Duration:** 5–7 minutes  
**Focus:** Connecting LM Studio's local server to code editors (Cursor/Zed) and translating natural language into game behaviors.  
**Tone:** Collaborative and practical.  
**Tools Demonstrated:** LM Studio (Server Mode), Cursor IDE or Zed Editor  
**Delivery:** YouTube with closed captions + downloadable transcript (ADA 508)

#### Learning Objectives (Module 2)

By the end of this video, learners will be able to:

1. **Start** LM Studio's local API server and understand what `localhost` means.
2. **Connect** a code editor (Cursor or Zed) to their private AI server.
3. **Describe** how AI scaffolding relates to Vygotsky's Zone of Proximal Development.

#### Scene-by-Scene Storyboard

| Scene | Time | Visual / Screen Capture | Audio / Narration Script | Gagné's Instructional Event | Pedagogical Theory |
|:------|:-----|:------------------------|:-------------------------|:---------------------------|:-------------------|
| **01: The Concept** | 0:00–0:45 | A simple lesson plan visible on screen about "Ecosystems." The instructor recalls the setup from Video 1. | *"You already have great lesson plans. Usually, these stay on paper. But what if we could turn those ideas into rules for a digital world? In the last module, we set up our private assistant. Now, let's connect it to a workspace where it can help us build."* | **Stimulate Recall** | Connecting to prior knowledge — reinforcing the foundation built in Module 1. |
| **02: The Local Server** | 0:45–2:00 | LM Studio is open. The instructor navigates to the "Server" tab and clicks "Start Server." The terminal output shows `localhost:1234` listening. A brief explanation of what `localhost` means appears. | *"LM Studio isn't just a chat window — it can act as an API server. I click 'Start Server' and now my computer is hosting its own AI endpoint at localhost:1234. That just means 'this computer, talking to itself.' Nothing goes to the internet."* | **Present Stimulus** | Scaffolding (Vygotsky) — demystifying technical concepts (`localhost`, API) through simple metaphors. |
| **03: Connecting the IDE** | 2:00–3:30 | The instructor opens Cursor (or Zed). In the settings/configuration panel, they override the API endpoint URL with `http://localhost:1234/v1`. The editor's AI features activate — autocompletion and inline suggestions begin working. | *"Now I open Cursor, my code editor. In settings, I just point it to my local server URL. And now — watch — the editor's AI is powered by MY model. Every suggestion, every autocompletion, is running privately on my hardware."* | **Learning Guidance** | Zone of Proximal Development — the AI acts as the "More Knowledgeable Other," providing contextual help precisely when needed. |
| **04: The Prompt** | 3:30–5:00 | Inside the editor, the instructor types a natural language prompt (using comments or an AI chat panel): *"I'm teaching about ecosystems. Help me write a set of rules for a game NPC that explains how bees help flowers."* The AI generates clear If/Then logic statements. | *"We don't need a programming language. We just explain what we want. See how the AI responded? It took the lesson and turned it into clear steps: 'If a bee visits a flower, then the flower can grow.' This is the bridge between your imagination and a playable game."* | **Elicit Performance** | Cognitive Load Theory — the AI handles the extraneous load of syntax, allowing the educator to focus on germane load (pedagogical design). |
| **05: Refinement** | 5:00–5:45 | The instructor adds a follow-up: *"Make the character say 'Thank you' when the player helps."* The AI refines the output. The instructor copies the generated logic. | *"If it's not quite right, we just ask for a change. It's a simple back-and-forth until the logic matches exactly what you want your students to experience. With our rules written down in plain language, we're ready to bring them to life."* | **Provide Feedback** | Mentor-in-the-Loop — the iterative prompt-response cycle mirrors a mentoring relationship. |

#### Key Production Notes

- **OBS Scenes:** (1) LM Studio server tab, (2) Cursor/Zed editor with AI panel visible. Split-screen layouts are effective here to show the "two programs talking."
- **localhost Explanation:** Keep it to one sentence. The audience is non-technical. Use the metaphor: *"It's just your computer having a private conversation with itself."*
- **If using Cursor:** Show the Settings → Models → OpenAI-compatible → `http://localhost:1234/v1` configuration path.

---

### Video 3: The Sandbox Bridge (Implementation)

**Duration:** 5–7 minutes  
**Focus:** Moving AI-generated logic into interactive environments. Demonstrating the COSTAR prompting framework and the Sovereign Sandbox.  
**Tone:** Clear, successful, and empowering.  
**Tools Demonstrated:** LM Studio, Roblox Studio (or Bevy demonstration), the e-learning Sandbox page  
**Delivery:** YouTube with closed captions + downloadable transcript (ADA 508)

#### Learning Objectives (Module 3)

By the end of this video, learners will be able to:

1. **Write** a structured COSTAR prompt to generate game logic from natural language.
2. **Explain** how Constructivism applies to prompt-driven creation.
3. **Use** AI to translate a lesson plan into interactive sandbox behavior.

#### Scene-by-Scene Storyboard

| Scene | Time | Visual / Screen Capture | Audio / Narration Script | Gagné's Instructional Event | Pedagogical Theory |
|:------|:-----|:------------------------|:-------------------------|:---------------------------|:-------------------|
| **01: The Space** | 0:00–0:45 | A basic, colorful world in a game engine (e.g., Roblox Studio or the Sovereign Sandbox running in the browser at consciousframework.com). | *"This is our digital classroom. It's a place where students can explore. Right now it's just a world — but we're about to give it a purpose."* | **Present Stimulus** | Constructionism (Papert) — the sandbox is the "public artifact" the learner will construct. |
| **02: The COSTAR Framework** | 0:45–2:30 | The instructor shows a split view: on one side, a blank prompt window; on the other, a filled COSTAR template. Each element is highlighted as it's discussed: **C**ontext, **O**bjective, **S**tyle, **T**one, **A**udience, **R**esponse. | *"Instead of just typing 'make an NPC,' we use a simple framework called COSTAR. It stands for Context, Objective, Style, Tone, Audience, and Response. Watch how much better the output gets when we structure our intent."* | **Learning Guidance** | COSTAR Framework — structured prompting transforms vague intent into precise, usable educational architecture. Reduces cognitive load by providing a template. |
| **03: The Action** | 2:30–4:00 | The AI-generated logic (from Video 2 or a new COSTAR prompt) is pasted into a script box in the game engine. An NPC is configured with the new behavior rules. The instructor shows the before (empty NPC) and after (functional NPC). | *"We take the rules we wrote with our assistant and place them into a character. Because the AI handled the technical translation, we stayed focused on the teaching. This is the Sandbox Bridge — from your imagination to a playable world."* | **Assess Performance** | Constructivism — the educator is constructing knowledge by building a functional artifact. The "technical wall" has been removed. |
| **04: The Play** | 4:00–5:15 | A player walks up to the configured NPC. The interaction works as planned — the NPC responds according to the defined logic. Multiple quick examples flash on screen (History, Math, Science scenarios). | *"Now the lesson is alive. When a student interacts with this world, they aren't just reading about a concept — they are experiencing it. And if you can describe a learning experience, you can build one. The technical barrier has finally disappeared."* | **Enhance Transfer** | Transfer of learning — showing multiple subject examples demonstrates that the workflow applies universally, not just to one topic. |
| **05: The Impact** | 5:15–6:00 | Return to the e-learning platform. Show the Sovereign Sandbox running in the browser. A brief tour of the Sandbox page's "Watch, Play, Read" structure. The downloadable Natural Language Blueprint is highlighted. | *"You are now an Experience Architect. You've gone from downloading an AI to building a functional, interactive classroom — all with natural language. The tools are free. The data is yours. And the only limit is your imagination."* | **Enhance Retention** | Self-Determination Theory (all three pillars) — Autonomy (you own the tools), Competence (you built something real), Relatedness (you're part of a community of architect-educators). |

#### Key Production Notes

- **COSTAR Display:** Consider a brief overlay graphic or a text card showing the COSTAR acronym. This visual aid reinforces the framework.
- **Game Engine Choice:** Roblox Studio is the most relatable for the target audience. If using the Bevy Sovereign Sandbox, emphasize that it runs in the browser — no installation needed.
- **Empowerment Close:** End on the strongest emotional note. The final message should leave the learner feeling capable, not overwhelmed.

---

## Part 2: E-Learning System Storyboard

The e-learning platform is a React/Vite web application hosted at **consciousframework.com**. It delivers the full instructional experience through a structured, self-paced flow:

**Aesthetic:** Premium dark mode with glassmorphism, violet/fuchsia/indigo gradients, and micro-animations. The visual design deliberately separates this experience from generic institutional LMS interfaces.

### System Flow Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Landing /   │     │  Module 1:   │     │  Module 2:   │
│  Homepage    │────▶│   Setup      │────▶│    Logic     │
│              │     │  (Emerald)   │     │  (Fuchsia)   │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                     ┌──────────────┐            │
                     │  Module 3:   │◀───────────┘
                     │  Implement   │
                     │   (Amber)    │
                     └──────┬───────┘
                            │
                     ┌──────▼───────┐
                     │   Sandbox    │
                     │  (Watch,     │
                     │  Play, Read) │
                     └──────┬───────┘
                            │
                     ┌──────▼───────┐
                     │  Knowledge   │
                     │    Check     │
                     └──────┬───────┘
                            │
                     ┌──────▼───────┐
                     │ Documentation│
                     └──────────────┘
```

### Screen-by-Screen Storyboard

#### Screen 1: Landing Page (Homepage)

| Element | Description | Instructional Purpose |
|:--------|:------------|:---------------------|
| **Hero Section** | Title "The Local AI Architect" with gradient text. Tagline: "Transform from a passive consumer of software into an active Experience Architect." | **Gain Attention** — establishes the transformation promise. |
| **Hero Image** | AI-generated image of a futuristic workspace where natural language transforms into holographic 3D architecture. | Visual metaphor for the course outcome. |
| **The Problem / The Solution** | Two glassmorphic cards. Problem: "The Textbook Trap" and "The Creative Wall." Solution: LM Studio + Constructionism + CLT + SDT. | **Inform Objective** — frames the gap analysis and theoretical grounding. |
| **Course Overview** | Three module cards (Setup, Logic, Implement) with clickable Learning Objectives. Clicking an objective reveals a popup explaining the pedagogical theory behind it. | **Isomorphic Design** — the interface itself demonstrates the learning theories it teaches. Objectives link to SDT, Scaffolding, ZPD, COSTAR, and Constructionism. |
| **CTA Button** | "Start Learning Module →" routes to Module 1. | Clear entry point for the learning path. |

#### Screen 2: Module 1 — Starting Your Private Assistant (Setup)

| Element | Description | Instructional Purpose |
|:--------|:------------|:---------------------|
| **Prerequisites Panel** | "What You'll Need" — laptop, 8 GB disk space, internet for initial download, ~20 minutes. | Reduces anxiety by setting clear expectations. |
| **Learning Objectives** | 3 objectives mapped to Data Sovereignty, Cognitive Load Theory, and SDT (Autonomy). | Gagné: **Inform Objective** |
| **Privacy First Card** | Links to LM Studio. Explains local hosting and offline capability. | Core content delivery. |
| **The Goal Quote** | Blockquote: *"We all want our students to be active participants..."* | Emotional anchor — connects to the educator's existing values. |
| **Safe Failure Space** | Interactive element: "Trigger Local Error" button simulates a crash, then reveals that nothing actually broke. | **Isomorphic design** — the learner *experiences* the Safe Failure Space concept by breaking something safely. |
| **Video Embed** | Placeholder for Video 1 (5 min, closed captions, transcript). | Gagné: **Present Stimulus** |
| **Navigation** | "Back to Intro" / "Continue to Logic →" | Linear progression pathway. |

#### Screen 3: Module 2 — IDE Integration (Logic)

| Element | Description | Instructional Purpose |
|:--------|:------------|:---------------------|
| **Learning Objectives** | 3 objectives: Start LM Studio server, connect Cursor/Zed, describe ZPD scaffolding. | Gagné: **Inform Objective** |
| **The Local Server Card** | Explains `localhost:1234`. Includes a "What is localhost?" tooltip with plain-language definition. | Scaffolded vocabulary — introducing technical terms with simple metaphors. |
| **Plugging into IDEs Card** | Links to Cursor and Zed. Explains that overriding the API endpoint connects local AI to professional coding tools. | Practical how-to guidance. |
| **ZPD & Scaffolding Panel** | Explains Zone of Proximal Development. Includes "Flow State" and "Contextual Help" as applied examples. | Gagné: **Learning Guidance** — grounding the technical skill in pedagogical theory. |
| **Sandbox Objectives Sidebar** | Game-style objective list: Locate the Archive, Unlock the Logic Lens, Identify AI's role in the Synthesis Quiz. | Cross-references the Sovereign Sandbox game assessment. |
| **Hover Scaffolding Element** | A code snippet where hovering reveals AI-generated code comments — *the interface itself demonstrates scaffolding*. | **Isomorphic design** — the learner physically experiences scaffolding by hovering. |
| **Video Embed** | Placeholder for Video 2 (5 min). | Gagné: **Present Stimulus** |

#### Screen 4: Module 3 — Entering the Forge (Implementation)

| Element | Description | Instructional Purpose |
|:--------|:------------|:---------------------|
| **Learning Objectives** | 3 objectives: Write COSTAR prompt, explain Constructivism, translate lesson plan to sandbox behavior. | Gagné: **Inform Objective** |
| **Engineering with Words** | Explains the shift from "writing code" to "writing specifications." | Reframing the educator's self-concept from "non-coder" to "architect." |
| **The Sovereign Sandbox Card** | Links to Rust/Bevy. Explains WASM compilation and browser execution. | Showing the technical gold standard is accessible. |
| **Active Constructivism Gate** | Interactive element: the learner must type `generate sandbox` to unlock the lesson content. The content only appears after this action. | **Isomorphic design** — the learner must actively construct (type a command) to access constructivist theory. The form mirrors the content. |
| **Unlocked Content** | Builder's Mindset, Bridging Imagination and Implementation, Ownership. Final Objectives sidebar. | Gagné: **Elicit Performance** + core theory delivery. |
| **Video Embed** | Placeholder for Video 3 (5 min). | Gagné: **Present Stimulus** |

#### Screen 5: Sandbox Page (Watch, Play, Read)

| Element | Description | Instructional Purpose |
|:--------|:------------|:---------------------|
| **Header** | "Building Educational Sandboxes Without Code" — estimated 20-minute completion time. | Sets expectations for the culminating experience. |
| **Step 1: Watch (45 min)** | Three curated YouTube video embeds: (1) Kurzgesagt — LLM architecture, (2) Answer in Progress — AI NPCs, (3) Tina Huang — Future of coding. | Gagné: **Present Stimulus** — external "Visionary Broadcasts" provide foundational context from established creators. |
| **Step 2: Play (8 min)** | Embedded Sovereign Sandbox (Bevy WASM game via iframe). Includes WASM loading animation. Control Protocol panel (WASD, T, Space, 1-2-3, C/L/M). Architect Objectives panel (walk to NPC, collect fragments, use terminal). | Gagné: **Assess Performance** — the game is the practical assessment. Constructionism — the learner interacts with a live artifact built using the sovereign workflow. |
| **Step 3: Read** | Downloadable "Natural Language Blueprint" infographic poster (PNG). | Gagné: **Enhance Retention** — a tangible takeaway that reinforces the COSTAR framework. |

#### Screen 6: Knowledge Check (The Architect's Exam)

| Element | Description | Instructional Purpose |
|:--------|:------------|:---------------------|
| **Quiz Header** | "10 scenarios that test your understanding of local AI, prompt engineering, and learning theory." Progress bar with category color coding. | Gagné: **Assess Performance** |
| **Question Format** | Scenario-based multiple choice. Each question includes: Scenario context → Question → 4 options → Instant feedback (correct/incorrect + explanation) → Theory tag + Module link → **Meta Moment** callout. | COSTAR-structured questions. Dynamic scaffolding — wrong answers link back to relevant modules for review. |
| **Three Categories** | Privacy & Setup (3 Qs, Emerald), Prompt Engineering (4 Qs, Fuchsia), Pedagogical Theory (3 Qs, Violet). | Comprehensive coverage across all three modules. |
| **Meta Moments** | After each question's feedback, a small "Meta Moment" panel reveals how the quiz itself embodies the theory being tested. Example: *"This quiz runs in your browser with no server-side tracking. You're experiencing the same data sovereignty this question tests."* | **Isomorphic design at its deepest level** — the quiz doesn't just test theory, it demonstrates it. The medium IS the message. |
| **Results Dashboard** | Animated score ring. Grade tier (Architect Master / Builder / Apprentice / Novice). Category breakdown bars. Missed question review with module links. Retake button. | Gagné: **Provide Feedback** — comprehensive, actionable feedback with clear remediation paths. |
| **The Meta Layer Reveal** | Final panel after results: reveals that the entire quiz was designed using COSTAR, Constructionism, Dynamic Scaffolding, and Safe Failure Space principles. | Capstone insight — the learner recognizes that the form mirrored the content throughout. Marshall McLuhan: "The medium is the message." |

---

## Part 3: The Interaction Blueprint

### The Natural Language Architect's Guide

A downloadable reference card (PDF/PNG infographic) that provides the educator with a reusable workflow:

| Step | Instruction | Example |
|:-----|:------------|:--------|
| **1. Describe the Goal** | *"I want my students to understand [Topic]."* | *"I want my students to understand how photosynthesis converts sunlight into energy."* |
| **2. Define the Interaction** | *"When the player does [Action], the world should [Result]."* | *"When the player waters the plant, it should grow and display the equation."* |
| **3. Ask for Translation** | *"Help me turn this into a step-by-step logic set for a game character."* | The AI generates If/Then rules ready for implementation. |
| **4. Apply COSTAR** | Use the framework to refine: Context, Objective, Style, Tone, Audience, Response. | A fully structured prompt yields precise, implementable output. |

---

## Part 4: ID Reflection

**How does learning about this topic apply to your future professional plans?**

Learning to storyboard complex technical processes using simple, natural language is a core skill for my professional growth. It allows me to bridge the gap between advanced technology — like local AI and game engines — and the practical needs of educators. By removing technical jargon and "ego-driven" terminology, I can empower teachers to feel capable and in control of their own digital tools.

The isomorphic design philosophy I've applied throughout this project — where the learning experience itself embodies the principles it teaches — represents the kind of instructional design I want to create professionally. When a learner experiences scaffolding through a hover effect, or understands constructivism by being forced to type a command before content unlocks, the lesson becomes unforgettable because they felt it, not just read about it.

This project proves that effective instructional design isn't about the complexity of the machine, but the clarity of the instruction, which is a principle I will carry forward into all my future educational work.
