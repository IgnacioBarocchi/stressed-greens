## Context

The app is frontend-only (Vite + React, Dexie, Jotai). There is already a `debug3dAtom` that controls visibility of the 3D debug card; mock/clear data actions (`MockDataActions`) are currently always rendered on the main page. The 3D canvas (`VegetableCard3dCanvas`) uses R3F and drei `OrbitControls` with a hardcoded camera (position, quaternion, fov). Camera tuning today is done by clicking to log camera state and manually pasting values into the canvas component. The proposal introduces an internal admin mode to gate mock/clear and to configure the 3D camera by capturing state when the user releases the orbit control.

## Goals / Non-Goals

**Goals:**

- Provide a single internal “admin mode” flag that, when on, shows mock/clear data actions and enables saving the 3D camera when the user finishes orbiting.
- Persist the last orbit-end camera (position, quaternion, fov) and use it as the initial camera for the 3D canvas so no manual copy-paste is needed.
- Keep admin mode off by default and togglable only by developers (e.g. shortcut or dev-only control); no persistence of the admin flag across reloads.

**Non-Goals:**

- User-facing settings or admin UI in production.
- Persisting admin mode across reloads.
- Changing how the 3D debug card or vegetable cards work beyond camera source and conditional mock/clear visibility.

## Decisions

### 1. Where the admin flag lives

**Decision:** Add a new Jotai atom `adminModeAtom` (boolean, default `false`) in the existing store module (e.g. `src/store/atoms.ts`).

**Rationale:** Keeps admin distinct from `debug3dAtom` (which controls the debug 3D card). Any component can read the flag to gate mock/clear or camera-persist behavior. No new store surface beyond one atom.

**Alternative:** Reuse `debug3dAtom` for both debug card and admin features. Rejected so that “show debug card” and “admin capabilities” can evolve independently.

### 2. Gating mock/clear actions

**Decision:** The parent that renders `MockDataActions` (e.g. main page) reads `adminModeAtom` and renders `MockDataActions` only when `adminModeAtom` is true.

**Rationale:** Single place to gate; no changes inside `MockDataActions`; when admin is off, the component is not mounted.

### 3. When to capture camera and where to persist it

**Decision:** Use OrbitControls’ `onEnd` callback to capture the current camera (position, quaternion, fov) when the user releases the orbit interaction. Persist to `localStorage` under a stable key (e.g. `stressed-greens-3d-camera`). On 3D canvas mount, if a persisted config exists, use it as the initial camera; otherwise use the current hardcoded default.

**Rationale:** `onEnd` fires when the user finishes dragging (and after damping, for drei), so the snapshot matches what they see. localStorage avoids manual paste and works across reloads; no file I/O or build step. If we later want a committed default, we can add a fallback that reads from a constant or JSON file and is overridden by localStorage when present.

**Alternative:** Only log on `onEnd` and keep manual paste into code. Rejected because the proposal asks for “no manual copy-paste.”

### 4. Where to implement onEnd and persistence

**Decision:** Implement inside the 3D canvas feature: a component inside the R3F tree (or the same module) that has access to the camera via `useThree()` and passes `onEnd` to `OrbitControls`. Only when admin (or debug) mode is on, the `onEnd` handler reads camera state, serializes it, and writes to localStorage. The canvas’s initial `camera` prop is derived from a small helper that reads from localStorage (or a constant) so the canvas stays the single source of truth for the camera.

**Rationale:** Keeps camera config co-located with the canvas; no new global services. Reading initial camera from localStorage at render time is sufficient for a dev-only workflow.

### 5. Who may trigger camera save (admin vs debug)

**Decision:** Allow saving the camera when either admin mode or the existing 3D debug mode is on (e.g. `adminModeAtom || debug3dAtom`). When the user releases orbit in the debug card or any 3D canvas, persist the camera so the next mount uses it.

**Rationale:** Debug card is the main place for camera tuning; admin mode adds mock/clear. Both are dev-only; sharing the same persistence keeps one canonical camera config.

## Risks / Trade-offs

| Risk                                                                  | Mitigation                                                                                                                      |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Admin mode accidentally left on and exposed (e.g. mock/clear visible) | Do not persist admin flag; default off. Toggle only via dev shortcut or hidden control so normal users never see it.            |
| Stale or invalid camera in localStorage breaks the 3D view            | On load, validate shape/numbers; on failure, ignore stored config and use hardcoded default. Optionally clear the key on error. |
| Multiple canvases (e.g. debug card + per-card 3D) both writing onEnd  | Same localStorage key for all; last orbit-end wins. Acceptable for single-dev workflow.                                         |

## Migration Plan

- Add `adminModeAtom` and wire it where needed.
- Add camera read/write helpers (localStorage) and use them for initial camera and onEnd.
- Gate `MockDataActions` on `adminModeAtom`.
- Add a dev-only way to toggle admin (e.g. keyboard shortcut); no deployment flag required.
- Rollback: remove gate (show mock/clear always again), remove onEnd persistence, and use only hardcoded camera if needed.

## Open Questions

- Exact keyboard shortcut or entry point for toggling admin mode (e.g. Ctrl+Shift+A or a hidden button in the header). To be decided in implementation.
