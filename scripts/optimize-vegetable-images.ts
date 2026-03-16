/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import { readdir, mkdir } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE_DIR = join(ROOT, "public", "vegetables-source");
const OUT_DIR = join(ROOT, "public", "vegetables");

const INPUT_EXTS = new Set([".png", ".jpg", ".jpeg"]);

async function main() {
        let entries: string[];
        try {
                entries = await readdir(SOURCE_DIR);
        } catch (err) {
                const e = err as NodeJS.ErrnoException;
                if (e.code === "ENOENT") {
                        console.error(`Source directory not found: ${SOURCE_DIR}`);
                        console.error(
                                "Create it and add images (e.g. bell-pepper.png), then run again."
                        );
                        process.exit(1);
                }
                throw err;
        }

        const files = entries.filter((f) => INPUT_EXTS.has(extname(f).toLowerCase()));
        if (files.length === 0) {
                console.log(`No images (${[...INPUT_EXTS].join(", ")}) found in ${SOURCE_DIR}`);
                process.exit(0);
        }

        await mkdir(OUT_DIR, { recursive: true });

        for (const file of files) {
                const base = basename(file, extname(file));
                const srcPath = join(SOURCE_DIR, file);
                const outPath = join(OUT_DIR, `${base}.webp`);
                await sharp(srcPath).webp({ quality: 85 }).toFile(outPath);
                console.log(`${file} → ${base}.webp`);
        }

        console.log(`Done. ${files.length} image(s) written to public/vegetables/`);
}

main().catch((err) => {
        console.error(err);
        process.exit(1);
});
