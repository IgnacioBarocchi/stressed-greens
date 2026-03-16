/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import { useAtomValue, useSetAtom } from "jotai";
import { Refrigerator } from "lucide-react";
import { type VegetableItem } from "@/lib/vegetables-data";
import { VegetableCard } from "@/components/vegetable-card";
import { Debug3dCard } from "@/components/debug-3d-card";
import { expandedCardIdAtom } from "@/store/atoms";
import { useUserSettings } from "@/hooks/use-user-settings";

interface VegetableListProps {
        items: VegetableItem[];
        onRemove: (id: string) => void;
}

export function VegetableList({ items, onRemove }: VegetableListProps) {
        const expandedCardId = useAtomValue(expandedCardIdAtom);
        const setExpandedCardId = useSetAtom(expandedCardIdAtom);
        const { settings } = useUserSettings();
        const show3dDebug = settings.adminMode && settings.show3dDebug;

        const handleToggleExpand = (id: string) => {
                setExpandedCardId((prev: string | null) => (prev === id ? null : id));
        };

        if (items.length === 0) {
                return (
                        <>
                                {show3dDebug && <Debug3dCard />}
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                                                <Refrigerator className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="mt-4 text-sm font-semibold text-foreground">
                                                {`Your fridge is empty`}
                                        </h3>
                                        <p className="mt-1 max-w-[240px] text-xs text-muted-foreground leading-relaxed">
                                                {`Add vegetables to start tracking their shelf life and reduce food waste.`}
                                        </p>
                                </div>
                        </>
                );
        }

        return (
                <div className="flex flex-col gap-2">
                        {show3dDebug && <Debug3dCard />}
                        {items.map((item) => (
                                <VegetableCard
                                        key={item.id}
                                        item={item}
                                        onRemove={onRemove}
                                        isExpanded={expandedCardId === item.id}
                                        onToggleExpand={() => handleToggleExpand(item.id)}
                                />
                        ))}
                </div>
        );
}
