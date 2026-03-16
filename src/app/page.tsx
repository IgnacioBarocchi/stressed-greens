/**
 * This file may contain code that uses generative AI
 */

import { useRef } from "react";
import { AppHeader } from "@/components/app-header";
import { AddVegetableForm } from "@/components/add-vegetable-form";
import { VegetableList } from "@/components/vegetable-list";
import { RecipeFinder } from "@/components/recipe-finder";
import { MockDataActions } from "@/components/mock-data-actions";
import { FirstSessionTour } from "@/components/first-session-tour";
import { useVegetableStore } from "@/hooks/use-vegetable-store";
import { useAdminShortcut } from "@/hooks/use-admin-shortcut";
import { useOnOpenReminder } from "@/hooks/use-on-open-reminder";
import { useUserSettings } from "@/hooks/use-user-settings";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import type { VegetableItem } from "@/lib/vegetables-data";

const UNDO_DELAY_MS = 5000;

export default function Home() {
        useAdminShortcut();
        const { items, addItem, removeItem, totalItems } = useVegetableStore();
        const { settings, updateSettings, isLoading: settingsLoading } = useUserSettings();
        useOnOpenReminder(items, settings, !settingsLoading, updateSettings);

        const pendingUndoRef = useRef<VegetableItem[]>([]);
        const undoToastRef = useRef<{ id: string; dismiss: () => void; update: (p: object) => void } | null>(null);
        const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

        const handleUndo = () => {
                pendingUndoRef.current.forEach((item) => addItem(item));
                pendingUndoRef.current = [];
                if (undoTimeoutRef.current) {
                        clearTimeout(undoTimeoutRef.current);
                        undoTimeoutRef.current = null;
                }
                undoToastRef.current?.dismiss();
                undoToastRef.current = null;
        };

        const removeWithUndo = (id: string) => {
                const item = items.find((i) => i.id === id);
                if (!item) return;
                removeItem(id);
                pendingUndoRef.current = [...pendingUndoRef.current, item];

                if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
                undoTimeoutRef.current = setTimeout(() => {
                        pendingUndoRef.current = [];
                        undoToastRef.current = null;
                        undoTimeoutRef.current = null;
                }, UNDO_DELAY_MS);

                const count = pendingUndoRef.current.length;
                const title = count === 1 ? "1 item removed" : `${count} items removed`;

                if (undoToastRef.current) {
                        undoToastRef.current.update({ title });
                } else {
                        const t = toast({
                                title,
                                action: <ToastAction altText="Undo" onClick={handleUndo}>Undo</ToastAction>,
                        });
                        undoToastRef.current = t;
                }
        };

        return (
                <div className="flex min-h-screen flex-col bg-background">
                        {!settingsLoading && !settings.tourSeen && <FirstSessionTour />}
                        <AppHeader totalItems={totalItems} />
                        <main className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
                                <AddVegetableForm onAdd={addItem} />
                                {settings.adminMode && <MockDataActions />}
                                <VegetableList items={items} onRemove={removeWithUndo} />
                                {settings.useAIAgents && <RecipeFinder items={items} />}
                        </main>
                </div>
        );
}
