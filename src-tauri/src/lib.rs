//! # Stressed Greens Tauri Backend
//!
//! Tauri backend for the Stressed Greens vegetable tracking application.
//! Includes AI research agent functionality for recipe discovery.

// =============================================================================
// MODULE DECLARATIONS
// =============================================================================

/// Configuration management
mod config;

/// Research agent implementation
mod agent;

/// Web search and other tools
mod tools;

// =============================================================================
// IMPORTS
// =============================================================================
use crate::agent::ResearchAgent;
use crate::config::Config;
use serde::Serialize;
use serde_json;

// =============================================================================
// RECIPE SEARCH OUTPUT MODE
// =============================================================================
/// **Important:** This constant controls the contract of the `search_recipes` Tauri command.
///
/// - When `false` (legacy): the command returns a formatted string (markdown-like text)
///   for backward compatibility. The frontend may use a string parser to extract titles/URLs.
/// - When `true`: the command returns a JSON string of an array of `RecipeSearchItem`,
///   giving API consumers and the frontend a stable, typed structure (title, url, snippet).
///
/// Changing this constant changes the frontend/API contract. Keep it in sync with the
/// TypeScript side so the UI either parses text or consumes JSON.
pub const RECIPE_SEARCH_RETURN_STRUCTURED: bool = true;

/// DTO for one recipe search result when `RECIPE_SEARCH_RETURN_STRUCTURED` is true.
#[derive(Debug, Clone, Serialize)]
pub struct RecipeSearchItem {
    pub title: String,
    pub url: String,
    pub snippet: String,
}

// =============================================================================
// TAURI COMMANDS
// =============================================================================
/// Search for recipes using the AI research agent.
///
/// Returns either a legacy formatted string or a JSON array of `RecipeSearchItem`,
/// depending on `RECIPE_SEARCH_RETURN_STRUCTURED`.
#[tauri::command]
async fn search_recipes(query: String) -> Result<String, String> {
    let config = Config::from_env()
        .map_err(|e| format!("Failed to load config: {}", e))?;
    config
        .validate()
        .map_err(|e| format!("Invalid config: {}", e))?;
    let agent = ResearchAgent::new(config);

    if RECIPE_SEARCH_RETURN_STRUCTURED {
        let results = agent
            .quick_search_results(&query)
            .await
            .map_err(|e| format!("Search failed: {}", e))?;
        let items: Vec<RecipeSearchItem> = results
            .into_iter()
            .map(|r| RecipeSearchItem {
                title: r.title,
                url: r.url,
                snippet: r.snippet,
            })
            .collect();
        serde_json::to_string(&items).map_err(|e| format!("Serialize failed: {}", e))
    } else {
        agent
            .quick_search(&query)
            .await
            .map_err(|e| format!("Search failed: {}", e))
    }
}

/// Run the full LLM research on the query and return the summary string.
/// Used by the recipe finder UI "Get AI summary" CTA.
#[tauri::command]
async fn get_recipe_summary(query: String) -> Result<String, String> {
    let config = Config::from_env()
        .map_err(|e| format!("Failed to load config: {}", e))?;
    config
        .validate()
        .map_err(|e| format!("Invalid config: {}", e))?;
    let agent = ResearchAgent::new(config);
    agent
        .research(&query)
        .await
        .map_err(|e| format!("Research failed: {}", e))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![search_recipes, get_recipe_summary])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
