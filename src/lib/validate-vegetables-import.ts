/**
 * This file may contain code that uses generative AI
 */

import type { VegetableItem } from "@/lib/vegetables-data"

export type ValidateVegetablesResult =
	| { ok: true; items: VegetableItem[] }
	| { ok: false; error: string }

const REQUIRED_STRING_FIELDS = ["id", "name", "fridgeDate"] as const
const REQUIRED_NUMBER_FIELDS = ["lifespanWholeDays", "lifespanCutDays"] as const
const OPTIONAL_STRING_FIELDS = ["imageUrl"] as const

function isPlainObject(x: unknown): x is Record<string, unknown> {
	return typeof x === "object" && x !== null && !Array.isArray(x)
}

function validateOneItem(raw: unknown, index: number): ValidateVegetablesResult {
	if (!isPlainObject(raw)) {
		return { ok: false, error: `Item at index ${index}: expected an object` }
	}
	const o = raw as Record<string, unknown>

	for (const key of REQUIRED_STRING_FIELDS) {
		const v = o[key]
		if (v === undefined || v === null) {
			return { ok: false, error: `Item at index ${index}: missing required field "${key}"` }
		}
		if (typeof v !== "string") {
			return { ok: false, error: `Item at index ${index}: field "${key}" must be a string` }
		}
	}

	const quantity = o.quantity
	if (quantity !== null && quantity !== undefined && typeof quantity !== "number") {
		return { ok: false, error: `Item at index ${index}: field "quantity" must be a number or null` }
	}
	const unit = o.unit
	if (unit !== undefined && unit !== null && typeof unit !== "string") {
		return { ok: false, error: `Item at index ${index}: field "unit" must be a string or null` }
	}

	for (const key of REQUIRED_NUMBER_FIELDS) {
		const v = o[key]
		if (v === undefined || v === null) {
			return { ok: false, error: `Item at index ${index}: missing required field "${key}"` }
		}
		if (typeof v !== "number") {
			return { ok: false, error: `Item at index ${index}: field "${key}" must be a number` }
		}
	}

	const wasCut = o.wasCut
	if (wasCut === undefined || wasCut === null) {
		return { ok: false, error: `Item at index ${index}: missing required field "wasCut"` }
	}
	if (typeof wasCut !== "boolean") {
		return { ok: false, error: `Item at index ${index}: field "wasCut" must be a boolean` }
	}

	if (o.isMock !== undefined && o.isMock !== null && typeof o.isMock !== "boolean") {
		return { ok: false, error: `Item at index ${index}: field "isMock" must be a boolean if present` }
	}
	for (const key of OPTIONAL_STRING_FIELDS) {
		const v = o[key]
		if (v !== undefined && v !== null && typeof v !== "string") {
			return { ok: false, error: `Item at index ${index}: field "${key}" must be a string if present` }
		}
	}

	const item: VegetableItem = {
		id: o.id as string,
		name: o.name as string,
		quantity: quantity === undefined || quantity === null ? null : (quantity as number),
		unit: unit === undefined ? null : (unit as string | null),
		fridgeDate: o.fridgeDate as string,
		lifespanWholeDays: o.lifespanWholeDays as number,
		lifespanCutDays: o.lifespanCutDays as number,
		wasCut: wasCut as boolean,
		isMock: o.isMock as boolean | undefined,
		imageUrl: o.imageUrl as string | undefined,
	}
	return { ok: true, items: [item] }
}

export function validateVegetablesImport(parsed: unknown): ValidateVegetablesResult {
	if (!Array.isArray(parsed)) {
		return { ok: false, error: "Expected a JSON array of vegetable items" }
	}
	const items: VegetableItem[] = []
	const seenIds = new Set<string>()
	for (let i = 0; i < parsed.length; i++) {
		const one = validateOneItem(parsed[i], i)
		if (!one.ok) return one
		const item = one.items[0]
		if (seenIds.has(item.id)) {
			return { ok: false, error: `Duplicate id: ${item.id}` }
		}
		seenIds.add(item.id)
		items.push(item)
	}
	return { ok: true, items }
}
