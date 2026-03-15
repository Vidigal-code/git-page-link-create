# Configuracao

O `git-page-link-create` possui duas camadas de configuracao: runtime da aplicacao (`next.config.js`) e metadados de documentacao (`gitpagedocs/*.json`).

## Runtime da aplicacao (`next.config.js`)

- `output: "export"` habilita exportacao estatica
- `basePath` e `assetPrefix` usam `/git-page-link-create` em producao
- `trailingSlash: true` melhora compatibilidade com hosts estaticos
- `images.unoptimized: true` e obrigatorio para export estatico
- `NEXT_PUBLIC_BASE_PATH` e `NEXT_PUBLIC_SITE_URL` ficam disponiveis no cliente

## Variaveis importantes

- `NODE_ENV=production` ativa comportamento de base path de producao
- `NEXT_PUBLIC_SITE_URL` e usado para links canonicos e metadados
- Limites de URL sao aplicados no create/render por helpers em `src/shared/lib/theme.ts`

## Formato de links e marcadores

- Marcadores padrao: `#d=` e `?d=`
- Marcadores legados continuam compativeis: `#data=` e `?data=`
- Modo de compartilhamento:
  - `?z=1` redirecionamento silencioso
  - `?z=0` redirecionamento com interface

## Metadados de docs (`gitpagedocs/config.json`)

- `site`: opcoes do shell, idiomas, tema padrao, icones
- `VersionControl.versions`: versoes de docs disponiveis
- `translations`: textos de navegacao e pagina nao encontrada

## Config da versao (`gitpagedocs/docs/versions/1.0.0/config.json`)

- `routes`: mapeamento rota-arquivo por idioma (`en`, `pt`, `es`)
- `menus-header`: menu superior e submenus
- Cada rota aponta para um markdown em `gitpagedocs/docs/versions/1.0.0/<lang>/`
