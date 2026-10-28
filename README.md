# Snapmaker U1 Card

**Tarjeta para Home Assistant dedicada a la impresora 3D Snapmaker U1.** Permite consultar el estado de impresión, controlar los cuatro cabezales, visualizar temperaturas, filamentos, cámara y consumo eléctrico, y ejecutar los controles compatibles desde un único panel.

**Idioma:** Español | [English](README.en.md)

**Versión estable actual: [v0.1.0](https://github.com/sergey08/snapmaker-u1-card/releases/tag/v0.1.0).** Instalación mediante HACS como repositorio personalizado de tipo **Dashboard**.

![Vista previa de Snapmaker U1 Card](assets/snapmaker-u1-preview.svg)

## Capturas de pantalla

### Vista completa
![Vista completa de la tarjeta](assets/screenshots/card-full.png)

### Vista compacta
![Vista compacta](assets/screenshots/card-compact.png)

### Asistente de configuración
![Asistente de configuración](assets/screenshots/setup-wizard.png)

### Inventario de Spoolman
![Inventario de filamentos](assets/screenshots/spoolman-inventory.png)

## Funcionalidades

- **Cuatro cabezales T0, T1, T2 y T3:** temperaturas, herramienta activa e información de filamento.
- **Seguimiento de impresión:** estado, progreso, capas, tiempo estimado y miniatura del trabajo actual.
- **Cámara opcional:** imagen en directo si Home Assistant dispone de la entidad correspondiente.
- **Spoolman opcional:** inventario, materiales, colores, pesos y filamento restante.
- **Consumo eléctrico opcional:** potencia, energía y coste estimado según las entidades configuradas.
- **Controles de impresión:** acciones compatibles con confirmación para operaciones potencialmente destructivas.
- **Editor visual y asistente inicial de tres pasos**, con detección automática de entidades y revisión de las asignaciones.
- **Diseño claro y oscuro**, adaptado al tema de Home Assistant, con modo completo y compacto.
- **Idiomas:** español, inglés, portugués, francés, alemán, italiano y neerlandés. Algunas traducciones siguen en revisión.

## Requisitos

| Componente | Necesidad | Función |
| --- | --- | --- |
| Home Assistant | Obligatorio | Panel y entidades |
| Moonraker | Necesario para las funciones principales | Estado, temperaturas, progreso y controles compatibles |
| Lava | Necesario para las funciones específicas de U1 | Información de cabezales y filamentos |
| Spoolman | Opcional | Inventario, colores y cantidades de filamento |
| Entidad de cámara | Opcional | Vídeo o imagen en directo |
| Sensores eléctricos | Opcional | Consumo y coste |

**Importante:** instalar la tarjeta no instala Moonraker, Lava ni Spoolman. Estas integraciones deben estar configuradas por separado y exponer sus entidades en Home Assistant. Sin Spoolman, las funciones principales de impresión pueden seguir funcionando.

## Instalación con HACS

1. Abre **HACS** en Home Assistant.
2. En el menú de los tres puntos, selecciona **Repositorios personalizados**.
3. Introduce `https://github.com/sergey08/snapmaker-u1-card`.
4. Selecciona la categoría **Dashboard** y añade el repositorio.
5. Instala **Snapmaker U1 Card**, preferiblemente la versión estable **v0.1.0**.
6. Añade la tarjeta desde el selector de tarjetas o utiliza:

```yaml
type: custom:snapmaker-u1-card
```

7. Abre el asistente de configuración, pulsa **Detectar entidades automáticamente** y revisa las correspondencias antes de guardar.
8. Si el navegador sigue mostrando una versión anterior, recarga con **Ctrl + Shift + R**.

**Actualizaciones:** las versiones estables se publican con etiquetas `v0.1.0`, `v0.1.1`, etc. HACS permite instalar las actualizaciones disponibles. La inclusión en el catálogo oficial de HACS sigue pendiente; por ahora se utiliza el repositorio personalizado.

## Configuración y uso

El asistente intenta identificar automáticamente las entidades de Moonraker, Lava y los componentes opcionales. Si alguna no se detecta, puede asignarse manualmente desde el editor visual. Los sensores que no existan pueden dejarse sin configurar cuando sean opcionales.

Durante la impresión, la tarjeta muestra la información disponible del trabajo y del cabezal activo. Cuando la impresora está inactiva o desconectada, algunas entidades pueden mostrar valores no disponibles; esto no significa necesariamente que la tarjeta esté averiada.

**Seguridad:** la detección automática solo consulta estados; no ejecuta acciones. Antes de utilizar los botones de control, comprueba las entidades asignadas.

## Estado del proyecto

**v0.1.0 está publicada e instalada correctamente mediante HACS en una instalación real de Home Assistant.** Quedan pendientes pruebas adicionales durante una impresión real, comprobaciones en otros navegadores y configuraciones con varias impresoras, así como completar algunas traducciones.

La primera beta `v0.1.0-beta.1` sigue disponible en [versiones publicadas](https://github.com/sergey08/snapmaker-u1-card/releases). El procedimiento de publicación y validación se mantiene en los flujos de GitHub Actions del repositorio.

## Soporte y desarrollo

Para informar de errores o proponer mejoras, utiliza [GitHub Issues](https://github.com/sergey08/snapmaker-u1-card/issues).

**Licencia:** MIT.
