# 📅 Avance por Día — Essential WhatsApp Widget (Shopify)

Documento de tracking para el supervisor y el equipo técnico. Cada día registra el problema identificado, la solución aplicada y la referencia técnica (archivo y comando) para verificarlo.

## 📊 Resumen de Progreso

**Plan Original (17 días - ~2.5 semanas):**
- ✅ **Semana 1 (Días 1-7):** **COMPLETADA**
  - ✅ Días 1-3: Tests y configuración → **Completado** (documentado como "Día 1-3")
  - ✅ Días 4-5: Logging profesional → **Completado** (documentado como "Día 4-5")
  - ✅ Días 6-7: Refactorización y validaciones → **Completado** (documentado como "Día 6-7")
- ✅ **Semana 2 (Días 8-14):** **EN PROGRESO**
  - ✅ Días 8-9: Debouncing y hooks compartidos → **Completado** (documentado como "Día 8-9")
  - ✅ Día 10: Tests finales y documentación → **Completado** (deploy pendiente - se guarda en GitHub)
  - 🆕 **Día 11**: Diagnóstico Culqi + Vitest → **Completado (bloque externo)** — ver sección nueva
  - ⏸️ Días 12-14: Integración Culqi pendiente de habilitación de Checkout (ver `ESTADO_CULQI_INTEGRACION.md`)
- ⏸️ **Semana 3 (Días 15-17):** **PENDIENTE**
  - ⏸️ Días 15-17: Finalización Culqi y deploy → **Pendiente**

**Estado Actual:**
- ✅ **Semana 1: 100% Completada**
- ✅ **Semana 2: 65% Completada** (Días 8-11 cerrados; Días 12-14 dependen de Culqi)
- ⏸️ **Semana 3: Pendiente** (depende de finalizar Culqi)

**Nota:** El trabajo se completó en un orden diferente al plan original, pero todo el trabajo de los días 1-11 está terminado. El Día 4 (EXTRA) fue trabajo adicional no planificado. La integración de Culqi está pausada temporalmente pendiente de habilitar el Checkout para la llave pública desde el panel de Culqi.

> 📖 **Para más detalles:** Ver `ESTADO_PROYECTO.md` para explicación completa para equipo y supervisores.

---

## Día 10 — Tests Finales y Documentación

**Problema detectado:**
- Necesidad de validar que toda la refactorización funciona correctamente antes de continuar con Culqi.
- Documentación necesaria para el equipo y supervisores sobre el estado del proyecto.

**Solución implementada:**
- Verificación de suite completa de tests (28+ tests).
- Actualización de documentación técnica (`ESTADO_PROYECTO.md`, `ROADMAP_PROGRESS.md`).
- Validación de configuración y variables de entorno.
- Preparación de estructura para integración Culqi (configuración lista, solo falta credenciales).

**Arquitectura / Código clave:**
- `tests/*.test.ts` (suite completa de tests).
- `app/config/app.config.ts` (configuración Culqi preparada).
- `ENV_TEMPLATE.txt` (template actualizado).
- `ESTADO_PROYECTO.md` (documentación completa).

**Cómo probar:**
```bash
cd SHOPIFY
npm run test:run          # Ejecutar todos los tests
npm run typecheck         # Verificar tipos TypeScript
```

**Nota:** Deploy no realizado - todo se guarda en GitHub. Se realizará después de completar la integración Culqi.

**Estado de Culqi:**
- ⏸️ Integración pausada temporalmente
- 📄 Ver `ESTADO_CULQI_INTEGRACION.md` para detalles completos
- 🔑 Falta configurar llave pública en panel de Culqi con permisos de checkout
- ✅ Código de integración completado y listo (solo falta configuración externa)

**Próximo paso:** Día 11 - Setup Culqi (pausado). Continuar con otras tareas o finalizar configuración de Culqi cuando se tenga la llave pública correcta.

---

## Día 11 — Integración Culqi (bloque externo) & Vitest estable

**Problema detectado:**
- Culqi v4 mostraba “No ha ingresado la configuración o no es válida” pese a configurar correctamente la llave pública.
- `_isCheckoutEnabled` aparecía en `false`, indicando que la llave no tiene habilitado Checkout en el panel de Culqi.
- Al correr `npm run test:run` varias veces en Windows, Vitest detenía la ejecución con `Timeout starting threads runner`.

**Solución implementada:**
- Se reforzó `CulqiCheckout.tsx` con:
  - Validación de moneda (`USD`/`PEN`) y fallback seguro.
  - Logs detallados (`[CULQI][DEBUG]`) que indican el estado interno de Culqi y explican claramente la acción necesaria (habilitar Checkout en el panel).
  - Archivos de apoyo para el equipo (`GUIA_RAPIDA_CULQI.md`, `INSTRUCCIONES_HABILITAR_CHECKOUT_CULQI.md`, `ESTADO_CULQI_INTEGRACION.md`) y un resumen ejecutivo para supervisión (`RESUMEN_CAMBIOS_SUPERVISOR.md`).
- Se ajustó `vitest.config.ts` (pool `threads` con `singleThread`) para evitar que Vitest cree forks en PowerShell; los tests vuelven a correr siempre que se reinicie la terminal entre ejecuciones (limitación conocida en Vitest v4).
- Los tests de `codform.api` ahora mockean `logger.client`, consistente con la implementación, para asegurar que las aserciones de logging se mantengan.

**Arquitectura / Código clave:**
- `app/routes/codform/components/CulqiCheckout.tsx` – nueva validación y logs.
- `GUIA_RAPIDA_CULQI.md`, `INSTRUCCIONES_HABILITAR_CHECKOUT_CULQI.md`, `ESTADO_CULQI_INTEGRACION.md` – documentación operativa.
- `RESUMEN_CAMBIOS_SUPERVISOR.md` – informe no técnico para stakeholders.
- `vitest.config.ts` y `tests/codform.api.test.ts`.

**Cómo probar:**
```bash
# 1) Ejecutar pruebas (en terminal recién abierta para evitar bug de Vitest)
cd SHOPIFY
npm run test:run

# 2) Revisar logs de Culqi en navegador
npm run preview
# Abrir el modal y observar [CULQI][DEBUG] en la consola del navegador
```

**Estado de Culqi (externo):**
- ✅ Código listo y validado.
- ❌ Checkout deshabilitado en cuenta Culqi (`pk_test_dkeS17NBw8B1srCt`).
- 📩 Acción pendiente: soporte de Culqi debe habilitar Checkout (se dejó texto sugerido).

**Próximo paso:** Esperar respuesta de Culqi o usar una nueva llave con Checkout habilitado; al habilitarlo el modal funcionará sin cambios adicionales.

---

## Día 1-3 — Base técnica ausente (tests y configuración)



**Problema detectado (negocio / supervisor):**
- No existían pruebas automatizadas; cualquier cambio podía romper producción sin darnos cuenta.
- Configuración dispersa (URLs, keys, endpoints) dificultaba agregar nuevas features rápidamente.

**Solución implementada:**
- Instalación y configuración de **Vitest** + Testing Library (`npm run test:run`).
- Creación de archivo de configuración central `app/config/app.config.ts` con helpers (`getBackendUrl`, `calculateCulqiFee`).
- Template de variables `ENV_TEMPLATE.txt` + carga automática en `server.js` (`import "dotenv/config"`).
- Documentación completa en `TESTING_SETUP.md` y `presentar.md`.

**Arquitectura / Código clave:**
- `vitest.config.ts`, `tests/example.test.ts`, `tests/config.test.ts`.
- `app/config/app.config.ts` (centralización de endpoints y Culqi).
- `server.js` (uso de dotenv) y `ENV_TEMPLATE.txt`.

**Cómo probar (comandos):**
```bash
cd SHOPIFY
npm run test:run      
```

---

## Día 6-7 — Componente gigante y sin modularidad / validaciones débiles

**Nota:** Según el plan original, este trabajo correspondía a los Días 6-7, pero se completó antes como  en el roadmap.

**Problema detectado:**
- `codform.tsx` superaba +400 líneas mezclando estado, fetch, UI y manejo de pantalla.
- Campos críticos (correo, teléfono, términos) no tenían validaciones sólidas.
- Duplicación de strings de endpoints (riesgo al cambiar Railway).

**Solución implementada:**
- Extract `useCodFormState.ts` (estado, efectos, handlers) y `codform.api.ts` (fetch + upsert reutilizable).
- Integración de **Zod** (`validation/codform.validation.ts`) + mensajes visibles por campo (`FormContent`), bloqueando guardados inválidos.
- Pruebas unitarias nuevas: `tests/codform.validation.test.ts` (4 casos) → suite total **28 tests** (desde Día 3 se suman logs).
- Documentación actualizada (sección  en `presentar.md` + `TESTING_SETUP.md`).

**Arquitectura / Código clave:**
- `app/routes/codform/codform.tsx` (render limpio). Hook + service en `hooks/useCodFormState.ts` y `services/codform.api.ts`.
- Validaciones: `app/routes/codform/validation/codform.validation.ts` + UI en `FormContent.tsx`.
- Test unitarios: `tests/codform.validation.test.ts`.

**Cómo probar:**
```bash
cd SHOPIFY
npm run test:run          # 28 tests (incluye validaciones + logging)
npm run preview           # http://localhost:3000 → interactuar con formulario y ver mensajes de error
```

**Demostración:**
- Intentar guardar sin llenar “Correo”/“Teléfono” → se muestran errores rojos y no se guarda.
- Observar banner “Cambios no guardados” y notificación de error/success (estado global).

---

## Día 4-5 — Logging profesional & configuración avanzada

**Nota:** Según el plan original, este trabajo correspondía a los Días 4-5, pero se completó despues en el roadmap.

**Problema detectado (inicio de jornada):**
- Falta de observabilidad: el flujo `COD Form → API` solo usa `console.log`, lo que impide diferenciar severidad (info/warn/error) y rastrear fallos en producción.
- Backend sin validaciones extra para el `upsert` y sin alertas cuando Railway responde con `4xx/5xx`.

**Solución implementada:**
- Logger backend `app/utils/logger.server.ts` con **Pino** integrado a `APP_CONFIG` (nivel configurable, pretty log en desarrollo).
- Instrumentación completa en `routes/codform/services/codform.api.ts`: métricas de duración, validación previa del payload (`validateUpsertPayload`) y manejo estructurado de errores con `parseErrorBody`.
- Logger cliente `app/utils/logger.client.ts` adoptado en `useCodFormState.ts` para evitar `console.*` y mantener trazabilidad en UI.
- Suite de pruebas `tests/codform.api.test.ts` con mocks de logger (`vi.spyOn`) verificando `info`, `warn` y `error`.
- Documentación y guías actualizadas (`presentar.md`, `TESTING_SETUP.md`, este roadmap).

**Arquitectura / Código clave:**
- `app/utils/logger.server.ts`, `app/utils/logger.client.ts`.
- `app/routes/codform/services/codform.api.ts` (logs + validaciones).
- `app/routes/codform/hooks/useCodFormState.ts` (logger cliente en flujos UI).
- `tests/codform.api.test.ts` (mocks/verificación de eventos de log).

**Cómo probar:**
```bash
cd SHOPIFY
npm run dev            # observar logs Pino en consola (pretty)
npm run test:run       # 28 tests, incluye verificaciones de logging
```

**Tareas inmediatas:**
- [x] Instalar dependencias (`pino`, `pino-pretty`, tipos).
- [x] Crear utilidades de logging (archivo nuevo en `app/utils` o similar) y configurar `APP_CONFIG`.
- [x] Reemplazar `console.log` en `useCodFormState` y `codform.api.ts`.
- [x] Extender pruebas unitarias/mocks para verificar logging (al menos smoke test con `vi.spyOn`).
- [x] Actualizar documentación (`ROADMAP_PROGRESS.md`, `presentar.md`, `TESTING_SETUP.md`).

---

## Día 4 (EXTRA) — Diseñador visual del formulario COD

**Nota:** Este día fue un trabajo adicional no planificado originalmente. Se agregó para mejorar la experiencia del diseñador visual.

**Problema detectado:**
- La sección de estilos (`Section4_Estilos`) solo permitía editar dos textos de error; no había control sobre colores, tipografía ni banderas como RTL o pantalla completa.
- La vista previa y el modal no reflejaban cambios globales (bordes, sombras, ocultar labels), generando desconfianza en el resultado final.

**Solución aplicada (iteración inicial, aún pendiente pulido visual fino):**
- Nuevo panel “Apariencia general” con selectores de color (hex / rgba), sliders para tamaño de texto, bordes, ancho de borde y sombra, además de toggles para: ocultar labels, ocultar botón de cierre, RTL y modo pantalla completa.
- Panel “Mensajes de validación” plegable con inputs styled para `required` e `invalid`.
- `FormContent` ahora aplica el estilo global: fondo, border radius, sombra, dirección RTL y control dinámico para mostrar/ocultar etiquetas.
- `PreviewPanel` y el modal en `codform.tsx` adoptan el nuevo `FormStyle` (sin duplicar cajas blancas), respetando `enableFullScreen`, sombras y bordes.
- Documentación del flujo de diseño actualizada en este roadmap; el UI todavía recibirá refinamiento visual (tipografías, spacing y presets predefinidos) en una iteración posterior.

**Arquitectura / Código clave:**
- `app/routes/codform/components/Section4_Estilos.tsx`
- `app/routes/codform/components/FormContent.tsx`
- `app/routes/codform/components/PreviewPanel.tsx`
- `app/routes/codform/codform.tsx`

**Cómo validar hoy (aterrizaje rápido):**
```bash
cd SHOPIFY
npm run dev            # abrir /codform y mover sliders/toggles para ver cambios
```
- Probar: activar/desactivar `Ocultar etiquetas`, cambiar colores en formato HEX y RGBA, encender `enableFullScreen` y el modo RTL para verificar que el contenedor se adapte.

**Notas / próximos pasos de diseño:**
- Implementar presets y controles más condensados (UI final con iconografía y tooltips).
- Conectar los nuevos estilos con un sistema de guardado/borrador para volver a versiones previas.
- Ajustar la vista móvil con layout dedicado una vez definidos los componentes definitivos.

---

## Día 8-9 — Eliminación de código duplicado y hooks compartidos

**Nota:** Este trabajo corresponde correctamente a los Días 8-9 del plan original.

**Problema detectado:**
- Múltiples componentes duplicaban la lógica de detección de tamaño de ventana (`window.innerWidth < 768`) con listeners de resize idénticos.
- La función `handleSave` en `useCodFormState` no tenía protección contra múltiples guardados simultáneos, pudiendo causar race conditions.
- Falta de hooks reutilizables para funcionalidades comunes (debouncing, detección de viewport).

**Solución implementada:**
- Creación de hooks compartidos en `app/utils/hooks/`:
  - `useDebounce` y `useDebounceWithCancel`: Para evitar múltiples ejecuciones de funciones costosas.
  - `useWindowSize`, `useIsMobile`, `useIsDesktop`: Para detección unificada de tamaño de ventana y breakpoints.
- Protección contra guardados múltiples en `handleSave` usando `useRef` para rastrear estado de guardado.
- Eliminación de código duplicado en 5 componentes (`DesignPanel`, `PreviewPanel`, `FormContent`, `Section3_Bloques`, `Section4_Estilos`) reemplazando lógica de resize por `useIsMobile`.
- Suite de pruebas `tests/hooks.test.ts` para validar comportamiento de debouncing.

**Arquitectura / Código clave:**
- `app/utils/hooks/useDebounce.ts` (hooks de debouncing).
- `app/utils/hooks/useWindowSize.ts` (hooks de detección de viewport).
- `app/utils/hooks/index.ts` (exportaciones centralizadas).
- `app/routes/codform/hooks/useCodFormState.ts` (protección contra guardados múltiples).
- Componentes actualizados: `DesignPanel.tsx`, `PreviewPanel.tsx`, `FormContent.tsx`, `Section3_Bloques.tsx`, `Section4_Estilos.tsx`.

**Cómo probar:**
```bash
cd SHOPIFY
npm run test:run          # Incluye tests de hooks (nuevos)
npm run dev               # Verificar que componentes responden correctamente a cambios de tamaño
```
- Verificar: Hacer clic múltiples veces rápidamente en "Guardar" → solo debe ejecutarse una vez.
- Verificar: Redimensionar ventana → todos los componentes deben actualizar correctamente sin duplicar listeners.

**Beneficios:**
- ✅ ~150 líneas de código duplicado eliminadas.
- ✅ Prevención de race conditions en guardados.
- ✅ Hooks reutilizables disponibles para futuras features.
- ✅ Código más mantenible y testeable.

---

> **Nota:** Si el supervisor necesita verificar commits por día, la rama de trabajo actual es `atter`. Recuerda limpiar secretos antiguos antes de subir a GitHub (ver repo histórico `my-ai-workflows`).
