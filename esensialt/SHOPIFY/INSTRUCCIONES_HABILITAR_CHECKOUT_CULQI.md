# 🔧 Instrucciones para Habilitar Checkout en Culqi

## ⚠️ Problema Actual

El checkout está deshabilitado (`_isCheckoutEnabled: false`) en la llave pública de Culqi. Esto significa que la llave no tiene permisos de checkout habilitados en el panel de Culqi.

**Error que aparece:**
```
No ha ingresado la configuración o no es válida
```

## 🎯 Solución: Habilitar Checkout en el Panel de Culqi

### Paso 1: Acceder al Panel de Culqi

1. Ve a: https://integraciones.culqi.com/
2. Inicia sesión con tus credenciales
3. Busca la sección de **"API Keys"** o **"Llaves API"**

### Paso 2: Verificar la Llave Pública

1. Busca tu llave pública de prueba: `pk_test_dkeS17NBw8B1srCt`
2. Haz clic en ella para ver los detalles

### Paso 3: Habilitar Permisos de Checkout

**Busca una de estas opciones:**

#### Opción A: Permisos o Scopes
- Busca una sección que diga **"Permisos"**, **"Scopes"** o **"Capabilities"**
- Debe haber checkboxes o toggles para:
  - ✅ **Checkout** (OBLIGATORIO)
  - ✅ **Tokens**
  - ✅ **Pagos**
- Habilita todos estos permisos
- Guarda los cambios

#### Opción B: Configuración de Checkout
- Busca una sección que diga **"Configuración de Checkout"** o **"Checkout Settings"**
- Debe haber una opción para **"Habilitar Checkout"** o **"Activar Checkout"**
- Actívala
- Guarda los cambios

#### Opción C: Webhooks o Integraciones
- Busca una sección que diga **"Webhooks"** o **"Integraciones"**
- Puede haber opciones para habilitar el checkout allí
- Configura según sea necesario

### Paso 4: Verificar que se Habilitó

1. Después de habilitar, recarga la página del panel
2. Verifica que los permisos estén habilitados
3. Puede que necesites generar una nueva llave si la actual no permite habilitar checkout

### Paso 5: Si No Encuentras las Opciones

**Contacta al soporte de Culqi:**
- Email: soporte@culqi.com
- Teléfono: (01) 415-1415
- Chat en vivo en el panel de Culqi

**Información que debes proporcionar:**
- Tu llave pública: `pk_test_dkeS17NBw8B1srCt`
- El problema: "El checkout está deshabilitado en mi llave de prueba"
- Lo que necesitas: "Necesito habilitar el checkout para poder usar el modal de pagos"

## 🔄 Alternativa: Generar Nueva Llave

Si la llave actual no permite habilitar checkout:

1. Ve a **"API Keys"** → **"Crear nueva llave"**
2. Selecciona tipo: **"Prueba"** (Test)
3. Al crear, asegúrate de habilitar:
   - ✅ Checkout
   - ✅ Tokens
   - ✅ Pagos
4. Copia la nueva llave pública (empieza con `pk_test_...`)
5. Actualiza tu archivo `.env` con la nueva llave

## 📝 Verificación

Una vez habilitado el checkout:

1. Reinicia tu aplicación
2. Intenta abrir el modal de Culqi nuevamente
3. En la consola del navegador, deberías ver:
   ```
   _isCheckoutEnabled: true
   ```
4. El modal de Culqi debería abrirse correctamente

## 🆘 Si el Problema Persiste

Si después de habilitar el checkout en el panel el problema persiste:

1. **Verifica que la llave sea válida:**
   - Asegúrate de que no esté expirada
   - Verifica que sea de tipo "Prueba" (Test)

2. **Verifica que los permisos estén guardados:**
   - Recarga la página del panel
   - Verifica que los cambios se guardaron

3. **Intenta con una nueva llave:**
   - Genera una nueva llave de prueba
   - Asegúrate de habilitar checkout al crearla
   - Actualiza tu código con la nueva llave

4. **Contacta al soporte de Culqi:**
   - Puede que haya un problema con tu cuenta
   - O que necesites un plan específico para usar checkout

---

**Nota:** El código está listo y funcionando. El único problema es que la llave no tiene permisos de checkout habilitados en el panel de Culqi. Una vez habilitados, el código funcionará correctamente.




