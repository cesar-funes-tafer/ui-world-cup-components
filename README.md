# ui-web-components

Repositorio para construir y publicar el Web Component `football-game` como bundle JS versionado.

## Tipo de proyecto

- Libreria de UI embebible (Custom Element)
- Stack: Vue 3 + Vite + Tailwind CSS
- Caso de uso: minijuego de penales para activaciones/campanas con promo code

## Estructura

- `src/components/football-game.ce.vue`: UI del widget
- `src/elements/football-game.js`: registro de tag (`customElements.define`)
- `src/registry.js`: entry global
- `src/composables/use-penalty-game.js`: logica de gameplay
- `src/composables/use-localized-copy.js`: i18n + copy override
- `src/lib/promo-storage.js`: utilidades de promo/cookies
- `src/content/football-game.copy.json`: textos por locale

## Scripts

- `npm run dev`: desarrollo local
- `npm run preview`: preview en `http://localhost:4173`
- `npm run build`: genera un solo JS standalone de `football-game` (plug-and-play)
- `npm run build:all`: genera `football-game` + `registry`
- `npm run build:game`: genera bundle standalone de `football-game`
- `npm run build:registry`: genera bundle del registro global
- `npm run release:patch`: sube version patch y genera bundles versionados
- `npm run release:minor`: sube version minor y genera bundles versionados

## Outputs

- `dist/ui-football-game@<version>.js`
- `dist/ui-registry@<version>.js` (solo con `build:all` o `build:registry`)

`npm run build` deja un solo archivo de salida principal para integracion directa.

## Consumo en otro proyecto

### Opcion A: solo `football-game`

```html
<script src="https://cdn.example.com/ui-football-game@1.0.0.js"></script>
<football-game lang="es" promo-cookie-name="promo_code_name"></football-game>
```

### Opcion B: registro global

```html
<script src="https://cdn.example.com/ui-registry@1.0.0.js"></script>
<football-game></football-game>
```

## API publica del componente

### Props

- `lang="en|es"`
- `locale="en|es"` (fallback)
- `copy='{"es": {...}}'` (override opcional)
- `promo-cookie-name="mi_cookie"`

Si no envias `promo-cookie-name`, el componente funciona sin cookies (modo adorno/rejugable).

### Custom events

- `game-start`: cuando inicia una ronda
- `game-shot`: resultado de cada tiro
- `game-finish`: resultado final con promo code
- `promo-copy`: exito/error al copiar el codigo

## Versionado recomendado

Usar SemVer en filename y no sobrescribir assets:

- `ui-football-game@1.0.0.js`
- `ui-football-game@1.0.1.js`

Flujo sugerido para CDN:

1. Ejecutar `npm run release:patch` (o `npm run release:minor`)
2. Subir archivos nuevos en `dist/`
3. Actualizar URL del script en el host
4. Para rollback, volver al archivo version anterior
