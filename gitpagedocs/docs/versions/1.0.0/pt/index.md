# git-page-link-create v1.0.0

`git-page-link-create` e uma aplicacao Next.js estatica para criar e abrir links compartilhaveis com conteudo codificado na hash/query da URL, sem backend.

## O que esta versao documenta

- Criacao e renderizacao de links para HTML, Markdown, CSV/XLS, imagem, PDF, video, audio e Office
- Fluxo de short URL frontend-only (`/shorturl-create`, `/shorturl`, `/s/<code>`)
- Aliases compactos (`/r/` e `/ra/`) com marcadores `#d=` e `?d=`
- Chat por URL (`/chat-link/`)
- Comportamento de tema, i18n e hospedagem estatica (incluindo GitHub Pages)

## Rotas principais

- `/` - pagina inicial com recursos e cards de links registrados
- `/create` - toolbox completa (conteudo, midia, office, recovery, QR)
- `/render/*` - renderizadores especificos (`image`, `pdf`, `video`, `audio`, `office`)
- `/render-all` - renderer generico em tela completa
- `/shorturl-create` e `/shorturl` - geracao e decodificacao de short link
- `/s/<code>` - caminho mais curto para recuperacao em hosting estatico
- `/chat-link/` - conversa armazenada na hash

## Mapa da documentacao

- **Primeiros passos**: instalar, rodar e validar localmente
- **Configuracao**: Next.js, variaveis, base path e metadados de docs
- **Publicacao**: fluxo de export estatico e GitHub Pages
- **Arquitetura**: modulos, rotas e pipeline de dados
- **Temas e layouts**: templates e tokens visuais
- **FAQ**: problemas comuns e correcoes
