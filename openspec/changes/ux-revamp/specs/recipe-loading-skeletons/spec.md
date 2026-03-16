## ADDED Requirements

### Requirement: Skeleton placeholders while recipe search loads

While recipe search results are loading, the system SHALL display a fixed number of skeleton card placeholders (e.g. 5) in the same approximate layout as recipe result cards. The system SHALL remove or replace the skeletons when results are available or when loading ends.

#### Scenario: Skeletons shown during load

- **WHEN** the user triggers recipe search and the results are not yet available
- **THEN** the system displays the configured number of skeleton cards (e.g. 5)

#### Scenario: Skeletons removed when results arrive

- **WHEN** recipe search results become available
- **THEN** the skeleton cards are no longer shown and the actual result cards are shown

#### Scenario: Skeletons removed when load fails

- **WHEN** recipe search loading ends without results (e.g. error or empty)
- **THEN** the skeleton cards are no longer shown and the appropriate empty or error state is shown
