## Why

On Android (Tauri mobile), the app header currently renders under the status bar and system navigation, overlapping with system UI. Content should respect the device "safe area" so the header appears below the status bar and above the navigation bar. This improves usability and matches platform conventions.

## What Changes

- Add `viewport-fit=cover` to the HTML viewport meta so the app can extend edge-to-edge and use safe-area insets.
- Apply CSS safe-area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, etc.) so the header sits below the status bar and content above the navigation bar.
- Optionally apply safe-area insets to the main content area and bottom elements.

## Capabilities

### New Capabilities

- `safe-area-layout`: Layout respects device safe areas on Android (and other platforms that expose them). Header renders below status bar; bottom content above navigation bar; uses CSS `env(safe-area-inset-*)` and `viewport-fit=cover`.

### Modified Capabilities

(Leave empty—no existing spec requirements change.)

## Impact

- `index.html`: Viewport meta tag
- `src/components/app-header.tsx`: Padding for `safe-area-inset-top`
- Layout/container components: Padding for bottom and horizontal insets as needed
- No new dependencies; CSS-only
