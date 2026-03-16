/**
 * This file may contain code that uses generative AI
 */

import type { VegetableItem } from "@/lib/vegetables-data"
import { getUrgencyLevel } from "@/lib/vegetables-data"
import { sortByPriority } from "@/lib/vegetables-data"
import { assertInvariant } from "@/lib/utils"

export const REMINDER_THROTTLE_MS = 24 * 60 * 60 * 1000

export function shouldSendReminder(
  lastSentAt: string | null,
  windowMs: number = REMINDER_THROTTLE_MS
): boolean {
  assertInvariant(windowMs > 0, "Expected positive windowMs")
  if (lastSentAt == null) return true
  const elapsed = Date.now() - new Date(lastSentAt).getTime()
  return elapsed >= windowMs
}

export function getUrgentItems(items: VegetableItem[]): VegetableItem[] {
  assertInvariant(Array.isArray(items), "Expected array of items")
  return items
    .filter((item) => {
      const level = getUrgencyLevel(item)
      return level === "warning" || level === "danger"
    })
    .sort(sortByPriority)
}

export function buildReminderMessage(items: VegetableItem[]): string | null {
  assertInvariant(Array.isArray(items), "Expected array of items")
  const urgent = getUrgentItems(items)
  if (urgent.length === 0) return null
  const danger = urgent.filter((i) => getUrgencyLevel(i) === "danger")
  const warning = urgent.filter((i) => getUrgencyLevel(i) === "warning")
  const names = urgent.map((i) => i.name).join(", ")
  const parts: string[] = []
  if (danger.length > 0) parts.push(`${danger.length} use today / expired`)
  if (warning.length > 0) parts.push(`${warning.length} use soon`)
  return `${parts.join(", ")}: ${names}`
}
