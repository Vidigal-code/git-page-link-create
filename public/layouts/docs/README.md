# Layouts & Themes

This folder stores the theme catalog and template files used by the app.

## Files

- `public/layouts/layoutsConfig.json` — theme catalog, defaults, and limits
- `public/layouts/templates/*.json` — theme definitions

## `layoutsConfig.json`

**Top-level fields**

- `HideThemeSelector` (boolean) — hide the theme selector in the header
- `MaxUrlLength` (number) — maximum allowed URL length for generated links
- `LangDefault` (string) — default language code (e.g., `en`)
- `default` (string) — default theme id (must exist in `layouts`)
- `layouts` (array) — list of available themes

**Theme item fields**

- `id` (string) — unique theme id
- `name` (string) — display name
- `author` (string)
- `file` (string) — path relative to `public/layouts`
- `preview` (string) — short description
- `supportsLightAndDarkModes` (boolean)
- `supportsLightAndDarkModesReference` (string, optional) — links paired themes
- `mode` (`"light"` | `"dark"`)

## Theme template structure

Each file in `public/layouts/templates/` follows this shape:

- **Metadata**: `id`, `name`, `author`, `version`, `mode`, `supportsLightAndDarkModes`
- **colors**: `background`, `primary`, `secondary`, `text`, `textSecondary`, `cardBackground`, `cardBorder`, `error`, `success`
- **typography**: `fontFamily`, `fontSize` (`small`, `base`, `medium`, `large`, `xlarge`)
- **components**: `header`, `footer`, `card`, `button`, `select`, `checkbox`, `headerControls?`
- **animations**: `enableTypingEffect`, `enableGlow`, `transitionDuration`

## Add a new theme

1. Create a JSON file in `public/layouts/templates/`.
2. Add it to `layoutsConfig.json` under `layouts`.
3. Refresh the app and select the new theme.
