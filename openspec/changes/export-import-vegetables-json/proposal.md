## Why

Admins need a way to backup and restore vegetable inventory data and to migrate or seed data between instances. An export/import flow using JSON gives a portable, human-readable format that works with the existing offline-only, no-backend model.

## What Changes

- **Export**: Admin can trigger an export that serializes the current `vegetables` table to a JSON file and downloads it (e.g. one file per run).
- **Import**: Admin can select a JSON file; the app validates its shape, then either replaces the current DB contents or merges (behavior to be specified in design). User is warned before overwrite.
- **Admin-only**: Import/export controls are exposed only in an admin or settings area (no change to normal user flows).
- **Format**: JSON array of `VegetableItem`-shaped objects; same shape as stored in DB and as `mock-vegetables.json`, so export is round-trip compatible with existing mock tooling where applicable.

## Capabilities

### New Capabilities

- `vegetables-json-import-export`: Admin UI and logic to export the vegetables table to a JSON file and to import from a JSON file into the DB (with validation and replace/merge policy).

### Modified Capabilities

- `db-interface-spec`: Extend the public API from `src/lib/db.ts` (or a dedicated module under the same spec) with export/import entry points used by the admin feature—e.g. functions that produce/consume JSON and call existing DB APIs, so the spec documents the new surface and invariants (e.g. import validation, id handling).

## Impact

- **Code**: New admin/settings UI (export/import buttons or section), new pure helpers for serialization/validation, and DB-layer or lib functions for export/import. Possibly a small script or reuse of existing mock format for consistency.
- **APIs**: `src/lib/db.ts` (or adjacent lib) gains export/import functions; no backend or network.
- **Dependencies**: None new; file download uses browser APIs (e.g. blob + anchor), file read via file input.
- **Systems**: IndexedDB contents can be replaced or merged on import; user data at risk if used incorrectly, hence admin-only and clear confirmation before destructive import.
