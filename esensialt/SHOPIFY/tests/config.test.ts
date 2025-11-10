// tests/config.test.ts
import { describe, it, expect } from 'vitest';
import {
  BACKEND_CONFIG,
  CULQI_CONFIG,
  APP_CONFIG,
  getBackendUrl,
  calculateCulqiFee,
} from '../app/config/app.config';

describe('Configuración Centralizada - Backend', () => {
  it('debe tener la URL del backend configurada', () => {
    expect(BACKEND_CONFIG.baseUrl).toBeDefined();
    expect(BACKEND_CONFIG.baseUrl).toContain('https://');
  });

  it('debe tener todos los endpoints de WhatsApp', () => {
    expect(BACKEND_CONFIG.endpoints.whatsapp).toHaveProperty('crear');
    expect(BACKEND_CONFIG.endpoints.whatsapp).toHaveProperty('obtener');
    expect(BACKEND_CONFIG.endpoints.whatsapp).toHaveProperty('actualizar');
    expect(BACKEND_CONFIG.endpoints.whatsapp).toHaveProperty('eliminar');
  });

  it('debe tener endpoints de COD Forms', () => {
    expect(BACKEND_CONFIG.endpoints.codForms).toHaveProperty('create');
    expect(BACKEND_CONFIG.endpoints.codForms).toHaveProperty('get');
    
    // Test función get con userId
    const endpoint = BACKEND_CONFIG.endpoints.codForms.get('user123');
    expect(endpoint).toBe('/cod-forms?idusuarios=user123');
  });

  it('debe tener timeout configurado', () => {
    expect(BACKEND_CONFIG.timeout).toBe(30000);
  });
});

describe('Configuración Culqi - Pasarela de Pagos', () => {
  it('debe tener las API keys configuradas', () => {
    expect(CULQI_CONFIG.publicKey).toBeDefined();
    expect(CULQI_CONFIG.secretKey).toBeDefined();
    
    // Verificar que tienen el formato correcto
    expect(CULQI_CONFIG.publicKey).toMatch(/^pk_/);
    expect(CULQI_CONFIG.secretKey).toMatch(/^sk_/);
  });

  it('debe estar en modo test por defecto', () => {
    expect(CULQI_CONFIG.environment).toBe('test');
  });

  it('debe tener moneda PEN (Perú)', () => {
    expect(CULQI_CONFIG.currency).toBe('PEN');
  });

  it('debe tener comisiones configuradas correctamente', () => {
    expect(CULQI_CONFIG.fees.card.percentage).toBe(3.5);
    expect(CULQI_CONFIG.fees.card.fixed).toBe(0.30);
    
    expect(CULQI_CONFIG.fees.yape.percentage).toBe(2.5);
    expect(CULQI_CONFIG.fees.pagoEfectivo.percentage).toBe(3.0);
  });
});

describe('Helper Functions', () => {
  it('debe construir URL completa del backend', () => {
    const url = getBackendUrl('/whatsapp/crear');
    expect(url).toBe('https://essent-backen-production.up.railway.app/whatsapp/crear');
  });

  it('debe calcular comisión de tarjeta correctamente', () => {
    const { fee, net } = calculateCulqiFee(100, 'card');
    
    // 100 * 3.5% + 0.30 = 3.80
    expect(fee).toBe(3.80);
    expect(net).toBe(96.20);
  });

  it('debe calcular comisión de Yape correctamente', () => {
    const { fee, net } = calculateCulqiFee(100, 'yape');
    
    // 100 * 2.5% + 0.30 = 2.80
    expect(fee).toBe(2.80);
    expect(net).toBe(97.20);
  });

  it('debe calcular comisión de PagoEfectivo correctamente', () => {
    const { fee, net } = calculateCulqiFee(100, 'pagoEfectivo');
    
    // 100 * 3.0% + 0.50 = 3.50
    expect(fee).toBe(3.50);
    expect(net).toBe(96.50);
  });
});

describe('Configuración de la Aplicación', () => {
  it('debe tener nombre y versión', () => {
    expect(APP_CONFIG.name).toBe('Essential WhatsApp Widget');
    expect(APP_CONFIG.version).toBeDefined();
  });

  it('debe detectar ambiente de desarrollo', () => {
    // Este test puede fallar en producción, lo cual es correcto
    expect(APP_CONFIG.environment).toBeDefined();
    expect(['development', 'production', 'test']).toContain(APP_CONFIG.environment);
  });

  it('debe tener configuración de logging', () => {
    expect(APP_CONFIG.logging.level).toBeDefined();
    expect(['debug', 'info', 'warn', 'error']).toContain(APP_CONFIG.logging.level);
  });
});



