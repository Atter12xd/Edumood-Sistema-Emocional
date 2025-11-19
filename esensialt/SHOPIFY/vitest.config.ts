import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '~': resolve(__dirname, './app'),
    },
  },
  test: {
    // Evitar problemas al crear procesos/forks en algunos entornos Windows
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.shopify', 'build'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/*',
      ],
    },
  },
});



