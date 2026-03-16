## ADDED Requirements

### Requirement: Card expand and collapse

When "Use 3D graphics" is enabled, the system SHALL allow the user to expand a vegetable card by clicking it to reveal an inline 3D canvas, and to collapse it by clicking the same card again.

#### Scenario: Expand on click

- **WHEN** "Use 3D graphics" is on and the user clicks a vegetable card
- **THEN** that card expands to show the 3D canvas

#### Scenario: Collapse on second click

- **WHEN** the user clicks the same card again while it is expanded
- **THEN** the card collapses and the 3D canvas is hidden

#### Scenario: No expand when 3D setting is off

- **WHEN** "Use 3D graphics" is off and the user clicks a vegetable card
- **THEN** the card does not expand to show a 3D canvas (or expands without 3D content, per implementation)

---

### Requirement: Single card expanded

The system SHALL ensure at most one vegetable card is expanded at a time. Opening another card SHALL close the previously expanded card.

#### Scenario: Opening second card closes first

- **WHEN** one card is expanded and the user clicks a different card
- **THEN** the first card collapses and the second card expands

#### Scenario: Only one canvas visible

- **WHEN** one card is expanded
- **THEN** exactly one inline 3D canvas is visible in the list

---

### Requirement: Phase 1 canvas content

When 3D is enabled and a card is expanded, the inline canvas SHALL render a default Drei Box. No vegetable-specific geometry or models are required in this phase.

#### Scenario: Expanded card shows Box

- **WHEN** "Use 3D graphics" is on and a card is expanded
- **THEN** the canvas displays a Drei Box (default appearance)

#### Scenario: Canvas unmounts when collapsed

- **WHEN** the user collapses the card
- **THEN** the 3D canvas is unmounted (no canvas in DOM for that card)

---

### Requirement: Remove action does not trigger expand

The system SHALL ensure the card remove (e.g. "mark as eaten") action does not expand the card or toggle expansion.

#### Scenario: Remove button does not expand

- **WHEN** the user clicks the remove button on a card
- **THEN** the card is removed (or removal is triggered) and the card does not expand
