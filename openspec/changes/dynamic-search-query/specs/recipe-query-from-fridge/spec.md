## ADDED Requirements

### Requirement: Recipe search query is derived from fridge vegetables

The system SHALL build the recipe search query from the current fridge vegetable list. The query SHALL include the vegetable names (e.g. in a form such as "100% vegan recipes containing X, Y, Z"). Names SHALL be taken from the fridge items; duplicate names MAY be deduplicated so each vegetable type appears once in the query.

#### Scenario: Query includes names from fridge

- **WHEN** the user has one or more vegetables in the fridge and triggers recipe search
- **THEN** the search is performed with a query that contains the vegetable names from the fridge (e.g. comma-separated or equivalent)

#### Scenario: No hardcoded ingredient list

- **WHEN** recipe search is implemented
- **THEN** the query string is not hardcoded to a fixed list (e.g. "bell pepper, carrots and mushrooms"); it is built from the current fridge data

---

### Requirement: Empty fridge is handled without a meaningless search

The system SHALL support the case when the fridge has no vegetables. The system SHALL NOT perform a recipe search with an empty or meaningless list of ingredients (e.g. "recipes containing " with nothing after it). The system SHALL either disable the recipe-search action when the fridge is empty or show a clear message so the user understands they need to add vegetables first.

#### Scenario: No search when fridge is empty

- **WHEN** the fridge has no items and the user would trigger recipe search
- **THEN** either the search is not invoked, or the user is shown a message (e.g. "Add vegetables to find recipes") and no search is sent with an empty ingredient list

#### Scenario: Search allowed when fridge has at least one item

- **WHEN** the fridge has at least one vegetable
- **THEN** the user can trigger recipe search and the query SHALL include the vegetable name(s) from the fridge
