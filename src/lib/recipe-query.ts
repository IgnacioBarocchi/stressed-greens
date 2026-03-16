/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import type { VegetableItem } from "@/lib/vegetables-data"
import { assertInvariant } from "@/lib/utils"

export const MAX_NAMES_IN_QUERY = 15

export function buildRecipeSearchQuery(items: VegetableItem[]): string {
  assertInvariant(Array.isArray(items), "Expected array of items")
  const names = [...new Set(items.map((i) => i.name?.trim()).filter(Boolean))].slice(0, MAX_NAMES_IN_QUERY)
  if (names.length === 0) return ""
  return `100% vegan recipes containing ${names.join(", ")}`
}
