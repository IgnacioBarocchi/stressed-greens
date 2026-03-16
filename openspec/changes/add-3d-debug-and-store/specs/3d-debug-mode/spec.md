## ADDED Requirements

### Requirement: Internal debug flag

The system SHALL provide an internal, developer-only flag that enables 3D camera setup behavior. The flag SHALL NOT be a user-facing setting and SHALL NOT be persisted to user settings or database.

#### Scenario: Flag is off by default

- **WHEN** the app loads
- **THEN** the 3D debug mode is disabled unless overridden by developer code

#### Scenario: Flag can be read by list and canvas

- **WHEN** debug mode is enabled
- **THEN** the list (or equivalent) can read the flag to auto-expand the first card and the canvas can read it to enable click-to-log camera

---

### Requirement: First card auto-expanded when debug on

When the 3D debug flag is enabled and the vegetable list has at least one item, the system SHALL automatically expand the first card so that the 3D canvas is visible without a user click.

#### Scenario: First card opens when debug on and list has items

- **WHEN** debug mode is on and there is at least one vegetable in the list
- **THEN** the first card is expanded and its 3D canvas is visible

#### Scenario: No auto-expand when debug off

- **WHEN** debug mode is off
- **THEN** no card is expanded solely due to debug; expansion follows normal user interaction

---

### Requirement: Click on canvas logs camera state when debug on

When the 3D debug flag is enabled and the user clicks anywhere on the 3D canvas, the system SHALL log the current camera state (e.g. position, rotation or quaternion, fov) to the console in a form suitable for copying into canvas or camera props.

#### Scenario: Click logs camera

- **WHEN** debug mode is on and the user clicks on the 3D canvas
- **THEN** the current camera state is written to the console (e.g. via console.log)

#### Scenario: No log when debug off

- **WHEN** debug mode is off and the user clicks on the canvas
- **THEN** camera state is not logged for debug purposes (normal orbit or no-op)
