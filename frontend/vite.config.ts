import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { ENVIROMENT_MODE } from '../backend/src/config/constants'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const base = mode === ENVIROMENT_MODE.PRODUCTION ? '/tips-hub/' : '/'  
  
  return {
    base,
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false
    }
  }
})
