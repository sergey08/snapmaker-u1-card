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
- [ ] Optional camera, thumbnail, Spoolman and electricity sections handle unavailable entities.
- [ ] Pause/resume/stop/emergency actions are tested with explicit user confirmation and safe conditions.
- [ ] Multiple-printer installations do not accidentally mix entity mappings.

## Publication / Publicación

- [ ] Add genuine Home Assistant screenshots to `assets/` and link them in README.
- [ ] Update README with verified HACS installation instructions.
- [ ] Create a pre-release GitHub tag and release notes (for example `v0.1.0-beta.1`).
- [ ] Install the exact release through HACS and test a fresh dashboard.
- [ ] Only then announce the beta; stable release requires further testing.

**Current status:** In progress. Do not mark the beta released until the above checks have been performed.
