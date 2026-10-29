# Snapmaker U1 Card v0.1.2 — Release notes / Notas de publicación

## English

This release introduces optional Snapmaker U1 lighting controls and an update notice that only appears when an update is available.

### What's new
- **Integrated LED control:** tap the lightbulb to turn the printer light off or turn it on at 100% brightness.
- **0–100% brightness slider:** 0% turns the light off; any higher value turns it on at the selected brightness.
- **Live state synchronization:** the bulb is dim/grey and the slider reads 0% when off; when on, the bulb lights up and the slider follows the actual reported brightness.
- **Moonraker-compatible startup:** when adjusting brightness from the off state, the card first turns the light on, then sets the requested brightness.
- **Unobtrusive update notice:** shown only when the configured binary sensor is `on`; otherwise hidden entirely.
- **Optional visual-editor configuration:** `led_light_entity` and `update_available_sensor`; existing cards continue to work without them.

- **Optional card title:** leave **Card name** blank to hide the title; a custom name remains supported.
- **Instant save availability:** editing or clearing the card name enables saving without leaving the input field.

### Installation / Upgrade
Update the card through HACS and refresh the dashboard. Assign the LED light entity and optionally an update-availability sensor in the card editor. Verify entity mappings before using controls.

## Español

Esta versión añade controles opcionales de iluminación para la Snapmaker U1 y un aviso de actualizaciones que solo aparece cuando hay novedades.

### Novedades
- **Control LED integrado:** bombilla para apagar la iluminación o encenderla al 100 % de brillo.
- **Brillo regulable del 0 al 100 %:** 0 % apaga; cualquier valor superior enciende y aplica la intensidad seleccionada.
- **Estado sincronizado:** bombilla gris y barra al 0 % cuando la luz está apagada; bombilla iluminada y barra con el brillo real cuando está encendida.
- **Encendido compatible con Moonraker:** al utilizar la barra con la luz apagada, la tarjeta primero enciende la entidad y después establece el brillo.
- **Aviso de actualizaciones discreto:** aparece únicamente cuando el sensor configurado está en `on`; de lo contrario, no se muestra.
- **Configuración opcional en el editor visual:** `led_light_entity` y `update_available_sensor`. No son necesarias para seguir utilizando el resto de la tarjeta.

- **Título opcional:** deja vacío **Nombre de la tarjeta** para ocultar el título, o introduce un nombre personalizado.
- **Guardado inmediato:** al escribir o borrar el nombre, se habilita guardar sin salir del campo.

### Instalación / Actualización
Actualiza la tarjeta mediante HACS y recarga la página del panel. Configura la entidad LED y, opcionalmente, el sensor de actualizaciones desde el editor de la tarjeta. Revisa las asignaciones antes de utilizar los controles.

**Example / Ejemplo:**
```yaml
led_light_entity: light.led_cavity_led_snapmaker_u1_despacho
update_available_sensor: binary_sensor.update_available_lava
```

For full setup instructions / Instrucciones completas: [README.md](README.md).
