## ADDED Requirements

### Requirement: Viewport allows safe area insets

The HTML viewport meta SHALL include `viewport-fit=cover` so the document can extend into the display cutout and the user agent exposes `env(safe-area-inset-*)` values.

#### Scenario: Viewport meta on load

- **WHEN** the app loads (any platform)
- **THEN** the viewport meta tag includes `viewport-fit=cover` (in addition to existing width and scale)

#### Scenario: No regression on desktop

- **WHEN** the app runs in an environment that does not set safe-area env vars
- **THEN** layout SHALL remain correct (e.g. via `env(..., 0px)` fallback)

---

### Requirement: Header respects top safe area

The app header SHALL be positioned below the system status bar by applying top safe-area inset as padding so header content is not obscured.

#### Scenario: Header below status bar on Android

- **WHEN** the app runs in Tauri Android WebView and the device reports a non-zero top safe area
- **THEN** the header content (title, actions) is fully visible below the status bar

#### Scenario: Header unchanged on desktop

- **WHEN** the app runs on desktop or in a context with no top safe area
- **THEN** the header has no extra top padding (fallback 0px)

---

### Requirement: Main content respects bottom safe area

The main content area SHALL include bottom padding equal to the bottom safe-area inset so content and bottom UI are not obscured by the system navigation or gesture bar.

#### Scenario: Content above nav bar on Android

- **WHEN** the app runs in Tauri Android WebView and the device reports a non-zero bottom safe area
- **THEN** the bottom of the scrollable content and any bottom-affixed UI sit above the navigation/gesture area

#### Scenario: No extra bottom padding on desktop

- **WHEN** the app runs on desktop or in a context with no bottom safe area
- **THEN** the main content has no extra bottom padding (fallback 0px)
