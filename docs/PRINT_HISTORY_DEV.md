# Print history storage / Almacenamiento del historial (DEV)

## English

Development-only Home Assistant integration, not included in the stable HACS card installation yet.

- Uses Home Assistant's native `Store` API, saved in `.storage/snapmaker_u1_history`.
- Each printer has its own list, default 20 entries (1–200 configurable).
- Idempotent `snapmaker_u1_history.save_print` service, keyed by printer and print ID.
- Records job name, status, timestamp, optional image URL, duration, electricity cost, material cost and total.
- This stage **does not** save image bytes or provide a deployed Lovelace read API yet; a URL alone is not a permanent thumbnail.
- Do not manually edit `.storage`. A read endpoint, image snapshot persistence, UI controls and automatic completion tracking are still pending.
- No change to the stable v0.1.6 card.

## Español

Integración experimental de Home Assistant, **todavía no incluida** en la instalación estable por HACS.

- Usa la API nativa `Store` de Home Assistant, con datos en `.storage/snapmaker_u1_history`.
- Historial independiente por impresora, 20 registros por defecto (configurable de 1 a 200).
- Servicio `snapmaker_u1_history.save_print` idempotente por impresora e identificador de impresión.
- Guarda nombre, estado, fecha, URL opcional de imagen, duración, electricidad, material y total.
- En esta fase **no** guarda todavía los bytes de la imagen ni ofrece una API de lectura desplegada para Lovelace; la URL por sí sola no conserva la miniatura.
- Pendiente: API de consulta, miniaturas persistentes, configuración visual y detección automática de fin de impresión.
- La tarjeta estable v0.1.6 no se modifica.

## Read API / API de lectura

Authenticated GET `/api/snapmaker_u1_history/{printer_id}` returns `{"prints":[...]}`. Requires installation and loading of the integration; it is not yet installed on the user's Home Assistant. A Lovelace card must call this endpoint through Home Assistant's authenticated API rather than fetching it anonymously. The current implementation is an infrastructure milestone, **not** an end-to-end working history.

GET autenticado `/api/snapmaker_u1_history/{printer_id}` devuelve `{"prints":[...]}`. Requiere instalar y cargar la integración. Todavía no se ha instalado en el Home Assistant del usuario. La tarjeta debe utilizar la API autenticada de HA. Este avance es infraestructura, **no** un historial funcional de extremo a extremo.

## Current implementation / Implementación actual

- The development card can optionally read history through the authenticated endpoint and send completed jobs to `snapmaker_u1_history.save_print`.
- Editor options: `show_print_history` (disabled by default) and `history_limit` (default 20, maximum 200).
- Saving requires the custom integration to be installed and loaded. Without it, the UI shows a history-unavailable message.
- **Not yet end-to-end tested or deployed**. Current job thumbnail URL is only a reference and does not survive changes to the camera image; real thumbnail archival remains pending.
- Completion classification is provisional, based on last known progress (99% threshold); final status needs validation with real printer events.

- La tarjeta de desarrollo permite consultar el historial y enviar impresiones terminadas al servicio de almacenamiento.
- Opciones del editor: `show_print_history` (desactivado por defecto) y `history_limit` (20 por defecto, máximo 200).
- Para guardar es imprescindible instalar y cargar la integración personalizada. Sin ella se muestra un aviso.
- **Aún no probado de extremo a extremo ni desplegado**. La URL de la miniatura no conserva la imagen; pendiente archivar la miniatura real.
- La clasificación de finalización es provisional, basada en el último progreso (umbral 99 %); requiere pruebas con la impresora.

## Safety gate / Protección contra falsos positivos

- Only a stopped job whose printer's actual print state is `complete` is currently eligible for automatic archival. A pause, temporary disconnection, cancellation or interruption with lower progress must **not** be stored as a completed print.
- Dynamic camera proxy URLs are **not** persisted as if they were permanent images.
- Completion detection still needs validation against real Lava/Moonraker status transitions, especially prints that finish without a 99% progress update.

- Solo se archiva automáticamente un trabajo detenido cuyo estado real de impresión sea `complete`. Una pausa, desconexión temporal o cancelación anterior a su finalización **no** se registra como completada.
- No se guardan URLs temporales de cámara como si fueran imágenes permanentes.
- Pendiente validar las transiciones reales de Lava/Moonraker y los trabajos que finalicen sin recibir una actualización del 99 %.

## Live HA entity check / Comprobación real de entidades (31/10/2026)

- `sensor.current_print_state_snapmaker_u1_despacho` and `sensor.print_state_lava` expose enum options `standby`, `printing`, `paused`, `complete`, `cancelled`, `error`; both were `complete` during inspection.
- Automatic archival in the experimental card now requires the actual configured `print_state` entity to equal `complete`, in addition to an existing tracked print and its stopped timestamp. It no longer infers completion from progress percentage.
- La tarjeta experimental exige el estado `complete` de la entidad configurada, además de una impresión rastreada que haya terminado. No infiere el éxito a partir del porcentaje.
- Not deployed or end-to-end tested yet / Todavía no desplegado ni probado de extremo a extremo.
