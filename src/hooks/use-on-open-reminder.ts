/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import { useEffect } from "react"
import type { VegetableItem } from "@/lib/vegetables-data"
import type { UserSettings } from "@/lib/user-settings"
import {
  shouldSendReminder,
  buildReminderMessage,
} from "@/lib/reminder-notifications"
import { assertInvariant } from "@/lib/utils"

const REMINDER_TITLE = "Stressed Greens"

function tryShowReminder(
  items: VegetableItem[],
  settings: UserSettings,
  updateLastSent: (iso: string) => void
): void {
  assertInvariant(Array.isArray(items), "Expected array of items")
  assertInvariant(settings != null, "Expected UserSettings")
  assertInvariant(typeof updateLastSent === "function", "Expected updateLastSent fn")
  if (!settings.reminderNotificationsEnabled) return
  if (!shouldSendReminder(settings.lastReminderSentAt)) return
  const message = buildReminderMessage(items)
  if (!message) return

  if (typeof Notification === "undefined") return

  const show = () => {
    try {
      new Notification(REMINDER_TITLE, { body: message })
      updateLastSent(new Date().toISOString())
    } catch {
      // ignore
    }
  }

  if (Notification.permission === "granted") {
    show()
    return
  }
  if (Notification.permission === "default") {
    Notification.requestPermission().then((p) => {
      if (p === "granted") show()
    })
  }
}

export function useOnOpenReminder(
  items: VegetableItem[],
  settings: UserSettings,
  settingsLoaded: boolean,
  updateSettings: (partial: Partial<Pick<UserSettings, "lastReminderSentAt">>) => void
): void {
  assertInvariant(Array.isArray(items), "Expected array of items")
  assertInvariant(settings != null, "Expected UserSettings")
  assertInvariant(typeof updateSettings === "function", "Expected updateSettings fn")
  useEffect(() => {
    if (!settingsLoaded) return
    tryShowReminder(items, settings, (iso) =>
      updateSettings({ lastReminderSentAt: iso })
    )
  }, [settingsLoaded, items, settings.reminderNotificationsEnabled, settings.lastReminderSentAt, updateSettings])
}
