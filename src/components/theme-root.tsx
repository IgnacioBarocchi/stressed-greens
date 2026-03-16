/**
 * This file may contain code that uses generative AI
 */

import { useUserSettings } from "@/hooks/use-user-settings"
import { type ThemeId } from "@/lib/user-settings"
import { cn } from "@/lib/utils"

export function ThemeRoot({ children }: { children: React.ReactNode }) {
  const { settings } = useUserSettings()
  const theme: ThemeId = settings.theme ?? "legacy"
  return (
    <div
      className={cn("dark", theme === "vercel" && "theme-vercel")}
      data-theme={theme}
    >
      {children}
    </div>
  )
}
