/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import {
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "@/components/ui/select";
import { useUserSettings } from "@/hooks/use-user-settings";
import { type ThemeId } from "@/lib/user-settings";
import { useAdminDataActions } from "@/hooks/use-admin-data-actions";
import { AdmBadge, adminCardClasses } from "@/components/adm-badge";

interface SettingsModalProps {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        /** When true, render as inline page content (no dialog). Used for /settings route. */
        asPage?: boolean;
}

export function SettingsModal({ open, onOpenChange, asPage }: SettingsModalProps) {
        const { settings, updateSettings } = useUserSettings();
        const adminActions = useAdminDataActions();

        const handleSimpleFormToggle = (checked: boolean) => {
                updateSettings({ simpleCreateForm: checked });
        };

        const handle3dGraphicsToggle = (checked: boolean) => {
                updateSettings({ use3dGraphics: checked });
        };

        const handleUseAIAgentsToggle = (checked: boolean) => {
                updateSettings({ useAIAgents: checked });
        };

        const handleReminderNotificationsToggle = (checked: boolean) => {
                updateSettings({ reminderNotificationsEnabled: checked });
        };

        const handleAdminModeToggle = (checked: boolean) => {
                updateSettings({ adminMode: checked });
        };

        const handleShow3dDebugToggle = (checked: boolean) => {
                updateSettings({ show3dDebug: checked });
        };

        const handleShow3dDebugClick = () => {
                updateSettings({ show3dDebug: true });
                onOpenChange(false);
        };

        const handleThemeChange = (value: ThemeId) => {
                updateSettings({ theme: value });
        };

        const formBody = (
                                <>
                                        <div className="space-y-2 rounded-lg border border-border p-4">
                                                <Label className="text-sm font-medium">{`Theme`}</Label>
                                                <p className="text-xs text-muted-foreground">
                                                        {`App appearance (Legacy = current style, Vercel = experimental)`}
                                                </p>
                                                <Select
                                                        value={settings.theme ?? "legacy"}
                                                        onValueChange={(v) => handleThemeChange(v as ThemeId)}
                                                >
                                                        <SelectTrigger className="w-full">
                                                                <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                                <SelectItem value="legacy">{`Legacy`}</SelectItem>
                                                                <SelectItem value="vercel">{`Vercel (experimental)`}</SelectItem>
                                                        </SelectContent>
                                                </Select>
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                                <div className="space-y-0.5">
                                                        <Label
                                                                htmlFor="simple-form"
                                                                className="text-sm font-medium"
                                                        >
                                                                {`Simple create form`}
                                                        </Label>
                                                        <p className="text-xs text-muted-foreground">
                                                                {`Hide quantity, unit, and date fields when adding vegetables`}
                                                        </p>
                                                </div>
                                                <Switch
                                                        id="simple-form"
                                                        checked={settings.simpleCreateForm}
                                                        onCheckedChange={handleSimpleFormToggle}
                                                />
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                                <div className="space-y-0.5">
                                                        <Label
                                                                htmlFor="use-3d"
                                                                className="text-sm font-medium"
                                                        >
                                                                {`Use 3D graphics`}
                                                        </Label>
                                                        <p className="text-xs text-muted-foreground">
                                                                {`Expand cards to show a 3D preview`}
                                                        </p>
                                                </div>
                                                <Switch
                                                        id="use-3d"
                                                        checked={settings.use3dGraphics}
                                                        onCheckedChange={handle3dGraphicsToggle}
                                                />
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                                <div className="space-y-0.5">
                                                        <Label
                                                                htmlFor="use-ai-agents"
                                                                className="text-sm font-medium"
                                                        >
                                                                {`Use AI Agents`}
                                                        </Label>
                                                        <p className="text-xs text-muted-foreground">
                                                                {`Get AI recipes`}
                                                        </p>
                                                </div>
                                                <Switch
                                                        id="use-ai-agents"
                                                        checked={settings.useAIAgents}
                                                        onCheckedChange={handleUseAIAgentsToggle}
                                                />
                                        </div>
                                        <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                                <div className="space-y-0.5">
                                                        <Label
                                                                htmlFor="reminder-notifications"
                                                                className="text-sm font-medium"
                                                        >
                                                                {`Reminder notifications`}
                                                        </Label>
                                                        <p className="text-xs text-muted-foreground">
                                                                {`Notify when you open the app if any vegetables are use soon, use today, or expired (at most once per 24 hours).`}
                                                        </p>
                                                </div>
                                                <Switch
                                                        id="reminder-notifications"
                                                        checked={
                                                                settings.reminderNotificationsEnabled
                                                        }
                                                        onCheckedChange={
                                                                handleReminderNotificationsToggle
                                                        }
                                                />
                                        </div>

                                        <div
                                                className={`${adminCardClasses} border-t border-border pt-4 relative`}
                                        >
                                                <AdmBadge className="absolute top-4 right-4" />
                                                <h3 className="text-sm font-medium text-foreground mb-2 font-mono">
                                                        {`Admin`}
                                                </h3>
                                                <div className="flex items-center justify-between rounded-lg border border-admin p-4 mb-4">
                                                        <Label
                                                                htmlFor="admin-mode"
                                                                className="text-sm font-medium font-mono"
                                                        >
                                                                {`Admin mode`}
                                                        </Label>
                                                        <Switch
                                                                id="admin-mode"
                                                                checked={settings.adminMode}
                                                                onCheckedChange={handleAdminModeToggle}
                                                                className="data-[state=checked]:bg-admin"
                                                        />
                                                </div>
                                                {settings.adminMode && (
                                                        <>
                                                                <div className="flex items-center justify-between rounded-lg border border-admin p-4 mb-4">
                                                                        <Label
                                                                                htmlFor="show-3d-debug"
                                                                                className="text-sm font-medium font-mono"
                                                                        >
                                                                                {`Show 3D debug card`}
                                                                        </Label>
                                                                        <Switch
                                                                                id="show-3d-debug"
                                                                                checked={settings.show3dDebug}
                                                                                onCheckedChange={handleShow3dDebugToggle}
                                                                        />
                                                                </div>
                                                                <input
                                                                        ref={adminActions.fileInputRef}
                                                                        type="file"
                                                                        accept=".json,application/json"
                                                                        className="hidden"
                                                                        aria-hidden
                                                                        onChange={
                                                                                adminActions.handleImportFileChange
                                                                        }
                                                                />
                                                                <AlertDialog
                                                                        open={
                                                                                !!adminActions.importConfirm
                                                                        }
                                                                        onOpenChange={(open) =>
                                                                                !open &&
                                                                                adminActions.handleImportCancel()
                                                                        }
                                                                >
                                                                        <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                        <AlertDialogTitle>
                                                                                                Replace
                                                                                                vegetables?
                                                                                        </AlertDialogTitle>
                                                                                        <AlertDialogDescription>
                                                                                                {adminActions.importConfirm &&
                                                                                                        `Replace ${adminActions.importConfirm.fileItemCount} items. Current DB has ${adminActions.totalItems} items. Continue?`}
                                                                                        </AlertDialogDescription>
                                                                                </AlertDialogHeader>
                                                                                <AlertDialogFooter>
                                                                                <AlertDialogCancel
                                                                                        onClick={
                                                                                                adminActions.handleImportCancel
                                                                                        }
                                                                                >
                                                                                        Cancel
                                                                                </AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                        onClick={
                                                                                                adminActions.handleImportConfirm
                                                                                        }
                                                                                >
                                                                                        Replace
                                                                                </AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                </AlertDialog>
                                                                <div className="flex flex-col gap-2 font-mono text-sm">
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="border-admin w-full justify-start"
                                                                                onClick={
                                                                                        handleShow3dDebugClick
                                                                                }
                                                                        >
                                                                                                Show 3D
                                                                                                debug card
                                                                        </Button>
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="border-admin w-full justify-start"
                                                                                onClick={
                                                                                        adminActions.handleSeed
                                                                                }
                                                                                disabled={
                                                                                        adminActions.loading !==
                                                                                        null
                                                                                }
                                                                        >
                                                                                                {adminActions.loading ===
                                                                                                "seed"
                                                                                                        ? "Loading…"
                                                                                                        : "Load mock data"}
                                                                        </Button>
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="border-admin w-full justify-start"
                                                                                onClick={
                                                                                        adminActions.handleClean
                                                                                }
                                                                                disabled={
                                                                                        adminActions.loading !==
                                                                                        null
                                                                                }
                                                                        >
                                                                                                {adminActions.loading ===
                                                                                                "clean"
                                                                                                        ? "Clearing…"
                                                                                                        : "Clear mock data"}
                                                                        </Button>
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="border-admin w-full justify-start"
                                                                                onClick={
                                                                                        adminActions.handleExport
                                                                                }
                                                                                disabled={
                                                                                        adminActions.loading !==
                                                                                        null
                                                                                }
                                                                        >
                                                                                                {adminActions.loading ===
                                                                                                "export"
                                                                                                        ? "Exporting…"
                                                                                                        : "Export vegetables"}
                                                                        </Button>
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="border-admin w-full justify-start"
                                                                                onClick={
                                                                                        adminActions.handleImportClick
                                                                                }
                                                                                disabled={
                                                                                        adminActions.loading !==
                                                                                        null
                                                                                }
                                                                        >
                                                                                                {adminActions.loading ===
                                                                                                "import"
                                                                                                        ? "Importing…"
                                                                                                        : "Import vegetables"}
                                                                        </Button>
                                                                        {adminActions.message && (
                                                                                <span className="text-muted-foreground text-xs">
                                                                                        {adminActions.message}
                                                                                </span>
                                                                        )}
                                                                </div>
                                                        </>
                                                )}
                                        </div>

                                        <div className="border-t border-border pt-4">
                                                <h3 className="text-sm font-medium text-foreground mb-2">
                                                        {`About this app`}
                                                </h3>
                                                <p className="text-xs text-muted-foreground space-y-2">
                                                        {`This app is fully `}
                                                        <strong>offline-first</strong>
                                                        {`. It does `}
                                                        <strong>not require an account</strong>
                                                        {`, and all data is stored locally on your device.`}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                        {`The app only makes an `}
                                                        <strong>outbound connection</strong>
                                                        {` if you choose to enable `}
                                                        <strong>AI agents</strong>
                                                        {` in the settings above. Otherwise, it runs entirely offline.`}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                        {`This project is `}
                                                        <strong>free and open source</strong>
                                                        {`.`}
                                                </p>
                                                <p className="text-xs text-muted-foreground pt-1">
                                                        {`Created by: `}
                                                        <a
                                                                href="https://linkedin.com"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="underline hover:text-foreground"
                                                        >
                                                                {`LinkedIn`}
                                                        </a>
                                                        {` · `}
                                                        <a
                                                                href="https://github.com"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="underline hover:text-foreground"
                                                        >
                                                                {`GitHub`}
                                                        </a>
                                                </p>
                                        </div>
                                </>
        );

        if (asPage) return <div className="space-y-4 py-4">{formBody}</div>;

        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                        <DialogTitle>{`Settings`}</DialogTitle>
                                        <DialogDescription>
                                                {`Customize your fridge tracking experience`}
                                        </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">{formBody}</div>
                        </DialogContent>
                </Dialog>
        );
}
