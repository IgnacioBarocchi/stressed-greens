## ADDED Requirements

### Requirement: Admin mode toggle in settings modal

The system SHALL expose an admin mode toggle from the settings modal so the user can enable or disable admin mode without dev shortcuts or internal state. The toggle SHALL read and write the same admin flag used to gate admin-only UI (e.g. `adminModeAtom`).

#### Scenario: Toggle visible in settings

- **WHEN** the user opens the settings modal
- **THEN** an admin mode toggle (or equivalent control) SHALL be visible so the user can turn admin on or off

#### Scenario: Toggle reflects and updates admin state

- **WHEN** the user changes the admin mode toggle in the settings modal
- **THEN** the admin flag SHALL update immediately and admin-only UI (mock/clear, debug card, import/export) SHALL appear or disappear according to the new state

#### Scenario: Single entry point for admin

- **WHEN** the user wants to access admin features (3D debug, mocks, import/export)
- **THEN** they SHALL be able to do so by opening settings and turning admin on; no dev-only shortcut SHALL be required (shortcuts may remain as a convenience)

---

### Requirement: Admin section in settings with 3D debug, mocks, and import/export

When admin mode is on, the settings modal (or an admin subsection within it) SHALL provide access to: preview or open the 3D debug card, load mock data, clear mock data, and import/export vegetables (e.g. JSON). These entry points SHALL be grouped or labeled as admin so they are discoverable from settings.

#### Scenario: 3D debug card accessible from settings when admin on

- **WHEN** admin mode is on and the user is in the settings modal
- **THEN** the user SHALL be able to preview or open the 3D debug card (e.g. via a link, button, or inline preview) so they can tune the camera or inspect the 3D view without leaving settings flow

#### Scenario: Load and clear mock data from settings when admin on

- **WHEN** admin mode is on and the user is in the settings modal
- **THEN** the user SHALL be able to trigger "Load mock data" and "Clear mock data" (or equivalent actions) from the settings modal so mock data can be managed from one place

#### Scenario: Import and export from settings when admin on

- **WHEN** admin mode is on and the user is in the settings modal
- **THEN** the user SHALL be able to import vegetables (e.g. from JSON) and export vegetables (e.g. to JSON) from the settings modal so data can be backed up or restored without a separate admin screen

#### Scenario: Admin section hidden or inactive when admin off

- **WHEN** admin mode is off
- **THEN** the admin-only entry points (3D debug, load/clear mocks, import/export) in the settings modal SHALL either be hidden or inactive so normal users do not see or use them
