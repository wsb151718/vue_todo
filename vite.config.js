import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { playwright } from '@vitest/browser-playwright'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.output/**', '**/coverage/**'],
    include: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
    environment: 'happy-dom',
    projects: [
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['test/components/**/*.{test,spec}.{ts,tsx,js,jsx}'],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
