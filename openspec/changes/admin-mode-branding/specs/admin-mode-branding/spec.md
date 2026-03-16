## ADDED Requirements

### Requirement: Shared admin visual identity

The system SHALL provide a consistent visual identity for all admin-only UI: monospace typography, a distinct border color (e.g. purple), and an "adm" pill badge (brand background, white text). Admin-only components SHALL use this branding so they are distinguishable from normal production UI.

#### Scenario: Monospace font for admin text

- **WHEN** an admin-only component displays labels or body text
- **THEN** that text SHALL use a monospace font (e.g. Consolas or equivalent)

#### Scenario: Distinct border for admin containers

- **WHEN** an admin-only component is a container (card, panel, button group, or control with a visible boundary)
- **THEN** it SHALL have a visible border using the admin brand color (e.g. purple) so it reads as "experimental" or discrete

#### Scenario: "adm" pill badge on admin elements

- **WHEN** an admin-only element is rendered (button, card, switch, or section)
- **THEN** it SHALL display a pill-style badge with the admin brand color as background, white text "adm", so the element is clearly marked as admin

#### Scenario: Branding is reusable

- **WHEN** a new admin-only component is added
- **THEN** it SHALL be able to apply the same branding via shared styles or a shared wrapper (classes or component) without duplicating visual tokens

---

### Requirement: Admin branding applies to existing admin surfaces

Mock/clear data actions, the 3D debug card, import/export controls, and any admin-only switch or button SHALL use the shared admin branding (font, border, "adm" badge) so all admin UI is visually consistent.

#### Scenario: Mock and clear actions branded

- **WHEN** admin mode is on and the user sees load mock data or clear mock data actions
- **THEN** those controls SHALL use the admin visual identity (mono font, border, "adm" badge as appropriate)

#### Scenario: 3D debug card branded

- **WHEN** the 3D debug card is visible (e.g. when debug or admin is on)
- **THEN** the card or its container SHALL use the admin visual identity

#### Scenario: Import/export controls branded

- **WHEN** import or export controls are shown in an admin context
- **THEN** those controls SHALL use the admin visual identity
