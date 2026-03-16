## ADDED Requirements

### Requirement: Internal admin flag

The system SHALL provide an internal, developer-only flag (admin mode) that gates visibility of mock/clear data actions and enables 3D camera configuration. The flag SHALL NOT be a user-facing setting and SHALL NOT be persisted across reloads.

#### Scenario: Admin mode is off by default

- **WHEN** the app loads
- **THEN** admin mode is disabled unless toggled by developer (e.g. shortcut or dev-only control)

#### Scenario: Admin flag is readable by UI

- **WHEN** a component needs to know if admin mode is on
- **THEN** it SHALL be able to read the flag from the same store or atom used for the admin state

#### Scenario: Toggle is dev-only

- **WHEN** the app is used by an end user with no dev tools or shortcut
- **THEN** there is no visible or discoverable way to turn admin mode on

---

### Requirement: Mock and clear-mock data controls gated by admin mode

When admin mode is off, the system SHALL NOT show the "Load mock data" and "Clear mock data" actions. When admin mode is on, the system SHALL show them.

#### Scenario: Mock/clear hidden when admin off

- **WHEN** admin mode is off
- **THEN** the mock data and clear mock data buttons (or equivalent entry points) are not rendered

#### Scenario: Mock/clear visible when admin on

- **WHEN** admin mode is on
- **THEN** the mock data and clear mock data actions are visible and usable
