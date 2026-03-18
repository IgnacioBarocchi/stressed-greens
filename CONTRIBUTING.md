# Contributor Onboarding: Module Map (Deep Modules)

This repo aims to keep “business/domain logic” separate from React and persistence, so newcomers can understand the system by reading a small set of modules.

This doc is intentionally a *map*, not a complete refactor plan: it identifies the current module boundaries, common newcomer pitfalls, and the “ideal shape” we should converge on—split by effort.

## Deep vs Shallow Modules (how to read this codebase)

From the “deep modules” idea:

- A **deep module** has a small interface but a more complex implementation behind it.
- A **shallow module** exposes complexity to callers (callers can’t avoid understanding internals).

In this codebase, that translates to:

- `src/lib/*` should be deep: callers should rarely care about implementation details.
- `src/hooks/*` should be thin wiring/orchestration: take inputs, call domain/lib functions, and expose outputs.
- `src/components/*` should be view logic: render data and call event handlers; avoid business decisions inside JSX lifecycle.

References:
- [Software Engineering: A Modern Approach (Deep Modules)](https://softengbook.org/articles/deep-modules)
- [Understanding Shallow and Deep Modules (Medium)](https://medium.com/@mrtkrkrt/understanding-shallow-and-deep-modules-in-software-architecture-fa7515eec7bf)

## Metal Map (where code lives)

Think in layers:

1. **Domain & rules** (pure logic): `src/lib/`
2. **Persistence & IO** (Dexie, fetch, export/import): `src/lib/db.ts` (and a small number of other lib modules)
3. **Wiring** (translate UI intent to domain/db calls): `src/hooks/`
4. **Rendering** (what the user sees): `src/components/`

Simple dependency direction (ideal):

```text
UI components
  -> hooks (wiring)
    -> lib pure functions (domain rules)
    -> lib db (persistence/IO)
      (lib does not import React)
```

## The “Important Few” files (best starting points)

### Domain model + shelf-life rules (pure-ish)
- `src/lib/vegetables-data.ts`
  - The preset dataset (`VEGETABLE_PRESETS`)
  - Pure helpers like:
    - `getRemainingDays(item)`
    - `getUrgencyLevel(item)`
    - `sortByPriority(a, b)`
    - `buildAddItemPayload(...)`

New contributor goal: learn shelf-life + urgency by reading *only this file* first.

### Persistence boundary (Dexie)
- `src/lib/db.ts`
  - `FridgeDb` (Dexie schema)
  - `seedMockData`, `cleanMockData`
  - export/import helpers (used by admin features)

New contributor goal: persistence operations live here, and most logic should be call-ready with dependency injection for tests.

### Import validation (pure validator)
- `src/lib/validate-vegetables-import.ts`
  - `validateVegetablesImport(parsed)`
  - The validator is self-contained and returns an explicit `{ ok: true, items }` / `{ ok: false, error }` shape.

New contributor goal: don’t embed validation rules into UI; reuse this module.

### Query builder (small pure helper)
- `src/lib/recipe-query.ts`
  - `buildRecipeSearchQuery(items)`

New contributor goal: treat it like a “string transformer with invariants”.

## Current State: what’s already tidy

Based on the current code layout:

- `src/lib/vegetables-data.ts` is already acting like a deep module: callers can treat it as an interface to shelf-life and urgency logic.
- `src/lib/db.ts` cleanly centralizes persistence (and supports injecting a `FridgeDb` instance in test scenarios).
- Hooks like `src/hooks/use-vegetable-store.ts` appear to be primarily wiring + sorting, delegating domain decisions to `src/lib/vegetables-data.ts`.

This is a good baseline for newcomer onboarding: there’s a natural “read `src/lib` first, then follow how hooks call them” path.

## Current Pain Points (where onboarding can stall)

1. **Side-effects in hooks:**
   - `src/hooks/use-on-open-reminder.ts` uses `useEffect` and triggers notifications via the browser `Notification` API.
   - The decision logic (throttling/message building) is already pure-ish and lives in `src/lib/reminder-notifications.ts`.
   - Still, newcomers can get confused about where “pure decision” ends and “imperative OS/browser side-effect” begins.

2. **No single “start here” onboarding doc (yet):**
   - There’s a `README.md`, but no dedicated contributor page describing the layer boundaries above.
   - Newcomers end up learning the architecture by searching and opening multiple files.

3. **Module boundaries should be enforced by convention:**
   - Some files already follow the “lib depends on nothing React-y” direction.
   - It’s not yet codified as a checklist in documentation, so the project is relying on tacit knowledge.

## Ideal Shape (what we want to converge to)

### A. Deep modules everywhere “domain matters”
When adding features:
- If the logic is a rule/decision (shelf-life math, urgency labeling, ID generation policy, query shaping, validation), it belongs in `src/lib/*` as a deep module.
- The “interface” should be simple: input types in, output types out; minimal incidental complexity.

### B. Hooks are wiring, not decision engines
Hooks should:
- accept concrete inputs (items, settings flags)
- call domain/lib helpers to compute results
- call db methods for persistence
- expose data and handlers

Hooks should minimize:
- long chains of conditionals that represent domain rules
- mixing “pure decisions” with IO/side effects in the same function block

### C. React lifecycle is an escape hatch (document it)
If a `useEffect` exists:
- it should be explicitly treated as an IO/bridge (subscriptions, permission prompting, notifications, external events)
- any pure logic used by the effect should be imported from `src/lib/*`

## Refactor Roadmap (split by effort)

### Effort 1 (low risk, improves onboarding immediately)
- Keep this doc updated when new modules are added.
- Add short “how to extend X” sections for the top contributors:
  - add a new vegetable preset
  - add a new domain helper
  - add a new db operation (and how to unit-test it with DI)

### Effort 2 (reduce confusion around side-effects)
- In `use-on-open-reminder.ts`, clearly isolate:
  - pure message building (already in `src/lib/reminder-notifications.ts`)
  - Notification permission/notification creation (the only truly imperative part)
- Optional: move “permission / notification permission state transitions” into a dedicated lib module if it can remain testable with small seams.

### Effort 3 (enforce module boundaries via conventions)
- Document a strict rule-of-thumb in this file:
  - `src/lib/*` must not import React or hooks
  - `src/components/*` must not import Dexie directly (prefer hooks/lib)
- Optionally add lightweight CI checks later (after we’re ready), but don’t block development.

### Effort 4 (quality + test coverage follow-through)
- Ensure unit tests exist for the domain helpers newcomers will touch first.
- Add targeted tests for “wiring” helpers when they contain non-trivial data shaping.

## Quick “How do I navigate?” for first-time contributors

1. Start with `src/lib/vegetables-data.ts` (domain rules).
2. Follow from there into:
   - `src/hooks/use-vegetable-store.ts` (wiring, sorting usage)
   - persistence in `src/lib/db.ts`
3. If you change how freshness works, re-check `getRemainingDays`, `getUrgencyLevel`, and any sorting logic.
4. If you change how add/import works, verify payload building and validation:
   - `buildAddItemPayload(...)`
   - `validateVegetablesImport(...)`

