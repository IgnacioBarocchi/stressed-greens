# Proposal: Add Vegetable Form Expansion

**Status:** Design and architecture proposal (no implementation)  
**Context:** Expand and improve the Add Vegetable form with progressive disclosure, visual preset grid, custom-vegetable entry, and image support.

---

## 1. Current State Summary

### 1.1 Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Page                                                                     │
│    └── AddVegetableForm(onAdd)                                            │
│          ├── isOpen → reveals full form or "Add Vegetable" button        │
│          ├── search, selectedPreset, quantity, unit, fridgeDate, wasCut   │
│          ├── showSuggestions → dropdown when search.length > 0 && match   │
│          └── All fields (search, qty, unit, date, wasCut) visible at once │
│    └── VegetableList(items, onRemove)                                     │
│    └── MockDataActions, RecipeFinder                                      │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼  onAdd(item) → useVegetableStore.addItem(item)
┌─────────────────────────────────────────────────────────────────────────┐
│  useVegetableStore                                                        │
│    useLiveQuery(() => db.vegetables.toArray()) → items                    │
│    sortedItems = useMemo(sortByPriority(items))                           │
│    addItem(item) → db.vegetables.add({ ...item, id, isMock: false })      │
└─────────────────────────────────────────────────────────────────────────┘
         │
         ▼  Dexie "vegetables" table (id, fridgeDate, isMock)
┌─────────────────────────────────────────────────────────────────────────┐
│  VegetableItem: id, name, quantity, unit, fridgeDate,                     │
│                 lifespanWholeDays, lifespanCutDays, wasCut, isMock?        │
│  VegetablePreset: name, lifespanWholeDays, lifespanCutDays, icon          │
│  (Presets in-memory only; no imageUrl today)                              │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Current UX Flow

1. User clicks "Add Vegetable" → form opens with search input and all secondary fields visible.
2. User types → filtered presets in dropdown; user selects one or keeps typing (custom name).
3. User edits quantity, unit, date, wasCut as needed.
4. User clicks "Add to Fridge" → `onAdd` called with payload; store writes to Dexie; form resets.

**Pain points:** All fields visible immediately (cognitive load, vertical space); no visual preset grid; no explicit "custom vegetable" path when search has no results; no image on presets or stored items.

---

## 2. Proposed Enhancements (Summary)

| Enhancement                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Progressive field rendering** | Quantity, unit, fridge date, wasCut toggle hidden until a vegetable is selected (preset or custom).                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Empty-state custom entry**    | When search yields no preset matches, show "Add Unknown / Custom Vegetable" and treat it as a valid selection so secondary fields appear.                                                                                                                                                                                                                                                                                                                                                                                 |
| **Visual selection grid**       | When search input is focused, show a card below with a responsive grid of preset tiles (image + name); selectable; mobile-first. **Filtered by search:** as the user types, the grid shows only presets whose name matches the search (same filter as autocomplete). **Match highlighting:** the matching substring in each preset name is visually highlighted (e.g. bold or accent) so users see why a row is shown (e.g. typing "be" shows Bell Pepper, Beetroot, Green Bean, Cucumber with "be" highlighted in each). |
| **Data model: imageUrl**        | Add `imageUrl` to `VegetablePreset` and `VegetableItem`; presets use placeholder `https://placehold.co/400x400` for now.                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Custom entry strategy**       | Evaluate empty-state-only vs explicit "Add Custom" CTA; recommend one approach.                                                                                                                                                                                                                                                                                                                                                                                                                                           |

---

## 3. UX Rationale

### 3.1 Progressive disclosure

- **Goal:** Minimize friction and focus attention on "which vegetable?" first. Quantity, unit, date, and cut state are secondary and only relevant once the user has committed to an item.
- **Benefit:** Shorter perceived form, fewer decisions on first glance, and a clear sequence: choose vegetable → then refine details.
- **Trade-off:** Users who want to change quantity/date after selection can do so in one place; no extra step.

### 3.2 Empty-state as entry point for custom

- **Goal:** When the search has no matches, the UI should not feel like an error. Instead, offer "Add Unknown / Custom Vegetable" so the empty state becomes an intentional path.
- **Benefit:** Custom vegetables are discoverable without a separate mode or toggle; one input serves both preset and custom.

### 3.3 Visual preset grid

- **Goal:** When the input is focused, show a scannable grid of presets (image + name) so users can pick without typing. Complements autocomplete for browse-first users.
- **Benefit:** Faster selection for known vegetables; clearer affordance that "these are the suggested options." Placeholder image (e.g. placehold.co) keeps implementation simple until real assets exist.

**Grid filtering and match highlighting (search-driven grid):**

- The grid behaves like a search-driven filter: **as the user types, the grid shows only presets whose name contains the search string** (same rule as autocomplete: e.g. `preset.name.toLowerCase().includes(search.trim().toLowerCase())`). When search is empty, the grid shows all presets (or a sensible default subset).
- **Example:** Typing "b" shows e.g. Bell Pepper, Broccoli, Green Bean, Beetroot (any preset with "b" in the name). Typing "be" narrows to Bell Pepper, Beetroot, Green Bean, Cucumber (and any other with "be"); Broccoli is filtered out.
- **Match highlighting:** In each grid cell, the portion of the preset name that matches the search is visually highlighted (e.g. bold, background tint, or accent color). Examples: for "be", "**Be**ll Pepper", "**Be**etroot", "Green **Be**an", "Cucum**be**r". This makes it clear why each item appears and supports quick scanning.
- **Single source of filter:** The same filtered list used for the autocomplete dropdown should drive the grid (one derived list: e.g. `filteredPresets`). Dropdown and grid stay in sync; both show the same matches and both benefit from highlighting in their label/name display.

### 3.4 Image on presets and items

- **Goal:** Presets have an image URL for the grid; stored items carry an image URL so the list/card can show a thumbnail later if desired.
- **Rationale:** Single source of truth (preset or placeholder for custom) at add time; no need to look up preset by name when rendering the list.

---

## 4. Custom Entry: Empty-State vs Explicit CTA (Evaluation)

### 4.1 Option A: Empty-state-driven only

- Custom entry is only available when the user has typed and the autocomplete returns no matches. Then we show "Add Unknown / Custom Vegetable."
- **Pros:** One input; no extra UI; custom is a natural fallback.
- **Cons:** Users who already know the vegetable is not in the list must type something and wait for "no results," which can feel like friction or a dead end before they see the option.

### 4.2 Option B: Explicit "Add Custom Vegetable" CTA (always visible)

- A persistent control (e.g. link or button) near the search: "Add Custom Vegetable" or "Not in the list? Add your own." Clicking it either clears search and sets a "custom mode" or inserts a sentinel so secondary fields appear with an empty/custom name.
- **Pros:** No need to type to discover custom; power users can go straight to custom.
- **Cons:** Two entry paths (search vs custom) can increase cognitive load; need to define behavior when user then types (e.g. switch back to search, or merge with custom name).

### 4.3 Option C: Hybrid (e.g. toggle or segmented control)

- "Preset | Custom" or similar. Preset = current behavior + grid; Custom = skip search, show name input + secondary fields.
- **Pros:** Clear mental model; no "type to get no results" for custom.
- **Cons:** More UI; possible redundancy with empty-state custom.

### 4.4 Recommendation: **Option A (empty-state-driven) with a small enhancement**

- **Primary path:** Keep custom entry as the empty-state option: when `filteredPresets.length === 0` and `search.trim().length > 0`, show a single actionable row: "Add '[search]' as custom vegetable" (or "Add Unknown / Custom Vegetable" with the typed name used as the item name). Selecting it sets "selected custom" state and reveals secondary fields, same as selecting a preset.
- **Rationale:**
     - One input and one mental model: "type to search; if no match, you can still add it."
     - Avoids extra chrome (no toggle, no persistent CTA). The empty state is the affordance.
     - Power users who want custom can type a name and immediately see "no results" + custom option (one clear step).
- **Optional enhancement:** If analytics or feedback show that many users type custom names and get no results, add a subtle hint near the input when it’s empty or on first focus: e.g. "Search or add a custom vegetable." No extra button required.
- **Progressive rendering:** Same rule for both preset and custom: secondary fields (quantity, unit, date, wasCut) appear only after a "selection" is made (preset chosen or custom chosen from empty state). So custom does not require different validation rules: same payload shape, with name from search and default lifespans (e.g. 7/3). Preset linking: custom items have no preset; we already support that (preset optional in payload). Data integrity: no change; custom is just "no matching preset."

**Conclusion:** Use empty-state-driven custom entry as the main path; avoid a persistent "Add Custom" CTA or Preset | Custom toggle unless later evidence justifies it.

---

## 5. State Flow Impact

### 5.1 useLiveQuery and store

- **No change to store or Dexie read path.** `useVegetableStore` continues to expose `items`, `addItem`, `removeItem`. The shape of the object passed to `addItem` will gain an optional (or required) `imageUrl`; the store does not need to know about "preset vs custom" or progressive disclosure.
- **Add flow is entirely local UI state.** Progressive disclosure (show/hide quantity, unit, date, wasCut) is driven by "has selection" (preset or custom). That state lives in the Add form (or a child), not in the store. useLiveQuery remains the single reactive source for the list.

### 5.2 Form state machine (conceptual)

```
                    ┌──────────────────────────────────────┐
                    │  Form open, no selection               │
                    │  Visible: search + (grid when focus)   │
                    │  Hidden: qty, unit, date, wasCut       │
                    └──────────────────────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │ select preset (grid or     │ select "Add custom"        │
         │ autocomplete)              │ (empty state)              │
         ▼                            ▼                            │
┌─────────────────────┐    ┌─────────────────────┐                │
│  Selection = preset  │    │  Selection = custom  │                │
│  name, lifespans,   │    │  name = search.trim  │                │
│  imageUrl from preset│    │  default lifespans   │                │
│  Show: qty, unit,   │    │  imageUrl=placeholder│                │
│  date, wasCut       │    │  Show: qty, unit,   │◀───────────────┘
│  Submit → onAdd      │    │  date, wasCut       │
└─────────────────────┘    │  Submit → onAdd      │
                           └─────────────────────┘
```

- **Click-outside / blur:** Current behavior (e.g. close suggestions) must be extended so that closing the grid or suggestions does not clear "selection" once the user has selected a preset or custom. Only explicit clear or form close resets selection.

### 5.3 Implications for existing logic

- **handleSelect:** Today it sets `selectedPreset` and `search`. It must be extended to support "custom" selection (e.g. `selectedPreset = null` but a flag or derived state like `selectedCustomName = search.trim()`). Submit logic already supports "no preset" (custom) via `selectedPreset || VEGETABLE_PRESETS.find(...)` and default 7/3 lifespans; that remains valid.
- **Submit:** Payload must include `imageUrl`: from preset if preset selected, else placeholder. Store and DB accept the new field.

---

## 6. Component Architecture Changes

### 6.1 High-level structure

- **AddVegetableForm** remains the container. It owns: isOpen, search, selectedPreset, "selected custom" (or derived), quantity, unit, fridgeDate, wasCut, showSuggestions, and refs for click-outside.
- **New or refactored pieces:**
     - **Selection trigger / input block:** Search input + (when focused) a card below containing:
          - **Preset grid:** New component. Receives **filtered** presets (same list as dropdown: filtered by `search`, e.g. `name.toLowerCase().includes(search.toLowerCase())`), `search` (for highlighting), `onSelect(preset)`, and imageUrl per preset. Renders responsive grid; each cell: image + **name with match highlighting** (the substring that matches `search` is visually emphasized). As the user types, the grid updates to show only matching presets. When search is empty, show all presets. Click selects preset and reveals secondary fields.
          - **Autocomplete dropdown:** Same filtered list as the grid. When `search.length > 0` and there are matches, show dropdown (optionally with match highlighting in each row). When no matches, show empty-state custom. Grid and dropdown can both be visible (grid below input, dropdown below that) or only one at a time—design choice; in both cases they share the same `filteredPresets` and highlighting logic.
     - **Empty state block:** When `search.trim().length > 0` and `filteredPresets.length === 0`, show a single option: "Add '[search]' as custom vegetable" (or similar). Clicking it sets "custom selected" and reveals secondary fields; name for submit = search.trim().
     - **Secondary fields block:** Quantity, unit, fridge date, wasCut. Rendered only when `hasSelection` (preset selected or custom selected). This block is the same as today’s form body, just conditionally rendered.

### 6.2 Suggested component boundaries

| Component                                       | Responsibility                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **AddVegetableForm**                            | Orchestration: open/close, search, selection (preset or custom), secondary form state, submit, reset. Decides when to show grid vs dropdown vs empty state vs secondary fields.                                                                                                                                    |
| **PresetGrid** (new)                            | Receives **filtered** presets (by search), current `search` string (for highlighting), imageUrl per preset. Renders responsive grid; each tile shows image + name with **matching substring highlighted**. Grid updates as user types (same filter as dropdown). On select calls `onSelect(preset)`. Mobile-first. |
| **PresetDropdown** (existing, can be extracted) | List of filtered presets; on select calls `onSelect(preset)`. Can show lifespan hint.                                                                                                                                                                                                                              |
| **EmptyStateCustom** (new or inline)            | When no preset match and search non-empty: one button/row "Add as custom"; on click calls `onSelectCustom(name)`.                                                                                                                                                                                                  |
| **SecondaryFields** (optional extract)          | Quantity, unit, date, wasCut. Receives state and setters; no need to know preset vs custom.                                                                                                                                                                                                                        |

### 6.3 Focus and visibility rules

- **Grid visibility:** Shown when search input has focus. Optionally hide when user has selected (preset or custom) to avoid clutter. Click-outside (or blur) should not clear selection; it may close grid/dropdown only.
- **Dropdown visibility:** Shown when `showSuggestions && search.length > 0`: if matches, show preset list; if no matches, show empty-state custom option.
- **Accessibility:** Focus management when opening/closing grid and dropdown; ensure keyboard can select preset or custom and then move to secondary fields.

---

## 7. Type and Interface Updates

### 7.1 VegetablePreset (`src/lib/vegetables-data.ts`)

- Add:
     - `imageUrl: string`
- Default for all current presets: `imageUrl: "https://placehold.co/400x400"` (or a constant). No other preset fields change.

### 7.2 VegetableItem (`src/lib/vegetables-data.ts`)

- Add:
     - `imageUrl: string` (recommended required, with a default at add time when missing for backward compatibility)
- When adding an item from a preset: `imageUrl = preset.imageUrl`. When adding a custom item: `imageUrl = "https://placehold.co/400x400"` (or same constant).
- All consumers of `VegetableItem` (store, VegetableCard, etc.) must accept the new field. VegetableCard does not currently render an image; it can remain so until a later task, but the type must include `imageUrl` so that stored items are consistent.

### 7.3 Payload to addItem

- Today: `Omit<VegetableItem, "id">`. After change: same, but with `imageUrl` required (or optional with default in the form so existing call sites do not break). Store’s `addItem` will pass through to Dexie; no change to signature beyond the shape of the object.

### 7.4 Preset list and mock data

- **VEGETABLE_PRESETS:** Every entry gets `imageUrl: "https://placehold.co/400x400"` (or constant).
- **scripts/mock-vegetables.ts:** Generated items should include `imageUrl` (same placeholder) so mock data matches the new shape. Existing mock JSON can be regenerated with `npm run generate-mock` after the constant is updated.

---

## 8. Database Adjustments

### 8.1 Dexie schema

- **VegetableItem** gains `imageUrl`. Dexie does not require a schema version bump for adding a new non-indexed field; existing records without `imageUrl` can be treated as "use default in UI" (e.g. placeholder) when reading. If you prefer strict typing and no missing fields, add a migration in a new version (e.g. v3) that adds `imageUrl` to existing documents with the placeholder URL.
- **Indexes:** No need to index `imageUrl`. Current indexes `id`, `fridgeDate`, `isMock` remain.

### 8.2 Backward compatibility

- **Existing stored items** without `imageUrl`: either treat as optional in TypeScript (`imageUrl?: string`) and in UI use placeholder when missing, or run a one-time migration (Dexie version upgrade) to set `imageUrl` on all existing rows. Recommendation: optional field + default in UI to avoid migration complexity; new adds always set `imageUrl`.

---

## 9. Edge Cases and Behaviors

| Edge case                                                    | Recommendation                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User focuses input, selects nothing, blurs                   | Grid closes; no selection. Secondary fields stay hidden.                                                                                                                                                                                                               |
| User selects preset, then clears search manually             | Define: either clear selection (and hide secondary fields) or keep selection and show preset name. Recommendation: keep selection and show preset name; "clear" could be a separate control if needed.                                                                 |
| User selects "Add custom", then changes search               | Either keep "custom" selection with name = previous search and ignore new typing until submit, or treat as "cleared" and hide secondary fields. Recommendation: keep selection; name at submit = what was in search when "Add custom" was clicked (store it in state). |
| Empty search + focus                                         | Show grid with **all presets** (no filter). No dropdown. No "Add custom" (nothing to add). No highlighting (search is empty).                                                                                                                                          |
| Search matches one preset; user could click grid or dropdown | Both should set same state (selectedPreset); no duplication of logic.                                                                                                                                                                                                  |
| Very long preset list in grid                                | Grid can be scrollable; consider pagination or "show more" if needed. Mobile: small tiles, many rows scroll.                                                                                                                                                           |
| Custom vegetable with empty name                             | Disallow submit when name is empty (current behavior). "Add custom" only appears when `search.trim().length > 0`.                                                                                                                                                      |
| Image load failure in grid                                   | Use placeholder or alt text; do not block selection.                                                                                                                                                                                                                   |
| Offline: placehold.co not loading                            | Images may fail; app still works. Consider later: local placeholder asset or data URL.                                                                                                                                                                                 |

---

## 10. Suggested Task Breakdown (Implementation Steps)

1. **Data model and constants**
      - Add `imageUrl` to `VegetablePreset` and `VEGETABLE_PRESETS` (placeholder constant).
      - Add `imageUrl` to `VegetableItem` (required or optional with default); update `addItem` payload type.
      - Optionally: Dexie v3 migration to backfill `imageUrl` on existing records; or leave optional and default in UI.

2. **Mock data and scripts**
      - Update `scripts/mock-vegetables.ts` to set `imageUrl` on generated items. Regenerate `public/mock-vegetables.json`.

3. **Progressive disclosure**
      - Introduce "selection" state (preset or custom). Render quantity, unit, date, wasCut only when selection exists.
      - Ensure submit uses selected preset or custom name and default lifespans; include `imageUrl` in payload.

4. **Empty-state custom entry**
      - When `filteredPresets.length === 0` and `search.trim().length > 0`, show "Add '[search]' as custom vegetable" (or similar). On select: set custom selection, reveal secondary fields, keep name for submit.

5. **Preset grid component**
      - New component: receives filtered presets (by search), search string, imageUrl per preset, `onSelect(preset)`. Render responsive grid below input when input is focused. **Filter:** use same `filteredPresets` as dropdown (e.g. `name.toLowerCase().includes(search.toLowerCase())`); when search empty show all presets. **Highlight:** in each tile, highlight the substring of the preset name that matches `search` (e.g. wrap in a span with a class for bold/accent). Grid updates reactively as user types. Handle click-outside to close grid without clearing selection.

6. **Integration in Add form**
      - When input focused: show grid (and optionally dropdown when search non-empty). Wire grid select and dropdown select to same selection handler. Wire empty-state custom to custom selection. Conditional rendering of secondary fields and submit button (only when selection exists).

7. **VegetableCard and list**
      - If desired: show thumbnail from `item.imageUrl` in card (optional follow-up). Type already supports it; no DB change needed for display.

8. **Tests and docs**
      - Unit test: payload builder or submit logic includes `imageUrl` (preset vs custom). Update `openspec/specs/db-interface-spec.md` and `openspec/specs/product-definition.md` with `imageUrl` and new Add flow.

---

## 11. Risk Analysis

| Risk                                  | Mitigation                                                                                                                                                                    |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Regression in add flow                | Keep submit contract (payload shape) and store API stable; extend with `imageUrl`. Progressive disclosure is additive (hide until selection).                                 |
| Grid + dropdown UX confusion          | Clear rules: grid on focus; dropdown when typing with matches; empty state when no matches. Optionally show only grid when search empty, only dropdown when search non-empty. |
| Custom entry ambiguity                | Single definition: custom = "Add custom" from empty state; name = search at time of click. Store in state to avoid confusion if user types more.                              |
| Existing DB records without imageUrl  | Treat as optional in type and UI; default to placeholder when missing. Or one-time migration.                                                                                 |
| Performance with many presets in grid | Grid is in-memory; use CSS grid and overflow scroll. If needed later, virtualize or paginate.                                                                                 |
| Accessibility and keyboard            | Ensure grid and dropdown are keyboard-navigable and that focus moves to secondary fields after selection.                                                                     |
| Anti-pattern rule (useEffect)         | Click-outside and focus/blur logic may require effects or event listeners; keep them minimal and document why they are necessary if they are added.                           |

---

## 12. Summary

- **Progressive fields:** Quantity, unit, date, wasCut appear only after a vegetable is selected (preset or custom).
- **Custom entry:** Empty-state-driven "Add custom" when search has no matches; no persistent "Add Custom" CTA or Preset | Custom toggle in the first version.
- **Visual grid:** Focus on input shows a card with a responsive preset grid (image + name). **Grid is filtered by search** (same as dropdown); as the user types, only matching presets are shown, and the **matching substring in each name is highlighted** (e.g. "be" in "Bell Pepper", "Beetroot"). Empty search shows all presets. Selection reveals secondary fields.
- **Data model:** `VegetablePreset` and `VegetableItem` gain `imageUrl`; placeholder `https://placehold.co/400x400` for now; optional backfill or optional field for existing DB rows.
- **Store/Dexie:** No change to useLiveQuery or read path; add payload gains `imageUrl`. Optional Dexie version bump for migration.
- **Components:** Add PresetGrid and empty-state custom block; refactor Add form to selection-driven visibility and single submit path.

This document is design and architecture only. No implementation or UI code is included.
