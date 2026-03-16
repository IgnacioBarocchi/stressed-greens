## Why

An internal admin mode lets developers iterate faster by trying things end users cannot: configuring the 3D camera and accessing mock/clear data actions without shipping those controls in the production UX. Configuring the camera today (click-to-log then manual paste) is tedious; capturing camera state when the user releases the orbit control is a simple, reliable way to persist the desired view.

## What Changes

- Introduce an **internal admin mode** flag (not a user setting). When enabled:
     - The **mock data** and **clear mock data** actions are visible (e.g. buttons or entry points that are otherwise hidden).
     - The **3D canvas camera** can be configured by orbiting to the desired view and releasing the mouse; the camera state (position, quaternion, fov) is captured on orbit end and persisted so the canvas uses it as its default.
- No change to normal user flow when admin mode is off: mock/clear remain hidden and camera config is not exposed.

## Capabilities

### New Capabilities

- **admin-mode**: Internal flag and gating. When admin mode is on, show mock and clear-mock data controls; when off, hide them. No persistence of the flag across reloads; toggled only by dev (e.g. shortcut or dev-only UI).
- **3d-camera-config**: Capture the current camera (position, quaternion, fov) when the user ends orbit interaction (e.g. OrbitControls `onEnd`), persist that state (e.g. in code or a dev-only store), and apply it as the initial camera for the 3D canvas so no manual copy-paste is needed.

### Modified Capabilities

- None.

## Impact

- **Store/atoms**: Optional atom or module flag for admin mode (e.g. alongside existing `debug3dAtom` or separate).
- **UI**: Conditional rendering of mock/clear actions; 3D canvas (or debug card) uses OrbitControls `onEnd` and a persisted camera config.
- **3D canvas**: Reads initial camera from persisted config when present; writes new config on orbit end when admin (or debug) mode allows it.
- **Dependencies**: None new; continues to use existing R3F/drei OrbitControls and Jotai (or equivalent).
