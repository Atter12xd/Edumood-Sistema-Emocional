 # 🧪 Comandos para Probar la Aplicación Localmente

**Guía rápida para probar sin entrar a Shopify**

---

## 📋 Pasos para Probar

### 1️⃣ Guardar en GitHub (Primero)

```bash
cd SHOPIFY
git add .
git commit -m "feat: Integración Culqi completada (Días 12-13)"
git push
```

---

### 2️⃣ Instalar Dependencias (si es necesario)

```bash
cd SHOPIFY
npm install
```

---

### 3️⃣ Verificar que el archivo .env existe

Asegúrate de que tienes el archivo `.env` con las credenciales de Culqi:

```env
CULQI_PUBLIC_KEY=pk_test_dkeS17NBw8B1srCt
CULQI_SECRET_KEY=sk_test_367uAvKKpKk9ChQs
CULQI_ENV=test
```

---

### 4️⃣ Construir y Ejecutar la Aplicación

**Opción A: Preview (Recomendado)**
```bash
cd SHOPIFY
npm run preview
```

Esto hará:
1. Build de la aplicación
2. Iniciar el servidor en `http://localhost:3000`

**Opción B: Desarrollo Directo**
```bash
cd SHOPIFY
npm run build
npm run start
```

---

### 5️⃣ Acceder a la Aplicación

Una vez que el servidor esté corriendo, verás en la consola:

```
🚀 ===================================================
   ESSENTIAL SHOPIFY APP - SERVIDOR LOCAL INICIADO
🚀 ===================================================

🌐 Servidor corriendo en: http://0.0.0.0:3000
```

**Abre en tu navegador:**
- **URL Principal:** http://localhost:3000
- **Formulario COD (si tienes ruta directa):** http://localhost:3000/codform

---

## ⚠️ Notas Importantes

### Si necesitas autenticación de Shopify:

Las rutas protegidas (`/app`, `/codform`) requieren autenticación de Shopify. Para probarlas completamente necesitarías:

1. **Usar el comando de desarrollo de Shopify:**
   ```bash
   npm run dev
   ```
   Esto abrirá un túnel y te pedirá autenticarte con Shopify.

2. **O crear una ruta de prueba sin autenticación** (para desarrollo)

---

## 🧪 Probar la Integración de Culqi

### Ruta del API de Culqi:
- **Endpoint:** `POST http://localhost:3000/api/culqi/create-charge`
- **Body de ejemplo:**
  ```json
  {
    "token_id": "tok_test_1234567890",
    "amount": 100.00,
    "email": "test@example.com",
    "description": "Test de pago",
    "currency_code": "PEN"
  }
  ```

### Probar con Postman/Insomnia:

1. Abre Postman o Insomnia
2. Crea una petición POST a: `http://localhost:3000/api/culqi/create-charge`
3. Headers: `Content-Type: application/json`
4. Body (JSON):
   ```json
   {
     "token_id": "tok_test_1234567890",
     "amount": 100.00,
     "email": "test@example.com",
     "description": "Test de pago COD",
     "currency_code": "PEN"
   }
   ```

---

## 🔍 Verificar que Todo Funciona

### 1. Verificar que el servidor inicia:
```bash
npm run preview
# Deberías ver el mensaje de servidor iniciado
```

### 2. Verificar logs:
- Los logs de Pino deberían aparecer en la consola
- Busca mensajes como `[CULQI]` para verificar la configuración

### 3. Verificar que Culqi.js se carga:
- Abre la consola del navegador (F12)
- Busca mensajes de `[CULQI]` en los logs del cliente

---

## 🛑 Detener el Servidor

Presiona `Ctrl + C` en la terminal donde está corriendo el servidor.

---

## 📝 Comandos Útiles Adicionales

```bash
# Verificar tipos TypeScript
npm run typecheck

# Ejecutar tests
npm run test:run

# Ver tests en modo watch
npm run test:watch

# Linting
npm run lint
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error: "Port 3000 already in use"
```bash
# Cambiar el puerto en .env
PORT=3001
```

### Error: "CULQI_SECRET_KEY no está configurada"
- Verifica que el archivo `.env` existe
- Verifica que tiene las credenciales correctas
- Reinicia el servidor después de cambiar `.env`

---

**¡Listo para probar!** 🚀

