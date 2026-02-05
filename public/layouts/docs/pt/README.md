# Configuração de Layouts

Este diretório contém os arquivos de configuração e template para os temas e layouts da aplicação.

## Visão Geral

O sistema de temas permite que você personalize toda a aparência visual da aplicação através de arquivos de configuração JSON. Cada tema define cores, tipografia, estilos de componentes e animações.

## `layoutsConfig.json`

O arquivo `layoutsConfig.json` é a configuração central para os temas. Ele controla os temas disponíveis, configurações padrão e limites globais.

### Campos de Configuração

-   **`HideThemeSelector`** (boolean):
    -   Se `true`, o menu suspenso de seleção de tema no cabeçalho será ocultado.
    -   Os usuários não poderão trocar de tema manualmente.
    -   Útil se você deseja impor um único tema específico.
-   **`MaxUrlLength`** (number):
    -   Define o número máximo de caracteres permitidos para URLs geradas.
    -   Isso é usado para evitar erros com navegadores ou servidores que possuem limites de comprimento de URL.
-   **`default`** (string):
    -   O `id` do tema que será carregado por padrão para novos usuários.
-   **`layouts`** (array):
    -   Uma lista de objetos de tema definindo os temas disponíveis na aplicação.

### Estrutura do Objeto de Tema

Cada objeto no array `layouts` representa um tema e possui as seguintes propriedades:

-   **`id`** (string): Identificador único para o tema.
-   **`name`** (string): O nome de exibição do tema mostrado no seletor.
-   **`author`** (string): O nome do criador do tema.
-   **`file`** (string): Caminho para o arquivo JSON de estilo do tema (relativo a `public/layouts`). Exemplo: `templates/matrix-dark.json`.
-   **`preview`** (string): Uma breve descrição do tema.
-   **`supportsLightAndDarkModes`** (boolean):
    -   Defina como `true` se este tema tiver uma versão clara ou escura correspondente.
    -   Habilita o botão de alternância sol/lua no cabeçalho.
-   **`supportsLightAndDarkModesReference`** (string):
    -   Uma string de referência usada para vincular temas claros e escuros.
    -   Exemplo: Se você tiver um tema escuro com ID `matrix-dark` e um tema claro `matrix-light`, ambos devem compartilhar uma base de referência comum aqui (ex: `matrix-1-dark` e `matrix-1-light`). O sistema os combina removendo o sufixo `-dark` ou `-light`.
-   **`mode`** (string):
    -   Define se este é um tema `"light"` (claro) ou `"dark"` (escuro).

## Estrutura do Arquivo de Tema

Cada arquivo JSON de tema (ex: `templates/default.json`) contém as seguintes seções:

### Metadados

-   **`id`**: Identificador único do tema (deve corresponder ao ID em `layoutsConfig.json`)
-   **`name`**: Nome de exibição
-   **`author`**: Nome do criador
-   **`version`**: Versão do tema
-   **`mode`**: `"light"` ou `"dark"`
-   **`supportsLightAndDarkModes`**: Boolean indicando se existem temas pareados

### Cores

Define a paleta de cores para toda a aplicação:

-   **`background`**: Cor de fundo principal
-   **`primary`**: Cor de destaque primária (usada para links, botões, destaques)
-   **`secondary`**: Cor de destaque secundária
-   **`text`**: Cor do texto principal
-   **`textSecondary`**: Cor do texto secundário/esmaecido
-   **`cardBackground`**: Cor de fundo para cards e containers
-   **`cardBorder`**: Cor da borda para cards e containers
-   **`error`**: Cor para estados e mensagens de erro
-   **`success`**: Cor para estados e mensagens de sucesso

### Tipografia

Define as configurações de fonte:

-   **`fontFamily`**: Pilha de famílias de fonte CSS
-   **`fontSize`**: Objeto contendo cinco tamanhos predefinidos:
    -   **`small`**: Texto pequeno (ex: `0.875rem`)
    -   **`base`**: Texto base/corpo (ex: `1rem`)
    -   **`medium`**: Texto médio (ex: `1.125rem`)
    -   **`large`**: Texto grande (ex: `1.25rem`)
    -   **`xlarge`**: Texto extra grande para títulos (ex: `2rem`)

### Componentes

Define o estilo para componentes individuais da interface:

#### `header`
-   **`height`**: Altura do cabeçalho (ex: `"80px"`)
-   **`backgroundColor`**: Cor de fundo do cabeçalho
-   **`borderBottom`**: Estilo da borda inferior

#### `footer`
-   **`height`**: Altura do rodapé (ex: `"60px"`)
-   **`backgroundColor`**: Cor de fundo do rodapé
-   **`borderTop`**: Estilo da borda superior

#### `card`
-   **`borderRadius`**: Arredondamento dos cantos (ex: `"8px"`)
-   **`padding`**: Espaçamento interno (ex: `"24px"`)
-   **`boxShadow`**: Efeito de sombra

#### `button`
-   **`borderRadius`**: Arredondamento dos cantos
-   **`padding`**: Espaçamento interno (ex: `"12px 24px"`)
-   **`border`**: Estilo da borda
-   **`hoverGlow`**: Efeito de brilho ao passar o mouse (ou `"none"`)

#### `select`
-   **`borderRadius`**: Arredondamento dos cantos
-   **`padding`**: Espaçamento interno (ex: `"10px 40px 10px 16px"`)
-   **`border`**: Estilo da borda
-   **`backgroundColor`**: Cor de fundo
-   **`textAlign`**: Alinhamento do texto (`"center"`, `"left"`, etc.)
-   **`iconColor`**: Cor do ícone dropdown
-   **`hoverBorderColor`**: Cor da borda ao passar o mouse
-   **`focusBorderColor`**: Cor da borda quando focado
-   **`focusGlow`**: Efeito de brilho quando focado

#### `checkbox`
-   **`width`**: Largura do checkbox (ex: `"20px"`)
-   **`height`**: Altura do checkbox (ex: `"20px"`)
-   **`accentColor`**: Cor do estado marcado
-   **`borderColor`**: Cor da borda
-   **`hoverBorderColor`**: Cor da borda ao passar o mouse
-   **`checkMarkColor`**: Cor da marca de seleção
-   **`borderRadius`**: Arredondamento dos cantos

#### `headerControls` (Sistema de Padronização)

Este é um **novo sistema de padronização** que garante que todos os controles do cabeçalho (botão Início, botão Criar, seletor de Idioma, seletor de Tema e alternador de Modo) tenham dimensões e estilos consistentes.

**`common`** - Propriedades compartilhadas aplicadas a todos os controles do cabeçalho:
-   **`height`**: Altura uniforme para todos os controles (ex: `"42px"`)
-   **`padding`**: Espaçamento interno (ex: `"0 16px"`)
-   **`borderRadius`**: Arredondamento dos cantos (ex: `"8px"`)
-   **`border`**: Estilo da borda (ex: `"1px solid #e1e1e1"`)
-   **`backgroundColor`**: Cor de fundo
-   **`fontSize`**: Tamanho da fonte (ex: `"0.9rem"`)
-   **`fontWeight`**: Peso da fonte (ex: `"600"`)
-   **`hoverBorderColor`**: Cor da borda ao passar o mouse
-   **`focusBorderColor`**: Cor da borda quando focado

**Substituições Específicas** - Configurações individuais de largura para cada controle:
-   **`homeButton.width`**: Largura do botão Início (ex: `"80px"`)
-   **`createButton.width`**: Largura do botão Criar (ex: `"80px"`)
-   **`languageSelect.width`**: Largura do seletor de Idioma (ex: `"130px"`)
-   **`themeSelect.width`**: Largura do seletor de Tema (ex: `"150px"`)
-   **`modeToggle.width`**: Largura do alternador Claro/Escuro (ex: `"42px"`)

Este sistema garante que todos os elementos do cabeçalho tenham uma aparência unificada e profissional, permitindo controle refinado sobre larguras individuais.

### Animações

Controla efeitos de animação e transição:

-   **`enableTypingEffect`** (boolean): Habilita efeito de animação de digitação no texto
-   **`enableGlow`** (boolean): Habilita efeitos de brilho nos estados hover e focus
-   **`transitionDuration`**: Velocidade das transições CSS (ex: `"0.2s"`)

## Como Criar um Novo Layout

1.  **Crie o Arquivo de Tema**:
    -   Crie um novo arquivo JSON em `public/layouts/templates/` (ex: `meu-tema.json`).
    -   Copie um tema existente como `default.json` como base.
    -   Personalize as cores, tipografia, componentes e animações.

2.  **Registre o Tema**:
    -   Abra `public/layouts/layoutsConfig.json`.
    -   Adicione um novo objeto ao array `layouts` com os detalhes do seu tema.

3.  **Teste**:
    -   Atualize a aplicação para ver seu novo tema no seletor (a menos que `HideThemeSelector` seja true).
    -   Teste todas as páginas e componentes para garantir o estilo adequado.

## Exemplo de Estrutura de Tema

```json
{
    "id": "meu-tema",
    "name": "Meu Tema Personalizado",
    "author": "Seu Nome",
    "version": "1.0.0",
    "mode": "light",
    "supportsLightAndDarkModes": false,
    "colors": {
        "background": "#ffffff",
        "primary": "#0070f3",
        "secondary": "#7928ca",
        "text": "#000000",
        "textSecondary": "#666666",
        "cardBackground": "#f9f9f9",
        "cardBorder": "#e1e1e1",
        "error": "#e00",
        "success": "#0070f3"
    },
    "typography": {
        "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        "fontSize": {
            "small": "0.875rem",
            "base": "1rem",
            "medium": "1.125rem",
            "large": "1.25rem",
            "xlarge": "2rem"
        }
    },
    "components": {
        "headerControls": {
            "common": {
                "height": "42px",
                "padding": "0 16px",
                "borderRadius": "8px",
                "border": "1px solid #e1e1e1",
                "backgroundColor": "#f9f9f9",
                "fontSize": "0.9rem",
                "fontWeight": "600",
                "hoverBorderColor": "#0070f3",
                "focusBorderColor": "#0070f3"
            },
            "homeButton": { "width": "80px" },
            "createButton": { "width": "80px" },
            "languageSelect": { "width": "130px" },
            "themeSelect": { "width": "150px" },
            "modeToggle": { "width": "42px" }
        }
    },
    "animations": {
        "enableTypingEffect": false,
        "enableGlow": false,
        "transitionDuration": "0.2s"
    }
}
```
