/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import type { VegetablePreset } from "@/lib/vegetables-data";
import { DEFAULT_IMAGE_URL } from "../lib/vegetables-data";

export function getHighlightSegments(
        name: string,
        search: string
): { text: string; match: boolean }[] {
        const s = search.trim().toLowerCase();
        if (!s) return [{ text: name, match: false }];
        const lower = name.toLowerCase();
        const i = lower.indexOf(s);
        if (i === -1) return [{ text: name, match: false }];
        return [
                ...(i > 0 ? [{ text: name.slice(0, i), match: false }] : []),
                { text: name.slice(i, i + s.length), match: true },
                ...(i + s.length < name.length
                        ? [{ text: name.slice(i + s.length), match: false }]
                        : []),
        ];
}

interface PresetGridProps {
        presets: VegetablePreset[];
        search: string;
        onSelect: (preset: VegetablePreset) => void;
}

export function PresetGrid({ presets, search, onSelect }: PresetGridProps) {
        if (presets.length === 0) return null;
        return (
                <div
                        className="grid grid-cols-3 gap-2 overflow-auto rounded-lg border border-border bg-popover p-2 sm:grid-cols-4 md:grid-cols-5 max-h-64"
                        data-preset-grid
                >
                        {presets.map((preset) => (
                                <button
                                        key={preset.name}
                                        type="button"
                                        onClick={() => onSelect(preset)}
                                        className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card p-2 text-center transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                        <img
                                                src={preset.imageUrl}
                                                alt=""
                                                className="h-12 w-12 rounded object-cover sm:h-14 sm:w-14"
                                                onError={(e) => {
                                                        const t = e.currentTarget;
                                                        t.onerror = null;
                                                        t.src = DEFAULT_IMAGE_URL;
                                                }}
                                        />
                                        <span className="line-clamp-2 text-xs font-medium text-popover-foreground">
                                                {getHighlightSegments(preset.name, search).map(
                                                        (seg, j) =>
                                                                seg.match ? (
                                                                        <span
                                                                                key={j}
                                                                                className="bg-primary/20 font-semibold"
                                                                        >
                                                                                {seg.text}
                                                                        </span>
                                                                ) : (
                                                                        seg.text
                                                                )
                                                )}
                                        </span>
                                </button>
                        ))}
                </div>
        );
}
