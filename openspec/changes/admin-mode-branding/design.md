## Context

The app has an internal admin mode (change `internal-admin-mode`): `adminModeAtom` and `debug3dAtom` in `src/store/atoms.ts` gate mock/clear actions and 3D camera persistence. Admin is toggled via keyboard shortcut (`use-admin-shortcut.ts`); the flag is not persisted. The settings modal (`src/components/settings-modal.tsx`) uses Radix Dialog and `useUserSettings()`; user preferences live in Dexie `settings` table (`UserSettings` in `src/lib/user-settings.ts`). Mock/clear actions are rendered on the main page when `adminModeAtom` is true. This change makes admin discoverable from settings, persists the toggle for the long-term single user, and applies a consistent visual identity (mono font, purple border, "adm" pill) to all admin-only UI.

## Goals / Non-Goals

**Goals:**

- Admin mode toggle in the settings modal; admin UI consistently branded (mono font, purple border, "adm" pill).
- Settings modal provides access to 3D debug card, load/clear mocks, and import/export when admin is on.
- Admin mode preference survives reloads (persisted) so the single user does not need to re-enable it.

**Non-Goals:**

- Changing how mock/clear or 3D debug work functionally (only entry point and visuals).
- Multi-user or role-based admin; this remains a single-user local app.

## Decisions

### 1. Persist admin mode in user settings

**Decision:** Add `adminMode: boolean` to `UserSettings` and persist it in the existing `settings` table. On app load, derive or sync `adminModeAtom` from the persisted value so the toggle survives reloads.

**Rationale:** The proposal targets a single long-term user; persisting avoids re-enabling admin after every reload. Reuses existing settings storage; no new persistence layer.

**Alternative:** Keep admin ephemeral (current behavior). Rejected because the user explicitly wanted a comfortable, non-internal experience.

### 2. Admin branding: Tailwind classes + small badge component

**Decision:** Define admin visual identity via Tailwind: (1) a shared font class (e.g. `font-mono`) for admin text, (2) a border class using a purple token (e.g. `border-admin` or `border-violet-600`), (3) a small `AdmBadge` component (pill, brand bg, white "adm" text) used on admin containers or next to labels. Export a wrapper or class list (e.g. `adminCardClasses`) so components can apply the full set without duplication.

**Rationale:** Keeps tokens in one place (Tailwind config or a single module); no inline magic values. Badge as a component allows consistent placement and accessibility (e.g. aria-label).

### 3. Admin brand color

**Decision:** Use a single purple/violet shade for border and badge background (e.g. `violet-600` or a custom `admin` theme color). Prefer a theme token in Tailwind so it can be adjusted in one place.

**Rationale:** "Experimental, discrete" look; purple is distinct from typical primary/secondary UI. One token keeps borders and badge aligned.

### 4. Where the "adm" badge appears

**Decision:** Each admin-only block (card, section, or logical control group) shows one "adm" pill—e.g. at the top-right of the block or next to the section heading. Buttons inside that block do not each get a separate pill to avoid clutter.

**Rationale:** Spec requires admin elements to be clearly marked; one badge per container is sufficient and keeps the UI readable.

### 5. Settings modal: Admin section

**Decision:** Add an "Admin" section to the settings modal, below the existing toggles, with the admin branding (mono font, purple border, "adm" badge). The section contains: (1) Admin mode toggle (persisted via `UserSettings`), (2) When admin is on: entry to open/preview 3D debug card, buttons for Load mock data and Clear mock data, and Import/Export (vegetables JSON). Use a collapsible or always-visible block; when admin is off, show only the toggle and optionally hide or disable the action buttons.

**Rationale:** Single place for admin entry points; branding makes the section obviously "admin" and separate from normal settings.

### 6. Sync atom with persisted admin setting

**Decision:** Either (a) initialize `adminModeAtom` from `UserSettings.adminMode` on load and update the DB when the toggle changes in settings, or (b) derive admin state from `useUserSettings().settings.adminMode` in components and stop using the atom for persistence. Prefer (a) if other code (e.g. shortcut, page gating) already reads the atom so we only add a sync path (settings → atom and atom → settings on toggle).

**Rationale:** One source of truth for "is admin on"; minimal change to existing consumers of `adminModeAtom`.

### 7. Mock/clear and debug card entry from settings

**Decision:** In the admin section, provide explicit buttons/links: "Open 3D debug card" (e.g. scroll to or expand debug card, or open in modal), "Load mock data", "Clear mock data", "Import…", "Export…". These may call the same handlers as existing mock/clear and import/export features. Mock/clear can remain on the main page when admin is on for quick access; settings then offers a second entry point.

**Rationale:** Spec requires access from settings; duplicating entry points (page + settings) is acceptable for convenience.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-------------|
| Admin left on by mistake (e.g. shared device) | Single-user assumption; if needed later, add "reset admin" or do not persist. |
| Brand color clashes with theme | Use a dedicated token; keep contrast for badge text (white on purple). |
| Settings modal grows large | Admin section can be collapsible; list actions compactly (e.g. icon + label). |

## Migration Plan

- Add `adminMode` to `UserSettings` and `DEFAULT_USER_SETTINGS` (default `false` for new users; optional migration for existing row).
- Add sync: on app init, set `adminModeAtom` from persisted `adminMode`; when settings modal toggle changes, write to DB and update atom.
- Introduce admin branding: Tailwind token(s), `AdmBadge` component, and shared class list or wrapper; apply to admin section in settings first.
- Add Admin section to settings modal (toggle + 3D debug, load/clear mock, import/export when admin on).
- Apply branding to existing admin surfaces: mock/clear block on page, 3D debug card, import/export UI.
- Keep keyboard shortcut as optional convenience; it can toggle the atom (and persist via same sync).

## Open Questions

None; persistence and structure are decided.
