# Recipe search modes – specification

## 1. Cache response when query is unchanged

### Requirement: Query-based response cache

When recipe search is triggered, the system SHALL use a cached response when the query is identical to the last run query, if caching is implemented. The cache MAY be stored in the UX layer (e.g. Dexie: last run query + last result) for testing; the decision of where to cache (Rust vs Dexie) SHALL be documented. If caching is not yet implemented, this requirement is satisfied by a documented decision and a placeholder or no-op.

#### Scenario: Same query returns cached result

- **WHEN** the user runs recipe search with query Q, then runs recipe search again with the same query Q before any cache invalidation
- **THEN** the second run MAY return the cached result (no new backend call) so that the UI shows the same results without delay

#### Scenario: Different query bypasses cache

- **WHEN** the user runs recipe search with query Q1, then with a different query Q2
- **THEN** the second run SHALL call the backend (or use a cache keyed by Q2) and SHALL NOT return the result for Q1

#### Scenario: Cache location

- **WHEN** caching is implemented
- **THEN** the cache location (e.g. Dexie table or key for “last recipe query” + “last recipe result”) SHALL be documented; for test/UX, storing in Dexie is acceptable

---

## 2. Configurable quick-search output: text vs structured

### Requirement: Constant or config for quick-search response shape

The Rust side SHALL expose a single constant (or configuration flag) that determines whether the quick-search path returns a formatted string (current behavior) or a structured value suitable for API consumers (e.g. JSON-serializable list of results). Changes SHALL be non-destructive: when the constant selects “text”, behavior SHALL remain as today; when it selects “structured”, the command SHALL return the structured type. The constant’s name and location SHALL be documented in Rust (see §3).

#### Scenario: Text mode (legacy)

- **WHEN** the constant is set to “text” (or equivalent)
- **THEN** the recipe search command returns a string in the existing format, and the frontend can continue to use the deprecated parser until removed

#### Scenario: Structured mode

- **WHEN** the constant is set to “structured” (or equivalent)
- **THEN** the recipe search command returns a serializable structure (e.g. list of items with title, url, snippet/description) and the frontend SHALL consume it via the TypeScript response type without string parsing

#### Scenario: Single source of truth

- **WHEN** the constant is changed
- **THEN** only one code path (text vs structured) is used per build or run; no mixed behavior for the same command

---

## 3. Rust documentation for output-mode constant

### Requirement: Document the output-mode constant and its importance

The Rust codebase SHALL include documentation (e.g. in the module or next to the constant) that (1) names the constant that controls quick-search output format, (2) explains that it toggles between text (legacy) and structured (API-friendly) response, and (3) states that this choice is important for backward compatibility and for consumers that expect either a string or a typed structure. The documentation SHALL be in Rust (doc comments or a small design doc in repo) and SHALL reference the constant by name.

#### Scenario: Constant is discoverable

- **WHEN** a developer looks for where the recipe search response shape is decided
- **THEN** they can find the constant and the doc that explains its role

#### Scenario: Importance is explicit

- **WHEN** a developer reads the documentation
- **THEN** they understand that changing the constant changes the contract of the recipe search command and affects the frontend/API consumers

---

## 4. TypeScript response type and deprecation of string parser

### Requirement: Response type and deprecate legacy parser

The frontend SHALL define a TypeScript type or interface that matches the structured response from the recipe search command (when in structured mode). The previous implementation’s string-parsing function (e.g. `parseSearchResults`) SHALL be deprecated: marked with a deprecation notice and replaced by direct use of the typed response where the command returns structure. The type SHALL be the single source of truth for the response shape consumed by the UI.

#### Scenario: Type matches backend structure

- **WHEN** the backend returns structured data (e.g. array of `{ title, url, snippet }` or equivalent)
- **THEN** the TypeScript type/interface SHALL reflect those field names and types so that no manual parsing is required

#### Scenario: Parser is deprecated

- **WHEN** the codebase still contains the old string-parsing function
- **THEN** it SHALL be marked deprecated (e.g. JSDoc `@deprecated`) and SHALL NOT be used when the command returns structured data

#### Scenario: UI uses typed response

- **WHEN** the recipe search command returns structured data
- **THEN** the UI SHALL map from the response type (e.g. `title`, `url`, `snippet`) to display; no regex or line-by-line parsing of a string

---

## 5. Map response shape in the UI

### Requirement: UI binds to response structure

The recipe list UI SHALL map the structured response fields (e.g. title, url, snippet/description) directly to the displayed elements. Field names and nesting SHALL follow the response type; no ad-hoc parsing. Placeholder or default values (e.g. for image) MAY be applied in the UI when the backend does not provide them.

#### Scenario: Titles and URLs from response

- **WHEN** the response contains items with `title` and `url`
- **THEN** the list SHALL show each item’s title and link using those fields

#### Scenario: Description/snippet from response

- **WHEN** the response contains a description or snippet field
- **THEN** the UI SHALL use it for the visible description (or fallback text) for each recipe card/row

#### Scenario: No string parsing

- **WHEN** rendering the list
- **THEN** the UI SHALL not parse a single string (e.g. with regex) to extract titles or URLs; it SHALL use the typed structure only

---

## 6. LLM summary block and new Tauri command

### Requirement: Summary block and full LLM research command

The recipe results view SHALL show a distinct block at the top of the list (above the web search result links) that (1) is visually clear and “good looking”, (2) offers a CTA (e.g. “Get AI summary”) that triggers a new Tauri command, (3) passes the same query used for the quick search to that command. The new command SHALL call the full LLM research handler (the existing research/agent path that returns a string), not the quick search. The command’s response (string) SHALL be rendered in that top block so the user can read the summary text first, then the list of links below.

#### Scenario: CTA triggers new command

- **WHEN** the user clicks the CTA (e.g. “Get AI summary”) in the summary block
- **THEN** the frontend invokes the new Tauri command with the current recipe search query

#### Scenario: Command uses full LLM research

- **WHEN** the new Tauri command is invoked
- **THEN** the backend SHALL run the full research/LLM path (e.g. `research()` or equivalent), not the quick-search path, and SHALL return the resulting string

#### Scenario: Summary rendered above links

- **WHEN** the command returns successfully
- **THEN** the returned string SHALL be displayed in the top block, above the list of recipe links, so the user reads the summary first

#### Scenario: Summary block is visible when results exist

- **WHEN** the user has run recipe search and has a non-empty list of results
- **THEN** the summary block (with CTA and, after success, the summary text) SHALL be visible at the top of the results area

---

## 7. Loading state for LLM summary

### Requirement: Loading state for the LLM summary request

When the user triggers the LLM summary (via the CTA that calls the new Tauri command), the UI SHALL show a loading state until the command completes. The loading state SHALL be clearly associated with the summary block (e.g. spinner or “Loading summary…” in that block). Errors SHALL be handled (e.g. message in the block or toast) and SHALL clear the loading state.

#### Scenario: Loading visible while request in flight

- **WHEN** the user has clicked “Get AI summary” and the Tauri command has not yet returned
- **THEN** the summary block SHALL show a loading indicator (e.g. spinner or text) so the user knows the request is in progress

#### Scenario: Loading cleared on success

- **WHEN** the command returns successfully
- **THEN** the loading state SHALL be removed and the summary text SHALL be shown

#### Scenario: Loading cleared on error

- **WHEN** the command fails or returns an error
- **THEN** the loading state SHALL be removed and an error state or message SHALL be shown (e.g. in the block or via toast)
