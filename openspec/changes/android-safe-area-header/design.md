## Context

The app runs in a Tauri WebView on Android. The root layout uses a sticky header (`AppHeader`) and main content. The HTML viewport is currently `width=device-width, initial-scale=1.0` with no `viewport-fit`. On devices with notches or gesture navigation, content can draw under the status bar and nav bar. Safe area insets are exposed by the platform and consumed via CSS `env(safe-area-inset-*)` once the viewport allows it.

## Goals / Non-Goals

**Goals:**

- Header visually starts below the status bar (respects top safe area).
- Main content and bottom UI respect bottom safe area (above nav/gesture bar).
- Use standard CSS safe-area env vars; no native plugin required.
- Desktop and older browsers unaffected (insets fall back to 0).

**Non-Goals:**

- Changing header structure or behavior beyond layout insets.
- Supporting custom “safe regions” or non-standard insets.
- Handling keyboard/IME overlap (separate concern).

## Decisions

1. **Viewport meta**  
   Add `viewport-fit=cover` to the existing viewport meta in `index.html` so the document can extend into the display cutout and `env(safe-area-inset-*)` is defined. Keep existing `width` and `initial-scale`.  
   *Alternative:* Leave viewport as-is and rely only on padding; then insets may not be provided on some WebViews. Rejected so we get predictable behavior on Android.

2. **Header top inset**  
   Apply `padding-top` on the header (or its inner container) using `env(safe-area-inset-top, 0px)` so the header content sits below the status bar. Apply to the existing sticky header in `app-header.tsx` (e.g. on the `<header>` or the inner flex container).  
   *Alternative:* Apply top padding on the body or root layout; that would push the whole page down and duplicate spacing when the header is sticky. Rejected in favor of insets on the header itself.

3. **Bottom and horizontal insets**  
   Add bottom safe-area padding to the main content container (e.g. in `layout.tsx` or the scrollable content wrapper) with `env(safe-area-inset-bottom, 0px)`. Use `env(safe-area-inset-left/right, 0px)` only if we observe content being clipped on devices with horizontal insets; otherwise leave horizontal insets for a later iteration.

4. **Fallback for non-supporting environments**  
   Use the two-argument form `env(safe-area-inset-*, 0px)` everywhere so desktop and browsers that don’t set these env vars get no extra padding. No JS or feature detection.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| WebView doesn’t set safe-area env vars | Tauri Android WebView is expected to set them when viewport-fit=cover is used; if not, we get 0px and layout matches current behavior. |
| Double top padding if body also has padding | Apply inset only on the header (and optionally root content), not on both body and header. |
| Very old Android WebView | env() with fallback is safe; unsupported env vars yield the fallback. |

## Open Questions

- None. Proceed to specs and tasks.
