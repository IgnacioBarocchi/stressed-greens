/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import { describe, it, expect } from "vitest"
import { validateVegetablesImport } from "./validate-vegetables-import"

function validItem(overrides: Record<string, unknown> = {}) {
	return {
		id: "id-1",
		name: "Carrot",
		quantity: 1,
		unit: "pcs",
		fridgeDate: "2026-01-01",
		lifespanWholeDays: 30,
		lifespanCutDays: 7,
		wasCut: false,
		...overrides,
	}
}

describe("validateVegetablesImport", () => {
	it("returns items for valid array", () => {
		const parsed = [validItem()]
		const result = validateVegetablesImport(parsed)
		expect(result.ok).toBe(true)
		if (result.ok) {
			expect(result.items).toHaveLength(1)
			expect(result.items[0].name).toBe("Carrot")
			expect(result.items[0].id).toBe("id-1")
		}
	})

	it("returns items for valid array with optional fields", () => {
		const parsed = [validItem({ isMock: true, imageUrl: "https://example.com/x.png" })]
		const result = validateVegetablesImport(parsed)
		expect(result.ok).toBe(true)
		if (result.ok) {
			expect(result.items[0].isMock).toBe(true)
			expect(result.items[0].imageUrl).toBe("https://example.com/x.png")
		}
	})

	it("accepts quantity and unit null", () => {
		const parsed = [validItem({ quantity: null, unit: null })]
		const result = validateVegetablesImport(parsed)
		expect(result.ok).toBe(true)
		if (result.ok) {
			expect(result.items[0].quantity).toBeNull()
			expect(result.items[0].unit).toBeNull()
		}
	})

	it("returns error for non-array input", () => {
		const result = validateVegetablesImport({})
		expect(result.ok).toBe(false)
		if (!result.ok) expect(result.error).toContain("Expected a JSON array")
	})

	it("returns error for empty array", () => {
		const result = validateVegetablesImport([])
		expect(result.ok).toBe(true)
		if (result.ok) expect(result.items).toHaveLength(0)
	})

	it("returns error for missing required field (id)", () => {
		const parsed = [validItem({ id: undefined })]
		const result = validateVegetablesImport(parsed)
		expect(result.ok).toBe(false)
		if (!result.ok) expect(result.error).toMatch(/missing required field "id"/)
	})

	it("returns error for wrong type (id number)", () => {
		const parsed = [validItem({ id: 123 })]
		const result = validateVegetablesImport(parsed)
		expect(result.ok).toBe(false)
		if (!result.ok) expect(result.error).toMatch(/must be a string/)
	})

	it("returns error for non-object element", () => {
		const result = validateVegetablesImport([42])
		expect(result.ok).toBe(false)
		if (!result.ok) expect(result.error).toMatch(/expected an object/)
	})

	it("returns error for duplicate ids", () => {
		const parsed = [validItem({ id: "dup" }), validItem({ id: "dup", name: "Other" })]
		const result = validateVegetablesImport(parsed)
		expect(result.ok).toBe(false)
		if (!result.ok) expect(result.error).toMatch(/Duplicate id: dup/)
	})

	it("returns error for missing wasCut", () => {
		const parsed = [validItem({ wasCut: undefined })]
		const result = validateVegetablesImport(parsed)
		expect(result.ok).toBe(false)
		if (!result.ok) expect(result.error).toMatch(/wasCut/)
	})

	it("returns error for wrong type wasCut", () => {
		const parsed = [validItem({ wasCut: "yes" })]
		const result = validateVegetablesImport(parsed)
		expect(result.ok).toBe(false)
		if (!result.ok) expect(result.error).toMatch(/wasCut.*boolean/)
	})
})
