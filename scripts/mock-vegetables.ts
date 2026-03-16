/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { VegetableItem } from "../src/lib/vegetables-data";
import { VEGETABLE_PRESETS, DEFAULT_IMAGE_URL, getUrgencyLevel } from "../src/lib/vegetables-data";

const __dirname = dirname(fileURLToPath(import.meta.url));

function generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function daysAgo(days: number): string {
        const d = new Date();
        d.setDate(d.getDate() - days);
        return d.toISOString().split("T")[0];
}

function buildItem(
        preset: (typeof VEGETABLE_PRESETS)[number],
        fridgeDate: string,
        wasCut: boolean,
        quantity: number,
        unit: string
): VegetableItem {
        const item: VegetableItem = {
                id: generateId(),
                name: preset.name,
                quantity,
                unit,
                fridgeDate,
                lifespanWholeDays: preset.lifespanWholeDays,
                lifespanCutDays: preset.lifespanCutDays,
                wasCut,
                isMock: true,
                imageUrl: preset.imageUrl ?? DEFAULT_IMAGE_URL,
        };
        return item;
}

function pick<T>(arr: T[], count: number): T[] {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
}

const UNITS = ["pcs", "g", "bunch", "head"] as const;

function main() {
        const items: VegetableItem[] = [];
        const presets = VEGETABLE_PRESETS;
        const used = new Set<number>();

        function addWithTargetRemaining(targetRemaining: number, count: number, wasCut: boolean) {
                const indices = presets.map((_, i) => i).filter((i) => !used.has(i));
                const chosen = pick(indices, count);
                chosen.forEach((idx) => {
                        used.add(idx);
                        const p = presets[idx];
                        const total = wasCut ? p.lifespanCutDays : p.lifespanWholeDays;
                        const daysPassed = Math.max(0, total - targetRemaining);
                        const fridgeDate = daysAgo(daysPassed);
                        const item = buildItem(
                                p,
                                fridgeDate,
                                wasCut,
                                Math.floor(Math.random() * 3) + 1,
                                UNITS[Math.floor(Math.random() * UNITS.length)]
                        );
                        items.push(item);
                });
        }

        addWithTargetRemaining(-1, 4, false);
        addWithTargetRemaining(0, 2, true);
        addWithTargetRemaining(1, 3, false);
        addWithTargetRemaining(2, 2, true);
        addWithTargetRemaining(3, 2, false);
        addWithTargetRemaining(4, 2, false);
        addWithTargetRemaining(6, 3, false);
        addWithTargetRemaining(10, 3, false);

        const byUrgency = { fresh: 0, warning: 0, danger: 0 };
        items.forEach((item) => {
                const u = getUrgencyLevel(item);
                byUrgency[u]++;
        });

        const outDir = join(__dirname, "..", "public");
        const outPath = join(outDir, "mock-vegetables.json");
        mkdirSync(outDir, { recursive: true });
        writeFileSync(outPath, JSON.stringify(items, null, 2), "utf-8");
        console.log(`Wrote ${items.length} mock items to ${outPath}`);
        console.log("By urgency:", byUrgency);
}

main();
