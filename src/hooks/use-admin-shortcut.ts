/**
 * This file may contain code that uses generative AI
 */

import { useEffect } from "react"
import { useUserSettings } from "@/hooks/use-user-settings"

const ADMIN_SHORTCUT_KEY = "a"
const ADMIN_SHORTCUT_CTRL = true
const ADMIN_SHORTCUT_SHIFT = true

export function useAdminShortcut() {
  const { settings, updateSettings } = useUserSettings()
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === ADMIN_SHORTCUT_KEY &&
        e.ctrlKey === ADMIN_SHORTCUT_CTRL &&
        e.shiftKey === ADMIN_SHORTCUT_SHIFT
      ) {
        e.preventDefault()
        updateSettings({ adminMode: !settings.adminMode })
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [settings.adminMode, updateSettings])
}
