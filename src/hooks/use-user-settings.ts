/**
 * This file may contain code that uses generative AI
 */

import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"
import { DEFAULT_USER_SETTINGS, type UserSettings } from "@/lib/user-settings"
import { assertInvariant } from "@/lib/utils"

export function useUserSettings() {
  const settings = useLiveQuery(() => db.settings.get("user-settings"))
  const resolved = settings
    ? { ...DEFAULT_USER_SETTINGS, ...settings }
    : DEFAULT_USER_SETTINGS

  const updateSettings = (partial: Partial<Omit<UserSettings, "id">>) => {
    assertInvariant(
      partial != null && typeof partial === "object",
      "Expected partial settings object"
    )
    db.settings.put({ ...resolved, ...partial, id: "user-settings" })
  }

  return {
    settings: resolved,
    updateSettings,
    isLoading: settings === undefined,
  }
}
