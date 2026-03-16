/**
 * This file may contain code that uses generative AI
 *
 * Cleans all mock vegetables from the Dexie DB (IndexedDB).
 * Must run in the browser: open /clean-mock.html when the dev server is running,
 * or use the "Clear mock data" button in the app.
 */

import { cleanMockData } from "../src/lib/db";

export async function runCleanMockData(): Promise<number> {
        return cleanMockData();
}
