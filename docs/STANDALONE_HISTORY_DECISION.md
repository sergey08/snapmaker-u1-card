# Standalone print history — design decision

The Snapmaker U1 Card must be installed as a **single HACS frontend card**. No `custom_components` integration, YAML entry, restart or separately installed backend may be required.

## Current behavior and constraints

- Preserve the DEV card's electricity calculation, Spoolman inventory and filament costs, printer controls, and UI.
- The experimental `snapmaker_u1_history` integration is **not** part of the standalone delivery and must not be invoked by the standalone card.
- Browser `localStorage` is per browser/device and is not a shared, reliable, permanent history.
- A pure Lovelace card cannot create server-side durable, multi-device storage on its own.
- Do not claim cross-device persistence or archive completed jobs until a supported storage mechanism is available without additional installation.
- Do not silently substitute local browser storage for the requested shared history.
- Do not merge this branch into `main` or release as stable until the standalone acceptance criteria are met.

## Acceptance criteria

1. HACS card installation alone is sufficient.
2. Existing DEV material and electricity costs remain unchanged.
3. No calls to `snapmaker_u1_history` endpoints or services.
4. Any future history feature accurately communicates its persistence limitations.
5. Print completion is verified using real printer state, never a progress-only inference.
