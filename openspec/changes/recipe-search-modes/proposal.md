# Recipe search modes and structured response

## Why

Recipe search today returns a formatted string that the frontend parses. We want modes (quick search vs full LLM), a configurable choice between text and structured output, response caching for repeated queries, and an LLM summary above the link list—all without breaking existing behavior.

## What changes

- **Caching**: Cache recipe search response when the query is unchanged (e.g. last query + result in Dexie for testing).
- **Output mode**: A Rust constant (or config) controls whether quick search returns plain text (current) or structured data for API/consumers.
- **Rust docs**: Document the change and the constant, emphasizing its role in backward compatibility and API shape.
- **TypeScript contract**: Define a response type/interface; deprecate the string-parsing function; map response shape in the UI.
- **LLM summary**: New UI block at the top of results with a CTA that calls a new Tauri command; command runs the full LLM research (not quick search), returns string; render that string above the link list, with loading state.

## Capabilities

### New capabilities

- **recipe-search-modes**: Caching (query-based), configurable text vs structured output in Rust, TS types and deprecated parser, UI mapping to response shape, new LLM-summary command and UI with loading.

### Modified capabilities

- None.

## Impact

- **Rust**: Config/const for output format; optional new command for LLM summary; docs.
- **Dexie**: Optional table or key for last recipe query + cached result (test/UX cache).
- **Frontend**: RecipeFinder uses response type; deprecates `parseSearchResults`; new summary block + CTA + loading; invokes new command for summary.
