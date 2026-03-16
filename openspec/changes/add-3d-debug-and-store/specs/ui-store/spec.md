## ADDED Requirements

### Requirement: Expanded card id in store

The system SHALL hold the id of the currently expanded vegetable card (or null if none) in a client-side UI store. The list and cards SHALL read and update this value from the store rather than passing it only via props.

#### Scenario: Store holds expanded id

- **WHEN** the store is read
- **THEN** it provides the expanded card id (string or null)

#### Scenario: Expanding a card updates the store

- **WHEN** the user expands a card (e.g. by clicking the card outside the canvas)
- **THEN** the store is updated with that card’s id

#### Scenario: Collapsing updates the store

- **WHEN** the user collapses the expanded card
- **THEN** the store is updated to null (or equivalent)

#### Scenario: Single-open enforced via store

- **WHEN** one card is expanded and the user expands another
- **THEN** the store holds only the newly expanded card’s id

---

### Requirement: Optional debug flag in store

The system MAY hold the 3D debug flag in the same UI store so that list and canvas can read it without prop drilling. If the debug flag is stored elsewhere (e.g. module constant), this requirement is satisfied by documentation of where the flag lives.

#### Scenario: Debug flag readable without props

- **WHEN** a component needs to know if 3D debug mode is on
- **THEN** it can obtain that value from the store or a documented single source (e.g. atom or constant)
