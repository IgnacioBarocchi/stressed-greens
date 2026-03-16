## Why

The recipe finder uses a hardcoded search query ("bell pepper, carrots and mushrooms"), so results never reflect what the user actually has in the fridge. Building the search query from the vegetables currently in the fridge makes recipe discovery relevant and reduces food waste.

## What Changes

- Remove the hardcoded recipe search query in RecipeFinder.
- Build the search query from the vegetables in the user's fridge (e.g. their names, optionally deduplicated).
- When the user clicks "Find recipes", the app SHALL pass a query that includes the fridge contents (e.g. "100% vegan recipes containing X, Y, Z" where X, Y, Z are the vegetable names from the list).
- Handle the empty-fridge case (e.g. fallback query or disable the action / show a message).

## Capabilities

### New Capabilities

- **recipe-query-from-fridge**: The recipe search query SHALL be derived from the current fridge vegetable list (e.g. list of vegetable names). The system SHALL support an empty fridge (fallback query or clear UX so the user is not sent a meaningless search).

### Modified Capabilities

- None.

## Impact

- **RecipeFinder**: Receives fridge items (or reads from store); builds query from item names; passes dynamic query to the existing search invocation (e.g. Tauri `search_recipes`). No change to result parsing or UI beyond how the query is produced.
- **Page or parent**: Passes vegetable items to RecipeFinder (or RecipeFinder reads from the same store as the list) so it has access to current fridge contents.
- **APIs**: No change to `search_recipes` signature; only the `query` string value becomes dynamic.
