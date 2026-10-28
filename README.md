# Snapmaker U1 Card

**A four-toolhead dashboard for Snapmaker U1 in Home Assistant.** Monitor print progress, temperatures, filament, cameras and electricity, and manage supported printer controls from one Lovelace card.

**Español:** Tarjeta para Home Assistant dedicada a la Snapmaker U1: cuatro cabezales, progreso, temperaturas, bobinas, cámaras, consumo y controles de impresión.

![Snapmaker U1 Card illustration](assets/snapmaker-u1-preview.svg)

> **Preview / Versión en desarrollo.** The card is being tested before its first public beta. / Estamos probando la tarjeta antes de publicar la primera beta.

## Screenshots / Capturas de pantalla

**Real Home Assistant screenshots will be added here before the beta release.** We want to show the real interface rather than mock-ups. / **Añadiremos capturas reales de Home Assistant antes de la beta**, mostrando la tarjeta completa, la vista compacta y el asistente de configuración.

Planned gallery / Galería prevista:

- Full dashboard with four toolheads / Vista completa con cuatro cabezales.
- Compact mode / Modo compacto.
- First-run setup wizard and auto-detection / Asistente inicial y detección automática.
- Filament and Spoolman inventory / Filamento e inventario Spoolman.

## Features / Funciones

- Four toolheads (T0–T3), temperatures and active tool / Cuatro cabezales, temperaturas y herramienta activa.
- Print status, progress, layers, estimated time and thumbnail / Estado, progreso, capas, tiempo estimado y miniatura.
- Optional live camera / Cámara en directo opcional.
- Optional Lava filament presence and job estimates / Presencia de filamento y estimaciones opcionales mediante Lava.
- Optional Spoolman spool colors, weights and inventory / Colores, pesos e inventario opcional mediante Spoolman.
- Optional power and electricity cost / Potencia y coste eléctrico opcionales.
- Print controls with confirmation for destructive actions / Controles con confirmación para acciones destructivas.
- Visual editor, three-step setup wizard and read-only entity auto-detection / Editor visual, asistente de tres pasos y detección de entidades de solo lectura.
- Language selector with automatic Home Assistant locale detection: English, Spanish, Portuguese, French, German, Italian and Dutch (translation coverage is still being completed). / Selector de idioma con detección automática: inglés, español, portugués, francés, alemán, italiano y neerlandés (traducciones todavía en revisión).
- Light/dark Home Assistant theme-aware design with cyan-blue accents / Diseño adaptable al tema claro/oscuro y acentos azul cian.

## Requirements / Requisitos

| Component / Componente | Required / Obligatorio | Purpose / Función |
| --- | --- | --- |
| Home Assistant printer entities / Entidades de impresora | Yes / Sí | Printer status and print state / Estado de impresora e impresión |
| Lava | No | Toolheads and filament sensors / Cabezales y sensores de filamento |
| Spoolman | No | Filament inventory / Inventario de bobinas |
| Camera entities / Entidades de cámara | No | Thumbnail and live view / Miniatura y vista en directo |
| Power and electricity-price sensors / Sensores de potencia y precio | No | Electricity metrics / Métricas eléctricas |

There is no mandatory dependency on a particular integration name: the card uses Home Assistant entity IDs configured by the user. / No se exige una integración con nombre concreto: la tarjeta utiliza las entidades configuradas por el usuario.

## Installation / Instalación

### Development preview / Versión de pruebas

1. Make the JavaScript file `snapmaker-u1-card.js` available to Home Assistant as a Lovelace JavaScript module resource. / Añade el archivo como recurso JavaScript de tipo módulo en Lovelace.
2. Add **Snapmaker U1 Card** from the card picker, or use the YAML below. / Añade la tarjeta desde el selector o utiliza este YAML:

```yaml
type: custom:snapmaker-u1-card
```

3. In the initial wizard, select **Auto-detect entities / Detectar entidades automáticamente**. Review all matches before finishing. / Revisa las entidades detectadas antes de finalizar.
4. Complete any optional entities in the advanced editor. / Completa las entidades opcionales desde el editor avanzado.

### HACS custom repository / Repositorio personalizado HACS

The repository includes `hacs.json` and can be added as a **custom dashboard repository** in HACS once a downloadable release is available. / El repositorio incluye `hacs.json` y podrá añadirse como **repositorio personalizado de tipo Dashboard** cuando exista una versión descargable.

1. Open **HACS → ⋮ → Custom repositories** / Abre **HACS → ⋮ → Repositorios personalizados**.
2. Add `https://github.com/sergey08/snapmaker-u1-card` with category **Dashboard** / Añade esa URL con categoría **Dashboard**.
3. Install the card and add `custom:snapmaker-u1-card` to a dashboard / Instala la tarjeta y añádela al panel.

**Not released yet / Aún sin publicar:** The first public beta and official HACS catalog submission remain pending. / La primera beta pública y su inclusión en el catálogo oficial de HACS siguen pendientes.

## Safety / Seguridad

Automatic detection only reads Home Assistant state; it does not execute printer actions. / La detección automática solo lee estados de Home Assistant y no ejecuta acciones.

Printer controls can execute real actions once configured. Verify entity mappings before using them. / Los controles pueden ejecutar acciones reales; comprueba las entidades antes de utilizarlos.

## Development status / Estado del desarrollo

The wizard and auto-detection have been validated on one Home Assistant installation. The current card styling has been reviewed in light mode. Full localization, screenshots in the repository, cross-browser testing, release validation and multi-printer matching are still pending. / El asistente y la detección se han validado en una instalación y el estilo claro se ha revisado visualmente. Siguen pendientes la traducción completa, subir las capturas, pruebas entre navegadores, validación de la versión y detección de varias impresoras.

## License

MIT.
