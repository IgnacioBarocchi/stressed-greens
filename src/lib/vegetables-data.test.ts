/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import { describe, it, expect } from "vitest"
import {
  getRemainingDays,
  getUrgencyLevel,
  generateId,
  sortByPriority,
  buildAddItemPayload,
  DEFAULT_IMAGE_URL,
  VEGETABLE_PRESETS,
  type VegetableItem,
} from "./vegetables-data"

function item(overrides: Partial<VegetableItem>): VegetableItem {
  const today = new Date()
  const base: VegetableItem = {
    id: "id-1",
    name: "Carrot",
    quantity: 1 as number | null,
    unit: "pcs" as string | null,
    fridgeDate: today.toISOString().split("T")[0],
    lifespanWholeDays: 10,
    lifespanCutDays: 4,
    wasCut: false,
  }
  return { ...base, ...overrides }
}

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split("T")[0]
}

describe("getRemainingDays", () => {
  it("returns full lifespan when fridgeDate is today (whole)", () => {
    const v = item({ fridgeDate: daysAgo(0), wasCut: false, lifespanWholeDays: 7 })
    expect(getRemainingDays(v)).toBe(7)
  })

  it("returns 0 when days passed equals lifespan (whole)", () => {
    const v = item({ fridgeDate: daysAgo(7), wasCut: false, lifespanWholeDays: 7 })
    expect(getRemainingDays(v)).toBe(0)
  })

  it("returns negative when past lifespan (whole)", () => {
    const v = item({ fridgeDate: daysAgo(10), wasCut: false, lifespanWholeDays: 7 })
    expect(getRemainingDays(v)).toBe(-3)
  })

  it("uses lifespanCutDays when wasCut is true", () => {
    const v = item({ fridgeDate: daysAgo(0), wasCut: true, lifespanCutDays: 3 })
    expect(getRemainingDays(v)).toBe(3)
  })

  it("returns correct remaining when cut and days passed", () => {
    const v = item({ fridgeDate: daysAgo(2), wasCut: true, lifespanCutDays: 5 })
    expect(getRemainingDays(v)).toBe(3)
  })
})

describe("getUrgencyLevel", () => {
  it("returns danger when remaining <= 0", () => {
    const v = item({ fridgeDate: daysAgo(10), wasCut: false, lifespanWholeDays: 7 })
    expect(getRemainingDays(v)).toBeLessThanOrEqual(0)
    expect(getUrgencyLevel(v)).toBe("danger")
  })

  it("returns danger when ratio <= 0.2", () => {
    const v = item({ fridgeDate: daysAgo(8), wasCut: false, lifespanWholeDays: 10 })
    expect(getRemainingDays(v)).toBe(2)
    expect(getUrgencyLevel(v)).toBe("danger")
  })

  it("returns warning when ratio <= 0.5 and > 0.2", () => {
    const v = item({ fridgeDate: daysAgo(5), wasCut: false, lifespanWholeDays: 10 })
    expect(getRemainingDays(v)).toBe(5)
    expect(getUrgencyLevel(v)).toBe("warning")
  })

  it("returns fresh when ratio > 0.5", () => {
    const v = item({ fridgeDate: daysAgo(2), wasCut: false, lifespanWholeDays: 10 })
    expect(getRemainingDays(v)).toBe(8)
    expect(getUrgencyLevel(v)).toBe("fresh")
  })

  it("returns fresh when just added (whole)", () => {
    const v = item({ fridgeDate: daysAgo(0), wasCut: false, lifespanWholeDays: 7 })
    expect(getUrgencyLevel(v)).toBe("fresh")
  })
})

describe("generateId", () => {
  it("returns non-empty string", () => {
    const id = generateId()
    expect(id).toBeDefined()
    expect(typeof id).toBe("string")
    expect(id.length).toBeGreaterThan(0)
  })

  it("returns unique ids in sequence", () => {
    const ids = new Set<string>()
    for (let i = 0; i < 50; i++) ids.add(generateId())
    expect(ids.size).toBe(50)
  })
})

describe("sortByPriority", () => {
  it("orders danger before warning before fresh", () => {
    const danger = item({
      fridgeDate: daysAgo(10),
      wasCut: false,
      lifespanWholeDays: 7,
    })
    const warning = item({
      fridgeDate: daysAgo(5),
      wasCut: false,
      lifespanWholeDays: 10,
    })
    const fresh = item({
      fridgeDate: daysAgo(0),
      wasCut: false,
      lifespanWholeDays: 7,
    })
    const sorted = [fresh, danger, warning].sort(sortByPriority)
    expect(getUrgencyLevel(sorted[0])).toBe("danger")
    expect(getUrgencyLevel(sorted[1])).toBe("warning")
    expect(getUrgencyLevel(sorted[2])).toBe("fresh")
  })

  it("within same urgency, sorts by remaining days ascending", () => {
    const less = item({ fridgeDate: daysAgo(8), wasCut: false, lifespanWholeDays: 10 })
    const more = item({ fridgeDate: daysAgo(2), wasCut: false, lifespanWholeDays: 10 })
    expect(getRemainingDays(less)).toBe(2)
    expect(getRemainingDays(more)).toBe(8)
    expect(getUrgencyLevel(less)).toBe("danger")
    expect(getUrgencyLevel(more)).toBe("fresh")
    const sorted = [more, less].sort(sortByPriority)
    expect(sorted[0]).toBe(less)
    expect(sorted[1]).toBe(more)
  })
})

describe("buildAddItemPayload", () => {
  const base = {
    name: "Carrot",
    quantity: 1 as number | null,
    unit: "pcs" as string | null,
    fridgeDate: "2025-01-15",
    wasCut: false,
  }

  it("includes imageUrl from preset when preset provided", () => {
    const preset = VEGETABLE_PRESETS.find((p) => p.name === "Carrot")!
    const payload = buildAddItemPayload({ ...base, preset })
    expect(payload.imageUrl).toBe(preset.imageUrl)
    expect(payload.lifespanWholeDays).toBe(preset.lifespanWholeDays)
    expect(payload.lifespanCutDays).toBe(preset.lifespanCutDays)
  })

  it("includes DEFAULT_IMAGE_URL when no preset (custom vegetable)", () => {
    const payload = buildAddItemPayload({ ...base, preset: null })
    expect(payload.imageUrl).toBe(DEFAULT_IMAGE_URL)
    expect(payload.lifespanWholeDays).toBe(7)
    expect(payload.lifespanCutDays).toBe(3)
  })

  it("includes DEFAULT_IMAGE_URL when preset undefined", () => {
    const payload = buildAddItemPayload({ ...base })
    expect(payload.imageUrl).toBe(DEFAULT_IMAGE_URL)
  })

  it("accepts null for quantity and unit (simple mode)", () => {
    const payload = buildAddItemPayload({
      ...base,
      quantity: null,
      unit: null,
    })
    expect(payload.quantity).toBeNull()
    expect(payload.unit).toBeNull()
  })
})
