# Snapmaker U1 Card v0.1.5 — Release notes / Notas de publicación

## English

- Remove the blue border and active-print label from the selected T0–T3 spool, retaining filament animation.
- Show all four toolhead filament usage indicators during printing; unused tools display `-- / --`.
- Hide the “Job” energy metric from the dashboard while retaining its internal calculation for electricity cost.
- Rename “Cost” to “Electricity cost” and display the amount with two decimal places.
- Show the printer camera panel and refresh its still image approximately every 2.5 seconds while expanded. This is periodic snapshots, not a true video stream.

Electricity cost does not include Spoolman filament prices. Job cost tracking is currently tied to the card's active session and can reset when reloading the dashboard.

## Español

- Eliminado el borde azul y el texto de impresión activa en la bobina T0–T3 seleccionada, manteniendo la animación del filamento.
- Los cuatro indicadores de consumo de filamento aparecen durante la impresión; los cabezales no utilizados muestran `-- / --`.
- Ocultado el indicador «Trabajo» de energía, conservando su cálculo interno para el coste eléctrico.
- Renombrado «Coste» a «Coste luz», con dos decimales.
- Panel de cámara visible y actualización de la imagen aproximadamente cada 2,5 segundos mientras esté desplegado. Son fotografías periódicas, no vídeo continuo.

El coste de la luz no incluye el precio del filamento de Spoolman. El seguimiento del coste depende de la sesión activa de la tarjeta y puede reiniciarse al recargar el panel.

## Upgrade / Actualización

Update via HACS and refresh Home Assistant. / Actualiza mediante HACS y recarga Home Assistant.
