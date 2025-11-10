// server.js - Servidor personalizado COMPLETO para Railway con HMAC FIX DEFINITIVO + CORS
import { createRequestHandler } from "@remix-run/express";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// 🚨 CRÍTICO: Configurar trust proxy para Railway
app.set('trust proxy', 1);

// 🌐 CONFIGURACIÓN CORS - AGREGAR ANTES QUE TODO
const corsOptions = {
  origin: [
    'http://localhost:8080',          // Backend local NestJS
    'https://essent-backen-production.up.railway.app',
    /\.myshopify\.com$/,
    /\.shopifyapps\.com$/,
    /\.trycloudflare\.com$/,
    /\.shopify\.com$/,
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:58183',
    'https://localhost:3458',        // Puerto actual de tu app con SSL
    /localhost:\d+$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Shopify-Shop-Domain',
    'X-Shopify-Access-Token',
    'X-Shopify-Hmac-Sha256',
    'X-Shopify-Topic',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// 🌐 APLICAR CORS GLOBALMENTE
app.use(cors(corsOptions));

// 🌐 MANEJAR PREFLIGHT OPTIONS REQUESTS
app.options('*', cors(corsOptions));

// 🔍 MIDDLEWARE DE LOGGING PARA CORS
app.use((req, res, next) => {
  console.log('🌐 [CORS REQUEST]:', {
    origin: req.headers.origin,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent']?.substring(0, 50)
  });
  next();
});

// 🔒 MIDDLEWARE RAW BODY PARA WEBHOOKS (DEBE IR ANTES DE TODO)
app.use('/webhooks', express.raw({
  type: ['application/json', 'text/plain'],
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    // Guardar el raw body para verificación HMAC
    req.rawBody = buf.toString('utf8');
    console.log('🔍 [RAW BODY CAPTURADO]:', {
      length: buf.length,
      encoding: encoding,
      url: req.url,
      preview: req.rawBody.substring(0, 100)
    });
  }
}));

// 🚨 CRÍTICO: JSON parsing SOLO para rutas NO-webhook
app.use((req, res, next) => {
  if (req.url.startsWith('/webhooks')) {
    console.log('🔒 [WEBHOOK] Skipping JSON parsing for:', req.url);
    return next(); // Skip JSON parsing for webhooks
  }
  express.json({ limit: '50mb' })(req, res, next);
});

// 🚨 CRÍTICO: URL encoded SOLO para rutas NO-webhook  
app.use((req, res, next) => {
  if (req.url.startsWith('/webhooks')) {
    return next(); // Skip URL encoded parsing for webhooks
  }
  express.urlencoded({ extended: true, limit: '50mb' })(req, res, next);
});

// 🛡️ MIDDLEWARE DE SECURITY HEADERS
app.use((req, res, next) => {
  const shop = req.query.shop;
  const url = req.url;
  const method = req.method;
  
  console.log("🔥 [SECURITY MIDDLEWARE] Procesando request:", {
    url: url,
    shop: shop,
    method: method,
    userAgent: req.headers['user-agent']?.substring(0, 50),
    isWebhook: url.startsWith('/webhooks'),
    hasRawBody: !!req.rawBody
  });
  
  // Detectar si es un request HTML (páginas de la app)
  const isHtmlRequest = req.headers.accept && 
    (req.headers.accept.includes('text/html') || 
     req.headers.accept.includes('*/*'));
  
  // Solo aplicar CSP headers para requests HTML (NO para webhooks)
  if (isHtmlRequest && !url.startsWith('/webhooks')) {
    if (shop && shop.includes('.myshopify.com')) {
      const cspHeader = `frame-ancestors https://${shop} https://admin.shopify.com`;
      res.setHeader('Content-Security-Policy', cspHeader);
      console.log("🛡️ [CSP APLICADO]:", cspHeader);
    } else if (shop) {
      const shopDomain = shop.includes('.myshopify.com') ? shop : `${shop}.myshopify.com`;
      const cspHeader = `frame-ancestors https://${shopDomain} https://admin.shopify.com`;
      res.setHeader('Content-Security-Policy', cspHeader);
      console.log("🛡️ [CSP APLICADO - NORMALIZADO]:", cspHeader);
    } else {
      res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
      console.log("🛡️ [CSP APLICADO - NONE]");
    }
    
    // Headers adicionales de seguridad para HTML
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');
  } else {
    console.log("📡 [API REQUEST] No aplicando CSP headers");
  }
  
  // Headers globales para TODAS las respuestas
  res.setHeader('X-Powered-By', 'Essential-Shopify-App');
  res.setHeader('Server', 'Essential-Railway');
  
  next();
});

// 🔍 MIDDLEWARE DE DEBUGGING ESPECÍFICO PARA WEBHOOKS
app.use('/webhooks', (req, res, next) => {
  console.log('🔍 [WEBHOOK DEBUG]:', {
    url: req.url,
    method: req.method,
    headers: {
      'x-shopify-hmac-sha256': req.headers['x-shopify-hmac-sha256'],
      'x-shopify-topic': req.headers['x-shopify-topic'],
      'x-shopify-shop-domain': req.headers['x-shopify-shop-domain'],
      'content-type': req.headers['content-type']
    },
    hasRawBody: !!req.rawBody,
    rawBodyLength: req.rawBody?.length,
    secretConfigured: !!process.env.SHOPIFY_WEBHOOK_SECRET
  });
  next();
});

// 🚀 MIDDLEWARE PARA DEBUGGING HEADERS
app.use((req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;
  
  res.send = function(body) {
    console.log("📤 [RESPONSE HEADERS FINALES]:", {
      url: req.url,
      status: res.statusCode,
      headers: Object.fromEntries(Object.entries(res.getHeaders()))
    });
    return originalSend.call(this, body);
  };
  
  res.json = function(body) {
    console.log("📤 [RESPONSE JSON HEADERS]:", {
      url: req.url,
      status: res.statusCode,
      headers: Object.fromEntries(Object.entries(res.getHeaders()))
    });
    return originalJson.call(this, body);
  };
  
  next();
});

// Servir archivos estáticos del build
app.use(express.static(join(__dirname, "build/client"), {
  maxAge: "1y",
  setHeaders: (res, path) => {
    if (path.endsWith('.js') || path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// 🚀 REMIX REQUEST HANDLER PRINCIPAL
const remixHandler = createRequestHandler({
  build: await import("./build/server/index.js"),
  mode: process.env.NODE_ENV
});

// Aplicar el handler de Remix a todas las rutas no manejadas
app.all("*", (req, res, next) => {
  console.log("🎯 [REMIX HANDLER] Procesando:", {
    url: req.url,
    method: req.method,
    shop: req.query.shop,
    hasRawBody: !!req.rawBody
  });
  
  return remixHandler(req, res, next);
});

// 🔧 MANEJO DE ERRORES (DEBE SER EL ÚLTIMO)
app.use((err, req, res, next) => {
  console.error("❌ [SERVER ERROR]:", {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : '[HIDDEN]',
    url: req.url,
    method: req.method,
    isWebhook: req.url.startsWith('/webhooks')
  });
  
  if (!res.headersSent) {
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
      timestamp: new Date().toISOString()
    });
  }
});

// 🚀 INICIAR SERVIDOR
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

const server = app.listen(port, host, () => {
  console.log(`
🚀 ===================================================
   ESSENTIAL SHOPIFY APP - SERVIDOR LOCAL INICIADO
🚀 ===================================================

🌐 Servidor corriendo en: http://${host}:${port}
🛡️ Security Headers: ✅ CONFIGURADOS
🔧 Trust Proxy: ✅ HABILITADO
🔒 Raw Body Middleware: ✅ ACTIVO para webhooks
🚨 JSON Parsing: ✅ DESHABILITADO para webhooks
🌐 CORS: ✅ CONFIGURADO para backend local (localhost:8080)
📊 Environment: ${process.env.NODE_ENV || 'development'}
🎯 Framework: Remix + Express
💡 Status: ✅ LISTO PARA DESARROLLO

🔒 Webhook HMAC Fix aplicado:
   - Trust Proxy ✅
   - Raw Body Capture ✅
   - JSON Parsing Bypass ✅
   - Debug Logging ✅
   - Error Handling mejorado ✅

🌐 CORS Fix aplicado:
   - Backend local localhost:8080 ✅
   - Dominios permitidos ✅
   - Headers configurados ✅
   - Preflight handling ✅

🎉 Tu app puede conectarse al backend local NestJS!
🚀 ===================================================
  `);
});

// 🔄 GRACEFUL SHUTDOWN
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;