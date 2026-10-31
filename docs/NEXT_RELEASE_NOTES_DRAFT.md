# Release notes draft — Snapmaker U1 Card

> Release candidate documentation only. **Do not publish until the actual DEV JavaScript has been synchronized into the release branch, syntax-checked and tested in Home Assistant.** No persistent print history is included.

## English

### What's improved
- **Print cost breakdown:** live electricity cost, estimated filament cost from Spoolman and combined total, displayed to three decimal places.
- **Four-toolhead filament calculation:** slicer-estimated grams for T0–T3, with per-spool Spoolman pricing and weight data.
- **Clear missing-data handling:** display `--` instead of inventing a filament or combined cost when required price/weight information is missing.
- **Spoolman inventory:** more useful filament listing with names, colors, remaining weight and toolhead context.
- **Existing printer controls preserved:** power, LED, camera, printer screen and print actions are unchanged.

### Installation
Install or update the card via HACS. No additional integration, YAML configuration or restart is required for these frontend improvements.

### Not included
Shared, durable print history is deferred. The experimental history backend is not part of this release. Browser-only storage is not presented as cross-device history.

## Español

### Mejoras
- **Desglose del coste de impresión:** coste eléctrico, estimación del material mediante Spoolman y coste total, con tres decimales.
- **Cálculo para cuatro cabezales:** gramos estimados por el laminador para T0–T3 y precio/peso de cada bobina de Spoolman.
- **Sin importes inventados:** se muestra `--` cuando falta información necesaria para calcular el material o el total.
- **Inventario Spoolman:** consulta mejorada de nombres, colores, peso disponible y bobinas por cabezal.
- **Controles existentes conservados:** alimentación, LED, cámara, pantalla y acciones de impresión.

### Instalación
Instalar o actualizar la tarjeta desde HACS. Estas mejoras de interfaz no requieren integraciones adicionales, cambios de YAML ni reinicios.

### No incluido
Se aplaza el histórico persistente compartido. El backend experimental de histórico no forma parte de esta versión. El almacenamiento local del navegador no equivale a un histórico compartido.

## Release gate
- [ ] Sync the exact running DEV card source to the release branch without losing changes.
- [ ] Validate JavaScript syntax and compare existing controls.
- [ ] Verify live Spoolman material cost and electricity cost on a real print.
- [ ] Confirm HACS distribution matches the tested file.
- [ ] Publish release/tag only after the above checks.
