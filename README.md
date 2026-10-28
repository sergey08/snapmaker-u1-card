# Snapmaker U1 Card

**A four-toolhead dashboard for Snapmaker U1 in Home Assistant.** Monitor print progress, temperatures, filament, cameras and electricity, and manage supported printer controls from one Lovelace card.

**Español:** Tarjeta para Home Assistant dedicada a la Snapmaker U1: cuatro cabezales, progreso, temperaturas, bobinas, cámaras, consumo y controles de impresión.

![Snapmaker U1 Card illustration](assets/snapmaker-u1-preview.svg)

> **Preview / Versión en desarrollo.** The card is being tested before its first public beta. / Estamos probando la tarjeta antes de publicar la primera beta.

## Screenshots / Capturas de pantalla

These are genuine screenshots of the approved light/cyan Home Assistant design. / Capturas reales del diseño claro y azul cian aprobado en Home Assistant.

### Full dashboard / Vista completa
![Snapmaker U1 Card — full dashboard](assets/screenshots/card-full.png)

### Compact mode / Modo compacto
![Snapmaker U1 Card — compact mode](assets/screenshots/card-compact.png)

### Initial setup wizard / Asistente de configuración inicial
![Snapmaker U1 Card — setup wizard step 1](assets/screenshots/setup-wizard.png)

The setup wizard preview is not yet connected to printer entities, so it may show unavailable values. / La vista previa del asistente aún no tiene entidades asignadas, por lo que puede mostrar valores no disponibles.

### Spoolman inventory / Inventario Spoolman
![Snapmaker U1 Card — Spoolman inventory](assets/screenshots/spoolman-inventory.png)

## Features / Funciones

- Four toolheads (T0–T3), temperatures and active tool / Cuatro cabezales, temperaturas y herramienta activa.
- Print status, progress, layers, estimated time and an in-job thumbnail / Estado, progreso, capas, tiempo estimado y miniatura integrada en el trabajo actual.
- Optional live camera; the print thumbnail is displayed inside the current-job panel without a duplicate preview section / Cámara en directo opcional; la miniatura aparece dentro del trabajo actual sin una sección duplicada.
- Optional Lava filament presence and job estimates / Presencia de filamento y estimaciones opcionales mediante Lava.
- Optional Spoolman spool colors, weights and inventory / Colores, pesos e inventario opcional mediante Spoolman.
- Optional power and electricity cost / Potencia y coste eléctrico opcionales.
- Print controls with confirmation for destructive actions / Controles con confirmación para acciones destructivas.
- Visual editor, three-step setup wizard and read-only entity auto-detection / Editor visual, asistente de tres pasos y detección de entidades de solo lectura.
- Language selector with automatic Home Assistant locale detection: English, Spanish, Portuguese, French, German, Italian and Dutch (translation coverage is still being completed). / Selector de idioma con detección automática: inglés, español, portugués, francés, alemán, italiano y neerlandés (traducciones todavía en revisión).
- Light/dark Home Assistant theme-aware design with cyan-blue accents / Diseño adaptable al tema claro/oscuro y acentos azul cian.

## Requirements / Requisitos

For the **full Snapmaker U1 Card experience**, configure **Moonraker and Lava** in Home Assistant. **Spoolman is optional**. / Para disfrutar de **todas las funciones de Snapmaker U1 Card**, configura **Moonraker y Lava** en Home Assistant. **Spoolman es opcional**.

| Component / Componente | Requirement / Requisito | What it provides / Qué aporta |
| --- | --- | --- |
| **Home Assistant** | **Required / Obligatorio** | Lovelace dashboard and entity configuration / Panel Lovelace y configuración de entidades |
| **Moonraker** | **Required for core printing features / Necesario para las funciones principales de impresión** | Printer status, print progress, temperatures and compatible controls / Estado, progreso, temperaturas y controles compatibles |
| **Lava** | **Required for full U1-specific functionality / Necesario para todas las funciones específicas de U1** | Snapmaker U1-specific toolhead and filament information / Información específica de los cuatro cabezales y filamentos |
| **Spoolman** | **Optional / Opcional** | Filament inventory, spool colors, weights and remaining material / Inventario de filamento, colores, pesos y material restante |
| Camera entities / Entidades de cámara | Optional / Opcional | Live camera and current-job thumbnail when entities are available / Cámara en directo y miniatura del trabajo actual cuando existen entidades |
| Power, energy and electricity-price entities / Entidades de potencia, energía y precio | Optional / Opcional | Electricity consumption and estimated cost / Consumo eléctrico y coste estimado |

**Important / Importante:** The card reads entities exposed in Home Assistant; installing the card alone does not install or configure Moonraker, Lava or Spoolman. The available features depend on the entities provided by those integrations and their configured mappings. / La tarjeta utiliza las entidades disponibles en Home Assistant: instalarla no instala ni configura Moonraker, Lava o Spoolman. Las funciones disponibles dependen de las entidades que expongan esas integraciones y de su asignación.

**Without Spoolman / Sin Spoolman:** The printer status and printing controls can still work with Moonraker and Lava; only the optional inventory functionality is unavailable. / El estado y los controles de impresión pueden seguir funcionando con Moonraker y Lava; únicamente faltará el inventario opcional.

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

## Beta release process / Publicación de la beta

The beta workflow runs **only** when a tag matching `v*-beta.*` is pushed. It validates JavaScript and HACS metadata before creating a GitHub **pre-release** with `snapmaker-u1-card.js` attached. / El flujo de beta se ejecuta **solo** al publicar una etiqueta con formato `v*-beta.*`. Valida el código y HACS antes de crear una **versión preliminar** con el archivo JavaScript adjunto.

No release has been published by adding this workflow. See [BETA_CHECKLIST.md](BETA_CHECKLIST.md) for the remaining manual acceptance tests. / Añadir este flujo **no publica** ninguna versión. Consulta [BETA_CHECKLIST.md](BETA_CHECKLIST.md) para las pruebas manuales pendientes.

## Safety / Seguridad

Automatic detection only reads Home Assistant state; it does not execute printer actions. / La detección automática solo lee estados de Home Assistant y no ejecuta acciones.

Printer controls can execute real actions once configured. Verify entity mappings before using them. / Los controles pueden ejecutar acciones reales; comprueba las entidades antes de utilizarlos.

## Development status / Estado del desarrollo

The wizard and auto-detection have been validated on one Home Assistant installation. The current card styling has been reviewed in light mode. Full localization, screenshots in the repository, cross-browser testing, release validation and multi-printer matching are still pending. / El asistente y la detección se han validado en una instalación y el estilo claro se ha revisado visualmente. Siguen pendientes la traducción completa, subir las capturas, pruebas entre navegadores, validación de la versión y detección de varias impresoras.

## License

MIT.
