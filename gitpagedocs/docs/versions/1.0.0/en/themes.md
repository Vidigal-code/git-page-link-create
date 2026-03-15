# Themes and Layouts

Theme configuration is JSON-driven and loaded at runtime.

## Theme files

- `public/layouts/layoutsConfig.json` - primary catalog
- `public/layouts/layoutsFallbackConfig.json` - fallback catalog
- `public/layouts/templates/*.json` - tokenized theme templates
- `gitpagedocs/layouts/*` - docs-site equivalents for versioned docs rendering

## Template structure

Each template usually defines:

- Metadata: `id`, `name`, `author`, `version`
- Mode pairing: dark/light relationship
- Design tokens: colors, spacing, radius, typography
- Component tokens: button, card, input, header/surface styles
- Optional animation flags

## Runtime behavior

- User-selected theme is loaded from the catalog
- Light/dark switch resolves paired templates when available
- Tokens are mapped into styled-components theme objects
- Persisted preferences are reused across sessions

## Recommended workflow

1. Duplicate an existing template from `public/layouts/templates/`
2. Adjust token values while keeping key names stable
3. Register new template in `layoutsConfig.json`
4. Validate contrast and readability on all main pages
