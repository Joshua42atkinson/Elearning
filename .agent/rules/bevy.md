---
description: Best Practices for Bevy ECS and AI Code Generation
---

# Bevy ECS Architecture Strategy (Sovereign Sandbox)

We are building a "Level 4" educational engine. The architecture must be **robust**, **performant**, and **easy for AI/Students to script**.

## 1. The "Driving Concept" Pattern (Bevy 0.15+)
Minimize boilerplater for the AI. Use `Required Components`.

**Bad (Old):**
```rust
commands.spawn((
    HeavyShield,
    Transform::default(),
    Visibility::default(),
    Collider::cuboid(1.0, 2.0, 0.1),
    RigidBody::Dynamic,
));
```

**Good (New):**
Define the requirements in the Component itself:
```rust
#[derive(Component)]
#[require(Transform, Visibility, Collider(shield_collider), RigidBody(dynamic_body))]
struct HeavyShield;

fn shield_collider() -> Collider { Collider::cuboid(1.0, 2.0, 0.1) }
fn dynamic_body() -> RigidBody { RigidBody::Dynamic }
```
*AI Generation Goal*: The AI only needs to generate `commands.spawn(HeavyShield);`.

## 2. Entity Relationships (Bevy 0.16+)
Use `ChildOf` and `Children` for explicit hierarchy.
-   Do not rely on implicit transform propagation alone.
-   Use `Observer` patterns for event handling between parent/child entities.

## 3. Scripting Layer (Rhai + Bevy Mod Scripting)
We use **Rhai** because it is safe and Rust-native.

**Safety Rules:**
-   **No infinite loops**: Configure Rhai engine with instruction limits.
-   **Sandboxed Access**: Scripts can *read* World state but only *modify* specific components via exposed API.
-   **Callback Pattern**:
    -   `on_init(entity)`
    -   `on_interact(entity, source)`
    -   `on_tick(entity, delta_time)`

## 4. Visuals
-   **Projection**: Orthographic (Isometric/Dimetric).
-   **Ratio**: 2:1 Pixel Ratio for assets.
-   **GPU Culling**: Ensure `Aabb` components are correct for GPU-driven rendering efficiency.
