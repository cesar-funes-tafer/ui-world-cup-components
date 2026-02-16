import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
)
const buildVersion = packageJson.version

const allEntries = {
  registry: 'src/registry.js',
  'football-game': 'src/elements/football-game.js'
}

const buildTarget = process.env.BUILD_TARGET
if (buildTarget && !allEntries[buildTarget]) {
  throw new Error(
    `Invalid BUILD_TARGET "${buildTarget}". Use one of: ${Object.keys(allEntries).join(', ')}`
  )
}

const selectedEntries = buildTarget
  ? { [buildTarget]: allEntries[buildTarget] }
  : allEntries

const isSingleEntryBuild = Object.keys(selectedEntries).length === 1

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
      entry: selectedEntries,
      name: 'uiWebComponents',
      formats: ['es'],
      fileName: (_, entryName) => `ui-${entryName}@${buildVersion}.js`
    },
    rollupOptions: isSingleEntryBuild
      ? {
          output: {
            inlineDynamicImports: true
          }
        }
      : undefined
  }
})
