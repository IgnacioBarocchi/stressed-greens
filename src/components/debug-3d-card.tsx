/**
 * This file may contain code that uses generative AI
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
        VegetableCard3dCanvas,
        type MascotAnimationState,
} from "@/components/vegetable-card-3d-canvas";
import { AdmBadge, adminCardClasses } from "@/components/adm-badge";

export function Debug3dCard() {
        const [animation, setAnimation] = useState<MascotAnimationState>("dance");

        const toggleAnimation = () => {
                setAnimation((prev) => (prev === "dance" ? "crawl" : "dance"));
        };

        return (
                <div
                        className={`${adminCardClasses} rounded-xl bg-card p-3 shadow-sm relative`}
                >
                        <AdmBadge className="absolute top-2 right-2" />
                        <p className="mb-2 text-xs font-medium text-muted-foreground font-mono">
                                {`3D debug — click canvas to log camera`}
                        </p>
                        <VegetableCard3dCanvas animation={animation} />
                        <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="mt-2 w-full font-mono border-admin"
                                onClick={toggleAnimation}
                        >
                                {animation === "dance"
                                        ? "Switch to crawl"
                                        : "Switch to dance"}
                        </Button>
                </div>
        );
}
