# Rediseño Snapmaker U1 — bobinas laterales

Estado: especificación aprobada, pendiente de implementación y pruebas.

## Posiciones físicas mirando la impresora de frente
- Superior izquierda: T0 (bobina física 1)
- Inferior izquierda: T1 (bobina física 2)
- Inferior derecha: T2 (bobina física 3)
- Superior derecha: T3 (bobina física 4)

## Presentación
- Mantener ilustración frontal de la U1 centrada.
- Representar cuatro bobinas circulares de perfil, dos a cada lado, en las posiciones físicas indicadas.
- Sin etiquetas visibles T0-T3 ni números de bobina.
- Junto a cada bobina, mostrar material (PLA, PETG...) y gramos restantes procedentes de Spoolman.
- Color dinámico según el filamento asignado en Spoolman; estado sin asignación en gris.
- Halo y rotación discreta únicamente en la bobina activa durante impresión, si el estado de herramienta activa está disponible y es fiable.
- Conservar indicadores existentes: progreso, capas, tiempo restante, temperaturas cama/cámara/T0-T3, estado, cámara y otras funciones.
- Estilo visual inspirado en la tarjeta XPeng G6 sin modificar su repositorio.
- Diseño responsive para móvil; no solapar tarjeta de cámara ni otros elementos.

## Validación
1. Verificar correspondencia entre slots y entidades Spoolman reales.
2. Verificar estados de impresora y herramienta activa.
3. Probar ausencia de datos, filamento agotado y colores claros/oscuros.
4. Probar vista móvil y caché HACS antes de desplegar.
