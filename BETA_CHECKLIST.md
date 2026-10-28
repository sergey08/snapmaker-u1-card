# Beta release checklist / Lista de comprobación de la beta

This checklist is for the **first public beta**, not a stable release.

## Automated checks / Pruebas automáticas

- [ ] GitHub Actions `Validate Snapmaker U1 Card` passes on the release commit.
- [ ] JavaScript syntax check passes.
- [ ] HACS metadata and required repository files pass validation.
- [ ] Localization and custom element smoke checks pass.

## Manual Home Assistant tests / Pruebas manuales

- [ ] Fresh installation using a HACS custom Dashboard repository.
- [ ] New card starts the three-step wizard without JavaScript errors.
- [ ] Entity auto-detection is read-only and requires user review.
- [ ] All seven languages display correctly in the card, wizard, and editor.
- [ ] Full and compact layouts work in desktop and mobile dashboards.
- [ ] Light and dark themes have readable text and cyan-blue progress indicators.
- [ ] Optional camera, current-job thumbnail, Spoolman and electricity sections handle unavailable entities; no duplicate preview section appears.
- [ ] Pause/resume/stop/emergency actions are tested with explicit user confirmation and safe conditions.
- [ ] Multiple-printer installations do not accidentally mix entity mappings.

## Verified on the development Home Assistant / Verificado en el Home Assistant de desarrollo

- [x] The definitive `custom:snapmaker-u1-card` instance is in `lovelace` (Resumen). The redundant `dashboard-sca` was deleted on user request and its absence confirmed via a fresh dashboard list (2026-10-28).
- [x] Current JavaScript resource successfully deployed to Home Assistant in the preceding development step.
- [ ] Clean HACS installation remains unverified; the current test deployment is **not** proof of HACS installability.
- [ ] Visual verification of the final changes on both dashboards is still pending.

## Read-only entity audit / Auditoría de entidades (2026-10-28)

- [x] Verified all 45 entity references on the definitive `lovelace` card via Home Assistant read-only state queries.
- [x] Printer state `ready`, print state `complete`; camera entities, all four filament materials/weights/colors, temperatures, and electricity entities responded.
- [ ] `print_eta` and four print-control button entities returned `unknown` while no print was active. Verify them during a controlled live print before release; do **not** assume they are broken and do not trigger emergency/stop actions merely to test.

## Publication / Publicación

- [ ] Capture **new** genuine Home Assistant screenshots of the approved **light background / cyan-blue EV Builder-inspired design** (the older dark-theme screenshots are outdated).
- [ ] Add four current screenshots to `assets/screenshots/` with exact names `card-full.png`, `card-compact.png`, `setup-wizard.png`, and `spoolman-inventory.png`, then link them in README.
- [ ] Update README with verified HACS installation instructions.
- [ ] Create a pre-release GitHub tag and release notes (for example `v0.1.0-beta.1`).
- [ ] Install the exact release through HACS and test a fresh dashboard.
- [ ] Only then announce the beta; stable release requires further testing.

**Current status:** In progress. Direct JavaScript syntax and runtime registration checks were performed against the current GitHub source, but a successful GitHub Actions workflow run has **not** been verified. No public beta tag or release has been created. Do not mark the beta released until the above checks have been performed.
