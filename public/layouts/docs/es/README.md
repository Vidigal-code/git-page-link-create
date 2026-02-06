# Layouts y temas

Esta carpeta guarda el catálogo de temas y los archivos de plantilla usados por la app.

## Archivos

- `public/layouts/layoutsConfig.json` — catálogo de temas, valores por defecto y límites
- `public/layouts/templates/*.json` — definiciones de temas

## `layoutsConfig.json`

**Campos principales**

- `HideThemeSelector` (boolean) — oculta el selector de tema en el encabezado
- `MaxUrlLength` (number) — longitud máxima permitida para URLs generadas
- `LangDefault` (string) — idioma por defecto (ej.: `en`)
- `default` (string) — id del tema por defecto (debe existir en `layouts`)
- `layouts` (array) — lista de temas disponibles

**Campos de cada tema**

- `id` (string) — id único
- `name` (string) — nombre visible
- `author` (string)
- `file` (string) — ruta relativa a `public/layouts`
- `preview` (string) — descripción corta
- `supportsLightAndDarkModes` (boolean)
- `supportsLightAndDarkModesReference` (string, opcional) — vincula temas claros/oscuros
- `mode` (`"light"` | `"dark"`)

## Estructura del tema (templates)

Cada archivo en `public/layouts/templates/` sigue esta forma:

- **Metadatos**: `id`, `name`, `author`, `version`, `mode`, `supportsLightAndDarkModes`
- **colors**: `background`, `primary`, `secondary`, `text`, `textSecondary`, `cardBackground`, `cardBorder`, `error`, `success`
- **typography**: `fontFamily`, `fontSize` (`small`, `base`, `medium`, `large`, `xlarge`)
- **components**: `header`, `footer`, `card`, `button`, `select`, `checkbox`, `headerControls?`
- **animations**: `enableTypingEffect`, `enableGlow`, `transitionDuration`

## Añadir un tema

1. Crea un JSON en `public/layouts/templates/`.
2. Regístralo en `layoutsConfig.json` dentro de `layouts`.
3. Recarga la app y selecciona el tema.
