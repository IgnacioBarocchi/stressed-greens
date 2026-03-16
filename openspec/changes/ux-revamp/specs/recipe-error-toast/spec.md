## ADDED Requirements

### Requirement: Toast when recipe fetch fails

When the recipe search (Rust/invoke) request fails, the system SHALL show a toast message that informs the user that content could not be loaded and that the app is falling back to default or placeholder results. The system SHALL use a toast component from the UI folder when available.

#### Scenario: Toast on fetch failure

- **WHEN** the recipe fetch (e.g. Tauri invoke) fails or throws
- **THEN** the system displays a toast with a message indicating load failure and fallback to default results

#### Scenario: Toast is dismissible

- **WHEN** the toast is shown
- **THEN** the user can dismiss it (e.g. by action or auto-dismiss after a delay)

#### Scenario: Fallback behavior still occurs

- **WHEN** the recipe fetch fails
- **THEN** the app SHALL show default or fallback results in addition to showing the toast
