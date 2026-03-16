## ADDED Requirements

### Requirement: Capture camera state on orbit end

When the user ends an orbit interaction on the 3D canvas (e.g. releases the mouse after dragging), and admin or debug mode is on, the system SHALL capture the current camera state (position, quaternion, fov) from the active camera.

#### Scenario: Camera captured on orbit end when admin or debug on

- **WHEN** admin mode or 3D debug mode is on and the user finishes an orbit interaction (e.g. OrbitControls onEnd fires)
- **THEN** the system captures the camera position, quaternion, and fov at that moment

#### Scenario: No capture when both admin and debug off

- **WHEN** both admin mode and 3D debug mode are off and the user finishes an orbit interaction
- **THEN** the system does not persist or overwrite any stored camera config for this action

---

### Requirement: Persist captured camera and use as initial camera

The system SHALL persist the captured camera state (e.g. to localStorage or a dev-only store) and SHALL use it as the initial camera for the 3D canvas when present, so that no manual copy-paste is required.

#### Scenario: Persisted config used on canvas mount

- **WHEN** the 3D canvas mounts and a valid persisted camera config exists
- **THEN** the canvas uses that config (position, quaternion, fov) as its initial camera

#### Scenario: Default camera when no persisted config

- **WHEN** the 3D canvas mounts and no valid persisted camera config exists
- **THEN** the canvas uses a hardcoded or code-defined default camera

#### Scenario: New snapshot overwrites previous

- **WHEN** the user ends an orbit interaction with admin or debug on and capture runs
- **THEN** the persisted camera config is updated so the next mount uses the new view
