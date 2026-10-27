# Snapmaker U1 Card

A community-oriented, read-only Home Assistant Lovelace card for the Snapmaker U1, with a dark interface, four toolhead/filament indicators, and Spoolman integration planned.

> **Status: early development.** This repository is not yet a working HACS release. No printer commands are sent.

## Planned behavior

- Moonraker/printer unavailable: dimmed, grayscale printer and stopped animations; label **Disconnected** (not necessarily powered off).
- Available/idle: full-color display, four filament slots.
- Printing: animate only the spool and filament path of the extruding toolhead.
- Paused: stop filament movement while retaining selected tool indication.
- Configurable Home Assistant entity mappings (no hard-coded local IPs or personal entities).
- Spoolman filament colors, material names, and remaining quantities.

## Roadmap

1. Confirm live Snapmaker U1 and Moonraker entities.
2. Implement the Lovelace custom element and editor.
3. Integrate Spoolman slot mapping and active extrusion.
4. Validate offline, idle, printing and pause states.
5. Publish a tested release and HACS installation instructions.

## Project links

Issues and feedback: https://github.com/sergey08/snapmaker-u1-card/issues
