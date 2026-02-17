---
description: Session 7 - The Glass Bead Game (UI/UX Quest Progression)
---

# Session 7: The Glass Bead Game (UI/UX)

## Context
You have successfully implemented the **Syllabus Engine (QDL)**. The AI Teacher now receives quest context when you press 'T', but there's no visual feedback showing where the learner is in the journey.

## Session Goal
Build the **Quest Progression UI** to visualize the learner's progress through the syllabus.

## What's Already Done
✅ Syllabus Engine (`SyllabusResource`) with event progression  
✅ `module_1.toml` with 3 video lessons (20min storyboard)  
✅ Teacher integration (injects context into AI prompts)  
✅ Memory system (Trinity Sled)  
✅ AI Brain (Phi-3) and Ears (Whisper)  

## What's Missing
❌ Visual quest tracker showing current module/event  
❌ User can't see which Gagné event they're on  
❌ No way to advance to next step (need 'N' key handler)  
❌ No completion indicators  

## How to Start This Session

### Step 1: Test Current State
```bash
cd sovereign-sandbox
cargo run
# Wait for boot sequence
# Press 'T' to chat with Teacher
# Observe: Teacher has context, but you can't see it visually
```

### Step 2: Tell the Agent Your Goal
```
"I need a visual Quest Log UI that shows:
- Current module title
- Current Gagné event step (1-9)
- Progress bar
- 'N' key to advance to next step

Use the Matrix-Rust aesthetic (Phosphor Amber #FFBF00 on Deep Charcoal #1A1A1A)"
```

### Step 3: Expected Deliverables
- New UI component: Quest Log panel (top-right or left sidebar)
- Progress indicator (e.g., "2/9: Recall Prior Knowledge")
- Keyboard handler for 'N' key to call `syllabus.advance_step()`
- Visual feedback when quest step changes

## Design Reference
Check `.agent/rules/aesthetics.md` for Matrix-Rust design tokens.

## Technical Notes
- `SyllabusResource` already has `current_module_index` and `current_event_step`
- `advance_step()` method exists but isn't called anywhere yet
- You'll need a new Bevy system to render the Quest Log UI
- Update `teacher.rs` to trigger on step changes

## Success Criteria
When you press 'N':
1. Visual indicator updates to next step
2. Next 'T' press shows Teacher with new context
3. Progress bar fills incrementally
4. Completion message at quest end

---

**Pro Tip:** The syllabus module is ready. This session is pure UI/UX work. Focus on visual clarity and satisfying feedback loops.
