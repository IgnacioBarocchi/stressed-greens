## Context

The app is frontend-only (Vite, React, Dexie). The main page uses `useVegetableStore()` to get `items` (VegetableItem[]) and passes them to VegetableList. RecipeFinder is rendered on the same page and currently invokes Tauri `search_recipes` with a hardcoded query. VegetableItem has a `name` field (e.g. "Bell Pepper", "Carrot"). No backend; recipe search is via Tauri command.

## Goals / Non-Goals

**Goals:**

- Build the recipe search query from the current fridge vegetable list (item names).
- Remove all hardcoded ingredient lists from the query.
- Handle empty fridge in a clear way (no meaningless search).

**Non-Goals:**

- Changing how search results are parsed or displayed.
- Adding new APIs or Tauri commands.
- Changing the shape of VegetableItem.

## Decisions

### 1. How RecipeFinder gets fridge items

**Decision:** Pass `items` (VegetableItem[]) as a prop from the page to RecipeFinder. The page already has `items` from `useVegetableStore()`; add `items` to RecipeFinder props and pass it when rendering.

**Rationale:** Single source of truth (store) at the page; RecipeFinder stays a pure presenter of "find recipes for these items". Easy to test by passing mock items. No extra store subscription inside RecipeFinder.

**Alternative:** RecipeFinder calls `useVegetableStore()` and reads `items` itself. Rejected to avoid duplicating the subscription and to keep the component easier to test with explicit props.

### 2. How to build the query string

**Decision:** Derive a list of unique vegetable names from `items` (e.g. `[...new Set(items.map(i => i.name))]`), then format as a single string (e.g. comma-separated) and embed in a fixed template such as `"100% vegan recipes containing {names}"`. If the list is empty, do not run search (see empty-fridge handling).

**Rationale:** Simple, no new dependencies. Deduplication avoids "Carrot, Carrot, Carrot" when the user has multiple carrots. Template keeps the query shape consistent with current behavior.

**Alternative:** More complex NLP or synonym expansion. Out of scope for this change.

### 3. Empty-fridge behavior

**Decision:** When there are no items (or no items with names), do not call the search. Either disable the "Find recipes" button and show a short hint (e.g. "Add vegetables to find recipes") or show the hint when the user tries to find recipes with an empty list. Prefer disabling the button when `items.length === 0` and optionally showing the hint near the button so the user knows why it’s disabled.

**Rationale:** Avoids sending a query with no ingredients (e.g. "100% vegan recipes containing ") which would produce poor or irrelevant results. Clear UX: add vegetables first, then find recipes.

**Alternative:** Fallback to a generic query (e.g. "vegan vegetable recipes"). Rejected because results would not reflect the user’s fridge.

## Risks / Trade-offs

| Risk                                   | Mitigation                                                                                                |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Very long query if user has many items | Cap the number of names included (e.g. first 10–15) or truncate the query length; document limit in code. |
| Duplicate or empty names in data       | Deduplicate by name; treat empty name as absent for query building.                                       |

## Migration Plan

- Add `items` prop to RecipeFinder; page passes `items` from existing store.
- Replace hardcoded query with a small helper that builds the query from `items` (unique names + template).
- Add empty-fridge handling (disable button and/or hint).
- No rollback beyond reverting the change; no data migration.

## Open Questions

- Maximum number of vegetable names to include in the query (if any). Can be decided in implementation (e.g. 15 names max).
