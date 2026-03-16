/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsModal } from "@/components/settings-modal";
import { useIsMobile } from "@/components/ui/use-mobile";

interface AppHeaderProps {
  totalItems: number;
}

export function AppHeader({ totalItems }: AppHeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const openSettings = () => {
    if (isMobile) navigate("/settings");
    else setSettingsOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl pt-[calc(1rem+env(safe-area-inset-top,0px))]">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary"
            aria-label="Home"
          >
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </Link>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Stressed Greens
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {totalItems > 0 && (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={openSettings}
            aria-label="Open settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
}
