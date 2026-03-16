## ADDED Requirements

### Requirement: Undo snackbar after delete

After one or more vegetable records are deleted, the system SHALL show a bottom snackbar that includes an "Undo" action. The user SHALL have a limited time window (e.g. 5 seconds) to trigger Undo. If the user triggers Undo within the window, the system SHALL restore the recently deleted record(s). The snackbar SHALL be positioned above the safe-area bottom inset on devices that report it.

#### Scenario: Snackbar shown after delete

- **WHEN** the user deletes at least one vegetable record
- **THEN** a bottom snackbar appears with an Undo action

#### Scenario: Undo restores record

- **WHEN** the user taps Undo within the time window (e.g. 5s)
- **THEN** the system restores the deleted record(s) associated with that snackbar and dismisses the snackbar

#### Scenario: Snackbar respects safe area

- **WHEN** the snackbar is displayed on a device with a non-zero bottom safe-area inset
- **THEN** the snackbar is positioned above that inset (e.g. not obscured by system navigation)

#### Scenario: Time window expires

- **WHEN** the user does not tap Undo before the time window (e.g. 5s) expires
- **THEN** the delete is final and the snackbar is dismissed
