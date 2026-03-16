## ADDED Requirements

### Requirement: Skippable slide-based first-time tour

The system SHALL show a slide-based onboarding tour when the user is using the app for the first time (e.g. "tour seen" not set). The tour SHALL cover: app purpose (fridge tracker for vegans), recipe finder, items sorted by freshness, and settings. The user SHALL be able to skip the tour at any time. The tour SHALL NOT use overlay tooltips; it SHALL use slides only.

#### Scenario: Tour shown when not seen

- **WHEN** the user loads the app and has not previously completed or skipped the tour
- **THEN** the tour is displayed (slide-based)

#### Scenario: User can skip tour

- **WHEN** the user chooses to skip (e.g. skip button) at any point in the tour
- **THEN** the tour is dismissed and the "tour seen" state is persisted

#### Scenario: Tour not shown after seen

- **WHEN** the user has previously completed or skipped the tour
- **THEN** the tour is not shown on subsequent loads

#### Scenario: Tour content covers key areas

- **WHEN** the tour is displayed
- **THEN** it SHALL include at least: app purpose, recipe finder, sort by freshness, and settings
