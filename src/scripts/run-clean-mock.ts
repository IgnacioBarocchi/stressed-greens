/**
 * This file may contain code that uses generative AI
 */

import { cleanMockData } from "@/lib/db"

async function main() {
  const root = document.getElementById("root")
  if (!root) return
  try {
    const removed = await cleanMockData()
    root.innerHTML = `<p>Cleared ${removed} mock item(s) from the database.</p>`
  } catch (e) {
    root.innerHTML = `<p>Error: ${e instanceof Error ? e.message : String(e)}</p>`
  }
}

main()
