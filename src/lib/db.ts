/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import Dexie, { type Table } from "dexie"
import type { VegetableItem } from "@/lib/vegetables-data"
import type { UserSettings } from "@/lib/user-settings"
import { assertInvariant } from "@/lib/utils"

/** Single row cache for last recipe search (query + result JSON). Key: id "last". */
export interface RecipeSearchCacheEntry {
  id: string
  query: string
  resultJson: string
}

export class FridgeDb extends Dexie {
  vegetables!: Table<VegetableItem, string>
  settings!: Table<UserSettings, string>
  recipeSearchCache!: Table<RecipeSearchCacheEntry, string>

  constructor() {
    super("FridgeTracker")
    this.version(1).stores({
      vegetables: "id, fridgeDate",
    })
    this.version(2).stores({
      vegetables: "id, fridgeDate, isMock",
    })
    this.version(3).stores({
      vegetables: "id, fridgeDate, isMock",
      settings: "id",
    })
    this.version(4).stores({
      vegetables: "id, fridgeDate, isMock",
      settings: "id",
      recipeSearchCache: "id",
    })
  }
}

export const db = new FridgeDb()

export async function seedMockData(database: FridgeDb = db): Promise<number> {
  assertInvariant(database != null, "Expected FridgeDb instance")
  const res = await fetch("/mock-vegetables.json")
  if (!res.ok) throw new Error("Failed to fetch mock-vegetables.json")
  const items: VegetableItem[] = await res.json()
  assertInvariant(Array.isArray(items), "Expected mock data to be an array")
  const withMock = items.map((item) => ({ ...item, isMock: true }))
  await database.vegetables.bulkAdd(withMock)
  return withMock.length
}

export async function cleanMockData(database: FridgeDb = db): Promise<number> {
	assertInvariant(database != null, "Expected FridgeDb instance")
	const mocked = await database.vegetables.filter((v) => v.isMock === true).toArray()
	await database.vegetables.where("id").anyOf(mocked.map((v) => v.id)).delete()
	return mocked.length
}

export async function exportVegetablesToJson(database: FridgeDb = db): Promise<VegetableItem[]> {
	assertInvariant(database != null, "Expected FridgeDb instance")
	return database.vegetables.toArray()
}

export async function importVegetablesReplace(
	items: VegetableItem[],
	database: FridgeDb = db,
): Promise<void> {
	assertInvariant(database != null, "Expected FridgeDb instance")
	await database.vegetables.clear()
	if (items.length > 0) {
		await database.vegetables.bulkAdd(items)
	}
}
