# Snapmaker U1 Card v0.1.6 — Release notes / Notas de publicación

## English

- Fix printer status during printing: show “Printing” even if the power relay timestamp is newer than Moonraker's last update.
- Show “Used in this job” without a tool number on participating, non-feeding spools; feeding spools show only the filament animation.
- Calculate print electricity usage and cost from the live power sensor, persisting accumulated values in the browser across dashboard reloads.
- Show electricity cost with three decimal places to make small values visible.
- Preserve the power-on and power-off status transitions and existing LED controls.

Electricity cost uses the configured electricity-price sensor (for example, `sensor.precio_kwh`) and excludes filament costs. Tracking is browser-local, not a Home Assistant entity.

## Español

- Corregido el estado durante la impresión: muestra «Imprimiendo» aunque el relé tenga una marca de tiempo posterior a la última actualización de Moonraker.
- Las bobinas que participan pero no están extruyendo muestran «En este trabajo», sin número de cabezal; la bobina que imprime muestra únicamente la animación.
- Consumo y coste eléctrico acumulados desde el sensor de potencia instantánea, con persistencia local al recargar el panel.
- «Coste luz» con tres decimales para apreciar importes pequeños.
- Conservadas las transiciones de encendido y apagado y el control de iluminación.

El coste usa el sensor de precio configurado (por ejemplo, `sensor.precio_kwh`) y no incluye filamento. El acumulado se guarda en el navegador, no en una entidad de Home Assistant.

## Upgrade / Actualización

Update via HACS, then fully reload the Home Assistant app. / Actualiza mediante HACS y vuelve a abrir la aplicación Home Assistant.
