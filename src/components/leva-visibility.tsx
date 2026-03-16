/**
 * This file may contain code that uses generative AI
 */

import { useCallback, useState } from "react";
import { Leva } from "leva";
import { useUserSettings } from "@/hooks/use-user-settings";

const PANEL_W = 320;
const PANEL_H = 400;
const MARGIN = 16;

function clampPosition(
	x: number | undefined,
	y: number | undefined
): { x: number; y: number } {
	const w = typeof window !== "undefined" ? window.innerWidth : 800;
	const h = typeof window !== "undefined" ? window.innerHeight : 600;
	const xVal = typeof x === "number" ? x : (w - PANEL_W) / 2;
	const yVal = typeof y === "number" ? y : (h - PANEL_H) / 2;
	return {
		x: Math.max(MARGIN, Math.min(w - PANEL_W - MARGIN, xVal)),
		y: Math.max(MARGIN, Math.min(h - PANEL_H - MARGIN, yVal)),
	};
}

function initialPosition(): { x: number; y: number } {
	if (typeof window === "undefined") return { x: MARGIN, y: MARGIN };
	const w = window.innerWidth;
	const h = window.innerHeight;
	return clampPosition((w - PANEL_W) / 2, (h - PANEL_H) / 2);
}

export function LevaVisibility() {
	const { settings } = useUserSettings();
	const visible = settings.adminMode && settings.show3dDebug;
	const [position, setPosition] = useState(initialPosition);

	const onDrag = useCallback(
		(pos: { x?: number; y?: number }) => setPosition(clampPosition(pos.x, pos.y)),
		[]
	);

	return (
		<div className="leva-panel-wrapper" aria-hidden={!visible}>
			<Leva
				hidden={!visible}
				titleBar={{
					position,
					onDrag,
					drag: true,
				}}
			/>
		</div>
	);
}
