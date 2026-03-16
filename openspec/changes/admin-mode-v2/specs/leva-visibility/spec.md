## ADDED Requirements

### Requirement: Leva panel visibility follows 3D debug setting

The system SHALL control the visibility of the Leva controls panel using the Leva library's `hidden` prop (or equivalent API). The panel SHALL be hidden when 3D debug is effectively off (admin off or show3dDebug off) and visible when both admin mode and the 3D debug setting are on.

#### Scenario: Leva panel hidden when 3D debug off

- **WHEN** the user has admin mode off, or admin mode on and "Show 3D debug card" off
- **THEN** the Leva panel SHALL be hidden (e.g. `hidden={true}` or equivalent so the panel is not visible)

#### Scenario: Leva panel visible when 3D debug on

- **WHEN** the user has admin mode on and "Show 3D debug card" on
- **THEN** the Leva panel SHALL be visible (e.g. `hidden={false}` so the user can interact with the controls)

#### Scenario: Visibility derived from user settings

- **WHEN** the system decides whether to pass `hidden={true}` or `hidden={false}` to Leva
- **THEN** it SHALL derive the value from user settings (`settings.adminMode` and `settings.show3dDebug`), and SHALL NOT use an atom for Leva visibility

---

### Requirement: A component controls Leva visibility

The system SHALL provide a component (or wrapper) that renders the Leva root component (or panel) and sets its `hidden` prop based on the effective 3D debug state (admin on and show3dDebug on). This component SHALL be mounted so that Leva is present in the app and its visibility is driven by settings.

#### Scenario: Single place for Leva visibility logic

- **WHEN** the Leva panel is used in the app
- **THEN** there SHALL be one component (or clear ownership) that reads user settings and passes `hidden` to Leva, so visibility logic is not duplicated

#### Scenario: Reactive to setting changes

- **WHEN** the user toggles "Show 3D debug card" or admin mode in settings
- **THEN** the Leva panel visibility SHALL update without reload (e.g. the component uses reactive settings and re-renders with the new `hidden` value)
