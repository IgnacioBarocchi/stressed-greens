/**
 * This file may contain code that uses generative AI
 */

import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsModal } from "@/components/settings-modal";

export function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl pt-[calc(1rem+env(safe-area-inset-top,0px))]">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => navigate("/")}
            aria-label="Back to home"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Settings
          </h1>
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg flex-1 overflow-auto px-4 py-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
        <SettingsModal open={true} onOpenChange={(open) => !open && navigate("/")} asPage={true} />
      </main>
    </div>
  )
}
