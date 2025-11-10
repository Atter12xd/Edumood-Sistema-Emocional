/**
 * Sistema de Rotación Automática de WhatsApp
 * Archivo: whatsapp-rotation.js
 * Ubicación: /assets/whatsapp-rotation.js
 * Endpoint: https://essent-backen-production.up.railway.app/whatsapp/siguiente/:idusuarios
 */

class WhatsAppRotationSystem {
  constructor(config) {
    this.config = config;
    this.baseEndpoint = 'https://essent-backen-production.up.railway.app/whatsapp/siguiente';
    
    console.log('🔧 WhatsAppRotationSystem inicializado con configuración:', config);
    console.log('🌐 Endpoint base:', this.baseEndpoint);
  }

  /**
   * Obtiene el siguiente número de la rotación automática desde Railway
   */
  async obtenerSiguienteNumero() {
    try {
      console.log('🔄 ===== INICIANDO LLAMADA AL ENDPOINT DE ROTACIÓN =====');
      
      // Preparar Shop ID y URL
      const shopIdOriginal = this.config.shopId;
      const shopIdEncoded = encodeURIComponent(shopIdOriginal);
      const endpointCompleto = `${this.baseEndpoint}/${shopIdEncoded}`;
      
      console.log('📊 Datos del endpoint:');
      console.log('   🏪 Shop ID original:', shopIdOriginal);
      console.log('   🔗 Shop ID encoded:', shopIdEncoded);
      console.log('   🌐 Endpoint completo:', endpointCompleto);
      
      // Realizar petición HTTP
      console.log('📡 Realizando fetch al endpoint...');
      const response = await fetch(endpointCompleto, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Respuesta HTTP recibida:');
      console.log('   📊 Status:', response.status);
      console.log('   📊 Status Text:', response.statusText);
      console.log('   ✅ OK?:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Procesar respuesta JSON
      const data = await response.json();
      
      console.log('✅ ===== RESPUESTA EXITOSA DEL ENDPOINT =====');
      console.log('📊 Data completa recibida:', JSON.stringify(data, null, 2));
      
      // Extraer número de diferentes propiedades posibles
      let numeroObtenido = null;
      
      if (data && typeof data === 'object') {
        numeroObtenido = data.numero || data.phone || data.telefono || data.number || data.phoneNumber;
        
        console.log('🔍 Extracción de número:');
        console.log('   📱 data.numero:', data.numero);
        console.log('   📱 data.phone:', data.phone);
        console.log('   📱 data.telefono:', data.telefono);
        console.log('   📱 data.number:', data.number);
        console.log('   📱 data.phoneNumber:', data.phoneNumber);
        console.log('   🎯 Número extraído:', numeroObtenido);
        
        // Información adicional de rotación
        if (data.posicion !== undefined && data.total !== undefined) {
          console.log('📊 ===== INFORMACIÓN DE LA ROTACIÓN =====');
          console.log('   📍 Posición actual:', data.posicion);
          console.log('   📊 Total de números:', data.total);
          console.log('   🔄 Siguiente número:', numeroObtenido);
        }
      } else {
        console.log('⚠️ Respuesta no es un objeto válido:', data);
      }
      
      // Validar número extraído
      if (numeroObtenido && typeof numeroObtenido === 'string' && numeroObtenido.trim() !== '') {
        const numeroLimpio = numeroObtenido.trim();
        console.log('✅ Número válido obtenido del endpoint:', numeroLimpio);
        return numeroLimpio;
      } else {
        console.log('❌ No se pudo extraer un número válido del endpoint');
        return null;
      }
      
    } catch (error) {
      console.log('❌ ===== ERROR EN ENDPOINT DE ROTACIÓN =====');
      console.log('🚨 Tipo de error:', error.name);
      console.log('🚨 Mensaje:', error.message);
      console.log('🚨 Stack trace:', error.stack);
      
      // Verificar tipo de error específico
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log('🌐 Error de red - el endpoint podría estar inaccesible');
      } else if (error.message.includes('HTTP')) {
        console.log('📡 Error HTTP - el endpoint respondió con error');
      }
      
      return null;
    }
  }

  /**
   * Construye la URL de WhatsApp con el número y mensaje
   */
  construirUrlWhatsApp(numero, mensaje) {
    // Limpiar número (quitar espacios, guiones, etc.)
    const numeroLimpio = numero.replace(/[\s\-\(\)]/g, '');
    
    // Codificar mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Construir URL de WhatsApp
    const url = `https://wa.me/${numeroLimpio}?text=${mensajeCodificado}`;
    
    console.log('🔗 Construcción de URL de WhatsApp:');
    console.log('   📱 Número original:', numero);
    console.log('   📱 Número limpio:', numeroLimpio);
    console.log('   💬 Mensaje original:', mensaje);
    console.log('   💬 Mensaje codificado:', mensajeCodificado);
    console.log('   🌐 URL final:', url);
    
    return url;
  }

  /**
   * Abre WhatsApp en nueva pestaña o misma pestaña
   */
  abrirWhatsApp(url) {
    console.log('🚀 Abriendo WhatsApp...');
    console.log('   🔗 URL:', url);
    console.log('   📂 Nueva pestaña:', this.config.openInNewTab);
    
    if (this.config.openInNewTab) {
      window.open(url, '_blank');
      console.log('✅ WhatsApp abierto en nueva pestaña');
    } else {
      window.location.href = url;
      console.log('✅ Redirigiendo a WhatsApp en misma pestaña');
    }
  }

  /**
   * Método principal: Obtiene número de rotación y abre WhatsApp
   */
  async abrirWhatsAppConRotacion() {
    console.log('🚀 ========================================');
    console.log('🚀 INICIANDO PROCESO DE WHATSAPP CON ROTACIÓN');
    console.log('🚀 ========================================');
    
    try {
      // PASO 1: Obtener número del endpoint de rotación
      console.log('📞 PASO 1: Obteniendo número de rotación...');
      const numeroRotacion = await this.obtenerSiguienteNumero();
      
      // PASO 2: Decidir qué número usar
      let numeroFinal;
      let fuente;
      
      if (numeroRotacion) {
        numeroFinal = numeroRotacion;
        fuente = 'ENDPOINT DE ROTACIÓN';
        console.log('✅ USANDO NÚMERO DEL ENDPOINT DE ROTACIÓN');
      } else {
        numeroFinal = this.config.fallbackPhone;
        fuente = 'METAFIELD FALLBACK';
        console.log('⚠️ USANDO NÚMERO FALLBACK DEL METAFIELD');
        console.log('⚠️ MOTIVO: El endpoint no devolvió un número válido');
      }
      
      console.log('📊 DECISIÓN FINAL:');
      console.log('   🎯 Número elegido:', numeroFinal);
      console.log('   🎯 Fuente:', fuente);
      console.log('   📏 Longitud:', numeroFinal?.length || 'N/A');
      
      // PASO 3: Construir URL de WhatsApp
      console.log('🔗 PASO 3: Construyendo URL de WhatsApp...');
      const url = this.construirUrlWhatsApp(numeroFinal, this.config.message);
      
      // PASO 4: Abrir WhatsApp
      console.log('🚀 PASO 4: Abriendo WhatsApp...');
      this.abrirWhatsApp(url);
      
      // RESUMEN FINAL
      console.log('📋 ========================================');
      console.log('📋 RESUMEN FINAL DEL PROCESO');
      console.log('📋 ========================================');
      console.log('   🎯 NÚMERO USADO:', numeroFinal);
      console.log('   🎯 FUENTE:', fuente);
      console.log('   🔗 URL FINAL:', url);
      console.log('   📊 ENDPOINT FUNCIONA:', numeroRotacion ? 'SÍ ✅' : 'NO ❌');
      console.log('   ⏰ Timestamp:', new Date().toISOString());
      
      // Retornar resultado para debugging
      return {
        exito: true,
        numero: numeroFinal,
        fuente: fuente,
        url: url,
        endpointFunciona: !!numeroRotacion
      };
      
    } catch (error) {
      console.log('❌ ========================================');
      console.log('❌ ERROR CRÍTICO EN PROCESO PRINCIPAL');
      console.log('❌ ========================================');
      console.log('🚨 Error completo:', error);
      console.log('🚨 Mensaje:', error.message);
      console.log('🚨 Stack:', error.stack);
      
      // FALLBACK DE EMERGENCIA
      console.log('🚨 EJECUTANDO FALLBACK DE EMERGENCIA...');
      const emergencyUrl = this.construirUrlWhatsApp(this.config.fallbackPhone, this.config.message);
      this.abrirWhatsApp(emergencyUrl);
      
      return {
        exito: false,
        numero: this.config.fallbackPhone,
        fuente: 'EMERGENCIA',
        url: emergencyUrl,
        error: error.message
      };
    }
  }
}

// Exportar para uso global
window.WhatsAppRotationSystem = WhatsAppRotationSystem;

console.log('✅ whatsapp-rotation.js cargado correctamente');
console.log('🔧 Clase WhatsAppRotationSystem disponible globalmente');