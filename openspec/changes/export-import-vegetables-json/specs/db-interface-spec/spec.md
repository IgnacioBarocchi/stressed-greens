# DB Interface Spec – Delta (Export/Import)

## ADDED Requirements

### Requirement: Public API includes export and import entry points

The public API from `src/lib/db.ts` (or a dedicated module under the same spec) SHALL expose entry points for exporting the vegetables table to JSON and for importing a validated array of `VegetableItem` into the vegetables table. These functions SHALL be callable with an optional `FridgeDb` instance for dependency injection in tests.

#### Scenario: Export returns JSON-serializable array

- **WHEN** the export function is called (with optional database instance)
- **THEN** it returns a promise that resolves to an array of all `VegetableItem` rows from the vegetables table, in a form suitable for `JSON.stringify` (e.g. plain objects with same shape as stored)

#### Scenario: Import replaces all vegetables after validation

- **WHEN** the import function is called with a validated array of `VegetableItem` and optional database instance
- **THEN** it SHALL delete all existing rows in the vegetables table, then bulk-add the given items; ids from the input array SHALL be preserved (no id regeneration)

#### Scenario: Import is not called with invalid data

- **WHEN** callers invoke the import function
- **THEN** the contract SHALL require that the payload has already been validated (e.g. by a pure validation helper); the spec does not require the import function to re-validate, but the overall system SHALL ensure invalid data is never written (see vegetables-json-import-export spec)

---

### Requirement: Validation of import payload is pure and testable

The system SHALL provide a pure function (no DB, no side effects) that accepts a parsed JSON value and returns a validation result: either a list of valid `VegetableItem` objects or one or more validation errors. This function SHALL be used before calling the DB import entry point. Validation SHALL enforce required fields and types per `VegetableItem` and SHALL treat duplicate ids in the array as invalid.

#### Scenario: Valid array passes validation

- **WHEN** the validation function is called with an array of objects that each satisfy the `VegetableItem` schema and ids are unique
- **THEN** it returns a success result containing that array (or the same items)

#### Scenario: Validation fails on missing or wrong-type field

- **WHEN** the validation function is called with an array containing an object that is missing a required field or has a field of the wrong type (e.g. `id` number instead of string)
- **THEN** it returns a failure result with at least one error (e.g. field name and reason); no partial success

#### Scenario: Validation fails on duplicate ids

- **WHEN** the validation function is called with an array that contains two or more items with the same `id`
- **THEN** it returns a failure result (e.g. "Duplicate id: …"); no partial success
