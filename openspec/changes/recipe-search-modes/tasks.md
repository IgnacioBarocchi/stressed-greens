## 1. Rust: output-mode constant and structured response

- [x] 1.1 Add module-level constant (e.g. RECIPE_SEARCH_RETURN_STRUCTURED) in lib.rs or recipe module; when false, search_recipes returns current formatted string; when true, returns a serializable struct (e.g. Vec of { title, url, snippet })
- [x] 1.2 Define a Rust DTO (e.g. RecipeSearchItem) with Serialize/Deserialize matching SearchResult shape (title, url, snippet); use it when constant is true
- [x] 1.3 In search_recipes command: read constant; if structured, call search tool (or quick_search returning vec), serialize and return Vec<RecipeSearchItem>; if text, keep current quick_search string path
- [x] 1.4 Add Rust doc comment on the constant explaining it controls legacy string vs structured JSON, backward compatibility, and frontend/API contract; reference constant by name

## 2. Rust: new LLM summary command

- [x] 2.1 Add new Tauri command (e.g. get_recipe_summary) that takes query: String and returns Result<String, String>; inside, call agent.research(&query) and return the string
- [x] 2.2 Register the new command in the Tauri invoke_handler

## 3. TypeScript types and deprecation

- [x] 3.1 Add TypeScript interface/types (e.g. RecipeSearchResult with title, url, snippet; RecipeSearchResponse as array) in a shared types file or recipe-finder; match backend DTO shape
- [x] 3.2 Mark parseSearchResults with @deprecated JSDoc (e.g. "Use typed response from search_recipes when RECIPE_SEARCH_RETURN_STRUCTURED is true"); keep function for text-mode fallback if needed

## 4. Dexie cache for recipe search

- [x] 4.1 Add storage for last recipe query and last recipe result (e.g. Dexie table or keyed store, or simple key in an existing store); document cache location in code or design
- [x] 4.2 In RecipeFinder before invoking search_recipes: if current query equals cached query, use cached result and skip Tauri call; otherwise invoke and then store query + result in cache

## 5. RecipeFinder: consume structured response and map UI

- [x] 5.1 When backend returns structured (or when using structured mode): invoke with typed response (e.g. invoke<RecipeSearchResponse>); use response array directly; do not call parseSearchResults
- [x] 5.2 Map list items to response shape: title -> card title, url -> link href, snippet -> description; use placeholder image when not provided
- [x] 5.3 When backend returns text (legacy): continue using parseSearchResults for that path so existing behavior remains until structured is default

## 6. Summary block and LLM summary UI

- [x] 6.1 Add a summary block above the recipe link list: distinct visual element with a CTA (e.g. "Get AI summary") that invokes the new Tauri command (get_recipe_summary) with the current query
- [x] 6.2 On success: render the returned string in the summary block (e.g. in a div with whitespace preserved); on error: show a short error message in the block
- [x] 6.3 Add loading state in the summary block (e.g. "Loading summary…" and spinner) while the get_recipe_summary command is in flight; clear loading on success or error

## 7. Manual verification

- [ ] 7.1 Verify same query uses cache (no second Tauri call when query unchanged)
- [ ] 7.2 Verify text vs structured: with constant false, string returned and parser works; with constant true, JSON returned and UI uses typed response
- [ ] 7.3 Verify summary CTA calls new command, loading shows, then summary text appears above the list
- [ ] 7.4 Verify quick-search loading ("Searching for recipes…") still works; verify LLM summary loading is separate and clears correctly
