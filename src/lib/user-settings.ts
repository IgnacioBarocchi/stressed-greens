/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

export type ThemeId = "legacy" | "vercel"

export interface UserSettings {
  id: "user-settings"
  simpleCreateForm: boolean
  use3dGraphics: boolean
  useAIAgents?: boolean
  reminderNotificationsEnabled: boolean
  lastReminderSentAt: string | null
  adminMode: boolean
  show3dDebug: boolean
  theme: ThemeId
  tourSeen: boolean
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  id: "user-settings",
  simpleCreateForm: true,
  use3dGraphics: false,
  useAIAgents: false,
  reminderNotificationsEnabled: true,
  lastReminderSentAt: null,
  adminMode: false,
  show3dDebug: false,
  theme: "legacy",
  tourSeen: false,
}
