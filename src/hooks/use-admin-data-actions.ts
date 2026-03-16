/**
 * This file may contain code that uses generative AI
 */

import { useRef, useState } from "react"
import {
  seedMockData,
  cleanMockData,
  exportVegetablesToJson,
  importVegetablesReplace,
} from "@/lib/db"
import { validateVegetablesImport } from "@/lib/validate-vegetables-import"
import { downloadJson } from "@/lib/download-json"
import type { VegetableItem } from "@/lib/vegetables-data"
import { useVegetableStore } from "@/hooks/use-vegetable-store"

function exportFilename(): string {
  const yyyy = new Date().getFullYear()
  const mm = String(new Date().getMonth() + 1).padStart(2, "0")
  const dd = String(new Date().getDate()).padStart(2, "0")
  return `vegetables-export-${yyyy}-${mm}-${dd}.json`
}

export function useAdminDataActions() {
  const { totalItems } = useVegetableStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<
    "seed" | "clean" | "export" | "import" | null
  >(null)
  const [message, setMessage] = useState<string | null>(null)
  const [importConfirm, setImportConfirm] = useState<{
    fileItemCount: number
    validatedItems: VegetableItem[]
  } | null>(null)

  const handleSeed = async () => {
    setLoading("seed")
    setMessage(null)
    try {
      const n = await seedMockData()
      setMessage(`Loaded ${n} mock items.`)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to load mock data.")
    } finally {
      setLoading(null)
    }
  }

  const handleClean = async () => {
    setLoading("clean")
    setMessage(null)
    try {
      const n = await cleanMockData()
      setMessage(`Cleared ${n} mock item(s).`)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to clear mock data.")
    } finally {
      setLoading(null)
    }
  }

  const handleExport = async () => {
    setLoading("export")
    setMessage(null)
    try {
      const items = await exportVegetablesToJson()
      downloadJson(JSON.stringify(items, null, 2), exportFilename())
      setMessage(`Exported ${items.length} item(s).`)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Export failed.")
    } finally {
      setLoading(null)
    }
  }

  const handleImportClick = () => {
    setMessage(null)
    fileInputRef.current?.click()
  }

  const handleImportFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setLoading("import")
    setMessage(null)
    try {
      const text = await file.text()
      let parsed: unknown
      try {
        parsed = JSON.parse(text)
      } catch {
        setMessage("Invalid JSON in file.")
        setLoading(null)
        return
      }
      if (!Array.isArray(parsed)) {
        setMessage("File must contain a JSON array of vegetable items.")
        setLoading(null)
        return
      }
      const result = validateVegetablesImport(parsed)
      if (!result.ok) {
        setMessage(result.error)
        setLoading(null)
        return
      }
      setLoading(null)
      setImportConfirm({
        fileItemCount: result.items.length,
        validatedItems: result.items,
      })
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to read file.")
      setLoading(null)
    }
  }

  const handleImportConfirm = async () => {
    if (!importConfirm) return
    setLoading("import")
    setMessage(null)
    setImportConfirm(null)
    try {
      await importVegetablesReplace(importConfirm.validatedItems)
      setMessage(
        `Import successful: ${importConfirm.validatedItems.length} items`
      )
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Import failed.")
    } finally {
      setLoading(null)
    }
  }

  const handleImportCancel = () => {
    setImportConfirm(null)
  }

  return {
    totalItems,
    fileInputRef,
    loading,
    message,
    importConfirm,
    handleSeed,
    handleClean,
    handleExport,
    handleImportClick,
    handleImportFileChange,
    handleImportConfirm,
    handleImportCancel,
  }
}
