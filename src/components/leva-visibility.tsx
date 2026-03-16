/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import { Leva } from "leva"
import { useUserSettings } from "@/hooks/use-user-settings"

export function LevaVisibility() {
  const { settings } = useUserSettings()
  const visible = settings.adminMode && settings.show3dDebug
  return <Leva hidden={!visible} />
}
