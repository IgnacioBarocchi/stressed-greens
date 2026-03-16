/**
 * This file may contain code that uses generative AI
 */

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAdminDataActions } from "@/hooks/use-admin-data-actions"
import { AdmBadge } from "@/components/adm-badge"
import { adminCardClasses } from "@/components/adm-badge"

export function MockDataActions() {
  const {
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
  } = useAdminDataActions()

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        aria-hidden
        onChange={handleImportFileChange}
      />
      <AlertDialog
        open={!!importConfirm}
        onOpenChange={(open) => !open && handleImportCancel()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace vegetables?</AlertDialogTitle>
            <AlertDialogDescription>
              {importConfirm &&
                `Replace ${importConfirm.fileItemCount} items. Current DB has ${totalItems} items. Continue?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleImportCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleImportConfirm}>
              Replace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div
        className={`${adminCardClasses} flex flex-wrap items-center gap-2 relative`}
      >
        <AdmBadge className="absolute top-2 right-2" />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSeed}
          disabled={loading !== null}
          className="font-mono border-admin"
        >
          {loading === "seed" ? "Loading…" : "Load mock data"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClean}
          disabled={loading !== null}
          className="font-mono border-admin"
        >
          {loading === "clean" ? "Clearing…" : "Clear mock data"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={loading !== null}
          className="font-mono border-admin"
        >
          {loading === "export" ? "Exporting…" : "Export vegetables (JSON)"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportClick}
          disabled={loading !== null}
          className="font-mono border-admin"
        >
          {loading === "import" ? "Importing…" : "Import vegetables (JSON)"}
        </Button>
        {message && (
          <span className="text-muted-foreground font-mono">{message}</span>
        )}
      </div>
    </>
  )
}
