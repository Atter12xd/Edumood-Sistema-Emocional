# 🚀 Guía Rápida: Configurar Culqi

## 📍 En el Panel de Culqi - Pasos Específicos

### Paso 1: Ubicación de API Keys

**Rutas posibles en el panel de Culqi:**
- Menú lateral → "Configuración" → "API Keys"
- Menú lateral → "Llaves API"
- Menú lateral → "Credenciales"
- Menú superior → "Configuración" → "API"

**Si no encuentras ninguna de estas opciones:**
- Busca en el menú de tu perfil (icono de usuario arriba a la derecha)
- Revisa si hay un menú "Desarrolladores" o "Integraciones"

---

### Paso 2: Verificar/Crear Llave de Prueba

#### Opción A: Si ya tienes una llave de prueba

1. En la lista de llaves, busca una que diga:
   - **Tipo:** "Prueba" o "Test" o "Sandbox"
   - **Empiece con:** `pk_test_...` (llave pública)
   
2. Haz clic en ella para ver los detalles

3. Verifica que tenga habilitados estos permisos:
   - ✅ **Checkout** (OBLIGATORIO)
   - ✅ **Tokens**
   - ✅ **Pagos**

4. Si NO tiene estos permisos:
   - Busca un botón de "Editar" o "Modificar"
   - Habilita los permisos mencionados
   - Guarda los cambios

---

#### Opción B: Crear nueva llave de prueba

1. Busca el botón: **"Crear nueva llave"** o **"Generar llave"** o **"Nueva llave"**

2. Al crear, selecciona:
   - **Tipo:** "Prueba" o "Test" (NO producción)
   - **Permisos:** Habilita:
     - ✅ Checkout
     - ✅ Tokens  
     - ✅ Pagos

3. Guarda la nueva llave

---

### Paso 3: Obtener la Llave Pública

Una vez que tengas la llave configurada:

1. **Busca la "Llave Pública"** (Public Key)
   - Empieza con: `pk_test_...` (para pruebas)
   - Ejemplo: `pk_test_abc123xyz456...`

2. **Cópiala completa** (debería tener entre 20-30 caracteres)

3. **NO copies la "Llave Secreta"** (Secret Key)
   - Esa empieza con: `sk_test_...`
   - Esa se usa solo en el backend

---

### Paso 4: Actualizar en el Código

Una vez que tengas la llave pública copiada:

1. **Dime la llave** (la puedes compartir, es segura para el frontend)
2. **La actualizaremos en el código**
3. **Probaremos que funcione**

---

## ❓ ¿Qué Hacer Si No Encuentras las Opciones?

### Si no ves "API Keys" en el menú:

1. **Verifica que estés en el panel correcto:**
   - URL debería ser: `https://integraciones.culqi.com/`
   - Asegúrate de estar logueado

2. **Busca en diferentes secciones:**
   - "Desarrolladores"
   - "Integraciones"  
   - "Mi Cuenta" → "Configuración"
   - "Dashboard" → "Configuración"

3. **Verifica tu plan de Culqi:**
   - Algunos planes básicos pueden tener opciones limitadas
   - Puede que necesites activar tu cuenta primero

---

## 🔍 Información a Buscar

Cuando encuentres las llaves, deberías ver algo como:

```
Llave Pública (Public Key)
pk_test_abc123xyz456789...

Permisos:
☑ Checkout
☑ Tokens
☑ Pagos
```

O en formato de tabla:

| Tipo | Llave | Permisos |
|------|-------|----------|
| Prueba | pk_test_... | Checkout, Tokens, Pagos |

---

## 📝 Notas Importantes

✅ **Usa llave de PRUEBA (Test)** - No uses producción aún  
✅ **La llave pública es segura** - Puedes compartirla sin riesgo  
✅ **La llave secreta es privada** - Solo para backend, nunca exponerla  
✅ **Verifica los permisos** - Especialmente "Checkout" debe estar habilitado  

---

## 🆘 ¿Necesitas Ayuda?

**Dime:**
1. ¿Qué opciones de menú ves en el panel de Culqi?
2. ¿Estás en la página de "Configuración" o "API Keys"?
3. ¿Ves alguna lista de llaves o necesitas crear una nueva?
4. ¿Pudiste copiar la llave pública?

Con esa información puedo darte instrucciones más específicas.

