# Recipe search modes – design

## Context

- **Rust**: `search_recipes` returns `Result<String, String>`. `quick_search()` formats `Vec<SearchResult>` (title, url, snippet) into a string. Full LLM path is `research()` in the agent.
- **Frontend**: RecipeFinder invokes `search_recipes`, parses the string with `parseSearchResults`, displays a list. No cache, no summary block, no second command.

## Decisions

### 1. Cache location

- **Decision**: Cache in the UX layer (Dexie) for now: store last recipe query + last recipe result (e.g. one key or a small table). On “Find recipes”, if the built query equals the stored query, return the stored result and skip the Tauri call.
- **Rationale**: Keeps backend stateless; easy to invalidate (e.g. clear on app version or manually); “just test” as requested. Alternative: cache in Rust (in-memory or file) if we want cache to survive frontend reload without Dexie.

### 2. Output-mode constant (Rust)

- **Name/location**: Use a **module-level constant** in the same module as the command (e.g. in `lib.rs` or in a small `recipe.rs`), e.g. `RECIPE_SEARCH_RETURN_STRUCTURED: bool`. If `true`, `search_recipes` returns a serializable struct (e.g. `Vec<RecipeSearchItem>`); if `false`, it returns the current formatted string.
- **Type when structured**: Mirror `SearchResult` or define a DTO like `{ title: String, url: String, snippet: String }` (and optional `image` if we add it later). Tauri will serialize to JSON.
- **Non-destructive**: `quick_search()` in the agent can gain a parameter or the command can call the search tool directly and then either format to string or pass through the vec; the constant is read only in the command handler.

### 3. New Tauri command for LLM summary

- **Name**: e.g. `get_recipe_summary` or `research_recipes` (takes `query: String`, returns `Result<String, String>`).
- **Implementation**: Call `agent.research(&query).await` (or equivalent full LLM path), return the string. No change to the agent’s `research()` signature.

### 4. TypeScript response type

- **Interface**: e.g. `RecipeSearchResult { title: string; url: string; snippet: string; }` and `RecipeSearchResponse = RecipeSearchResult[]`. When backend returns structured, `invoke<RecipeSearchResponse>("search_recipes", { query })`. Optional: `image?: string` with a default in the UI.
- **Deprecation**: Add `@deprecated Use typed response from search_recipes when RECIPE_SEARCH_RETURN_STRUCTURED is true` (or similar) on `parseSearchResults`; once structured is default, remove the parser or keep it behind a fallback for old builds.

### 5. UI mapping

- **List**: For each item in the response array, map `title` → card title, `url` → link href, `snippet` → description. Use a placeholder image if needed (e.g. same as today).
- **Summary block**: New section above the list: CTA button “Get AI summary”; on click invoke the new command with current `query`; show loading in that block; on success render the returned string (e.g. in a `<div>` or `<p>` with whitespace preserved); on error show a short message.

### 6. Loading states

- **Quick search**: Existing “Searching for recipes…” remains.
- **LLM summary**: New loading state in the summary block only (e.g. “Loading summary…” + spinner) while `get_recipe_summary` (or chosen name) is in flight; clear on success or error.

## Documentation (Rust)

- In the module that defines the constant: doc comment explaining that this constant controls whether `search_recipes` returns a legacy string or a JSON-serializable structure; that it exists for backward compatibility and for API/consumer control; and that changing it changes the frontend contract.
- Optionally: a short `docs/recipe-search.md` (or a section in an existing doc) referencing the constant and the two modes.

## Summary table

| Item               | Where                                         | What                                                                                        |
| ------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Cache              | Dexie (frontend)                              | Last query + last result; skip Tauri call when query matches                                |
| Text vs structured | Rust const                                    | e.g. `RECIPE_SEARCH_RETURN_STRUCTURED`; command returns `String` or `Vec<RecipeSearchItem>` |
| Rust docs          | Doc comment + optional doc file               | Constant name, purpose, importance                                                          |
| TS type            | e.g. `types/recipe-search.ts` or in component | `RecipeSearchResult`, `RecipeSearchResponse`; deprecate `parseSearchResults`                |
| UI mapping         | RecipeFinder                                  | Bind list to response array; summary block uses new command + loading                       |
