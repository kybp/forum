import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig((env) => {
  return mergeConfig(viteConfig(env), {
    test: {
      environment: 'jsdom',
      exclude: configDefaults.exclude,
      mockReset: true,
      root: fileURLToPath(new URL('./', import.meta.url)),
    }
  })
})
