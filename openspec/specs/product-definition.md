# Product Definition – Vegetable Shelf-Life Inventory App

## 1. Overview

The Vegetable Shelf-Life Inventory App is an offline-first, mobile-first application designed to help users track vegetables stored in their refrigerator, prioritize consumption based on remaining freshness, and reduce food waste.

The core principle of the product is urgency-based simplicity: minimal input from the user, biologically informed shelf-life modeling under the hood, and automatic prioritization of what should be consumed first.

The application runs fully offline using Dexie (IndexedDB) as an on-device database and is architected for portability to a Tauri (Vite + Rust) desktop environment.

---

## 2. Problem Statement

Users frequently forget what vegetables they have stored, when they were added, and which items are closest to spoilage. This results in:

- Food waste
- Cognitive overhead (mental tracking)
- Repeated purchases of already-owned produce
- Poor meal planning

Existing inventory or grocery apps are either too generic or require excessive manual input.

This product solves that by:

- Reducing input friction
- Modeling shelf-life automatically
- Sorting items by urgency
- Providing recipe inspiration before spoilage occurs

---

## 3. Core Product Principles

1. Offline-first
2. Minimal data entry
3. Biological realism in shelf-life modeling
4. Urgency-driven UX
5. Clean, modern, dark-mode interface
6. Modular architecture for future portability

---

## 4. Functional Scope

### 4.1 Add Vegetable Flow

Users can add vegetables via:

- **Preset grid** (when search input is focused): responsive grid of presets (image + name), filtered by search; matching substring in names is highlighted. Click selects preset.
- **Autocomplete dropdown** (when typing): filtered preset list; same selection as grid.
- **Empty-state custom**: when search has no preset matches, one option “Add [search] as custom vegetable”; click sets custom selection.

**Progressive disclosure:** Quantity, unit, fridge date, and WasCut are shown only after a selection exists (preset or custom). Submit is available only then.

User-provided inputs (after selection):

- Quantity (number + unit)
- Fridge date (default: current date)
- WasCut (boolean flag)

System-derived fields (not user-editable):

- Lifespan whole (days)
- Lifespan cut (days)
- imageUrl (from preset or placeholder for custom)

Lifespan values are sourced from a preset vegetable dataset stored locally. Custom entries use default lifespans (e.g. 7 / 3 days).

---

### 4.2 Inventory View

The main view presents:

- Card-based vegetable entries
- Sorted by priority on every load: urgency first (danger → warning → fresh), then by remaining days ascending within each tier
- Visual urgency indicators (color or status-based)
- Delete / remove action

Remaining life is calculated dynamically (see `getRemainingDays` in `src/lib/vegetables-data.ts`):

If wasCut = false: RemainingLife = lifespanWholeDays - daysSinceFridgeDate  
If wasCut = true: RemainingLife = lifespanCutDays - daysSinceFridgeDate

Urgency levels (see `getUrgencyLevel`): **danger** (remaining ≤ 0 or ratio ≤ 0.2), **warning** (ratio ≤ 0.5), **fresh** (otherwise). Ratio = remaining / totalLifespan.

Sorting (see `sortByPriority` in `src/hooks/use-vegetable-store.ts`) ensures most critical items first, healthiest last, regardless of raw DB order.

---

### 4.3 Recipe Discovery

Each vegetable entry can trigger a "Find Recipes" action.

This feature:

- Displays a list of vegan recipe URLs
- Uses mock placeholder URLs initially
- Renders Open Graph preview cards

Future enhancement may include LLM-generated recipe suggestions.

---

## 5. Data Architecture

### 5.1 Storage Model

The application uses **Dexie** (IndexedDB wrapper). Database name: `FridgeTracker`. Table: `vegetables` with indexes `id`, `fridgeDate`, `isMock`.

- **Database and API**: `src/lib/db.ts` — defines `FridgeDb`, singleton `db`, `seedMockData()`, `cleanMockData()`
- **State access**: `src/hooks/use-vegetable-store.ts` — `useLiveQuery` for reactive list, `addItem` / `removeItem`, in-memory sort by priority

Live synchronization is achieved using `dexie-react-hooks`’s `useLiveQuery` so the UI updates when the DB changes.

**Mock data**

- **Generate**: `npm run generate-mock` runs `scripts/mock-vegetables.ts` and writes `public/mock-vegetables.json` with items marked `isMock: true` and varied freshness.
- **Load**: In-app “Load mock data” calls `seedMockData()` (fetch + `bulkAdd` with `isMock: true`).
- **Clear**: In-app “Clear mock data” or opening `/clean-mock.html` calls `cleanMockData()` to delete all records where `isMock === true`. Script entry: `src/scripts/run-clean-mock.ts`; standalone script reference: `scripts/clean-mock-data.ts` (browser-only).

This guarantees:

- Full offline capability
- Instant UI updates on state change
- No external backend requirement

---

### 5.2 Domain Model

Source: `src/lib/vegetables-data.ts`.

#### VegetablePreset (preset list only; no DB table)

- name
- lifespanWholeDays
- lifespanCutDays
- icon
- imageUrl (placeholder URL for grid and item thumbnail)

Presets are in-memory (`VEGETABLE_PRESETS`). Custom entries use the same fields by name; no presetId.

#### VegetableItem (stored in Dexie `vegetables` table)

- id (string, primary)
- name
- quantity
- unit
- fridgeDate (ISO date string)
- lifespanWholeDays
- lifespanCutDays
- wasCut (boolean)
- isMock (optional boolean) — true for seeded mock data; user-added items use isMock: false
- imageUrl (optional string) — from preset or placeholder; used for card thumbnail

Remaining life and urgency are computed via `getRemainingDays()` and `getUrgencyLevel()`, not stored.

---

## 6. UX Characteristics

- Mobile-first layout
- Dark mode default
- Autocomplete-based vegetable selection
- Card-driven inventory list
- Visual freshness indicators
- Smooth micro-interactions
- Minimal navigation depth

The UI emphasizes clarity and immediacy over feature density.

---

## 7. Non-Functional Requirements

- Fully operational without internet
- Fast render performance
- Modular components
- Extractable state logic
- Portable to Tauri environment
- No backend dependency

### 7.1 Scripts and tooling

- `npm run generate-mock` — generates `public/mock-vegetables.json` (TS entry: `scripts/mock-vegetables.ts`)
- `npm run clean-mock` — prints instruction to open `/clean-mock.html` when dev server is running to clear mock-only records
- Multi-page build includes `clean-mock.html` (Vite `rollupOptions.input`) for standalone mock cleanup

---

## 8. Future Roadmap

- Expanded vegetable preset database
- Ethylene sensitivity modeling
- Advanced spoilage prediction using respiration coefficients
- Batch add functionality
- Push notifications (desktop/mobile wrapper)
- AI-assisted recipe matching

---

## 9. Success Criteria

The product succeeds if:

- Users reduce vegetable waste
- Adding inventory takes less than 10 seconds per item
- Inventory state is always accurate offline
- Urgency sorting clearly influences consumption behavior

---

## 10. Summary

This product is an offline-first vegetable shelf-life prioritization tool designed to reduce food waste through biologically informed modeling and frictionless UX. It combines modern front-end architecture with device-level storage to deliver a resilient, portable, and efficient inventory system.
