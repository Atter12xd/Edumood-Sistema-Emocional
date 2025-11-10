// tests/example.test.ts
import { describe, it, expect } from 'vitest';

describe('Tests de Ejemplo - Día 1', () => {
  it('debe sumar dos números correctamente', () => {
    expect(1 + 1).toBe(2);
  });

  it('debe verificar que un string contenga texto', () => {
    const message = 'Essential WhatsApp Widget';
    expect(message).toContain('WhatsApp');
  });

  it('debe validar objetos', () => {
    const config = {
      backendUrl: 'https://essent-backen-production.up.railway.app',
      environment: 'production'
    };
    
    expect(config).toHaveProperty('backendUrl');
    expect(config.environment).toBe('production');
  });
});

describe('Validaciones de Configuración', () => {
  it('debe validar URL del backend', () => {
    const url = 'https://essent-backen-production.up.railway.app';
    expect(url).toMatch(/^https:\/\//);
  });

  it('debe validar que las API keys tengan formato correcto', () => {
    const apiKey = 'b79e2fb8bcb7a5671f55e60712f610c2';
    expect(apiKey).toHaveLength(32);
    expect(apiKey).toMatch(/^[a-f0-9]+$/);
  });
});



