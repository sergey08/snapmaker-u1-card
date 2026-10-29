# Snapmaker U1 Card v0.1.3 — Release notes / Notas de publicación

## English

- Improved printer power states: Off, Starting up and Available, with immediate Off when the relay is switched off.
- LED bulb and brightness slider synchronized with the actual Home Assistant light entity; 0% turns the light off.
- Swapped the positions of the print progress bar and LED brightness control.
- Optional read-only printer GUI display using a Home Assistant camera (`gui_camera`), collapsible with configurable startup visibility (`gui_open_default`). Touching the image performs no action.
- T0–T3 spool taps open the corresponding Home Assistant Spoolman entity information.
- Improved power, daily energy consumption, cost and job layout.
- Update notice remains hidden unless the configured binary sensor reports an available update.
- Experimental PAXX12 interactive iframe removed.

## Español

- Estados de alimentación mejorados: Apagada, Encendiéndose y Disponible, con apagado inmediato al desactivar el relé.
- Bombilla LED y barra de brillo sincronizadas con la entidad real de Home Assistant; el 0 % apaga la luz.
- Intercambio de posición entre la barra de progreso y la barra de brillo LED.
- Pantalla GUI opcional de solo lectura desde una cámara de Home Assistant (`gui_camera`), plegable y con apertura inicial configurable (`gui_open_default`). Tocar la imagen no realiza ninguna acción.
- Al tocar las bobinas T0–T3 se abren los detalles de su entidad Spoolman en Home Assistant.
- Mejoras de disposición para potencia, consumo diario, coste y trabajo de impresión.
- El aviso de actualizaciones solo aparece cuando el sensor binario configurado indica una actualización disponible.
- Retirada la prueba de iframe interactivo de PAXX12.

## Installation / Instalación

Update via HACS and refresh the Home Assistant frontend. / Actualiza mediante HACS y recarga la interfaz de Home Assistant.
