/**
 * This file may contain code that uses generative AI
 */

import { Canvas3D } from "./canvas-3d";

export function VegetableCard3dCanvas({ animation = "dance" }: VegetableCard3dCanvasProps) {
        return (
                <div
                        className="relative w-full rounded-lg overflow-hidden bg-secondary/30"
                        style={{ aspectRatio: "16/10", minHeight: 120 }}
                        onPointerDown={(e) => e.stopPropagation()}
                >
                        <Canvas3D animation={animation} />
                </div>
        );
}
