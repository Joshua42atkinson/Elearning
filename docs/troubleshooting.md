# Troubleshooting & Development Guide

This document captures common pitfalls and solutions when developing Sovereign Sandbox and other Bevy/WASM applications.

## 1. Slow Compile Times in Rust & Bevy

Building a massive engine like Bevy can take a long time (frequently 5+ minutes for the first compilation), especially when switching between native and WASM targets. 

**How to speed this up:**

- **Use the Fast Compile Feature:** During native development, use Bevy's `dynamic_linking` feature. This compiles Bevy as a dynamic library, which significantly reduces the cost of iterative recompilation of your game logic.
  *Command:* `cargo run --features bevy/dynamic_linking`
  *(Note: Disable this feature when building for release or WASM).*
- **Use a Faster Linker:** The default GNU linker is slow. Switch to `lld` (on Linux/Mac) or `mold`.
  *Setup:* Add the following to your `.cargo/config.toml`:
  ```toml
  [target.x86_64-unknown-linux-gnu]
  rustflags = ["-C", "link-arg=-fuse-ld=lld"]
  ```
- **Avoid Constant WASM Builds:** Do not run `cargo build --target wasm32-unknown-unknown` repeatedly while testing game logic. Build and run natively (`cargo run`) because it's inherently faster and allows you to use standard debugging tools. Only build for WASM when you need to verify web-specific behavior.

## 2. WASM "Unreachable" Panics and WebGL

When testing the WASM build in a headless browser (like when using AI subagents for testing), the game might crash immediately with a `RuntimeError: unreachable`. 

**Diagnostic:**
- This often happens because the headless browser environment lacks WebGL2 or WebGPU support, which Bevy strictly requires.
- The `unreachable` WASM instruction is executed whenever Rust panics. If Bevy's `RenderPlugin` panics because it can't find a GPU in the browser, it looks like a fatal WASM logic error.

**Solution:**
- Always perform final validation of the game canvas in a standard, hardware-accelerated desktop browser (Chrome, Firefox, Safari) rather than relying exclusively on headless automated tests.
- Check the browser DevTools console directly. The actual panic message (e.g., `Unable to find a GPU!`) will be printed *before* the `unreachable` trace.

## 3. Reading Files in WASM

**Problem:** 
Using `std::fs::read_to_string` or `std::fs::create_dir_all` will cause a panic when compiled to WASM because a standard web browser does not provide a local filesystem API.

**Solution:**
- Use the `include_str!` or `include_bytes!` macros in Rust. These macros evaluate at compile time and bake the contents of the file directly into your executable binary, bypassing the need for a web filesystem entirely.
- Alternatively, use Bevy's asynchronous `AssetServer` to load assets via HTTP requests, which is fully supported in WASM.
