## ADDED Requirements

### Requirement: 3D debug visibility is a persisted user setting

The system SHALL provide a persisted user setting (e.g. `UserSettings.show3dDebug`) that controls whether the 3D debug card and related debug UI (e.g. Leva panel) are visible. This setting SHALL be stored in the same user settings store as other preferences and SHALL have a defined default (e.g. `false`).

#### Scenario: Setting exists in user settings

- **WHEN** the user settings schema is defined
- **THEN** it SHALL include a boolean field for 3D debug visibility (e.g. `show3dDebug`) and a default value in `DEFAULT_USER_SETTINGS`

#### Scenario: 3D debug card visibility follows setting when admin is on

- **WHEN** admin mode is on and the user has turned "Show 3D debug card" on in settings
- **THEN** the 3D debug card SHALL be visible (e.g. in the vegetable list or wherever it is rendered)

#### Scenario: 3D debug off when admin is off

- **WHEN** admin mode is off
- **THEN** 3D debug SHALL be considered off for visibility purposes; the 3D debug card and Leva panel SHALL be hidden regardless of the stored `show3dDebug` value

#### Scenario: No debug atom as source of truth

- **WHEN** the codebase determines whether to show the 3D debug card or Leva panel
- **THEN** it SHALL read from user settings (admin mode and show3dDebug), and SHALL NOT use `debug3dAtom` (or equivalent) as the source of truth for 3D debug visibility

---

### Requirement: 3D debug is a sub-setting of admin (only editable when admin on)

The "Show 3D debug card" toggle SHALL only be editable when admin mode is on. When admin mode is off, the 3D debug setting may be hidden or disabled in the settings UI.

#### Scenario: Toggle visible and editable when admin on

- **WHEN** admin mode is on and the user is in the settings modal Admin section
- **THEN** a "Show 3D debug card" (or equivalent) toggle SHALL be visible and the user SHALL be able to turn it on or off; the value SHALL be persisted to user settings

#### Scenario: Toggle hidden or disabled when admin off

- **WHEN** admin mode is off
- **THEN** the "Show 3D debug card" toggle in settings SHALL either be hidden or disabled so the user cannot change it until admin mode is on

#### Scenario: Effective visibility is admin AND show3dDebug

- **WHEN** the system decides whether to show the 3D debug card or Leva panel
- **THEN** it SHALL show them only when both `settings.adminMode` and `settings.show3dDebug` are true (or equivalent logic so 3D debug is a sub-setting of admin)
