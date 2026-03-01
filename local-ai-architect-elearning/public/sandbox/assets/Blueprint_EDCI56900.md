# The Natural Language Blueprint: Shaping Architectures with COSTAR

Welcome Architect. This specialized blueprint provides the foundational prompt structures required to define robust logic, create engaging learning scenarios, and build resilient Non-Player Characters (NPCs) within the Sovereign Sandbox. 

Instead of writing syntax, you are now writing **intent**. 

For maximum fidelity and consistency from local Large Language Models (LLMs), the Local AI Architect program utilizes the **COSTAR** framework.

---

## The COSTAR Framework

COSTAR is an acronym that forces you to provide explicitly structured context. When translating pedagogy into game mechanics, this framework prevents AI hallucinations and keeps output strictly aligned with your educational goals.

*   **C**ontext: Establish the background, setting, or learning environment.
*   **O**bjective: State the exact goal the AI needs to accomplish.
*   **S**tyle: Define the tone, persona, or specific voice (e.g., Socratic, Guide, Antagonist).
*   **T**one: Instruct the AI on how to interact or "feel" (e.g., encouraging, strict, mysterious).
*   **A**udience: Define who the AI is speaking to (e.g., a novice student, a professional).
*   **R**esponse: Dictate the exact output format (e.g., JSON, Rust code, dialogue dialogue box).

---

## Example 1: Defining an Interactive NPC (The Mentor)

When populating your sandbox, NPCs need rigorous boundaries so they don't break character or give away answers too easily. 

**Use Case:** You need an NPC that guides the player to find the "Logic Lens" but refuses to hand it over directly.

**The Prompt:**
> **[Context]** You are 'The Archivist', an ancient AI librarian residing within the Sovereign Sandbox game engine. The player is searching for an item called the 'Logic Lens'. The player needs this to proceed, but must earn it through deductive reasoning.
>
> **[Objective]** Engage the player in dialogue. Ask them a riddle about computational logic. If they answer correctly, give them the location of the Logic Lens. If they answer incorrectly, provide a subtle hint and ask again.
>
> **[Style]** Socratic, wise, slightly cryptic, and deeply knowledgeable about computer science history. 
>
> **[Tone]** Patient but firm. You do not suffer fools, but you want the player to succeed.
>
> **[Audience]** A learner who is new to programming concepts but eager to solve puzzles.
>
> **[Response Format]** Return your response as a JSON object containing two fields: `"dialogue"` (your spoken text) and `"action"` (either `"wait_for_input"`, `"give_hint"`, or `"reveal_location"`).

---

## Example 2: Generating Game Logic (Rust/Bevy)

When you need the local AI to actually *write* the code that drops into your Bevy WebAssembly engine, COSTAR ensures the code is formatted correctly.

**Use Case:** You need a Bevy system that spawns a glowing "Knowledge Fragment" collectible when the player enters a specific zone.

**The Prompt:**
> **[Context]** We are building an educational 3D game using the Rust programming language and the Bevy engine (version 0.12). 
>
> **[Objective]** Write a single Bevy system function called `spawn_knowledge_fragment`. This function should spawn a SpriteBundle or PbrBundle representing a glowing orb at coordinates (X: 10.0, Y: 1.0, Z: -5.0).
>
> **[Style]** Professional, idiomatic Rust. Follow standard Bevy ECS (Entity Component System) conventions.
>
> **[Tone]** Highly technical and precise. Include inline comments explaining the ECS logic for educational purposes.
>
> **[Audience]** A student learning Bevy ECS for the first time. The code must be clean and readable.
>
> **[Response Format]** Output ONLY the raw Rust code within a ```rust``` code block. Do not include any conversational filler before or after the code block.

---

## Implementation Checklist

Before you deploy your prompts to the local server, verify these critical constraints:

1.  **Is the boundary clear?** Have you told the AI what it is *not* allowed to do? (e.g., "Do not write the entire script, only the requested function").
2.  **Is the formatting strict?** Ensure your `[Response]` section dictates JSON or specifically formatted code blocks if you are piping the output directly into a game engine.
3.  **Is the temperature tuned?** In your local LM Studio settings, keep Temperature low (0.1 - 0.3) for generating logic/code, and slightly higher (0.6 - 0.8) for generating creative NPC dialogue.

Good luck, Architect. The grid awaits your command.
