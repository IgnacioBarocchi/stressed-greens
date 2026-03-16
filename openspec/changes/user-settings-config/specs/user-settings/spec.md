## ADDED Requirements

### Requirement: Settings persistence

The system SHALL store user settings in IndexedDB via a Dexie `settings` table with a single row identified by `id: "user-settings"`.

#### Scenario: Settings are persisted across sessions

- **WHEN** user changes a setting and closes the app
- **THEN** the setting value is preserved when the app is reopened

#### Scenario: Settings table created on schema upgrade

- **WHEN** the app initializes with schema version 3
- **THEN** a `settings` table exists with primary key `id`

---

### Requirement: Default settings on first launch

The system SHALL return default settings (`simpleCreateForm: true`) when no settings row exists in the database.

#### Scenario: First-time user sees defaults

- **WHEN** user opens the app for the first time (no settings row)
- **THEN** `simpleCreateForm` is treated as `true`

#### Scenario: Hook returns defaults while loading

- **WHEN** settings are being fetched from the database
- **THEN** the hook returns default values until the query resolves

---

### Requirement: Reactive settings access

Components SHALL receive updated settings values automatically when the database changes, via `useLiveQuery`.

#### Scenario: Setting change reflects immediately

- **WHEN** user toggles `simpleCreateForm` in the settings modal
- **THEN** the create form adapts without requiring a page refresh

---

### Requirement: Settings update API

The system SHALL provide an `updateSettings` function that merges partial updates with existing settings.

#### Scenario: Partial update preserves other fields

- **WHEN** `updateSettings({ simpleCreateForm: false })` is called
- **THEN** the `id` field remains `"user-settings"` and other future fields are unchanged

---

### Requirement: Simple create form mode

When `simpleCreateForm` is `true`, the create form SHALL display only the name/search field and the "Already cut/sliced" toggle.

#### Scenario: Simple mode hides optional fields

- **WHEN** user has `simpleCreateForm: true` and opens the create form
- **THEN** quantity, unit, and fridge date fields are NOT displayed

#### Scenario: Simple mode defaults date to today

- **WHEN** user submits a vegetable in simple mode
- **THEN** `fridgeDate` is set to the current date (ISO format)

#### Scenario: Simple mode sets quantity and unit to null

- **WHEN** user submits a vegetable in simple mode without expanding advanced options
- **THEN** `quantity` and `unit` are stored as `null`

---

### Requirement: Advanced create form mode

When `simpleCreateForm` is `false`, the create form SHALL display all fields: name/search, quantity, unit, fridge date, and "Already cut/sliced" toggle.

#### Scenario: Advanced mode shows all fields

- **WHEN** user has `simpleCreateForm: false` and opens the create form
- **THEN** quantity, unit, and fridge date fields ARE displayed

---

### Requirement: One-time override in simple mode

When in simple mode, the form SHALL provide a "More options" link that expands advanced fields for that single entry only.

#### Scenario: Override expands fields

- **WHEN** user clicks "More options" in simple mode
- **THEN** quantity, unit, and fridge date fields become visible

#### Scenario: Override does not persist

- **WHEN** user clicks "More options", submits the form, and opens a new create form
- **THEN** the form returns to simple mode (advanced fields hidden)

#### Scenario: Override does not change saved preference

- **WHEN** user clicks "More options" and submits
- **THEN** `simpleCreateForm` in the database remains `true`

---

### Requirement: Settings modal access

The system SHALL provide a settings icon in the app header that opens a modal containing the settings toggle.

#### Scenario: Settings icon visible in header

- **WHEN** user views the app
- **THEN** a settings icon (gear) is visible in the header

#### Scenario: Clicking icon opens modal

- **WHEN** user clicks the settings icon
- **THEN** a modal opens with the "Simple create form" toggle

#### Scenario: Toggle reflects current setting

- **WHEN** user opens the settings modal
- **THEN** the toggle state matches the current `simpleCreateForm` value

#### Scenario: Toggling updates the setting

- **WHEN** user toggles the switch in the settings modal
- **THEN** `simpleCreateForm` is updated in the database immediately

---

### Requirement: List view unchanged by setting

The setting SHALL only affect the create form. Items in the list view SHALL display whatever data they have stored.

#### Scenario: Items with quantity show quantity

- **WHEN** an item was created with `quantity: 2, unit: "pcs"`
- **THEN** the list view displays "2 pcs" regardless of the `simpleCreateForm` setting

#### Scenario: Items without quantity show no quantity

- **WHEN** an item was created with `quantity: null, unit: null`
- **THEN** the list view does not display quantity/unit for that item
