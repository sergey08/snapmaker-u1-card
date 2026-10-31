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
