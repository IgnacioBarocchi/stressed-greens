/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import { cn } from "@/lib/utils"

export function AdmBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-admin px-2 py-0.5 text-xs font-medium text-white",
        className
      )}
      aria-label="Admin-only feature"
    >
      adm
    </span>
  )
}

export const adminCardClasses =
  "font-mono rounded-lg border-2 border-admin p-4 text-sm"
