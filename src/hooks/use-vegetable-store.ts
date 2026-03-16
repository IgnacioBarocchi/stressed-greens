

/**
 * This file may contain code that uses generative AI
 */

import { useCallback, useMemo } from "react"
import { useLiveQuery } from "dexie-react-hooks"
import {
  type VegetableItem,
  generateId,
  sortByPriority,
} from "@/lib/vegetables-data"
import { db } from "@/lib/db"
import { assertInvariant } from "@/lib/utils"

export function useVegetableStore() {
  const items = useLiveQuery(() => db.vegetables.toArray(), []) ?? []

  const addItem = useCallback((item: Omit<VegetableItem, "id">) => {
    assertInvariant(item != null, "Expected item object")
    assertInvariant(typeof item.name === "string", "Expected item.name string")
    assertInvariant(typeof item.fridgeDate === "string", "Expected item.fridgeDate string")
    db.vegetables.add({ ...item, id: generateId(), isMock: false })
  }, [])

  const removeItem = useCallback((id: string) => {
    assertInvariant(typeof id === "string", "Expected string id")
    db.vegetables.delete(id)
  }, [])

  const sortedItems = useMemo(
    () => [...items].sort(sortByPriority),
    [items],
  )

  return {
    items: sortedItems,
    addItem,
    removeItem,
    totalItems: items.length,
  }
}
