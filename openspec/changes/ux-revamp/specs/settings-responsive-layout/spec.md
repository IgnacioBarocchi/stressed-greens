## ADDED Requirements

### Requirement: Settings as full page on small viewports

On viewports below the defined breakpoint, the system SHALL render settings as a full page (not a modal). On viewports at or above the breakpoint, the system MAY render settings as a modal as today.

#### Scenario: Small viewport opens settings

- **WHEN** the user opens settings on a small viewport (e.g. width below breakpoint)
- **THEN** settings are shown as the only visible content (full page)

#### Scenario: Large viewport opens settings

- **WHEN** the user opens settings on a large viewport (e.g. width at or above breakpoint)
- **THEN** settings are shown in a modal overlay

---

### Requirement: Navigation to home from settings

The system SHALL allow the user to return to the home view from the settings view by using the back action (browser or Android back) or by tapping the app header logo.

#### Scenario: Back returns to home

- **WHEN** the user is on the settings page and triggers back (back button or gesture)
- **THEN** the app navigates to home and settings are closed

#### Scenario: Header logo returns to home

- **WHEN** the user is on the settings page and taps the app header logo
- **THEN** the app navigates to home and settings are closed
