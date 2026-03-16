## 1. Store and admin toggle

- [x] 1.1 Add adminModeAtom (boolean, default false) to src/store/atoms.ts
- [x] 1.2 Add a dev-only way to toggle admin mode (e.g. keyboard shortcut Ctrl+Shift+A or hidden control in header)

## 2. Gate mock/clear actions

- [x] 2.1 On the main page, read adminModeAtom and render MockDataActions only when adminModeAtom is true

## 3. Camera persistence helpers

- [x] 3.1 Add a small module (e.g. src/lib/camera-config.ts or in canvas module) with: constant for localStorage key (e.g. stressed-greens-3d-camera), function to read and validate persisted camera (position, quaternion, fov), function to write camera state to localStorage; on invalid or missing data use/return null or fallback default
- [x] 3.2 Export a type or shape for the persisted camera (position array, quaternion array, fov number) for use by canvas and helpers

## 4. 3D canvas: initial camera and onEnd capture

- [x] 4.1 In VegetableCard3dCanvas (or shared canvas config), compute initial camera from the persistence helper when present; otherwise use current hardcoded default; pass that as the Canvas camera prop
- [x] 4.2 Add onEnd to OrbitControls; in the handler (when adminModeAtom or debug3dAtom is true), read camera via useThree(), serialize position/quaternion/fov, and call the persistence write function
- [x] 4.3 Ensure the onEnd/capture logic runs only when admin or debug is on (e.g. component inside Canvas that has useThree and useAtomValue, and passes onEnd to OrbitControls)

## 5. Manual verification

- [ ] 5.1 With admin off, confirm mock/clear buttons are hidden and orbit end does not persist camera
- [ ] 5.2 With admin on, confirm mock/clear visible; orbit to a new view, release mouse; reload and confirm 3D canvas uses the new camera
- [ ] 5.3 Confirm admin toggle works (shortcut or dev control) and does not persist across reload
