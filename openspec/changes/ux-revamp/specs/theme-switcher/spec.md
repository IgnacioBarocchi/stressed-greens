## ADDED Requirements

### Requirement: Runtime theme selection

The system SHALL allow the user to select a visual theme at runtime. The system SHALL support at least two options: "legacy" (current style) as the default and "vercel" (Vercel/tweakcn-inspired). The selected theme SHALL be persisted and applied on subsequent loads.

#### Scenario: Default theme is legacy

- **WHEN** the user has not chosen a theme or has chosen "legacy"
- **THEN** the app uses the legacy (current) visual style

#### Scenario: User selects vercel theme

- **WHEN** the user selects the "vercel" theme in settings
- **THEN** the app applies the Vercel-inspired theme immediately and persists the choice

#### Scenario: Theme persists across sessions

- **WHEN** the user has previously selected a theme and reopens the app
- **THEN** the app SHALL apply the last selected theme
