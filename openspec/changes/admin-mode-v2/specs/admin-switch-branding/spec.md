## ADDED Requirements

### Requirement: Admin mode switch uses admin brand color when on

The "Admin mode" switch in the settings modal SHALL use the admin brand color (e.g. the same purple/violet used for admin borders and the "adm" pill badge) for its fill when the switch is in the checked (on) state. This SHALL make the switch visually consistent with the rest of the admin branding.

#### Scenario: Checked state uses admin color

- **WHEN** the Admin mode switch is in the on (checked) state
- **THEN** the switch's fill (or thumb/background in the on state) SHALL use the admin brand color so it is visually distinct and aligned with other admin UI

#### Scenario: Unchecked state unchanged

- **WHEN** the Admin mode switch is in the off (unchecked) state
- **THEN** the switch MAY use the default or muted styling; the requirement applies to the on state only

#### Scenario: Single admin color token

- **WHEN** the switch is styled for the admin checked state
- **THEN** it SHALL use the same admin color token (e.g. `--color-admin` or equivalent) as the rest of the admin branding (borders, badge) so the palette stays consistent
