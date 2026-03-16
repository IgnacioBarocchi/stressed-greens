## ADDED Requirements

### Requirement: Swipe gesture deletes vegetable record

The system SHALL allow the user to delete a vegetable record by swiping its card (e.g. horizontal swipe past a threshold). This SHALL have the same effect as using the existing delete control. The system SHALL continue to offer the existing delete button; swipe is an additional way to delete.

#### Scenario: Swipe triggers delete

- **WHEN** the user swipes a vegetable card in the configured direction past the threshold
- **THEN** the system removes that vegetable record (same as delete button)

#### Scenario: Delete button still available

- **WHEN** the user views a vegetable card
- **THEN** the existing delete button or control remains available

#### Scenario: Swipe does not conflict with vertical scroll

- **WHEN** the user scrolls the list vertically
- **THEN** the system SHALL NOT treat the gesture as a delete swipe (e.g. direction or threshold distinguishes swipe from scroll)
