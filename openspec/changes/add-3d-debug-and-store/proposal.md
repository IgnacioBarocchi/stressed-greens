## Why

Tuning the 3D camera (position, fov) is difficult when orbit-drag on the canvas bubbles to the card and toggles expand/collapse. A dedicated internal debug mode and a clear event boundary make camera setup possible and improve normal use. Moving expanded-card state into a small store avoids prop drilling and keeps list/card logic simpler as features grow.

## What Changes

- **Internal 3D debug mode:** A developer-only flag (variable or store, not a user setting). When enabled: the first vegetable card is auto-expanded so the 3D canvas is visible; clicking anywhere on the canvas logs the current camera state (position, rotation, fov) to the console so it can be copied into canvas/camera props.
- **Canvas event boundary:** Pointer events on the 3D canvas container (e.g. the wrapper div) must not bubble to the card. OrbitControls and canvas clicks then no longer trigger card expand/collapse; only clicks on the card outside the canvas toggle expand.
- **UI store:** Introduce a small state store (e.g. Jotai or Zustand) that holds at least the expanded card id. Optionally the debug flag lives there. List and cards read/write from the store instead of passing expanded state via props.

## Capabilities

### New Capabilities

- `3d-debug-mode`: Internal flag for 3D camera setup. When on: first card auto-expands; click on canvas logs camera state via R3F (e.g. useThree). Not a user-facing setting.
- `ui-store`: Client-side store (e.g. Jotai or Zustand) for UI state such as expanded card id (and optionally the 3D debug flag). Consumed by list and cards without prop drilling.

### Modified Capabilities

- `expandable-3d-card`: Add requirement that pointer events on the 3D canvas (or its wrapper) do not bubble to the card, so orbit and canvas clicks do not trigger expand/collapse.

## Impact

- **Dependencies:** Add Jotai or Zustand (and possibly @types) if not present.
- **Components:** VegetableList, VegetableCard, VegetableCard3dCanvas; canvas wrapper gains pointer-event handling; optional camera-logger component inside canvas using useThree.
- **New modules:** Store definition (e.g. store/ui.ts or atoms); optional debug const or atom.
- **Behavior:** Expand/collapse only when user clicks card area outside the canvas; debug mode enables auto-open and click-to-log camera for tuning.
