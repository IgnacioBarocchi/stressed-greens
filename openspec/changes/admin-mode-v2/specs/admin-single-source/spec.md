## ADDED Requirements

### Requirement: Admin mode is a user setting only

The system SHALL treat admin mode exclusively as a user setting (`UserSettings.adminMode`). There SHALL be no separate Jotai atom or other in-memory source of truth for admin mode. All reads and writes for admin mode SHALL go through the persisted user settings (e.g. `useUserSettings().settings.adminMode` and `updateSettings({ adminMode })`).

#### Scenario: No admin atom

- **WHEN** the codebase is inspected for admin mode state
- **THEN** there SHALL be no `adminModeAtom` (or equivalent atom) used to gate admin-only UI; admin state SHALL be read only from user settings

#### Scenario: UI gates on settings

- **WHEN** a component needs to show or hide admin-only UI (mock/clear actions, admin section, 3D debug entry points)
- **THEN** it SHALL read admin mode from `useUserSettings().settings.adminMode` (or equivalent) and SHALL NOT read from a Jotai atom for admin

#### Scenario: Toggle and shortcut write to settings

- **WHEN** the user turns admin on or off via the settings modal toggle or the keyboard shortcut
- **THEN** the system SHALL update the persisted user setting (e.g. `updateSettings({ adminMode })`) and SHALL NOT update a Jotai atom for admin

#### Scenario: No sync hook between atom and settings

- **WHEN** the app runs
- **THEN** there SHALL be no hook or effect that syncs an admin atom from or to user settings; the only source of truth is the settings store

---

### Requirement: Admin mode persists and survives reload

Admin mode SHALL be persisted in the same user settings store as other preferences (e.g. Dexie `settings` table) so that the user's choice survives page reload and is the single source of truth.

#### Scenario: Reload preserves admin state

- **WHEN** the user has admin mode on and reloads the app
- **THEN** admin mode SHALL remain on because it is read from persisted settings on load

#### Scenario: Default when no setting exists

- **WHEN** the user has never set admin mode (e.g. new user or missing row)
- **THEN** the resolved admin mode SHALL be the default value from `DEFAULT_USER_SETTINGS` (e.g. `false`)
