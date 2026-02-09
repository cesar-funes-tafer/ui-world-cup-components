import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'uiWebComponents',
      fileName: () => 'ui-web-components.js'
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
})
