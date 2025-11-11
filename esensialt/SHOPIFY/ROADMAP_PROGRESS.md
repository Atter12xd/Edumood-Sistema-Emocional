# 📅 Avance por Día — Essential WhatsApp Widget (Shopify)

Documento de tracking para el supervisor y el equipo técnico. Cada día registra el problema identificado, la solución aplicada y la referencia técnica (archivo y comando) para verificarlo.

---

## Día 1 — Base técnica ausente (tests y configuración)

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
npm run test:run      # 28 tests (a partir del Día 3) — evidencia automatizada
```

---

## Día 2 — Componente gigante y sin modularidad / validaciones débiles

**Problema detectado:**
- `codform.tsx` superaba +400 líneas mezclando estado, fetch, UI y manejo de pantalla.
- Campos críticos (correo, teléfono, términos) no tenían validaciones sólidas.
- Duplicación de strings de endpoints (riesgo al cambiar Railway).

**Solución implementada:**
- Extract `useCodFormState.ts` (estado, efectos, handlers) y `codform.api.ts` (fetch + upsert reutilizable).
- Integración de **Zod** (`validation/codform.validation.ts`) + mensajes visibles por campo (`FormContent`), bloqueando guardados inválidos.
- Pruebas unitarias nuevas: `tests/codform.validation.test.ts` (4 casos) → suite total **28 tests** (desde Día 3 se suman logs).
- Documentación actualizada (sección “Avances Día 2” en `presentar.md` + `TESTING_SETUP.md`).

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

## Día 3 — Logging profesional & configuración avanzada

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

> **Nota:** Si el supervisor necesita verificar commits por día, la rama de trabajo actual es `atter`. Recuerda limpiar secretos antiguos antes de subir a GitHub (ver repo histórico `my-ai-workflows`).
