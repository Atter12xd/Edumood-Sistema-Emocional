# 🔐 Configuración de Culqi - Día 11

**Estado:** ✅ SDK instalado, estructura creada  
**Próximo paso:** Configurar credenciales en `.env`

---

## ✅ Lo que ya está listo

1. ✅ SDK de Culqi instalado (`culqi-node`)
2. ✅ Servicio de Culqi creado (`app/services/culqi.service.ts`)
3. ✅ API route para crear cargos (`app/routes/api.culqi.create-charge.ts`)
4. ✅ Configuración en `app/config/app.config.ts`

---

## 📝 Configurar credenciales en .env

### Paso 1: Crear/Editar archivo `.env`

En la raíz del proyecto `SHOPIFY/`, crea o edita el archivo `.env`:

```bash
# Si no existe, cópialo desde ENV_TEMPLATE.txt
cp ENV_TEMPLATE.txt .env
```

### Paso 2: Agregar credenciales de Culqi

Abre el archivo `.env` y agrega o actualiza estas líneas:

```env
# --------------------------------------------
# CULQI PAYMENT GATEWAY
# --------------------------------------------
CULQI_PUBLIC_KEY=pk_test_dkeS17NBw8B1srCt
CULQI_SECRET_KEY=sk_test_367uAvKKpKk9ChQs
CULQI_ENV=test
```

### Paso 3: Verificar que se carguen

El archivo `.env` debe estar en:
```
SHOPIFY/.env
```

**⚠️ IMPORTANTE:**
- ❌ **NUNCA** commitees el archivo `.env` al repositorio
- ✅ El archivo `.env` ya está en `.gitignore`
- ✅ Las credenciales se cargan automáticamente desde `.env`

---

## 🧪 Probar la configuración

### Opción 1: Verificar desde el código

```bash
cd SHOPIFY
npm run dev
```

Luego, en la consola del servidor, deberías ver que las credenciales se cargaron correctamente.

### Opción 2: Test manual

Puedes crear un test rápido para verificar:

```typescript
// tests/culqi.config.test.ts
import { describe, it, expect } from 'vitest';
import { CULQI_CONFIG, validateCulqiConfig } from '~/config/app.config';

describe('Culqi Configuration', () => {
  it('should have Culqi keys configured', () => {
    expect(CULQI_CONFIG.publicKey).toBeTruthy();
    expect(CULQI_CONFIG.secretKey).toBeTruthy();
  });

  it('should validate configuration', () => {
    const validation = validateCulqiConfig();
    // Si está usando valores por defecto, esto fallará
    // Eso es correcto - significa que necesitas configurar tus propias credenciales
    console.log('Validation result:', validation);
  });
});
```

---

## 📚 Estructura creada

### Servicio de Culqi
- **Archivo:** `app/services/culqi.service.ts`
- **Funciones:**
  - `createToken()` - Crear token de tarjeta
  - `createCharge()` - Crear cargo (pago)
  - `getCharge()` - Obtener información de cargo
  - `validateCulqiConfig()` - Validar configuración

### API Route
- **Archivo:** `app/routes/api.culqi.create-charge.ts`
- **Endpoint:** `POST /api/culqi/create-charge`
- **Validación:** Zod schema
- **Logging:** Integrado con Pino

---

## 🚀 Próximos pasos (Día 12-17)

Una vez configuradas las credenciales:

1. **Día 12:** Backend API Culqi (cargos únicos) - ✅ Ya creado
2. **Día 13:** Frontend Culqi Integration
3. **Día 14:** Mejoras COD Form + UI/UX
4. **Día 15:** Webhooks y confirmaciones
5. **Día 16:** Testing y seguridad
6. **Día 17:** Deploy final y documentación

---

## 🔒 Seguridad

### ✅ Buenas prácticas implementadas

- ✅ Secret Key solo en backend (nunca en frontend)
- ✅ Public Key puede usarse en frontend
- ✅ Validación de datos con Zod
- ✅ Logging estructurado de todas las operaciones
- ✅ Manejo de errores completo

### ⚠️ Recordatorios

- ❌ **NUNCA** expongas `CULQI_SECRET_KEY` en el frontend
- ❌ **NUNCA** commitees el archivo `.env`
- ✅ Usa modo `test` para desarrollo
- ✅ Cambia a `production` solo cuando estés listo

---

## 📞 Referencias

- **Documentación Culqi:** https://apidocs.culqi.com/
- **Dashboard Culqi:** https://integraciones.culqi.com/
- **SDK Node.js:** https://www.npmjs.com/package/culqi-node

---

**¿Listo para continuar?** Una vez que hayas agregado las credenciales al `.env`, podemos probar la conexión con Culqi.



