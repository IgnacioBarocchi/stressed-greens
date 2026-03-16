# Proposal: Quality & Tests Follow-up

**Status:** Proposal for later implementation  
**Context:** Audit of dependencies, test coverage, and untested features (conversation-driven). Do not remove unused UI components.

---

## 1. Purpose

This document captures findings and recommended work from an audit of the stressed-greens app:

- Package manager and dependencies (what to keep, what could be trimmed, what could be added for testing).
- Gaps in unit tests and which features or modules to test next.

Use this as a backlog or a change brief when tackling quality and tests later.

---

## 2. Package Audit Summary

### 2.1 Package manager

- The project already uses **pnpm** (`pnpm-lock.yaml`). Scripts use `npm run` / `npx`, which work the same under pnpm.
- **Action:** Continue using `pnpm install` and `pnpm run <script>`. No change required unless you want stricter CI (e.g. `pnpm install --frozen-lockfile`).

### 2.2 Dependencies that may be unused (candidates for removal only)

These are **not** used in `src/` today. Consider removing only if there is no planned use. **Do not remove any UI component libraries** (Radix, etc.); this list is limited to non-UI deps.

| Package               | Used in `src/`? | Note                                                                    |
| --------------------- | --------------- | ----------------------------------------------------------------------- |
| `papaparse`           | No              | Remove if no CSV import/export is planned.                              |
| `@react-pdf/renderer` | No              | Heavy; remove if no PDF export is planned.                              |
| `date-fns`            | No              | Date handling is currently `Date` + ISO strings. Remove if not planned. |

- **Action (optional):** When tackling cleanup, remove the above from `package.json` and run `pnpm install`. Do **not** remove unused UI primitives or Radix packages.

### 2.3 Dependencies to keep

- **react-hook-form**, **@hookform/resolvers**, **zod** — Used by `components/ui/form.tsx`. Keep for future forms or if you adopt the Form component.
- All **Radix UI** and other UI primitives under `src/components/ui/` — Keep. Do not remove unused UI components.

### 2.4 Optional addition for future component tests

- **@testing-library/user-event** — Not required for current unit tests. Add only when introducing component tests (e.g. add-form or VegetableCard) to make “click, type, submit” tests clearer.
- **Action (optional):** When adding component tests, add `@testing-library/user-event` and, if needed, configure Vitest to use `jsdom` for `*.test.tsx` (or per-file).

---

## 3. Test Coverage: Current vs Gaps

### 3.1 Currently tested

- **`src/lib/vegetables-data.ts`** — `getRemainingDays`, `getUrgencyLevel`, `generateId`, `sortByPriority` (unit tests in `vegetables-data.test.ts`).
- **`src/lib/db.ts`** — `seedMockData`, `cleanMockData` with injected mock DB and mocked `fetch` (unit tests in `db.test.ts`).

### 3.2 Not tested (areas of concern)

| Area                           | Description                                                                                                                     | Recommended focus                                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **use-vegetable-store**        | Hook returns sorted list and add/remove; uses `useLiveQuery` and `useMemo`.                                                     | Add `use-vegetable-store.test.ts`: mock Dexie / `useLiveQuery`, assert that `addItem` / `removeItem` call DB and that returned `items` are sorted (e.g. by priority). |
| **Add-vegetable form payload** | Building the object passed to `onAdd` (name, quantity, unit, fridgeDate, lifespans, wasCut) is inline in the component.         | Extract a small pure helper (e.g. `buildAddPayload(...)`) and add unit tests for it. Optionally one component test that submits and checks `onAdd` payload.           |
| **VegetableCard**              | Uses `getRemainingDays` / `getUrgencyLevel` (already tested). Extra logic: progress percent and “Expired” vs “Use today” label. | Optionally extract urgency label (and progress %) into a pure function and unit-test; or add one component test for VegetableCard.                                    |
| **MockDataActions**            | Calls `seedMockData()` / `cleanMockData()` and manages loading/message state.                                                   | Low priority; DB layer is already tested. Optional: component test that clicks and asserts calls or message.                                                          |
| **RecipeFinder**               | Renders `MOCK_RECIPES` and toggles open/closed.                                                                                 | Low priority; optional component test if desired.                                                                                                                     |
| **run-clean-mock.ts**          | Browser entry that calls `cleanMockData()` and updates DOM.                                                                     | Optional: small integration test with mock DB; or leave as thin script.                                                                                               |

### 3.3 Priority order for implementation

1. **use-vegetable-store** — Unit test with mocked Dexie / `useLiveQuery`: assert add/remove and sorted output.
2. **Add-vegetable form** — Extract payload builder; unit test it; optionally one component test for submit.
3. **VegetableCard** — Optional: extract label/progress helper and unit-test, or one component test.
4. **MockDataActions / RecipeFinder / run-clean-mock** — Only if time and value justify.

---

## 4. Out of Scope (Explicit)

- **Do not remove unused UI components or Radix (or other) UI libraries.** The audit did not recommend pruning the UI primitive set; only non-UI, clearly unused packages (papaparse, @react-pdf, date-fns) were listed as optional removal candidates.

---

## 5. How to Use This Proposal Later

- **As a backlog:** Pick items from §2 (optional package removal, optional user-event) and §3 (test tasks) when scheduling quality work.
- **As a change brief:** Create a change (e.g. via `/opsx:new` or manually) named something like `quality-and-tests` and copy the action items into tasks; then implement step by step.
- **Reference:** Point to this file from `.cursor/skills/test-writer/SKILL.md` or from a future “quality” spec if you want the agent to prioritize these areas.

---

## 6. Summary

| Category           | Action                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Package manager    | Keep using pnpm; no change required.                                                                                     |
| Unused non-UI deps | Optional: remove `papaparse`, `@react-pdf/renderer`, `date-fns` if not planned.                                          |
| UI / Radix         | Do not remove any unused UI components or UI libraries.                                                                  |
| Unit tests         | Add tests for use-vegetable-store; extract and test add-form payload; optionally VegetableCard helper or component test. |
| Component tests    | Optional: add `@testing-library/user-event` and jsdom when adding component tests.                                       |

All of the above is meaningful context from the audit conversation and is intended to be tackled later without blocking current work.
