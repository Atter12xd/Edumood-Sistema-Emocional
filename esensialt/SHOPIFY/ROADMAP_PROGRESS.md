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
npm run test:run      # 24 tests (a partir del Día 2) — evidencia automatizada
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
- Pruebas unitarias nuevas: `tests/codform.validation.test.ts` (4 casos) → suite total **24 tests**.
- Documentación actualizada (sección “Avances Día 2” en `presentar.md` + `TESTING_SETUP.md`).

**Arquitectura / Código clave:**
- `app/routes/codform/codform.tsx` (render limpio). Hook + service en `hooks/useCodFormState.ts` y `services/codform.api.ts`.
- Validaciones: `app/routes/codform/validation/codform.validation.ts` + UI en `FormContent.tsx`.
- Test unitarios: `tests/codform.validation.test.ts`.

**Cómo probar:**
```bash
cd SHOPIFY
npm run test:run          # 24 tests (incluye validaciones Zod)
npm run preview           # http://localhost:3000 → interactuar con formulario y ver mensajes de error
```

**Demostración:**
- Intentar guardar sin llenar “Correo”/“Teléfono” → se muestran errores rojos y no se guarda.
- Observar banner “Cambios no guardados” y notificación de error/success (estado global).

---

## Día 3 (próximo) — Logging profesional & configuración avanzada

**Meta (pendiente):**
- Reemplazar `console.log` por logger (Winston/Pino) + centralización de niveles (`APP_CONFIG.logging`).
- Validaciones backend y logs de `upsertCodForm` (capturar errores de Railway).
- Documentar en este archivo y en `presentar.md`.

**Próximos archivos/branches a tocar:**
- `app/routes/codform/services/codform.api.ts` — agregar logs y manejo de errores refinado.
- `config/app.config.ts` — habilitar niveles de logging.
- `presentar.md` — sección “Día 3”.

---

> **Nota:** Si el supervisor necesita verificar commits por día, la rama de trabajo actual es `atter`. Recuerda limpiar secretos antiguos antes de subir a GitHub (ver repo histórico `my-ai-workflows`).
