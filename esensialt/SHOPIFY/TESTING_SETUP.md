# 🧪 Guía de Testing - Essential WhatsApp Widget

**Fecha de implementación:** Día 1 del Plan de 17 Días  
**Framework:** Vitest 4.0.7  
**Estado:** ✅ Configurado y funcionando

---

## 📋 ¿Qué se implementó?

### **1. Sistema de Tests Automatizados**
- ✅ Vitest como framework de testing (alternativa moderna a Jest)
- ✅ @testing-library/react para testing de componentes
- ✅ 28 tests funcionando correctamente
- ✅ Coverage reports configurados
- ✅ UI interactiva para debugging
- ✅ Validaciones Zod activas en `hook` + `FormContent` con mensajes en UI

### **2. Configuración Centralizada**
- ✅ Todas las configuraciones en `app/config/app.config.ts`
- ✅ Variables de entorno organizadas
- ✅ Helper functions para calcular comisiones Culqi
- ✅ Validación de configuración requerida

---

## 🚀 Comandos Disponibles

```bash
# Ejecutar tests en modo watch (recomendado para desarrollo)
npm test

# Ejecutar tests una sola vez
npm run test:run

# Ver UI interactiva de Vitest (muy útil!)
npm run test:ui

# Ejecutar tests en modo watch (explícito)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### 🆕 Cambios Día 2

- Lógica del formulario COD movida a `app/routes/codform/hooks/useCodFormState.ts`
- Llamadas API centralizadas en `app/routes/codform/services/codform.api.ts`
- Componentes existentes (`DesignPanel`, `PreviewPanel`, `FormContent`) no cambiaron su API pública
- Todas las URLs ahora se construyen con `getBackendUrl` desde `app/config/app.config.ts`

### 🆕 Cambios Día 3

- Logger backend `app/utils/logger.server.ts` configurado con **Pino** (pretty en desarrollo, JSON en producción)
- Instrumentación de `codform.api.ts` con validación previa (`validateUpsertPayload`), medición de tiempos y manejo exhaustivo de errores (`parseErrorBody`)
- Logger cliente `app/utils/logger.client.ts` integrado en `hooks/useCodFormState.ts` para reemplazar `console.*`
- Tests `tests/codform.api.test.ts` validan que se emiten `info`, `warn` y `error` según la respuesta del backend
- Documentación y ejemplos de ejecución de logs actualizados (sección “Logs y Observabilidad” más abajo)

---

## 📁 Estructura de Archivos

```
SHOPIFY/
├── vitest.config.ts          # Configuración de Vitest
├── tests/                     # Todos los tests aquí
│   ├── setup.ts              # Setup global de tests
│   ├── example.test.ts       # Tests de ejemplo
│   ├── config.test.ts        # Tests de configuración y helpers
│   ├── codform.validation.test.ts # Tests Zod + reglas del formulario COD
│   └── codform.api.test.ts        # Logs + flujo COD form → Railway
├── app/
│   └── config/
│       └── app.config.ts     # ⭐ Configuración centralizada
│   └── utils/
│       ├── logger.client.ts  # ⭐ Logger en frontend
│       └── logger.server.ts  # ⭐ Logger Pino para backend
│   └── routes/
│       └── codform/
│           ├── hooks/useCodFormState.ts   # ⭐ Estado y handlers extraídos
│           ├── services/codform.api.ts    # ⭐ Integración con Railway
│           └── codform.tsx                # Render principal usando el hook
└── ENV_TEMPLATE.txt          # Template de variables de entorno
```

---

## 🛠️ Cómo Escribir Tests

### **Test Simple**

```typescript
import { describe, it, expect } from 'vitest';

describe('Mi Feature', () => {
  it('debe hacer algo específico', () => {
    const resultado = 1 + 1;
    expect(resultado).toBe(2);
  });
});
```

### **Test de Configuración**

```typescript
import { CULQI_CONFIG } from '../app/config/app.config';

it('debe tener API keys de Culqi', () => {
  expect(CULQI_CONFIG.publicKey).toMatch(/^pk_/);
  expect(CULQI_CONFIG.secretKey).toMatch(/^sk_/);
});
```

### **Test de Helper Functions**

```typescript
import { calculateCulqiFee } from '../app/config/app.config';

it('debe calcular comisión correctamente', () => {
  const { fee, net } = calculateCulqiFee(100, 'card');
  expect(fee).toBe(3.80);
  expect(net).toBe(96.20);
});
```

### **Testear nuevos servicios (ejemplo básico)**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { upsertCodForm } from '~/routes/codform/services/codform.api';

describe('Servicio COD Form', () => {
  it('llama a fetch con la URL configurada', async () => {
    const mockFetch = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: { id: '123' } }) } as any);

    await upsertCodForm({
      shopOwner: { shopId: '1', shopName: 'demo', firstName: '', lastName: '', email: '', phone: '', address: '', city: '', country: '' },
      product: { name: 'demo', price: 10, currency: 'PEN', image: '' },
      formType: 'popup',
      formStyle: { textColor: '#000', textSize: 14, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#000', shadow: 4, hideCloseButton: false, hideFieldLabels: false, enableRTL: false, enableFullScreen: false },
      blocks: {} as any,
      blockOrder: [],
      blockColors: { textColor: '#000', textSize: 14, bgColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#000', shadow: 4 },
      buttonConfig: null,
      errorMessages: { required: '', invalid: '' },
    });

    expect(mockFetch).toHaveBeenCalled();
    mockFetch.mockRestore();
  });
});
```

---

## 📊 Cobertura de Tests Actual

| Archivo | Tests | Estado |
|---------|-------|--------|
| `example.test.ts` | 5 tests | ✅ Pasando |
| `config.test.ts` | 9 tests | ✅ Pasando |
| `codform.validation.test.ts` | 4 tests | ✅ Pasando |
| `codform.api.test.ts` | 6 tests | ✅ Pasando |
| **TOTAL** | **28 tests** | **✅ 100%** |

---

## 🔍 Logs y Observabilidad

### **Backend (Pino)**
- Command: `npm run dev` (modo Remix dev)  
- Configuración: `LOG_LEVEL=debug` para mayor verbosidad  
- Salida esperada (desarrollo): formato coloreado con campos `service`, `environment`, `shopId`, `durationMs`
- Producción: logs en formato JSON (sin pretty transport)

### **Frontend**
- Logger en `app/utils/logger.client.ts` respeta `APP_CONFIG.logging.level`
- Eventos clave (`handleSubmit`, errores de carga/guardado) se registran con prefijo `[CODFORM]`
- Disponible en DevTools → pestaña **Console**

### **Tests de Logging**
- Archivo: `tests/codform.api.test.ts`
- Uso: `vi.mock("~/utils/logger.server")` para verificar llamadas `info`, `warn`, `error`
- Cubren escenarios: fetch exitoso, backend 500, payload inválido, guardado exitoso

---

## ⚙️ Configuración Centralizada

### **Importar Configuración**

```typescript
// Importar todo
import config from '~/config/app.config';

// O importar específico
import { 
  BACKEND_CONFIG,
  CULQI_CONFIG,
  getBackendUrl,
  calculateCulqiFee
} from '~/config/app.config';
```

### **Usar en Componentes**

```typescript
// Ejemplo: Llamar API del backend
const response = await fetch(
  getBackendUrl('/whatsapp/crear'),
  { method: 'POST', body: JSON.stringify(data) }
);

// Ejemplo: Calcular comisión de Culqi
const { fee, net } = calculateCulqiFee(100, 'card');
console.log(`Comisión: S/. ${fee}, Neto: S/. ${net}`);
```

### **Configuraciones Disponibles**

#### **1. BACKEND_CONFIG**
```typescript
BACKEND_CONFIG.baseUrl              // URL del backend Railway
BACKEND_CONFIG.endpoints.whatsapp   // Endpoints de WhatsApp
BACKEND_CONFIG.endpoints.codForms   // Endpoints de COD Forms
BACKEND_CONFIG.timeout              // Timeout de requests
```

#### **2. CULQI_CONFIG**
```typescript
CULQI_CONFIG.publicKey              // pk_test_dkeS17NBw8B1srCt
CULQI_CONFIG.secretKey              // sk_test_367uAvKKpKk9ChQs (BACKEND ONLY!)
CULQI_CONFIG.environment            // 'test' | 'production'
CULQI_CONFIG.currency               // 'PEN'
CULQI_CONFIG.fees.card              // Comisiones de tarjeta
CULQI_CONFIG.fees.yape              // Comisiones de Yape
CULQI_CONFIG.fees.pagoEfectivo      // Comisiones de PagoEfectivo
```

#### **3. APP_CONFIG**
```typescript
APP_CONFIG.name                     // 'Essential WhatsApp Widget'
APP_CONFIG.version                  // '2.0.0'
APP_CONFIG.environment              // 'development' | 'production' | 'test'
APP_CONFIG.isDevelopment            // boolean
APP_CONFIG.isProduction             // boolean
APP_CONFIG.logging.level            // 'debug' | 'info' | 'warn' | 'error'
```

---

## 🔧 Variables de Entorno

### **Configurar Variables**

1. Copia `ENV_TEMPLATE.txt` a `.env`
2. Llena los valores reales
3. **NUNCA** commits el archivo `.env`

### **Variables Críticas**

```bash
# Shopify
SHOPIFY_API_KEY=your_key_here
SHOPIFY_API_SECRET=your_secret_here

# Database
DATABASE_URL=postgresql://...

# Culqi (Test)
CULQI_PUBLIC_KEY=pk_test_dkeS17NBw8B1srCt
CULQI_SECRET_KEY=sk_test_367uAvKKpKk9ChQs
CULQI_ENV=test
```

---

## 🎯 Próximos Pasos

### **Día 2-3 (Pendiente)**
- [ ] Agregar más tests unitarios
- [ ] Tests de integración para componentes React
- [ ] Tests para routes de Remix
- [ ] Mocks de Shopify API

### **Día 4-5 (Pendiente)**
- [ ] Implementar sistema de logs profesional
- [ ] Agregar Winston o Pino
- [ ] Tests para sistema de logging

---

## 🐛 Troubleshooting

### **Tests no se ejecutan**
```bash
# Reinstalar dependencias
npm install

# Limpiar cache
rm -rf node_modules/.vite
npm run test:run
```

### **Error de módulssos**
```bash
# Verificar que todas las dependencias estén instaladas
npm install -D vitest @vitest/ui @testing-library/react @vitejs/plugin-react
```

### **Coverage no funciona**
```bash
# Instalar proveedor de coverage
npm install -D @vitest/coverage-v8
npm run test:coverage
```

---

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)
- [Culqi API Docs](https://apidocs.culqi.com/)

---

**✅ Tests configurados exitosamente el Día 1**  
**📊 28 tests pasando**
**🎯 Listo para continuar con Día 2-3**

### **Plus para la demo:**
- `npm run preview` abre la app en `http://localhost:3000`
- Mostrar la barra superior de “Cambios no guardados”, guardar (mock API) y ver notificación
- Abrir `hooks/useCodFormState.ts` para resaltar el refactor de Día 2
- Ejecutar `npm run test:run` en vivo para evidenciar cobertura



