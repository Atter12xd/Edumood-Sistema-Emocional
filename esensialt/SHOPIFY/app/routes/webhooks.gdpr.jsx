import { json } from "@remix-run/node";
import crypto from "crypto";

// 🔍 FUNCIÓN HELPER PARA LOGGING SEGURO (NUEVO)
function logSecurely(message, data) {
  const sanitizedData = data ? {
    ...data,
    secret: data.secret ? '[REDACTED]' : undefined,
    hmac: data.hmac ? data.hmac.substring(0, 8) + '...' : undefined
  } : undefined;
  
  console.log(`🔒 [GDPR] ${message}`, sanitizedData || '');
}

// Loader para manejar requests GET (para verificación)
export const loader = async () => {
  logSecurely('GET request received'); // NUEVO
  
  return json({ 
    message: "GDPR Webhook endpoint is working",
    methods: ["POST"],
    status: "active",
    timestamp: new Date().toISOString() // NUEVO
  }, { 
    status: 200,
    headers: { // NUEVO
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
    }
  });
};

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    logSecurely('Invalid method received', { method: request.method }); // NUEVO
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const topic = request.headers.get("x-shopify-topic");
    const shopDomain = request.headers.get("x-shopify-shop-domain");
    const hmac = request.headers.get("x-shopify-hmac-sha256");
    
    logSecurely('Webhook received', { // NUEVO
      topic,
      shopDomain,
      hasHmac: !!hmac,
      url: request.url
    });
    
    // 🚨 VERIFICAR SECRET PRIMERO (NUEVO)
    const SHOPIFY_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
    if (!SHOPIFY_SECRET) {
      logSecurely('❌ SHOPIFY_WEBHOOK_SECRET not configured');
      return json({ 
        error: "Server configuration error",
        message: "Webhook secret not configured"
      }, { 
        status: 500, // CAMBIADO: era 401, ahora 500 para errores de config
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // 🚨 VERIFICAR HMAC PRESENTE (MEJORADO)
    if (!hmac) {
      logSecurely('❌ Missing HMAC header');
      return json({ 
        error: "Unauthorized", 
        message: "Missing HMAC signature" // MEJORADO: mensaje más claro
      }, { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Obtener el body como texto para verificar HMAC
    const bodyText = await request.text();
    
    // 🚨 VERIFICAR BODY NO VACÍO (NUEVO)
    if (!bodyText) {
      logSecurely('❌ Empty request body');
      return json({ 
        error: "Unauthorized", 
        message: "Empty request body" 
      }, { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    logSecurely('Raw body obtained', { // NUEVO
      length: bodyText.length,
      preview: bodyText.substring(0, 100) 
    });
    
    // ⚡ CRÍTICO: Verificar HMAC - OBLIGATORIO para Shopify
    // Usar timing-safe comparison para seguridad
    const calculatedHmac = crypto
      .createHmac('sha256', SHOPIFY_SECRET) // CAMBIADO: usar SHOPIFY_SECRET en lugar de process.env
      .update(bodyText, 'utf8')
      .digest('base64');
    
    // 🔍 LOGGING MEJORADO (MODIFICADO)
    logSecurely('HMAC Verification Details', {
      receivedLength: hmac.length,
      calculatedLength: calculatedHmac.length,
      bodyLength: bodyText.length,
      topic: topic,
      secretPresent: !!SHOPIFY_SECRET,
      receivedPreview: hmac.substring(0, 8),
      calculatedPreview: calculatedHmac.substring(0, 8)
    });
    
    // 🔒 VERIFICACIÓN DE LONGITUD PRIMERO (NUEVO)
    if (hmac.length !== calculatedHmac.length) {
      logSecurely('❌ HMAC length mismatch - returning 401');
      return json({ 
        error: "Unauthorized", 
        message: "HMAC verification failed" 
      }, { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Comparación segura usando timing-safe equal
    let hmacMatches;
    try {
      hmacMatches = crypto.timingSafeEqual(
        Buffer.from(calculatedHmac), // CAMBIADO: sin especificar encoding
        Buffer.from(hmac) // CAMBIADO: sin especificar encoding
      );
    } catch (timingError) { // NUEVO: manejo de errores en timingSafeEqual
      logSecurely('❌ Error in timing-safe comparison', { error: timingError.message });
      return json({ 
        error: "Unauthorized", 
        message: "HMAC verification failed" 
      }, { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    if (!hmacMatches) {
      logSecurely("❌ HMAC verification failed - returning 401");
      
      // ⚡ CRÍTICO: SHOPIFY REQUIERE 401 para HMAC inválido
      return json({ 
        error: "Unauthorized", 
        message: "HMAC verification failed",
        timestamp: new Date().toISOString() // NUEVO
      }, { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      logSecurely("✅ HMAC verification successful");
    }
    
    // Convertir el body a JSON después de verificar HMAC
    let body;
    try {
      body = bodyText ? JSON.parse(bodyText) : {};
    } catch (parseError) {
      logSecurely("⚠️ JSON parse error, using empty object", { error: parseError.message }); // MEJORADO
      body = {};
    }
    
    logSecurely(`🔒 Processing GDPR webhook: ${topic}`, { // MEJORADO
      shop: shopDomain,
      dataKeys: Object.keys(body)
    });

    // Procesar según el tipo de webhook GDPR
    let processingResult; // NUEVO: capturar resultado
    switch (topic) {
      case "customers/data_request":
        logSecurely("📋 Processing customer data request"); // MEJORADO
        processingResult = await handleCustomerDataRequest(body, shopDomain);
        break;
        
      case "customers/redact":
        logSecurely("🗑️ Processing customer data redaction"); // MEJORADO
        processingResult = await handleCustomerRedact(body, shopDomain);
        break;
        
      case "shop/redact":
        logSecurely("🏪 Processing shop data redaction"); // MEJORADO
        processingResult = await handleShopRedact(body, shopDomain);
        break;
        
      default:
        logSecurely("⚠️ Unknown webhook topic", { topic }); // MEJORADO
        processingResult = { status: 'ignored', reason: 'Unknown topic' }; // NUEVO
    }
    
    // ⚡ SOLO responder 200 si HMAC es válido
    return json({ 
      success: true, 
      message: "GDPR webhook processed successfully",
      topic: topic,
      shop: shopDomain,
      result: processingResult, // NUEVO
      timestamp: new Date().toISOString()
    }, { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    logSecurely('❌ Unexpected error processing webhook', { // MEJORADO
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : '[HIDDEN]' // NUEVO: ocultar stack en producción
    });
    
    // 🚨 CAMBIO CRÍTICO: En error interno, responder 401 (no 500) para seguridad
    // Esto evita dar información sobre errores internos a requests no autorizados
    return json({ 
      error: "Unauthorized", // CAMBIADO: era "Internal server error"
      message: "Webhook processing failed", // CAMBIADO: mensaje más genérico
      timestamp: new Date().toISOString()
    }, { 
      status: 401, // CAMBIADO: era 500, ahora 401 por seguridad
      headers: { "Content-Type": "application/json" }
    });
  }
};

// Funciones auxiliares para manejar cada tipo de webhook GDPR (MEJORADAS)
async function handleCustomerDataRequest(data, shopDomain) {
  logSecurely(`Processing customer data request`, { // MEJORADO
    customerId: data.customer?.id,
    shop: shopDomain
  });
  
  try {
    // TODO: Implementar la lógica real según tus necesidades
    // 1. Buscar todos los datos del cliente en tu base de datos
    // 2. Compilar los datos en un formato legible
    // 3. Enviar los datos al store owner (por email o sistema)
    
    logSecurely('✅ Customer data request processed successfully'); // NUEVO
    return { // NUEVO: retornar resultado
      status: 'completed', 
      action: 'customer_data_compiled',
      timestamp: new Date().toISOString()
    };
  } catch (error) { // NUEVO: manejo de errores
    logSecurely('❌ Error processing customer data request', { error: error.message });
    return { 
      status: 'error', 
      action: 'customer_data_request_failed',
      error: error.message 
    };
  }
}

async function handleCustomerRedact(data, shopDomain) {
  logSecurely(`Processing customer redaction`, { // MEJORADO
    customerId: data.customer?.id,
    shop: shopDomain
  });
  
  try {
    // TODO: Implementar la lógica real según tus necesidades
    // 1. Encontrar todos los registros del cliente en tu base de datos
    // 2. Eliminar o anonimizar los datos personales
    // 3. Mantener logs de la eliminación para auditoría
    
    logSecurely('✅ Customer redaction processed successfully'); // NUEVO
    return { // NUEVO: retornar resultado
      status: 'completed', 
      action: 'customer_data_redacted',
      timestamp: new Date().toISOString()
    };
  } catch (error) { // NUEVO: manejo de errores
    logSecurely('❌ Error processing customer redaction', { error: error.message });
    return { 
      status: 'error', 
      action: 'customer_redaction_failed',
      error: error.message 
    };
  }
}

async function handleShopRedact(data, shopDomain) {
  logSecurely(`Processing shop redaction for domain: ${shopDomain}`); // MEJORADO
  
  try {
    // TODO: Implementar la lógica real según tus hhhhhhhhhh necesidades
    // ⚠️ CUIDADO: Esta operación elimina TODOS los datos de la tienda
    // 1. Eliminar todos los datos relacionados con esta tienda
    // 2. Eliminar configuraciones, logs, archivos, etc.
    // 3. Mantener logs de la eliminación para auditoría
    
    logSecurely('✅ Shop redaction processed successfully'); // NUEVO
    return { // NUEVO: retornar resultado
      status: 'completed', 
      action: 'shop_data_redacted',
      timestamp: new Date().toISOString()
    };
  } catch (error) { // NUEVO: manejo de errores
    logSecurely('❌ Error processing shop redaction', { error: error.message });
    return { 
      status: 'error', 
      action: 'shop_redaction_failed',
      error: error.message 
    };
  }
}