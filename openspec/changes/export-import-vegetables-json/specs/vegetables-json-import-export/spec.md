# Vegetables JSON Import/Export – Capability Spec

## ADDED Requirements

### Requirement: Admin can export vegetables to a JSON file

The system SHALL provide an admin-only action that serializes the current `vegetables` table to a JSON array of `VegetableItem`-shaped objects and triggers a browser download of that file. The format MUST be UTF-8 JSON and MUST match the stored row shape (same as `mock-vegetables.json` and DB rows).

#### Scenario: Successful export

- **WHEN** admin triggers export (e.g. clicks "Export vegetables (JSON)")
- **THEN** the system fetches all rows from the vegetables table, serializes them to a JSON array, and the browser downloads a file containing that JSON (e.g. filename includes a timestamp)

#### Scenario: Export with empty table

- **WHEN** admin triggers export and the vegetables table is empty
- **THEN** the system downloads a JSON file containing an empty array `[]`

---

### Requirement: Admin can import vegetables from a JSON file (replace)

The system SHALL provide an admin-only action that accepts a user-selected JSON file, validates its contents as an array of `VegetableItem`-shaped objects, and—after explicit user confirmation—replaces all current vegetables in the DB with the file contents. Import MUST be all-or-nothing: on any validation failure, no rows SHALL be written.

#### Scenario: Successful import after confirmation

- **WHEN** admin selects a valid JSON file and confirms the replace action (e.g. after seeing item counts)
- **THEN** the system deletes all existing vegetables rows, then inserts all items from the file preserving their ids; the UI SHALL indicate success (e.g. "Import successful: N items")

#### Scenario: Import aborted when user declines confirmation

- **WHEN** admin selects a file and the system shows a confirmation (e.g. "Replace M items. Current DB has N items. Continue?") and admin declines
- **THEN** no change SHALL be made to the vegetables table

#### Scenario: Import fails on invalid JSON

- **WHEN** the selected file is not valid JSON or is not an array
- **THEN** the system SHALL not write any rows and SHALL show a clear error message to the user

#### Scenario: Import fails on validation (shape or types)

- **WHEN** the JSON array contains one or more elements that do not satisfy the `VegetableItem` schema (required fields, types) or duplicate ids
- **THEN** the system SHALL fail-fast on the first error, write no rows, and SHALL show a clear error message (e.g. field and reason)

---

### Requirement: Import/export is admin-only

Import and export actions SHALL be exposed only in an admin or settings area. Normal inventory flows (add, remove, view list) SHALL not display or trigger import/export.

#### Scenario: Normal user flow unchanged

- **WHEN** a user uses the main inventory view (add vegetable, remove, view list)
- **THEN** no import or export controls are visible in that flow

#### Scenario: Admin can access import/export

- **WHEN** admin opens the admin or settings section where import/export is provided
- **THEN** export and import actions (e.g. button and file input) are available

---

### Requirement: Export format is round-trip compatible

The export format SHALL be a JSON array of objects that conform to `VegetableItem` (as stored in DB). An exported file that is not modified SHALL be valid for re-import; ids and all stored fields SHALL be preserved.

#### Scenario: Round-trip preserves data

- **WHEN** admin exports vegetables to a file, then (in the same or another instance) imports that file after confirming replace
- **THEN** the vegetables table after import SHALL match the table at export time (same ids, names, quantities, dates, and other fields)
