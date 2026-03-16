## 1. Pass fridge items to RecipeFinder

- [x] 1.1 Add an `items` prop (VegetableItem[]) to RecipeFinder and use it instead of any hardcoded list
- [x] 1.2 On the main page, pass `items` from useVegetableStore() to RecipeFinder

## 2. Build query from items

- [x] 2.1 Add a small helper (e.g. in RecipeFinder or in lib) that takes VegetableItem[] and returns a search query string: unique names (deduplicate by name), filter empty names, format (e.g. comma-separated) and embed in template like "100% vegan recipes containing {names}"; return empty string or signal when no names
- [x] 2.2 In handleFindRecipes, build the query using the helper from current items; only call search_recipes when the query is non-empty

## 3. Empty-fridge handling

- [x] 3.1 When items is empty (or no valid names), disable the "Find recipes" button
- [x] 3.2 Show a short hint when disabled (e.g. "Add vegetables to find recipes") so the user knows why

## 4. Manual verification

- [ ] 4.1 With empty fridge, button is disabled and hint visible; no search is sent
- [ ] 4.2 With one or more vegetables, button works and search query contains those vegetable names
