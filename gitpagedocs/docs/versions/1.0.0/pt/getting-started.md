# Primeiros passos

Use este guia para rodar `git-page-link-create` localmente e validar o fluxo completo de links.

## Requisitos

- Node.js 20+
- npm 10+ (pnpm tambem funciona)

## Instalar e executar

1. Instale dependencias:
   - `npm install`
2. Inicie o servidor de desenvolvimento:
   - `npm run dev`
3. Abra:
   - `http://localhost:3000`

## Validacao em producao

1. Build:
   - `npm run build`
2. Servidor de producao:
   - `npm start`
3. Export estatico opcional:
   - `npm run export`

## Checklist inicial

- Gerar um link HTML ou Markdown em `/create`
- Abrir links gerados em `/r/` e `/ra/`
- Gerar e abrir um link hash de imagem ou PDF
- Gerar short URL em `/shorturl-create`
- Validar recuperacao com `/s/<code>`
- Criar e compartilhar um chat em `/chat-link/`

## Scripts disponiveis

- `npm run dev` - desenvolvimento local
- `npm run build` - build de producao
- `npm run export` - export estatico para hosts como GitHub Pages
- `npm run deploy` - build mais export
- `npm run lint` - lint
- `npm run type-check` - checagem TypeScript
