# Layouts e temas

Esta pasta guarda o catálogo de temas e os arquivos de template usados pela aplicação.

## Arquivos

- `public/layouts/layoutsConfig.json` — catálogo de temas, padrões e limites
- `public/layouts/templates/*.json` — definições de tema

## `layoutsConfig.json`

**Campos principais**

- `HideThemeSelector` (boolean) — oculta o seletor de tema no cabeçalho
- `MaxUrlLength` (number) — tamanho máximo permitido para URLs geradas
- `LangDefault` (string) — idioma padrão (ex.: `en`)
- `default` (string) — id do tema padrão (deve existir em `layouts`)
- `layouts` (array) — lista de temas disponíveis

**Campos de cada tema**

- `id` (string) — id único
- `name` (string) — nome de exibição
- `author` (string)
- `file` (string) — caminho relativo a `public/layouts`
- `preview` (string) — descrição curta
- `supportsLightAndDarkModes` (boolean)
- `supportsLightAndDarkModesReference` (string, opcional) — vincula temas claros/escuros
- `mode` (`"light"` | `"dark"`)

## Estrutura do tema (templates)

Cada arquivo em `public/layouts/templates/` segue esta forma:

- **Metadados**: `id`, `name`, `author`, `version`, `mode`, `supportsLightAndDarkModes`
- **colors**: `background`, `primary`, `secondary`, `text`, `textSecondary`, `cardBackground`, `cardBorder`, `error`, `success`
- **typography**: `fontFamily`, `fontSize` (`small`, `base`, `medium`, `large`, `xlarge`)
- **components**: `header`, `footer`, `card`, `button`, `select`, `checkbox`, `headerControls?`
- **animations**: `enableTypingEffect`, `enableGlow`, `transitionDuration`

## Adicionar um tema

1. Crie um JSON em `public/layouts/templates/`.
2. Registre-o em `layoutsConfig.json` dentro de `layouts`.
3. Recarregue a app e selecione o tema.
