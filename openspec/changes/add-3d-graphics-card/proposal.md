## Why

Users benefit from a richer, more engaging way to view vegetable entries. Adding an optional 3D preview (React Three Fiber + Drei) per card provides a distinctive experience and a foundation for future 3D or AR features, while remaining optional and off by default so it does not affect users who prefer the current list.

## What Changes

- **Expandable cards:** Each vegetable card can be expanded on click to reveal an inline React Three Fiber (R3F) + Drei canvas. Clicking the same card again collapses it.
- **Single-open behavior:** Only one card can be expanded at a time; opening another card closes the previously expanded one.
- **Settings toggle:** A new option in the existing settings modal: "Use 3D graphics". When off, cards do not expand to show 3D (click may do nothing or expand a placeholder, per design). When on, expand/collapse and single-open behavior are active.
- **Phase 1 content:** When 3D is enabled and a card is expanded, the canvas renders a default Drei `Box` only (no vegetable-specific geometry yet).

## Capabilities

### New Capabilities

- `expandable-3d-card`: Expandable vegetable cards with a single-open constraint and an inline R3F+Drei canvas that, for this phase, renders a default Drei Box. Behavior is gated by a user setting.

### Modified Capabilities

- `user-settings`: Extend persisted settings with a "Use 3D graphics" preference (e.g. `use3dGraphics: boolean`), stored in the existing settings table and exposed in the existing settings modal.

## Impact

- **Dependencies:** Add `@react-three/fiber`, `@react-three/drei`, and `three` (or equivalent) to the project.
- **Components:** `VegetableCard` (or equivalent list item) gains expand/collapse state and conditional canvas rendering; a parent or store must track which card (if any) is expanded to enforce single-open.
- **Settings:** `UserSettings` type and `settings` table gain a new field; settings modal gains a "Use 3D graphics" toggle; `useUserSettings` hook continues to be the single access point.
- **Performance:** 3D canvas only mounts when a card is expanded and 3D is enabled; unmount when collapsed to limit GPU use.
