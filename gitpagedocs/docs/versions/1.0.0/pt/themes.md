# Temas e layouts

A configuracao de tema e baseada em JSON e carregada em runtime.

## Arquivos de tema

- `public/layouts/layoutsConfig.json` - catalogo principal
- `public/layouts/layoutsFallbackConfig.json` - catalogo de fallback
- `public/layouts/templates/*.json` - templates tokenizados
- `gitpagedocs/layouts/*` - equivalentes usados pela documentacao versionada

## Estrutura dos templates

Cada template normalmente define:

- Metadados: `id`, `name`, `author`, `version`
- Relacao dark/light
- Tokens visuais: cores, espacamento, borda, tipografia
- Tokens de componentes: botao, card, input, header/surface
- Flags opcionais de animacao

## Comportamento em runtime

- Tema selecionado pelo usuario e carregado do catalogo
- Alternancia light/dark resolve pares quando disponiveis
- Tokens sao convertidos para o tema do styled-components
- Preferencias ficam persistidas entre sessoes

## Fluxo recomendado

1. Duplique um template existente em `public/layouts/templates/`
2. Ajuste os valores mantendo as mesmas chaves
3. Registre o novo template em `layoutsConfig.json`
4. Valide contraste e legibilidade nas paginas principais
