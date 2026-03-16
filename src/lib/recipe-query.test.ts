/**
 * This file may contain code that uses generative AI
 */

import { describe, it, expect } from "vitest"
import { buildRecipeSearchQuery, MAX_NAMES_IN_QUERY } from "./recipe-query"
import type { VegetableItem } from "./vegetables-data"

function item(name: string, overrides: Partial<VegetableItem> = {}): VegetableItem {
  const today = new Date().toISOString().split("T")[0]
  return {
    id: "id-1",
    name,
    quantity: null,
    unit: null,
    fridgeDate: today,
    lifespanWholeDays: 10,
    lifespanCutDays: 4,
    wasCut: false,
    ...overrides,
  }
}

describe("buildRecipeSearchQuery", () => {
  it("returns empty string for empty array", () => {
    expect(buildRecipeSearchQuery([])).toBe("")
  })

  it("returns correct query for single item", () => {
    expect(buildRecipeSearchQuery([item("Carrot")])).toBe("100% vegan recipes containing Carrot")
  })

  it("returns comma-separated names for multiple items", () => {
    expect(
      buildRecipeSearchQuery([item("Carrot"), item("Kale"), item("Tomato")])
    ).toBe("100% vegan recipes containing Carrot, Kale, Tomato")
  })

  it("deduplicates same name", () => {
    expect(
      buildRecipeSearchQuery([item("Carrot"), item("Carrot"), item("Carrot")])
    ).toBe("100% vegan recipes containing Carrot")
  })

  it("trims leading and trailing spaces from names", () => {
    expect(
      buildRecipeSearchQuery([item("  Bell Pepper  "), item("Carrot")])
    ).toBe("100% vegan recipes containing Bell Pepper, Carrot")
  })

  it("returns empty string when single item has empty name", () => {
    expect(buildRecipeSearchQuery([item("")])).toBe("")
  })

  it("returns empty string when all items have empty or whitespace names", () => {
    expect(
      buildRecipeSearchQuery([item(""), item("   "), item("")])
    ).toBe("")
  })

  it("filters out empty names and keeps valid ones", () => {
    expect(
      buildRecipeSearchQuery([item(""), item("Carrot"), item(""), item("Kale")])
    ).toBe("100% vegan recipes containing Carrot, Kale")
  })

  it("caps at MAX_NAMES_IN_QUERY when more than 15 unique names", () => {
    const names = Array.from({ length: 20 }, (_, i) => `Veg${i}`)
    const items = names.map((n) => item(n))
    const result = buildRecipeSearchQuery(items)
    const match = result.match(/containing (.+)$/)
    expect(match).not.toBeNull()
    const listed = match![1].split(", ")
    expect(listed).toHaveLength(MAX_NAMES_IN_QUERY)
    expect(listed).toEqual(names.slice(0, 15))
  })

  it("includes all 15 names when exactly 15 distinct names", () => {
    const names = Array.from({ length: 15 }, (_, i) => `Veg${i}`)
    const items = names.map((n) => item(n))
    const result = buildRecipeSearchQuery(items)
    expect(result).toBe(`100% vegan recipes containing ${names.join(", ")}`)
  })

  it("output starts with template prefix", () => {
    const result = buildRecipeSearchQuery([item("A")])
    expect(result).toMatch(/^100% vegan recipes containing /)
  })

  it("uses comma-space between names", () => {
    const result = buildRecipeSearchQuery([item("A"), item("B"), item("C")])
    expect(result).toBe("100% vegan recipes containing A, B, C")
  })

  it("preserves order of first occurrence of each name", () => {
    expect(
      buildRecipeSearchQuery([item("A"), item("B"), item("C")])
    ).toBe("100% vegan recipes containing A, B, C")
    expect(
      buildRecipeSearchQuery([item("C"), item("A"), item("B")])
    ).toBe("100% vegan recipes containing C, A, B")
  })
})

describe("MAX_NAMES_IN_QUERY", () => {
  it("is 15", () => {
    expect(MAX_NAMES_IN_QUERY).toBe(15)
  })
})
