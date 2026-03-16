/**
 * This file may contain code that uses generative AI
 */

import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { devLog } from "./dev-log"

describe("devLog", () => {
	const logSpy = vi.spyOn(console, "log").mockImplementation(() => {})

	afterEach(() => {
		logSpy.mockClear()
	})

	describe("when dev mode is enabled", () => {
		beforeEach(() => {
			vi.stubEnv("DEV", "true")
		})
		afterEach(() => {
			vi.unstubAllEnvs()
		})

		it("forwards single argument to console.log", () => {
			devLog("hello")
			expect(logSpy).toHaveBeenCalledTimes(1)
			expect(logSpy).toHaveBeenCalledWith("hello")
		})

		it("forwards multiple arguments to console.log in order", () => {
			devLog("msg", 42, { a: 1 })
			expect(logSpy).toHaveBeenCalledTimes(1)
			expect(logSpy).toHaveBeenCalledWith("msg", 42, { a: 1 })
		})
	})

	// When not in dev mode, devLog is a no-op (see design.md). In Vitest with Vite,
	// import.meta.env.DEV is inlined at build time and typically true, so we cannot
	// reliably stub it to test the no-op branch without refactoring for injection.
	// Production builds replace DEV with false, so the no-op path is exercised there.
})
