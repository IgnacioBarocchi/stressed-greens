/**
 * This file may contain code that uses generative AI
 */

import { useState } from "react";
import { ChefHat, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_RECIPES, type VegetableItem } from "@/lib/vegetables-data";
import { buildRecipeSearchQuery } from "@/lib/recipe-query";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/db";

/** Structured response from search_recipes when RECIPE_SEARCH_RETURN_STRUCTURED is true */
export interface RecipeSearchResult {
        title: string;
        url: string;
        snippet: string;
}

export type RecipeSearchResponse = RecipeSearchResult[];

/** Display shape for one recipe card (includes placeholder image) */
interface Recipe {
        title: string;
        description: string;
        url: string;
        image: string;
}

const PLACEHOLDER_IMAGE = "https://placehold.co/400x400?text=Recipe";

function mapSearchResultsToRecipes(items: RecipeSearchResult[]): Recipe[] {
        return items.map((r) => ({
                title: r.title,
                description: r.snippet || "Search result from DuckDuckGo",
                url: r.url,
                image: PLACEHOLDER_IMAGE,
        }));
}

/**
 * Parse legacy formatted string from search_recipes when RECIPE_SEARCH_RETURN_STRUCTURED is false.
 * @deprecated Use typed response from search_recipes when RECIPE_SEARCH_RETURN_STRUCTURED is true; parse JSON array and map with mapSearchResultsToRecipes instead.
 */
const parseSearchResults = (response: string): Recipe[] => {
        const recipes: Recipe[] = [];
        const lines = response.split("\n");

        let currentRecipe: Partial<Recipe> | null = null;

        for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                const titleMatch = line.match(/^\d+\.\s+\*\*(.+?)\*\*$/);
                if (titleMatch) {
                        if (currentRecipe && currentRecipe.url) {
                                recipes.push({
                                        title: currentRecipe.title || "Recipe",
                                        description:
                                                currentRecipe.description ||
                                                "Search result from DuckDuckGo",
                                        url: currentRecipe.url,
                                        image: PLACEHOLDER_IMAGE,
                                });
                        }
                        currentRecipe = { title: titleMatch[1] };
                } else if (line.startsWith("URL:")) {
                        const url = line.replace(/^URL:\s*/, "").trim();
                        if (currentRecipe) {
                                currentRecipe.url = url;
                        }
                } else if (
                        line &&
                        !line.startsWith("##") &&
                        currentRecipe &&
                        line !== "Search result from DuckDuckGo"
                ) {
                        if (
                                !currentRecipe.description ||
                                currentRecipe.description === "Search result from DuckDuckGo"
                        ) {
                                currentRecipe.description = line;
                        }
                }
        }

        if (currentRecipe && currentRecipe.url) {
                recipes.push({
                        title: currentRecipe.title || "Recipe",
                        description: currentRecipe.description || "Search result from DuckDuckGo",
                        url: currentRecipe.url,
                        image: PLACEHOLDER_IMAGE,
                });
        }

        return recipes;
};

interface RecipeFinderProps {
        items: VegetableItem[];
}

const CACHE_KEY_LAST = "last";

function parseSearchResponse(raw: string): Recipe[] {
        try {
                const parsed = JSON.parse(raw) as unknown;
                if (Array.isArray(parsed)) {
                        return mapSearchResultsToRecipes(parsed as RecipeSearchResult[]);
                }
        } catch {
                // not JSON, fall back to legacy format
        }
        return parseSearchResults(raw);
}

export function RecipeFinder({ items }: RecipeFinderProps) {
        const [isOpen, setIsOpen] = useState(false);
        const [recipes, setRecipes] = useState<Recipe[] | null>(null);
        const [isLoading, setIsLoading] = useState(false);
        const [summaryText, setSummaryText] = useState<string | null>(null);
        const [summaryLoading, setSummaryLoading] = useState(false);
        const [summaryError, setSummaryError] = useState<string | null>(null);

        const query = buildRecipeSearchQuery(items);
        const canSearch = query.length > 0;

        const handleFindRecipes = async () => {
                if (!canSearch) return;
                setIsOpen(true);
                setIsLoading(true);
                setRecipes(null);
                setSummaryText(null);
                setSummaryError(null);
                try {
                        const cached = await db.recipeSearchCache.get(CACHE_KEY_LAST);
                        let raw: string;
                        if (cached?.query === query) {
                                raw = cached.resultJson;
                        } else {
                                raw = await invoke<string>("search_recipes", { query });
                                await db.recipeSearchCache.put({
                                        id: CACHE_KEY_LAST,
                                        query,
                                        resultJson: raw,
                                });
                        }
                        const parsedRecipes = parseSearchResponse(raw);
                        setRecipes(parsedRecipes.length > 0 ? parsedRecipes : null);
                } catch (error) {
                        console.error("Failed to search recipes:", error);
                        setRecipes(null);
                        toast({
                                title: "Could not load recipes",
                                description:
                                        "Using default results. You can try again later.",
                                variant: "destructive",
                        });
                } finally {
                        setIsLoading(false);
                }
        };

        const handleGetSummary = async () => {
                if (!query) return;
                setSummaryLoading(true);
                setSummaryError(null);
                try {
                        const text = await invoke<string>("get_recipe_summary", { query });
                        setSummaryText(text);
                } catch (error) {
                        setSummaryError(
                                error instanceof Error ? error.message : "Failed to load summary"
                        );
                } finally {
                        setSummaryLoading(false);
                }
        };

        const displayRecipes: Recipe[] = recipes || MOCK_RECIPES;

        if (!isOpen) {
                return (
                        <div className="flex flex-col gap-1.5">
                                <Button
                                        onClick={handleFindRecipes}
                                        variant="outline"
                                        className="w-full gap-2 border-border text-foreground hover:bg-accent"
                                        size="lg"
                                        disabled={!canSearch}
                                >
                                        <ChefHat className="h-4 w-4" />
                                        {`Find Recipes`}
                                </Button>
                                {!canSearch && (
                                        <p className="text-center text-xs text-muted-foreground">
                                                {`Add vegetables to find recipes`}
                                        </p>
                                )}
                        </div>
                );
        }

        return (
                <div className="animate-in slide-in-from-bottom-2 fade-in rounded-xl border border-border bg-card">
                        <div className="flex items-center justify-between border-b border-border px-4 py-3">
                                <div className="flex items-center gap-2">
                                        <ChefHat className="h-4 w-4 text-primary" />
                                        <h2 className="text-sm font-semibold text-card-foreground">
                                                {`Vegan Recipes`}
                                        </h2>
                                </div>
                                <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        onClick={() => setIsOpen(false)}
                                >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">{`Close recipes`}</span>
                                </Button>
                        </div>

                        <div className="flex flex-col gap-2 p-3">
                                {isLoading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                                <div
                                                        key={i}
                                                        className="flex gap-3 rounded-lg border border-border bg-secondary/30 p-2.5"
                                                >
                                                        <Skeleton className="h-16 w-16 flex-shrink-0 rounded-md" />
                                                        <div className="flex flex-1 flex-col justify-center gap-2 min-w-0">
                                                                <Skeleton className="h-4 w-48" />
                                                                <Skeleton className="h-3 w-full" />
                                                                <Skeleton className="h-3 w-full" />
                                                        </div>
                                                </div>
                                        ))
                                ) : displayRecipes.length === 0 ? (
                                        <div className="py-8 text-center text-sm text-muted-foreground">
                                                {`No recipes found`}
                                        </div>
                                ) : (
                                        <>
                                                <div className="rounded-lg border border-border bg-secondary/20 p-3">
                                                        {!summaryText &&
                                                                !summaryLoading &&
                                                                !summaryError && (
                                                                        <Button
                                                                                type="button"
                                                                                variant="secondary"
                                                                                size="sm"
                                                                                className="w-full"
                                                                                onClick={
                                                                                        handleGetSummary
                                                                                }
                                                                        >
                                                                                {`Get AI summary`}
                                                                        </Button>
                                                                )}
                                                        {summaryLoading && (
                                                                <div className="py-4 text-center text-sm text-muted-foreground">
                                                                        {`Loading summary…`}
                                                                </div>
                                                        )}
                                                        {summaryError && (
                                                                <p className="text-sm text-destructive">
                                                                        {summaryError}
                                                                </p>
                                                        )}
                                                        {summaryText && (
                                                                <div className="whitespace-pre-wrap text-sm text-foreground">
                                                                        {summaryText}
                                                                </div>
                                                        )}
                                                </div>
                                                {displayRecipes.map((recipe) => (
                                                        <a
                                                                key={recipe.url}
                                                                href={recipe.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="group flex gap-3 rounded-lg border border-border bg-secondary/30 p-2.5 transition-colors hover:bg-accent"
                                                        >
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                        src={recipe.image}
                                                                        alt={recipe.title}
                                                                        className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
                                                                />
                                                                <div className="flex flex-1 flex-col justify-center min-w-0">
                                                                        <div className="flex items-center gap-1.5">
                                                                                <h3 className="truncate text-sm font-medium text-foreground">
                                                                                        {
                                                                                                recipe.title
                                                                                        }
                                                                                </h3>
                                                                                <ExternalLink className="h-3 w-3 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                                                        </div>
                                                                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                                                                                {recipe.description}
                                                                        </p>
                                                                </div>
                                                        </a>
                                                ))}
                                        </>
                                )}
                        </div>
                </div>
        );
}
