## ADDED Requirements

### Requirement: Use 3D graphics setting

The system SHALL persist a user preference "Use 3D graphics" (e.g. `use3dGraphics: boolean`) in the existing settings storage and SHALL expose it in the existing settings modal.

#### Scenario: Toggle visible in settings modal

- **WHEN** the user opens the settings modal
- **THEN** a "Use 3D graphics" option (toggle or equivalent) is visible

#### Scenario: Setting persists across sessions

- **WHEN** the user changes "Use 3D graphics" and reopens the app
- **THEN** the chosen value is preserved

#### Scenario: Default is off

- **WHEN** the user has never set "Use 3D graphics"
- **THEN** the effective value is false (3D card expansion disabled)

#### Scenario: Toggle updates setting immediately

- **WHEN** the user toggles "Use 3D graphics" in the settings modal
- **THEN** the stored setting is updated and the list/cards reflect the new value (e.g. expanded canvas appears or disappears)
