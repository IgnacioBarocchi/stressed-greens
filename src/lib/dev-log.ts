/**
 * This file may contain code that uses generative AI
 */

/**
 * Logs arguments to console only when running in development (Vite `import.meta.env.DEV`).
 * No-op in production. Use as a drop-in for `console.log` in dev-only paths.
 */
export function devLog(...args: unknown[]): void {
	if (import.meta.env.DEV) {
		console.log(...args)
	}
}
