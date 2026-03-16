/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import { useState, useRef } from "react";
import { Check, Scissors, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
        type VegetableItem,
        DEFAULT_IMAGE_URL,
        getRemainingDays,
        getUrgencyLevel,
} from "@/lib/vegetables-data";
import { useUserSettings } from "@/hooks/use-user-settings";
import { VegetableCard3dCanvas } from "@/components/vegetable-card-3d-canvas";

interface VegetableCardProps {
        item: VegetableItem;
        onRemove: (id: string) => void;
        isExpanded?: boolean;
        onToggleExpand?: () => void;
}

export function VegetableCard({
        item,
        onRemove,
        isExpanded = false,
        onToggleExpand,
}: VegetableCardProps) {
        const { settings } = useUserSettings();
        const [isRemoving, setIsRemoving] = useState(false);
        const touchStart = useRef<{ x: number; y: number } | null>(null);
        const SWIPE_THRESHOLD = 80;
        const SWIPE_ASPECT = 2;
        const show3d = isExpanded && settings.use3dGraphics;
        const remaining = getRemainingDays(item);
        const urgency = getUrgencyLevel(item);
        const totalLifespan = item.wasCut ? item.lifespanCutDays : item.lifespanWholeDays;
        const progressPercent = Math.max(0, Math.min(100, (remaining / totalLifespan) * 100));

        const urgencyColorMap = {
                fresh: "bg-urgency-fresh",
                warning: "bg-urgency-warning",
                danger: "bg-urgency-danger",
        };

        const urgencyTextMap = {
                fresh: "text-urgency-fresh",
                warning: "text-urgency-warning",
                danger: "text-urgency-danger",
        };

        const urgencyLabel = {
                fresh: "Fresh",
                warning: "Use soon",
                danger: remaining <= 0 ? "Expired" : "Use today",
        };

        const handleRemove = (e: React.MouseEvent) => {
                e.stopPropagation();
                setIsRemoving(true);
                setTimeout(() => onRemove(item.id), 300);
        };

        const onTouchStart = (e: React.TouchEvent) => {
                const t = e.targetTouches[0];
                if (t) touchStart.current = { x: t.clientX, y: t.clientY };
        };

        const onTouchEnd = (e: React.TouchEvent) => {
                const start = touchStart.current;
                touchStart.current = null;
                if (!start) return;
                const t = e.changedTouches[0];
                if (!t) return;
                const deltaX = t.clientX - start.x;
                const deltaY = t.clientY - start.y;
                if (
                        deltaX < -SWIPE_THRESHOLD &&
                        Math.abs(deltaX) > Math.abs(deltaY) * SWIPE_ASPECT
                ) {
                        e.preventDefault();
                        setIsRemoving(true);
                        setTimeout(() => onRemove(item.id), 300);
                }
        };

        const handleCardClick = () => {
                onToggleExpand?.();
        };

        const canExpand = Boolean(onToggleExpand && settings.use3dGraphics);

        return (
                <div
                        role={canExpand ? "button" : undefined}
                        tabIndex={canExpand ? 0 : undefined}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                        className={`group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 ${
                                isRemoving
                                        ? "animate-out fade-out slide-out-to-right"
                                        : "animate-in fade-in slide-in-from-bottom-1"
                        } ${canExpand ? "cursor-pointer" : ""}`}
                >
                        <div
                                onClick={canExpand ? handleCardClick : undefined}
                                onKeyDown={
                                        canExpand
                                                ? (e) => e.key === "Enter" && handleCardClick()
                                                : undefined
                                }
                        >
                                {/* Urgency accent bar */}
                                <div
                                        className={`absolute left-0 top-0 h-full w-1 ${urgencyColorMap[urgency]}`}
                                />

                                <div className="flex items-start gap-3 p-3 pl-4">
                                        <img
                                                src={item.imageUrl ?? DEFAULT_IMAGE_URL}
                                                alt=""
                                                className="h-12 w-12 shrink-0 rounded-md object-cover"
                                                onError={(e) => {
                                                        const t = e.currentTarget;
                                                        t.onerror = null;
                                                        t.src = DEFAULT_IMAGE_URL;
                                                }}
                                        />
                                        <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                        <h3 className="truncate text-sm font-semibold text-card-foreground">
                                                                {item.name}
                                                        </h3>
                                                        {item.wasCut && (
                                                                <span className="flex items-center gap-0.5 rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">
                                                                        <Scissors className="h-2.5 w-2.5" />
                                                                        {`Cut`}
                                                                </span>
                                                        )}
                                                </div>

                                                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                                        {item.quantity != null &&
                                                                item.unit != null && (
                                                                        <span>
                                                                                {item.quantity}{" "}
                                                                                {item.unit}
                                                                        </span>
                                                                )}
                                                        <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {new Date(
                                                                        item.fridgeDate
                                                                ).toLocaleDateString("en-US", {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                })}
                                                        </span>
                                                </div>

                                                {/* Progress bar */}
                                                <div className="mt-2 flex items-center gap-2">
                                                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                                                                <div
                                                                        className={`h-full rounded-full transition-all duration-500 ${urgencyColorMap[urgency]}`}
                                                                        style={{
                                                                                width: `${progressPercent}%`,
                                                                        }}
                                                                />
                                                        </div>
                                                        <span
                                                                className={`text-[10px] font-semibold ${urgencyTextMap[urgency]}`}
                                                        >
                                                                {remaining <= 0
                                                                        ? "Expired"
                                                                        : `${remaining}d left`}
                                                        </span>
                                                </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col items-end gap-1">
                                                <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${urgencyColorMap[urgency]} text-background`}
                                                >
                                                        {urgencyLabel[urgency]}
                                                </span>
                                                <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-muted-foreground opacity-100 md:opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                                                        onClick={handleRemove}
                                                        aria-label={`Mark ${item.name} as eaten`}
                                                >
                                                        <Check className="h-3.5 w-3.5" />
                                                </Button>
                                        </div>
                                </div>
                        </div>

                        {show3d && (
                                <div className="px-3 pb-3">
                                        <VegetableCard3dCanvas
                                                animation={urgency === "danger" ? "crawl" : "dance"}
                                        />
                                </div>
                        )}
                </div>
        );
}
