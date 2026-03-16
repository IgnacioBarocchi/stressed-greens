/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative AI model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import { useState } from "react";
import { Leaf, Refrigerator, ChefHat, ArrowRight, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserSettings } from "@/hooks/use-user-settings";

const SLIDES: { title: string; body: string; icon: React.ReactNode }[] = [
  {
    title: "Stressed Greens",
    body: "A simple fridge tracker for vegans. Track vegetables, see freshness, and reduce waste.",
    icon: <Leaf className="h-10 w-10 text-primary" />,
  },
  {
    title: "Your fridge",
    body: "Add vegetables and we'll track their shelf life. Items are sorted by urgency so you use what needs attention first.",
    icon: <Refrigerator className="h-10 w-10 text-primary" />,
  },
  {
    title: "Recipe finder",
    body: "Turn on AI agents in settings to get recipe ideas based on what's in your fridge.",
    icon: <ChefHat className="h-10 w-10 text-primary" />,
  },
  {
    title: "Sorted by freshness",
    body: "We show what's fresh, what to use soon, and what's expired. Tap the checkmark to remove items you've used.",
    icon: <ArrowRight className="h-10 w-10 text-primary" />,
  },
  {
    title: "Settings",
    body: "Tweak the app in Settings: theme, simple form, 3D graphics, reminders, and more.",
    icon: <Settings className="h-10 w-10 text-primary" />,
  },
];

export function FirstSessionTour() {
  const { settings, updateSettings } = useUserSettings();
  const [slideIndex, setSlideIndex] = useState(0);

  if (settings.tourSeen) return null;

  const slide = SLIDES[slideIndex];
  const isLast = slideIndex === SLIDES.length - 1;

  const handleSkip = () => {
    updateSettings({ tourSeen: true });
  };

  const handleNext = () => {
    if (isLast) {
      updateSettings({ tourSeen: true });
    } else {
      setSlideIndex((i) => i + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          {slide.icon}
        </div>
        <h2 className="text-center text-lg font-semibold text-foreground">
          {slide.title}
        </h2>
        <p className="max-w-sm text-center text-sm text-muted-foreground leading-relaxed">
          {slide.body}
        </p>
      </div>
      <div className="flex gap-2 px-6 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={handleSkip}
        >
          Skip
        </Button>
        <Button
          className="flex-1"
          onClick={handleNext}
        >
          {isLast ? "Get started" : "Next"}
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 text-muted-foreground"
        onClick={handleSkip}
        aria-label="Skip tour"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
