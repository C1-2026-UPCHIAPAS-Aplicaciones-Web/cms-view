import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@dashboard': fileURLToPath(new URL('./src/dashboard', import.meta.url)),
      '@editor': fileURLToPath(new URL('./src/editor', import.meta.url)),
    },
  },
});
