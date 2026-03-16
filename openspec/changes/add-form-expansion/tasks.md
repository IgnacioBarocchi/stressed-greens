# Tasks: Add Form Expansion

Implement in order. Each task is scoped to the checklist below. Reference `openspec/specs/add-form-expansion-proposal.md` for details.

---

- [x] **Task 1: Data model and constants**
     - Add `imageUrl` to `VegetablePreset` in `src/lib/vegetables-data.ts`.
     - Add `imageUrl` to every entry in `VEGETABLE_PRESETS` (use constant e.g. `https://placehold.co/400x400`).
     - Add `imageUrl` to `VegetableItem` (required or optional with default in UI for backward compat).
     - Ensure payload to `addItem` includes `imageUrl` (from preset or placeholder for custom).

- [x] **Task 2: Mock data and scripts**
     - Update `scripts/mock-vegetables.ts` so generated items include `imageUrl` (same placeholder).
     - Regenerate `public/mock-vegetables.json` (run `npm run generate-mock`).

- [x] **Task 3: Progressive disclosure**
     - Introduce "selection" state in Add form: either a preset or a custom name.
     - Render quantity, unit, fridge date, and wasCut only when a selection exists (preset or custom).
     - Submit logic: use selected preset or custom name; include `imageUrl` in payload (preset’s or placeholder).

- [x] **Task 4: Empty-state custom entry**
     - When `filteredPresets.length === 0` and `search.trim().length > 0`, show one option: "Add '[search]' as custom vegetable" (or similar).
     - On click: set custom selection (store name for submit), reveal secondary fields.
     - Ensure submit uses that stored name and default lifespans (7/3).

- [x] **Task 5: Preset grid component**
     - Create new component (e.g. `PresetGrid`) that receives: filtered presets (by search), search string, `onSelect(preset)`.
     - Filter: same as dropdown (`name.toLowerCase().includes(search.toLowerCase())`); when search empty show all presets.
     - Render responsive grid (image + name per tile). In each name, **highlight the substring that matches `search`** (e.g. span with class).
     - Grid updates as user types. Show below input when input is focused. Handle click-outside (close grid without clearing selection).

- [x] **Task 6: Integration in Add form**
     - When search input focused: show grid below (and dropdown when search non-empty and there are matches).
     - Wire grid select and dropdown select to same selection handler.
     - Wire empty-state custom to custom selection.
     - Conditional rendering: secondary fields and submit button only when selection exists.

- [x] **Task 7: VegetableCard image (optional)**
     - If desired: show thumbnail from `item.imageUrl` in `VegetableCard`. Skip if not in scope.

- [x] **Task 8: Tests and docs**
     - Add or extend unit test: payload / submit logic includes `imageUrl` (preset vs custom).
     - Update `openspec/specs/db-interface-spec.md` and `openspec/specs/product-definition.md` with `imageUrl` and new Add flow.
