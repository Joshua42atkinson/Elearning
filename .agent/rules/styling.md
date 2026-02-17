---
description: "Design rules for the 'Matrix-Rust' aesthetic based on Daydream specs."
tags: [styling, css, design-system]
---

# Matrix-Rust Design System

This design system is built to evoke a "Sovereign/Cyberpunk" aesthetic, blending the retro-futurism of phosphor monitors with the industrial grit of rust.

## Color Palette

| Name | Hex | Usage | Rationale |
| :--- | :--- | :--- | :--- |
| **Phosphor Amber** | `#FFBF00` | Primary Text, Terminal Glow | Living intelligence, reduces eye strain. |
| **Industrial Rust** | `#B7410E` | Borders, Alerts, Accents | Hardware durability, offline resilience. |
| **Deep Charcoal** | `#1A1A1A` | Backgrounds, Panels | Soft dark mode to prevent halation. |
| **Terminal Black** | `#0D0D0D` | Code Blocks, Inputs | Depth and visual separation. |
| **Status Green** | `#40FF00` | Success Messages | Positive reinforcement feedback. |
| **Alert Red** | `#C9462A` | Error Messages, Critical Alerts | Vintage system alerts. |

## Typography

### Headers & Narrative
- **Font Family**: 'VT323', monospace
- **Usage**: Titles, Navigation, "Hacker" narrative elements.
- **Fallback**: 'Courier New', monospace

### Technical & Code
- **Font Family**: 'JetBrains Mono', 'Fira Code', monospace
- **Usage**: Code blocks, terminal inputs, file paths.
- **Features**: Ligatures enabled (e.g., `!=` as `≠`).

## UI Components

### The Terminal (The Forge)
- **Background**: `var(--terminal-black)`
- **Border**: 1px solid `var(--industrial-rust)`
- **Glow**: Box-shadow `0 0 10px var(--phosphor-amber-dim)`
- **Cursor**: Blinking block `█` in `var(--phosphor-amber)`

### Buttons (The Action)
- **Style**: Outlined, sharp corners.
- **Hover**: Invert colors (Amber text on Black -> Black text on Amber).
- **Active**: "Pressed" effect 2px down.

## CSS Variables
```css
:root {
  --phosphor-amber: #FFBF00;
  --phosphor-amber-dim: rgba(255, 191, 0, 0.2);
  --industrial-rust: #B7410E;
  --deep-charcoal: #1A1A1A;
  --terminal-black: #0D0D0D;
  --status-green: #40FF00;
  --alert-red: #C9462A;
  
  --font-header: 'VT323', monospace;
  --font-code: 'JetBrains Mono', monospace;
}
```
