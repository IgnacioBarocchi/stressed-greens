## 1. Validation (pure, no DB)

- [x] 1.1 Add pure function `validateVegetablesImport(parsed: unknown): { ok: true; items: VegetableItem[] } | { ok: false; error: string }` in `src/lib/` that returns success with items array or fail-fast error (first invalid field or duplicate id)
- [x] 1.2 Enforce required fields and types per `VegetableItem` (id, name, quantity, unit, fridgeDate, lifespanWholeDays, lifespanCutDays, wasCut; optional isMock, imageUrl) and reject non-array or non-object elements
- [x] 1.3 Reject arrays with duplicate `id` values and return a clear error (e.g. "Duplicate id: …")

## 2. DB layer (export / import)

- [x] 2.1 Add `exportVegetablesToJson(database?: FridgeDb): Promise<VegetableItem[]>` that returns all vegetables rows (use `db` singleton when omitted; injectable for tests)
- [x] 2.2 Add `importVegetablesReplace(items: VegetableItem[], database?: FridgeDb): Promise<void>` that deletes all vegetables then bulkAdds items (caller must validate first; injectable for tests)
- [x] 2.3 Export both from `src/lib/db.ts` (or a dedicated module under same spec) and document in db-interface spec

## 3. Download helper

- [x] 3.1 Add helper that accepts a JSON string and filename (e.g. `vegetables-export-YYYY-MM-DD.json`) and triggers a browser download via blob + programmatic anchor click (no new dependencies)

## 4. Admin UI (export / import)

- [x] 4.1 Add "Export vegetables (JSON)" action that calls `exportVegetablesToJson`, stringifies result, and triggers download with timestamped filename
- [x] 4.2 Add file input for "Import vegetables (JSON)"; on file selected, read as text, parse JSON; if not array or parse error, show clear error and abort
- [x] 4.3 After parse, call `validateVegetablesImport(parsed)`; on failure show error message and abort; on success show confirmation dialog with file item count and current DB count (e.g. "Replace N items. Current DB has M items. Continue?")
- [x] 4.4 On confirmation, call `importVegetablesReplace(validatedItems)`; on success show "Import successful: N items" (or similar); on failure show error
- [x] 4.5 Expose export and import controls only in admin or settings area (e.g. alongside existing MockDataActions when admin mode, or in settings modal); keep main inventory view unchanged

## 5. Tests

- [x] 5.1 Unit tests for `validateVegetablesImport`: valid array, missing/wrong-type field, duplicate ids, non-array input, empty array
- [x] 5.2 Unit tests for `exportVegetablesToJson` and `importVegetablesReplace` with injected test Dexie DB (export returns all rows; import clears then adds; ids preserved)
