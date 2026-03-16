/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import {
	seedMockData,
	cleanMockData,
	exportVegetablesToJson,
	importVegetablesReplace,
	type FridgeDb,
} from "./db"

describe("seedMockData", () => {
  const mockBulkAdd = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    mockBulkAdd.mockResolvedValue(undefined)
  })

  it("throws when fetch fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false })
    const db = { vegetables: { bulkAdd: mockBulkAdd } } as unknown as FridgeDb
    await expect(seedMockData(db)).rejects.toThrow("Failed to fetch mock-vegetables.json")
    expect(mockBulkAdd).not.toHaveBeenCalled()
  })

  it("calls fetch for mock-vegetables.json and bulkAdd with isMock true", async () => {
    const fixture = [
      {
        id: "1",
        name: "Carrot",
        quantity: 1,
        unit: "pcs",
        fridgeDate: "2026-01-01",
        lifespanWholeDays: 30,
        lifespanCutDays: 7,
        wasCut: false,
      },
    ]
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fixture),
    })
    const db = { vegetables: { bulkAdd: mockBulkAdd } } as unknown as FridgeDb
    const count = await seedMockData(db)
    expect(count).toBe(1)
    expect(mockBulkAdd).toHaveBeenCalledTimes(1)
    const added = mockBulkAdd.mock.calls[0][0]
    expect(added).toHaveLength(1)
    expect(added[0].isMock).toBe(true)
    expect(added[0].name).toBe("Carrot")
  })
})

describe("cleanMockData", () => {
  const mockToArray = vi.fn()
  const mockWhereDelete = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    mockToArray.mockResolvedValue([])
    mockWhereDelete.mockResolvedValue(undefined)
  })

  it("deletes only items with isMock true and returns count", async () => {
    const mocked = [
      { id: "m1", name: "A", isMock: true },
      { id: "m2", name: "B", isMock: true },
    ]
    mockToArray.mockResolvedValue(mocked)
    const db = {
      vegetables: {
        filter: () => ({ toArray: mockToArray }),
        where: () => ({ anyOf: (ids: string[]) => ({ delete: () => mockWhereDelete(ids) }) }),
      },
    } as unknown as FridgeDb
    const count = await cleanMockData(db)
    expect(count).toBe(2)
    expect(mockWhereDelete).toHaveBeenCalledWith(["m1", "m2"])
  })

  it("returns 0 when no mock items", async () => {
    mockToArray.mockResolvedValue([])
    const db = {
      vegetables: {
        filter: () => ({ toArray: mockToArray }),
        where: () => ({ anyOf: (ids: string[]) => ({ delete: () => mockWhereDelete(ids) }) }),
      },
    } as unknown as FridgeDb
    const count = await cleanMockData(db)
    expect(count).toBe(0)
    expect(mockWhereDelete).toHaveBeenCalledWith([])
  })
})

describe("exportVegetablesToJson", () => {
  it("returns all vegetables rows from database", async () => {
    const rows = [
      {
        id: "e1",
        name: "Carrot",
        quantity: 1,
        unit: "pcs",
        fridgeDate: "2026-01-01",
        lifespanWholeDays: 30,
        lifespanCutDays: 7,
        wasCut: false,
      },
    ]
    const mockToArray = vi.fn().mockResolvedValue(rows)
    const db = { vegetables: { toArray: mockToArray } } as unknown as FridgeDb
    const result = await exportVegetablesToJson(db)
    expect(mockToArray).toHaveBeenCalledTimes(1)
    expect(result).toEqual(rows)
    expect(result).toHaveLength(1)
  })

  it("returns empty array when table is empty", async () => {
    const mockToArray = vi.fn().mockResolvedValue([])
    const db = { vegetables: { toArray: mockToArray } } as unknown as FridgeDb
    const result = await exportVegetablesToJson(db)
    expect(result).toEqual([])
  })
})

describe("importVegetablesReplace", () => {
  it("clears table then bulkAdds items and preserves ids", async () => {
    const items = [
      {
        id: "i1",
        name: "Broccoli",
        quantity: 2,
        unit: "bunch",
        fridgeDate: "2026-02-01",
        lifespanWholeDays: 7,
        lifespanCutDays: 4,
        wasCut: true,
      },
    ]
    const mockClear = vi.fn().mockResolvedValue(undefined)
    const mockBulkAdd = vi.fn().mockResolvedValue(undefined)
    const db = {
      vegetables: {
        clear: mockClear,
        bulkAdd: mockBulkAdd,
      },
    } as unknown as FridgeDb
    await importVegetablesReplace(items, db)
    expect(mockClear).toHaveBeenCalledTimes(1)
    expect(mockBulkAdd).toHaveBeenCalledTimes(1)
    expect(mockBulkAdd).toHaveBeenCalledWith(items)
    expect(mockBulkAdd.mock.calls[0][0][0].id).toBe("i1")
  })

  it("clears table and does not bulkAdd when items empty", async () => {
    const mockClear = vi.fn().mockResolvedValue(undefined)
    const mockBulkAdd = vi.fn().mockResolvedValue(undefined)
    const db = {
      vegetables: { clear: mockClear, bulkAdd: mockBulkAdd },
    } as unknown as FridgeDb
    await importVegetablesReplace([], db)
    expect(mockClear).toHaveBeenCalledTimes(1)
    expect(mockBulkAdd).not.toHaveBeenCalled()
  })
})
