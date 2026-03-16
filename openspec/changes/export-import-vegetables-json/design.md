## Context

The app stores vegetable inventory in IndexedDB via Dexie (`FridgeDb`, table `vegetables`). There is no backend; all data is on-device. Existing flows include `seedMockData()` (fetch `/mock-vegetables.json`, mark `isMock: true`, `bulkAdd`) and `cleanMockData()` (delete by `isMock === true`). The proposal adds admin-only export (DB → JSON file download) and import (JSON file → DB with validation and replace/merge). Format is a JSON array of `VegetableItem`-shaped objects, aligned with the current DB row shape and mock format.

## Goals / Non-Goals

**Goals:**

- Export the full `vegetables` table to a single JSON file and trigger a browser download.
- Import from a user-selected JSON file: validate shape, then write to DB (replace or merge).
- Confirm before any destructive import (replace).
- Keep all logic testable without UI (pure validation/serialization, injectable DB).
- Admin-only surface (e.g. settings or admin area); no change to normal inventory flows.

**Non-Goals:**

- Export/import of `settings` or `recipeSearchCache` (vegetables only).
- Versioned or schema-evolved export format; format is current `VegetableItem[]`.
- Automatic backup or scheduled export; user-triggered only.

## Decisions

**1. Import policy: replace vs merge**

- **Choice:** Support **replace** only for the first version. User must confirm before replace. All existing `vegetables` rows are deleted, then the file contents are inserted.
- **Rationale:** Simplest behavior and clearest mental model (import = load this snapshot). Merge (e.g. by id) can be added later if needed; it complicates conflict handling and UX.
- **Alternative considered:** Merge by id (skip or overwrite). Deferred to avoid id-collision and ordering ambiguity in the first release.

**2. Where to put export/import logic**

- **Choice:** Pure validation and any serialization helpers in `src/lib/` (e.g. a small module that takes/returns data; no DB access). DB operations (read all, clear table, bulk add) live in `src/lib/db.ts` or a dedicated module that receives the `db` instance (dependency injection for tests). UI in admin/settings only calls these functions.
- **Rationale:** Keeps business logic out of React and allows unit tests without mocks where possible (pure validation), and DB tests with a test DB instance.

**3. Validation strategy**

- **Choice:** Validate the parsed JSON as an array of `VegetableItem`-shaped objects (required fields and types per existing type). **Fail-fast:** on first validation error, abort import and surface a clear message (e.g. field name and reason). No partial import.
- **Rationale:** Prevents bad data from entering the DB. Fail-fast keeps behavior predictable and avoids half-filled state.
- **Alternative considered:** Collect all errors and report. Deferred for simplicity; can be added if users need to fix files iteratively.

**4. Id handling on import**

- **Choice:** Use ids from the file as-is. No regeneration. Duplicate ids in the file are a validation error (or Dexie will reject; we can pre-check for duplicates and fail with a clear message).
- **Rationale:** Round-trip export/import preserves ids; matches mock flow and user expectations for backup/restore.

**5. Export format and download**

- **Choice:** Single JSON array, UTF-8. Download via blob + programmatic anchor click (or equivalent). Filename can include a timestamp (e.g. `vegetables-export-2025-03-13.json`) for clarity.
- **Rationale:** No new dependencies; same format as `mock-vegetables.json` for consistency and reuse in tooling.

**6. Admin surface**

- **Choice:** Add an admin or settings section (existing or new route) with two actions: “Export vegetables (JSON)” and “Import vegetables (JSON)”. Import uses a file input; after file selection, show a confirmation (e.g. “Replace N items. Current DB has M items. Continue?”) before calling replace.
- **Rationale:** Keeps normal flows untouched; admin explicitly opts in. Details (exact copy, button placement) can follow existing settings/admin patterns in the app.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| User accidentally replaces DB with wrong or empty file | Require explicit confirmation with item counts (file vs current DB) before replace. |
| Large import blocks UI | Run in same thread; consider future chunking or worker if large-file support is required. |
| Malformed or legacy JSON | Strict validation and fail-fast with clear error message; no partial write. |
| Duplicate ids in file | Validate uniqueness of `id` before writing; abort with message if duplicates. |

## Migration Plan

- No DB schema change; no migration steps.
- Feature is additive: new UI and new lib/db functions. Deploy as usual; no rollback beyond reverting the change.

## Open Questions

- Exact placement of admin/settings entry (which route or tab) to be decided during implementation based on current app structure.
- Whether to show a short “Import successful: N items” (or error) message after import; recommended for UX.
