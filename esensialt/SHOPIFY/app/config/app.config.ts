// app/config/app.config.ts
// Configuración centralizada de la aplicación Essential WhatsApp Widget

/**
 * Configuración del Backend Railway
 */
export const BACKEND_CONFIG = {
  baseUrl: process.env.BACKEND_URL || 'https://essent-backen-production.up.railway.app',
  
  endpoints: {
    whatsapp: {
      base: '/whatsapp',
      crear: '/whatsapp/crear',
      obtener: '/whatsapp/obtener',
      siguiente: '/whatsapp/siguiente',
      eliminar: '/whatsapp/eliminar',
      actualizar: '/whatsapp/actualizar',
    },
    codForms: {
      base: '/cod-forms',
      get: (userId: string) => `/cod-forms?idusuarios=${userId}`,
      create: '/cod-forms',
      update: (formId: string) => `/cod-forms/${formId}`,
      delete: (formId: string) => `/cod-forms/${formId}`,
    },
  },
  
  timeout: 30000, // 30 segundos
} as const;

/**
 * Configuración de CORS
 */
export const CORS_CONFIG = {
  allowedOrigins: [
    'https://essent-backen-production.up.railway.app',
    'https://*.myshopify.com',
    'https://*.shopifyapps.com',
    'http://localhost:*',
    'https://localhost:*',
  ],
  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  
  headers: [
    'Content-Type',
    'Authorization',
    'X-Shopify-Shop-Domain',
    'X-Shopify-Access-Token',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  
  credentials: true,
} as const;

/**
 * Configuración de Shopify
 */
export const SHOPIFY_CONFIG = {
  apiKey: process.env.SHOPIFY_API_KEY || '',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
  scopes: process.env.SCOPES || 'read_products,write_products',
  appUrl: process.env.SHOPIFY_APP_URL || '',
  isEmbedded: true,
} as const;

/**
 * Configuración de Culqi (Pasarela de Pagos)
 */
export const CULQI_CONFIG = {
  publicKey: process.env.CULQI_PUBLIC_KEY || 'pk_test_dkeS17NBw8B1srCt',
  secretKey: process.env.CULQI_SECRET_KEY || 'sk_test_367uAvKKpKk9ChQs',
  environment: process.env.CULQI_ENV || 'test', // 'test' | 'production'
  
  apiUrl: {
    test: 'https://api.culqi.com',
    production: 'https://api.culqi.com',
  },
  
  currency: 'PEN', // Soles peruanos
  
  // Comisiones
  fees: {
    card: { percentage: 3.5, fixed: 0.30 }, // 3.5% + S/. 0.30
    yape: { percentage: 2.5, fixed: 0.30 }, // 2.5% + S/. 0.30
    pagoEfectivo: { percentage: 3.0, fixed: 0.50 }, // 3.0% + S/. 0.50
  },
} as const;

/**
 * Configuración de Base de Datos (Prisma)
 */
export const DATABASE_CONFIG = {
  provider: 'postgresql',
  url: process.env.DATABASE_URL || '',
  maxConnections: 10,
  timeout: 30000,
} as const;

/**
 * Configuración de la Aplicación
 */
export const APP_CONFIG = {
  name: 'Essential WhatsApp Widget',
  version: '2.0.0',
  environment: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  logging: {
    level: process.env.LOG_LEVEL || 'info', // 'debug' | 'info' | 'warn' | 'error'
    enableConsole: process.env.NODE_ENV !== 'production',
    enableFile: process.env.NODE_ENV === 'production',
  },
} as const;

/**
 * Validación de configuración requerida
 */
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validar variables críticas
  if (!process.env.SHOPIFY_API_KEY) {
    errors.push('SHOPIFY_API_KEY no está definida');
  }
  
  if (!process.env.SHOPIFY_API_SECRET) {
    errors.push('SHOPIFY_API_SECRET no está definida');
  }
  
  if (!process.env.DATABASE_URL && APP_CONFIG.isProduction) {
    errors.push('DATABASE_URL no está definida en producción');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Obtener URL completa del backend
 */
export function getBackendUrl(endpoint: string): string {
  return `${BACKEND_CONFIG.baseUrl}${endpoint}`;
}

/**
 * Calcular comisión de Culqi
 */
export function calculateCulqiFee(
  amount: number,
  method: 'card' | 'yape' | 'pagoEfectivo'
): { fee: number; net: number } {
  const { percentage, fixed } = CULQI_CONFIG.fees[method];
  const fee = (amount * percentage / 100) + fixed;
  const net = amount - fee;
  
  return { fee: parseFloat(fee.toFixed(2)), net: parseFloat(net.toFixed(2)) };
}

// Exportar todo como default también
export default {
  BACKEND_CONFIG,
  CORS_CONFIG,
  SHOPIFY_CONFIG,
  CULQI_CONFIG,
  DATABASE_CONFIG,
  APP_CONFIG,
  validateConfig,
  getBackendUrl,
  calculateCulqiFee,
};



