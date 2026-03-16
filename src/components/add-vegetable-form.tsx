/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Scissors, Search, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
        type VegetableItem,
        type VegetablePreset,
        buildAddItemPayload,
        VEGETABLE_PRESETS,
} from "@/lib/vegetables-data";
import { PresetGrid } from "@/components/preset-grid";
import { useUserSettings } from "@/hooks/use-user-settings";

interface AddVegetableFormProps {
        onAdd: (item: Omit<VegetableItem, "id">) => void;
}

export function AddVegetableForm({ onAdd }: AddVegetableFormProps) {
        const { settings } = useUserSettings();
        const [isOpen, setIsOpen] = useState(false);
        const [search, setSearch] = useState("");
        const [selectedPreset, setSelectedPreset] = useState<VegetablePreset | null>(null);
        const [selectedCustomName, setSelectedCustomName] = useState<string | null>(null);
        const [quantity, setQuantity] = useState("1");
        const [unit, setUnit] = useState("pcs");
        const [wasCut, setWasCut] = useState(false);
        const [fridgeDate, setFridgeDate] = useState(new Date().toISOString().split("T")[0]);
        const [showSuggestions, setShowSuggestions] = useState(false);
        const [showGrid, setShowGrid] = useState(false);
        const [showAdvanced, setShowAdvanced] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);
        const searchBlockRef = useRef<HTMLDivElement>(null);

        const isSimpleMode = settings.simpleCreateForm && !showAdvanced;

        const filteredPresets = VEGETABLE_PRESETS.filter((v: VegetablePreset) =>
                v.name.toLowerCase().includes(search.toLowerCase().trim())
        );
        const hasSelection = selectedPreset !== null || selectedCustomName !== null;

        const handleSelect = useCallback((preset: VegetablePreset) => {
                setSelectedPreset(preset);
                setSelectedCustomName(null);
                setSearch(preset.name);
                setShowSuggestions(false);
                setShowGrid(false);
        }, []);

        const handleSelectCustom = useCallback((name: string) => {
                setSelectedCustomName(name);
                setSelectedPreset(null);
                setSearch(name);
                setShowSuggestions(false);
                setShowGrid(false);
        }, []);

        const handleSubmit = useCallback(() => {
                const name = selectedPreset?.name ?? selectedCustomName ?? search.trim();
                if (!name) return;

                const preset =
                        selectedPreset ??
                        VEGETABLE_PRESETS.find(
                                (v: VegetablePreset) => v.name.toLowerCase() === name.toLowerCase()
                        );

                const useSimpleDefaults = settings.simpleCreateForm && !showAdvanced;

                onAdd(
                        buildAddItemPayload({
                                name,
                                quantity: useSimpleDefaults ? null : Number(quantity) || 1,
                                unit: useSimpleDefaults ? null : unit,
                                fridgeDate: useSimpleDefaults
                                        ? new Date().toISOString().split("T")[0]
                                        : fridgeDate,
                                wasCut,
                                preset,
                        })
                );

                setSearch("");
                setSelectedPreset(null);
                setSelectedCustomName(null);
                setQuantity("1");
                setUnit("pcs");
                setWasCut(false);
                setFridgeDate(new Date().toISOString().split("T")[0]);
                setShowAdvanced(false);
                setIsOpen(false);
        }, [
                selectedPreset,
                selectedCustomName,
                search,
                quantity,
                unit,
                fridgeDate,
                wasCut,
                onAdd,
                settings.simpleCreateForm,
                showAdvanced,
        ]);

        useEffect(() => {
                function handleClickOutside(e: MouseEvent) {
                        if (
                                searchBlockRef.current &&
                                !searchBlockRef.current.contains(e.target as Node)
                        ) {
                                setShowSuggestions(false);
                                setShowGrid(false);
                        }
                }
                document.addEventListener("mousedown", handleClickOutside);
                return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        if (!isOpen) {
                return (
                        <Button
                                onClick={() => setIsOpen(true)}
                                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                                size="lg"
                        >
                                <Plus className="h-4 w-4" />
                                {`Add Vegetable`}
                        </Button>
                );
        }

        return (
                <div className="animate-in slide-in-from-bottom-2 fade-in rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center justify-between pb-3">
                                <h2 className="text-sm font-semibold text-foreground">
                                        {`Add to Fridge`}
                                </h2>
                                <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        onClick={() => setIsOpen(false)}
                                >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">{`Close`}</span>
                                </Button>
                        </div>

                        {/* Vegetable search with autocomplete + preset grid */}
                        <div ref={searchBlockRef} className="relative flex flex-col gap-2">
                                <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                                ref={inputRef}
                                                placeholder="Search vegetable..."
                                                value={search}
                                                onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                        setSearch(e.target.value);
                                                        setSelectedPreset(null);
                                                        setSelectedCustomName(null);
                                                        setShowSuggestions(true);
                                                }}
                                                onFocus={() => {
                                                        setShowSuggestions(true);
                                                        setShowGrid(true);
                                                }}
                                                className="pl-9 bg-input border-border text-foreground placeholder:text-muted-foreground"
                                        />
                                </div>

                                {showSuggestions && search.trim().length > 0 && (
                                        <div className="animate-in fade-in slide-in-from-top-1 z-10 w-full overflow-auto rounded-lg border border-border bg-popover shadow-xl max-h-48">
                                                {filteredPresets.length > 0 ? (
                                                        filteredPresets.map(
                                                                (preset: VegetablePreset) => (
                                                                        <button
                                                                                key={preset.name}
                                                                                onClick={() =>
                                                                                        handleSelect(
                                                                                                preset
                                                                                        )
                                                                                }
                                                                                className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-popover-foreground transition-colors hover:bg-accent"
                                                                        >
                                                                                <span className="font-medium">
                                                                                        {
                                                                                                preset.name
                                                                                        }
                                                                                </span>
                                                                                <span className="text-xs text-muted-foreground">
                                                                                        {
                                                                                                preset.lifespanWholeDays
                                                                                        }
                                                                                        {`d whole / `}
                                                                                        {
                                                                                                preset.lifespanCutDays
                                                                                        }
                                                                                        {`d cut`}
                                                                                </span>
                                                                        </button>
                                                                )
                                                        )
                                                ) : (
                                                        <button
                                                                type="button"
                                                                onClick={() =>
                                                                        handleSelectCustom(
                                                                                search.trim()
                                                                        )
                                                                }
                                                                className="flex w-full items-center px-3 py-2.5 text-left text-sm text-popover-foreground transition-colors hover:bg-accent"
                                                        >
                                                                {`Add "`}
                                                                {search.trim()}
                                                                {`" as custom vegetable`}
                                                        </button>
                                                )}
                                        </div>
                                )}

                                {showGrid && (
                                        <PresetGrid
                                                presets={filteredPresets}
                                                search={search}
                                                onSelect={handleSelect}
                                        />
                                )}
                        </div>

                        {hasSelection && (
                                <>
                                        {/* Was cut toggle - always visible */}
                                        <div className="mt-3 flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2.5">
                                                <div className="flex items-center gap-2">
                                                        <Scissors className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <Label
                                                                htmlFor="was-cut"
                                                                className="text-sm text-secondary-foreground cursor-pointer"
                                                        >
                                                                {`Already cut / sliced`}
                                                        </Label>
                                                </div>
                                                <Switch
                                                        id="was-cut"
                                                        checked={wasCut}
                                                        onCheckedChange={setWasCut}
                                                />
                                        </div>

                                        {/* More options link - only in simple mode */}
                                        {isSimpleMode && (
                                                <button
                                                        type="button"
                                                        onClick={() => setShowAdvanced(true)}
                                                        className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                        <ChevronDown className="h-3 w-3" />
                                                        {`More options`}
                                                </button>
                                        )}

                                        {/* Advanced fields - hidden in simple mode */}
                                        {!isSimpleMode && (
                                                <>
                                                        {/* Quantity + Unit */}
                                                        <div className="mt-3 flex gap-2">
                                                                <div className="flex-1">
                                                                        <Label
                                                                                htmlFor="quantity"
                                                                                className="sr-only"
                                                                        >
                                                                                {`Quantity`}
                                                                        </Label>
                                                                        <Input
                                                                                id="quantity"
                                                                                type="number"
                                                                                min="1"
                                                                                placeholder="Qty"
                                                                                value={quantity}
                                                                                onChange={(
                                                                                        e: React.ChangeEvent<HTMLInputElement>
                                                                                ) =>
                                                                                        setQuantity(
                                                                                                e
                                                                                                        .target
                                                                                                        .value
                                                                                        )
                                                                                }
                                                                                className="bg-input border-border text-foreground"
                                                                        />
                                                                </div>
                                                                <div className="w-24">
                                                                        <Label
                                                                                htmlFor="unit"
                                                                                className="sr-only"
                                                                        >
                                                                                {`Unit`}
                                                                        </Label>
                                                                        <select
                                                                                id="unit"
                                                                                value={unit}
                                                                                onChange={(
                                                                                        e: React.ChangeEvent<HTMLSelectElement>
                                                                                ) =>
                                                                                        setUnit(
                                                                                                e
                                                                                                        .target
                                                                                                        .value
                                                                                        )
                                                                                }
                                                                                className="flex h-9 w-full rounded-md border border-border bg-input px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                                        >
                                                                                <option value="pcs">
                                                                                        pcs
                                                                                </option>
                                                                                <option value="g">
                                                                                        {`g`}
                                                                                </option>
                                                                                <option value="kg">
                                                                                        {`kg`}
                                                                                </option>
                                                                                <option value="bunch">
                                                                                        {`bunch`}
                                                                                </option>
                                                                                <option value="head">
                                                                                        {`head`}
                                                                                </option>
                                                                                <option value="bag">
                                                                                        {`bag`}
                                                                                </option>
                                                                        </select>
                                                                </div>
                                                        </div>

                                                        {/* Fridge date */}
                                                        <div className="mt-3">
                                                                <Label
                                                                        htmlFor="fridge-date"
                                                                        className="text-xs text-muted-foreground"
                                                                >
                                                                        {`Date added to fridge`}
                                                                </Label>
                                                                <Input
                                                                        id="fridge-date"
                                                                        type="date"
                                                                        value={fridgeDate}
                                                                        onChange={(
                                                                                e: React.ChangeEvent<HTMLInputElement>
                                                                        ) =>
                                                                                setFridgeDate(
                                                                                        e.target
                                                                                                .value
                                                                                )
                                                                        }
                                                                        className="mt-1 bg-input border-border text-foreground"
                                                                />
                                                        </div>
                                                </>
                                        )}

                                        {/* Lifespan preview */}
                                        <div className="mt-3 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
                                                <span className="font-medium text-secondary-foreground">
                                                        {`Shelf life: `}
                                                </span>
                                                {selectedPreset
                                                        ? wasCut
                                                                ? `~${selectedPreset.lifespanCutDays} days (cut)`
                                                                : `~${selectedPreset.lifespanWholeDays} days (whole)`
                                                        : wasCut
                                                          ? "~3 days (custom, cut)"
                                                          : "~7 days (custom, whole)"}
                                        </div>

                                        {/* Submit */}
                                        <Button
                                                onClick={handleSubmit}
                                                className="mt-3 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                                        >
                                                <Plus className="h-4 w-4" />
                                                {`Add to Fridge`}
                                        </Button>
                                </>
                        )}
                </div>
        );
}
