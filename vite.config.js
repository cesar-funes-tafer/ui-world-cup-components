import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
)
const buildVersion = packageJson.version

const buildTarget = process.env.BUILD_TARGET
if (buildTarget && buildTarget !== 'football-game' && buildTarget !== 'registry') {
  throw new Error('Invalid BUILD_TARGET. Use "football-game" or "registry".')
}
const buildEntry =
  buildTarget === 'registry' ? 'src/registry.js' : 'src/elements/football-game.js'
const buildEntryName = buildTarget === 'registry' ? 'registry' : 'football-game'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      vue: 'vue/dist/vue.esm-browser.prod.js'
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    lib: {
      entry: buildEntry,
      name: 'uiWebComponents',
      formats: ['es'],
      fileName: () => `ui-${buildEntryName}@${buildVersion}.js`
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
})
