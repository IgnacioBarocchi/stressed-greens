## Context

The app has expandable 3D cards (VegetableList holds `expandedCardId` in local state, passes `isExpanded` and `onToggleExpand` to each VegetableCard). The 3D canvas lives inside the card; the whole card div is clickable to toggle expand. Pointer events on the canvas therefore bubble to the card and cause orbit-drag or canvas click to toggle expand/collapse. There is no global UI store; settings live in Dexie + useUserSettings. The project uses pnpm and already has R3F/Drei.

## Goals / Non-Goals

**Goals:**

- Stop canvas pointer events from bubbling to the card so OrbitControls and canvas clicks do not expand/collapse the card.
- Provide an internal 3D debug mode: when enabled, auto-expand the first card and allow click-on-canvas to log camera state (position, rotation, fov) for tuning.
- Introduce a small UI store holding at least expanded card id (and optionally the debug flag) so list and cards do not rely on prop drilling.

**Non-Goals:**

- User-facing debug or camera settings.
- Persisting the debug flag or expanded id across reloads (expanded id can reset; debug is dev-only).
- Replacing Dexie or useUserSettings with the new store; the store is for ephemeral UI state only.

## Decisions

### 1. Store library: Jotai vs Zustand

**Decision:** Use **Jotai** (atoms, no Provider required for basic use).

**Rationale:** The app is small and we need only a few atoms (expandedCardId, optionally debug3d). Jotai keeps the surface minimal and fits React’s model well; no single store object to maintain. Zustand would be a single store with slices; both are valid. Jotai is chosen for simplicity and atom-level granularity.

**Alternative:** Zustand — one `useUIStore` with `expandedCardId` and `debug3d`. Slightly more “one place to look” but adds a store shape and selectors. Deferred.

### 2. Where the debug flag lives

**Decision:** Store the 3D debug flag in a **Jotai atom** (e.g. `debug3dAtom`) so any component (list, canvas, camera logger) can read it without props. Default `false`. Toggled only by dev code (e.g. a temporary button or module-level override).

**Rationale:** Keeps the flag out of Dexie and out of user settings; clearly internal. The list can read the atom to implement “auto-expand first card when debug on”; the canvas can read it to show the click-to-log overlay or behavior.

**Alternative:** Module-level const (e.g. `DEBUG_3D = true`). Simpler but requires a rebuild to turn off; an atom allows a future dev UI to toggle without code change.

### 3. Canvas event boundary

**Decision:** On the **wrapper div** that contains the Canvas (the one with aspect ratio / min height), attach `onPointerDown={(e) => e.stopPropagation()}` so that all pointer events that start on the canvas (including drag for orbit) do not bubble to the card. No change to R3F event system; the boundary is at the React DOM level.

**Rationale:** Single, clear place to stop propagation; works for both pointer and click. The card’s onClick only runs when the user clicks the card content outside the canvas.

**Alternative:** Inside the Canvas, using R3F’s event system (e.g. `stopPropagation` on three.js events). Possible but more coupled to the 3D tree; the wrapper approach is simpler and sufficient.

### 4. Camera logging implementation

**Decision:** Add a small component **inside** the R3F tree that uses `useThree()` from @react-three/fiber to read `camera`. When debug mode is on, render a full-screen transparent click target (e.g. a plane or a group with a large mesh) with `onClick` that reads `camera.position`, `camera.quaternion` (or rotation), and `camera.fov`, then `console.log` them in a copy-paste-friendly form (e.g. object or one-line string). Optionally copy to clipboard.

**Rationale:** useThree() is the standard way to access the camera in R3F; the component only mounts when the canvas is mounted and can be gated on the debug atom so it has no effect in production.

**Alternative:** Expose camera via a ref and log from outside the canvas. More wiring; keeping the logger inside the canvas keeps camera access local to R3F.

### 5. Auto-expand first card when debug is on

**Decision:** In the component that owns the list (or in VegetableList), when the list has items and the debug atom is true, set the expanded-card id to the first item’s id (e.g. via a write to the expandedCardId atom). Do this in a single place (e.g. on mount or when items/debug change) so the first card opens automatically when debug is enabled.

**Rationale:** Ensures the 3D canvas is visible as soon as debug is on without requiring a manual click; one clear rule.

## Risks / Trade-offs

| Risk                                                                                | Mitigation                                                                                               |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Debug flag or expanded id visible in devtools                                       | Acceptable; debug is dev-only. Do not expose debug toggle in production UI.                              |
| Jotai adds a new dependency                                                         | Small API surface; document the atoms and their usage in code or a short README.                         |
| First-card auto-expand runs on every render if not guarded                          | Use a single effect or derived logic that runs when `debug3d` or `items[0]?.id` changes and writes once. |
| Canvas wrapper stopPropagation blocks all card clicks when pointer starts on canvas | By design; only the card area outside the canvas toggles expand.                                         |

## Open Questions

None. Store location (e.g. `src/store/atoms.ts` or `src/lib/ui-store.ts`) can be chosen at implementation time.
