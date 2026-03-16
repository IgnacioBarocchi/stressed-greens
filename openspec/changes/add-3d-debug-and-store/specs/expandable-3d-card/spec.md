## ADDED Requirements

### Requirement: Canvas pointer events do not trigger card expand or collapse

Pointer events that originate on the 3D canvas or its wrapper (e.g. the div that contains the Canvas) SHALL NOT bubble to the card. As a result, orbit-drag and clicks on the canvas SHALL NOT expand or collapse the card.

#### Scenario: Orbit-drag does not toggle card

- **WHEN** the user pointer-drags on the 3D canvas (e.g. to orbit the camera)
- **THEN** the card does not expand or collapse

#### Scenario: Click on canvas does not toggle card

- **WHEN** the user clicks on the 3D canvas (without dragging)
- **THEN** the card does not expand or collapse

#### Scenario: Click outside canvas still toggles card

- **WHEN** the user clicks on the card area outside the 3D canvas (e.g. the card header or content)
- **THEN** the card expand/collapse behavior runs as specified (toggle or no-op per 3D setting)
