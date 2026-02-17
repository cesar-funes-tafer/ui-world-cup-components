# ui-web-components

Repositorio para construir y publicar el Web Component `football-game` como bundle JS versionado.

## Tipo de proyecto

- Libreria de UI embebible (Custom Element)
- Stack: Vue 3 + Vite + Tailwind CSS
- Caso de uso: minijuego de penales para activaciones/campanas con promo code

## Estructura

- `src/components/football-game.ce.vue`: UI del widget
- `src/elements/football-game.js`: registro del tag (`customElements.define`)
- `src/registry.js`: entry global para registrar todos los componentes
- `src/composables/use-penalty-game.js`: estado y logica de gameplay
- `src/lib/promo-storage.js`: utilidades de cookies y promo codes
- `src/content/football-game.copy.json`: copy por locale (`en` / `es`)
- `src/assets/football-game/`: assets visuales del minijuego

## Assets del minijuego

Actualmente el componente consume estos archivos:

- `src/assets/football-game/ball.svg`
- `src/assets/football-game/goal.svg`
- `src/assets/football-game/keeper.svg`
- `src/assets/football-game/keeper-dive-left.svg`
- `src/assets/football-game/keeper-dive-right.svg`
- `src/assets/football-game/scoreboard.svg` (disponible para UI de marcador)

Si te pasan nuevos assets en otra carpeta (ej. `newassets/`), estandarizalos con estos nombres antes de integrarlos para evitar cambios extra en imports.

Mapeo sugerido desde `newassets/`:

- `balon copia.svg` -> `ball.svg`
- `porteria copia.svg` -> `goal.svg`
- `portero copia.svg` -> `keeper.svg`
- `marcador copia.svg` -> `scoreboard.svg`

## Scripts

- `npm run dev`: desarrollo local
- `npm run preview`: preview en `http://localhost:4173`
- `npm run build`: genera el bundle standalone de `football-game`
- `npm run build:game`: idem `build` (target `football-game`)
- `npm run build:registry`: genera bundle del registro global
- `npm run release:patch`: sube version patch y genera bundles versionados
- `npm run release:minor`: sube version minor y genera bundles versionados

## Outputs

- `dist/ui-football-game@<version>.js`
- `dist/ui-registry@<version>.js` (solo con `build:registry`)

`npm run build` deja un archivo de salida principal para integracion directa.

## Consumo en otro proyecto

### Opcion A: solo `football-game`

```html
<script src="https://cdn.example.com/ui-football-game@1.5.0.js"></script>
<football-game lang="es"></football-game>
```

### Opcion B: registro global

```html
<script src="https://cdn.example.com/ui-registry@1.5.0.js"></script>
<football-game></football-game>
```

## API publica del componente

### Props

- `lang="en|es"`
- `locale="en|es"` (fallback)
- `copy='{"es": {...}}'` (override opcional de textos)
- `promo-mode="none|cookie"` (default: `none`)
- `promo-cookie-name="mi_cookie"` (solo con `promo-mode="cookie"`)

Notas:

- Para modo adorno/rejugable usa `promo-mode="none"` (o no lo envies)
- En `promo-mode="cookie"`, el juego se bloquea despues de jugar y persiste resultado por cookie

### Custom events

- `game-start`: cuando inicia una ronda. Payload: `{ shotsRemaining }`
- `game-shot`: resultado de cada tiro. Payload: `{ position, keeperPosition, isGoal, goals, shotsRemaining }`
- `game-finish`: resultado final. Payload: `{ goals, promoCode }`
- `promo-copy`: exito/error al copiar codigo. Payload: `{ promoCode, copied }`

## Copy y locales

El copy base vive en `src/content/football-game.copy.json`.

- Locale default: `en`
- Locale soportados por defecto: `en`, `es`
- El prop `copy` permite override parcial por locale o plano

Ejemplo de override:

```html
<football-game
  lang="es"
  copy='{"es":{"shoot_cta":"Patear ahora"}}'
></football-game>
```

## Versionado recomendado

Usar SemVer en filename y no sobrescribir bundles:

- `ui-football-game@1.5.0.js`
- `ui-football-game@1.5.1.js`

Flujo sugerido para CDN:

1. Ejecutar `npm run release:patch` (o `npm run release:minor`)
2. Subir archivos nuevos en `dist/`
3. Actualizar URL del script en el host
4. Para rollback, volver al archivo version anterior
