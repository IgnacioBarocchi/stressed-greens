/**
 * This file may contain code that uses generative AI
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  assertInvariant(
    inputs != null && typeof inputs.length === "number",
    "Expected inputs array"
  )
  return twMerge(clsx(inputs))
}

export function assertInvariant(condition: boolean, message: string) {
  if (condition) return;

  const label = "%cINVARIANT%c " + message;
  const badge = "color:white;background:#c62828;padding:2px 4px;border-radius:2px;font-weight:bold;";
  const text = "color:#c62828;";

  if (process.env.NODE_ENV === "development") {
          console.error(label, badge, text);
          throw new Error(`Invariant violation: ${message}`);
  }

  console.assert(condition, label, badge, text);
}