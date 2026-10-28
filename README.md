# Snapmaker U1 Card

A custom Home Assistant Lovelace card for the Snapmaker U1, with four toolheads, print status, controls, camera, filament and electricity information.

![Snapmaker U1 illustration](assets/snapmaker-u1-preview.svg)

## Requirements / Requisitos

- **Required / Obligatorio:** Home Assistant entities exposing printer status and print state (typically provided by a compatible Snapmaker U1 integration). No specific integration name is hard-coded.
- **Optional / Opcional:** Lava (toolheads and filament sensors), Spoolman (filament inventory), cameras, power and electricity-price sensors.

## Setup / Configuración

1. Add the custom card resource as a JavaScript module, or install it through HACS once a compatible release/package is available.
2. Add **Snapmaker U1 Card** to a dashboard.
3. In the first-run wizard, select **Auto-detect entities / Detectar entidades automáticamente**.
4. Review the proposed entities, fill in any missing required fields, and complete the wizard.
5. Use the advanced editor to configure optional sensors and controls.

**Important:** Auto-detection reads Home Assistant state only. It never sends commands to the printer. Controls, when configured, are interactive and should be used carefully.

## Status / Estado

Development preview. The first-run wizard and automatic entity matching have been tested on one Home Assistant installation. Full multi-printer compatibility, complete UI localization, and HACS packaging still require validation before a stable release.

## License

MIT.
