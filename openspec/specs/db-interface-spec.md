# DB and Interface Spec – Offline Vegetable Inventory

## 1. Purpose

This spec defines the offline database layer and its public interfaces so that:

- The app maintains a single source of truth for vegetable inventory in IndexedDB.
- Interfaces are clear for implementation and unit testing.
- Behavior under various scenarios (add, remove, seed mock, clear mock, sort) is testable without relying on the full UI.

---

## 2. Stack and Boundaries

- **Storage:** Dexie (IndexedDB). DB name: `FridgeTracker`. Single table: `vegetables`.
- **Entry point:** `src/lib/db.ts` — database class, singleton, and DB operations.
- **Domain model and pure helpers:** `src/lib/vegetables-data.ts` — types and computed fields (remaining days, urgency).
- **State layer:** `src/hooks/use-vegetable-store.ts` — reads from DB via `useLiveQuery`, exposes sorted list and add/remove.

Tests use **Vitest**. Prefer unit tests for pure logic; use Dexie in a test DB or a mocked DB for `db.ts` behavior.

---

## 3. Database Interface

### 3.1 FridgeDb (Dexie)

- **Class:** `FridgeDb` extends Dexie.
- **Table:** `vegetables`, primary key `id` (string). Indexes: `id`, `fridgeDate`, `isMock`.
- **Schema versions:** v1 — `id, fridgeDate`; v2 — add `isMock`.
- **Singleton:** `db` — single instance used by the app.

### 3.2 Public API from `src/lib/db.ts`

| Function / export                    | Responsibility                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| `db`                                 | Singleton Dexie instance.                                                            |
| `db.vegetables.add(item)`            | Insert one `VegetableItem`.                                                          |
| `db.vegetables.bulkAdd(items)`       | Insert many (e.g. mock seed).                                                        |
| `db.vegetables.delete(id)`           | Delete one by id.                                                                    |
| `db.vegetables.toArray()`            | Return all rows (order not guaranteed).                                              |
| `db.vegetables.where(...).delete()`  | Delete by index (e.g. by id list).                                                   |
| `db.vegetables.filter(fn).toArray()` | In-memory filter (e.g. `isMock === true`).                                           |
| `seedMockData()`                     | Fetch `/mock-vegetables.json`, set `isMock: true` on each, `bulkAdd`; returns count. |
| `cleanMockData()`                    | Find all with `isMock === true`, delete by id, return count.                         |

### 3.3 Invariants

- Every stored item has `id`, `name`, `quantity`, `unit`, `fridgeDate`, `lifespanWholeDays`, `lifespanCutDays`, `wasCut`. Optional: `isMock` (boolean).
- User-added items must be stored with `isMock: false`. Seeded mock data with `isMock: true`.
- `cleanMockData()` only deletes rows where `isMock === true`; user data is left intact.

---

## 4. Domain Model Interfaces

### 4.1 VegetableItem (stored in DB)

Defined in `src/lib/vegetables-data.ts`.

| Field             | Type    | Required | Notes                                                                |
| ----------------- | ------- | -------- | -------------------------------------------------------------------- |
| id                | string  | yes      | Primary key; set at add time (e.g. `generateId()`).                  |
| name              | string  | yes      |                                                                      |
| quantity          | number  | yes      |                                                                      |
| unit              | string  | yes      | e.g. pcs, g, bunch.                                                  |
| fridgeDate        | string  | yes      | ISO date only (YYYY-MM-DD).                                          |
| lifespanWholeDays | number  | yes      | From preset or default.                                              |
| lifespanCutDays   | number  | yes      | From preset or default.                                              |
| wasCut            | boolean | yes      |                                                                      |
| isMock            | boolean | no       | Present and true for mock-seeded data.                               |
| imageUrl          | string  | no       | From preset or placeholder for custom; used for list/card thumbnail. |

### 4.2 VegetablePreset (in-memory only)

| Field             | Type   |
| ----------------- | ------ |
| name              | string |
| lifespanWholeDays | number |
| lifespanCutDays   | number |
| icon              | string |
| imageUrl          | string |

Not stored in IndexedDB; used for autocomplete, preset grid, and default lifespans. All presets use a shared placeholder URL constant by default.

### 4.3 Add flow (progressive disclosure)

The Add Vegetable form uses **progressive disclosure**: quantity, unit, fridge date, and wasCut are shown only after a selection exists (preset chosen or custom name from empty-state). Selection can be made via autocomplete dropdown, preset grid (when input is focused), or “Add [search] as custom vegetable” when search has no preset matches. Payload is built via `buildAddItemPayload()` and includes `imageUrl` (from preset or default).

### 4.4 Pure helpers (no DB, no side effects)

| Function                      | Input                                             | Output                           | Notes                                                                                                      |
| ----------------------------- | ------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `getRemainingDays(item)`      | VegetableItem                                     | number                           | `lifespan - daysSince(fridgeDate)`; lifespan = wasCut ? lifespanCutDays : lifespanWholeDays.               |
| `getUrgencyLevel(item)`       | VegetableItem                                     | "fresh" \| "warning" \| "danger" | danger: remaining ≤ 0 or ratio ≤ 0.2; warning: ratio ≤ 0.5; else fresh. Ratio = remaining / totalLifespan. |
| `generateId()`                | —                                                 | string                           | Unique id (e.g. timestamp + random).                                                                       |
| `buildAddItemPayload(params)` | name, quantity, unit, fridgeDate, wasCut, preset? | Omit\<VegetableItem, "id"\>      | Payload for addItem; includes imageUrl from preset or default.                                             |

These must be unit-tested with fixed dates or controlled `fridgeDate` / lifespans so results are deterministic.

---

## 5. Store Layer (use-vegetable-store)

- **Read:** `useLiveQuery(() => db.vegetables.toArray(), [])` — reactive list from DB.
- **Sort:** In-memory `sortByPriority`: first by urgency (danger → warning → fresh), then by `getRemainingDays` ascending. So list is “most critical first, healthiest last.”
- **Add:** `addItem(payload)` → `db.vegetables.add({ ...payload, id: generateId(), isMock: false })`.
- **Remove:** `removeItem(id)` → `db.vegetables.delete(id)`.

Sort logic and add/remove behavior are testable with a mocked or test Dexie instance.

---

## 6. Test Scenarios (Summary)

| Scenario                                            | Layer                                   | What to verify                                                                                |
| --------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| getRemainingDays (whole, cut, today, past, future)  | vegetables-data                         | Correct number of days.                                                                       |
| getUrgencyLevel (danger, warning, fresh boundaries) | vegetables-data                         | Correct level from ratio and remaining.                                                       |
| generateId                                          | vegetables-data                         | Non-empty, unique enough in a loop.                                                           |
| sortByPriority                                      | use-vegetable-store (or extracted util) | Order: danger first, then warning, then fresh; within same urgency, ascending remaining days. |
| seedMockData                                        | db                                      | Fetch failure throws; success: all items have isMock true, count returned, DB contains items. |
| cleanMockData                                       | db                                      | Only isMock true removed; count correct; isMock false untouched.                              |
| addItem / removeItem                                | store or db                             | Add inserts with isMock false; remove deletes by id.                                          |

---

## 7. Coverage Goals

- **Pure helpers (vegetables-data):** High line and branch coverage; no DB dependency.
- **db.ts (seedMockData, cleanMockData):** Unit tests with mocked fetch and Dexie (or test Dexie instance) so behavior is asserted without real network/IndexedDB if needed.
- **Store sort:** Unit test `sortByPriority` with arrays of VegetableItem; optional integration test with real Dexie + test DB.

Run: `npm test` (Vitest). Collect coverage for `src/lib/db.ts`, `src/lib/vegetables-data.ts`, and optionally `src/hooks/use-vegetable-store.ts`.
