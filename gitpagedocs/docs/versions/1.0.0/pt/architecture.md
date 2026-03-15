# Arquitetura

A aplicacao e orientada por rotas e organizada em create, render, short URL e utilitarios compartilhados.

## Pastas principais

- `src/pages` - rotas Next.js (`create`, `render`, `shorturl`, `chat-link`, aliases)
- `src/shared/lib` - encoding, compressao, helpers de midia, short URL, i18n
- `src/shared/ui` - componentes reutilizaveis e cards por feature
- `src/shared/styles` - tema styled-components e estilos de paginas
- `public/layouts` - templates e catalogo de temas
- `public/locales` - traducoes (`en`, `pt`, `es`)

## Grupos de rotas

- Criacao:
  - `/create`, `/create-links`, `/create-jobs`, `/create-portfolio`
- Renderizacao:
  - `/render`, `/render-all`, `/r`, `/ra`
  - `/render/image`, `/render/pdf`, `/render/video`, `/render/audio`, `/render/office`
- Short URLs:
  - `/shorturl-create`, `/shorturl`, `/s/v`, `/s/<code>`
- Chat:
  - `/chat-link/`

## Fluxo de dados ponta a ponta

1. Usuario cola conteudo ou envia arquivo em `/create`
2. Conteudo e comprimido e marcado com codigo de tipo
3. App gera links hash/query para `/r`, `/ra` ou `/render/*`
4. Rota de destino decodifica payload e renderiza no visualizador correto
5. Short URL opcional encurta links longos para compartilhamento

## Confiabilidade em hosting estatico

- `404.tsx` recupera deep links e redireciona para rotas validas
- Aliases compactos reduzem tamanho de URL
- Ferramenta de recovery restaura payloads antigos
- Limites de tamanho evitam gerar links acima do seguro
