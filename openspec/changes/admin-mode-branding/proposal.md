## Why

Admin mode is currently controlled only by an internal atom, with no persistent or discoverable entry point. For a single-user app where the same person will use it long-term, admin features (3D debug card, load mocks, import/export, etc.) should be reachable from a normal settings flow. Making admin UI visually distinct (branding) avoids confusion with normal production UI and signals “experimental” / dev-oriented controls.

## What Changes

- **Admin mode entry point**: Admin mode becomes available from the **settings modal** (toggle or section), so the user can enable it without dev shortcuts or internal state.
- **Admin mode branding**: Every admin-only component (buttons, cards, switch, etc.) gets a consistent visual identity:
  - **Typography**: Monospace font (e.g. Consolas) for labels/text in admin UI.
  - **Border**: Distinct border color (e.g. purple) for an “experimental / discrete” look.
  - **Badge**: A pill-style badge with the brand color and white text **“adm”** to mark admin-only elements.
- **Settings modal scope**: When admin is on, the settings modal (or an admin section within it) allows:
  - Preview / access to the 3D debug card.
  - Load mock data and clear mock data.
  - Import and export (e.g. vegetables JSON).
- **Persistence (optional)**: Decide whether the admin-mode toggle is persisted (e.g. in user settings) so it survives reloads; current internal atom does not persist.

## Capabilities

### New Capabilities

- **admin-mode-branding**: Shared styles and components for admin UI (mono font, purple border, “adm” pill badge). Any component that is admin-only can use this branding.
- **admin-mode-settings**: Admin mode toggle and admin-only actions (3D debug preview, load/clear mocks, import/export) exposed from the settings modal when the user has turned admin on.

### Modified Capabilities

- **admin-mode** (from internal-admin-mode): Evolve from “internal atom only” to “user-toggle from settings”; optionally persist the toggle. Existing atoms (e.g. `adminModeAtom`) can remain, but the toggle is now in settings.
- **Settings modal**: Add admin section or integrate admin toggle and links to admin actions (debug card, mocks, import/export).

## Impact

- **Store/atoms**: `adminModeAtom` may be persisted (e.g. via user settings) if we want admin to survive reloads; otherwise keep ephemeral and only move the toggle into settings UI.
- **UI**: New shared admin branding (CSS/Tailwind classes or a small wrapper component for border + font + badge). Settings modal gains admin toggle and entry points for 3D debug, mocks, import/export.
- **Components**: Mock/clear buttons, 3D debug card, import/export controls, and any admin-only switch/button get the new branding (mono font, purple border, “adm” pill).
- **Dependencies**: None new; reuse existing settings modal and store.
