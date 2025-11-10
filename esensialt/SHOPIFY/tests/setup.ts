// tests/setup.ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup después de cada test
afterEach(() => {
  cleanup();
});

// Configuración global para tests
globalThis.IS_REACT_ACT_ENVIRONMENT = true;



