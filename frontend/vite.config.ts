import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      host: true,
      open: false,
      port: 3000,
      watch: {
        usePolling: true,
      },
    },
    define: {
      'import.meta.env.DOMAIN': JSON.stringify(env.DOMAIN),
      'import.meta.env.OTLP_HOST': JSON.stringify(env.OTLP_HOST),
    },
  }
})
