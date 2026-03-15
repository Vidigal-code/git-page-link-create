# Publicacao

`git-page-link-create` e publicado como export estatico, otimizado para GitHub Pages e outros hosts estaticos.

## Execucao local em producao

1. `npm run build`
2. `npm start`

Use para validar rotas e renderizacao de producao antes do export.

## Fluxo de export estatico

1. `npm run build`
2. `npm run export`
3. Publique a pasta `out/`

Como `output: "export"` esta habilitado, nao e necessario backend em producao.

## Observacoes para GitHub Pages

- Base path de producao: `/git-page-link-create`
- `assetPrefix` usa o mesmo base path
- `trailingSlash: true` ajuda na resolucao das rotas
- `404.tsx` recupera deep links como `/s/<code>`, `/r/<payload>` e `/ra/<payload>`

## Checklist de hospedagem

- Garantir que o host sirva exatamente o conteudo de `out/`
- Manter fallback de rota para `404.html`
- Validar abertura de links com hash sem rewrites do servidor
- Confirmar redirecionamento correto dos caminhos curtos
