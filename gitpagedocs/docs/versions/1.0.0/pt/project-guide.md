# git-page-link-create: Contexto e fluxos do projeto

GitPageDocs **0.0.21** · 1.0.0 · 2026-11-08

## Contexto

Aplicação estática para criar e compartilhar conteúdo em URLs: HTML, Markdown, tabelas, mídia, vagas, portfólios, páginas de links e conversas compartilhadas por link. Os dados podem viajar compactados no próprio link. Não existe API de persistência, conta autenticada ou banco de slugs neste repositório.

## Stack e arquitetura

Next.js 15 com Pages Router, React 19, TypeScript 5.7 e styled-components 6. O build usa output: export e gera out/. Pako comprime, Marked interpreta Markdown, PapaParse/XLSX leem tabelas, Mammoth interpreta DOCX, JSZip trabalha com arquivos compactados e qrcode gera códigos. src/pages contém entradas; features, entities, widgets e shared separam interface e utilitários.

```mermaid
flowchart LR
  Input[Content or file] --> Encode[gzip and Base64URL]
  Encode --> Link[Shareable URL or QR]
  Link --> Decode[Browser decoder]
  Decode --> Render[Viewer]
  Decode --> Navigate[HTTP or HTTPS destination]
```

## Fluxos completos

1. /create recebe conteúdo ou arquivo → valida o formato → converte para texto ou bytes → gzip e Base64URL → URL de renderização. /render, /render-all, /r e /ra recuperam o payload; rotas de imagem, áudio, vídeo, PDF e Office escolhem a visualização apropriada. Consulte as páginas e utilitários vinculados para os parâmetros específicos de cada formato.

2. /shorturl-create codifica a URL reversivelmente. O token AT2 usa dicionário de prefixos, gzip e Base64URL; AT1/AT0 são formatos decimais legados. O decoder rejeita destinos fora de HTTP/HTTPS. /shorturl lê c/code, hash ou caminho; o fallback 404 recupera caminhos profundos no hosting estático. A navegação ocorre no navegador, sem resposta HTTP 302 de uma API. Compressão não garante URL menor em todos os casos.

3. /create-jobs, /create-portfolio e /create-links coletam dados e geram HTML com link compartilhável. /chat-link mantém uma conversa local (transcript) serializada em payload v:1/messages e compactada no hash #d=chat-; novas mensagens exigem compartilhar o novo snapshot. Não há servidor de chat nem integração WhatsApp nessa página. QR Code apenas representa a URL.

4. buildShortUrlCandidates também gera refcodes, elimina links repetidos e ordena pelo comprimento. Transporte por caminho é limitado a códigos de até 1500 caracteres; há alternativa por hash. No modo instantRenderer, um refcode que representa caminho local pode abrir diretamente o renderizador. O resolvedor reconhece tokens AT e refcodes.

## Dados, segurança e limites

Base64URL/gzip não criptografam dados. Não coloque credenciais ou informação confidencial em links. HTML, documentos e URLs de terceiros são entrada não confiável; o comportamento de isolamento depende do renderizador e deve ser revisado antes de aceitar conteúdo sensível. O limite de payload do codec é 999.999 bytes; navegador, mensageiro e hospedagem podem impor limites menores à URL. Requisições remotas dependem de disponibilidade e CORS. O caminho de produção é /git-page-link-create.

## Execução, testes e operação

Instale com pnpm usando pnpm-lock.yaml; use dev para desenvolvimento e build para exportação. Rode test, lint e type-check separadamente: next.config.js permite erros de lint/tipos durante o build. Os scripts export/deploy ainda usam next export, removido no Next.js 14; use build, que já respeita output: export. Verifique Unicode, payload inválido, links profundos, arquivos grandes e renderização sem rede. A atualização desta documentação não altera o workflow deploy.yml, não publica o app e não publica o GitPageDocs.

## Referência completa

Dependências, comandos, endpoints, variáveis, contratos e testes estão na [referência do código](?menu=pt&lang=pt&id=10).

## Fontes verificáveis

- [next.config.js](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/next.config.js)

- [src/shared/lib/compression.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/shared/lib/compression.ts)

- [src/shared/lib/shorturl/shorturl.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/shared/lib/shorturl/shorturl.ts)

- [src/pages/404.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/404.tsx)

- [src/pages/create.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/create.tsx)

- [src/pages/render/index.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/render/index.tsx)

- [src/pages/shorturl.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/shorturl.tsx)

- [.github/workflows/deploy.yml](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/.github/workflows/deploy.yml)

- [src/features/shorturl/model/createCandidates.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/shorturl/model/createCandidates.ts)

- [Next.js static export](https://nextjs.org/docs/app/guides/static-exports)

## Navegação da documentação com GitPageDocs 0.0.21

As opções desta seção requerem o runtime GitPageDocs **0.0.21**. A versão documental deste projeto continua **1.0.0**. Atualizar o texto e a configuração não atualiza, por si só, o runtime publicado pelo workflow.

### Índice por tags

Em `gitpagedocs/docs/versions/1.0.0/config.json`, cada item de `routes-md` usa `RouteguideBrand: true` e `RouteGuideTags: ["h1", "h2", "h3"]`. O índice mantém os três primeiros níveis de títulos; os demais títulos continuam no documento. A grafia das propriedades diferencia maiúsculas e minúsculas.

```json
{ "RouteguideBrand": true, "RouteGuideTags": ["h1", "h2", "h3"] }
```

Omitir `RouteGuideTags` preserva o comportamento legado, com `h1` até `h6`. Uma lista vazia (`[]`) remove as entradas automáticas por tag; marcadores explícitos configurados em `markdownMarkers.items` ainda podem compor o índice.

Para incluir outros elementos, acrescente nomes de tags permitidas pelo sanitizador, por exemplo `"p"`, `"blockquote"`, `"pre"`, `"table"`, `"img"`, `"details"` ou `"summary"`. Não existe curinga: `"*"`, tags perigosas e entradas inválidas são ignorados com diagnóstico. Incluir `p`, `li`, `div` ou `span` pode gerar muitas entradas; prefira somente as tags úteis para a leitura.

Os rótulos usam título, texto alternativo ou texto do elemento. Elementos vazios como `br`, `hr`, `img` e `input` podem usar o nome da tag. IDs automáticos são estáveis, únicos e separados por bloco. Use `markdownMarkers.items` quando precisar escolher uma ocorrência, definir rótulo próprio ou aplicar um destaque específico.

### Rolagem, telas pequenas e dobráveis

Com a rolagem do índice desbloqueada, o item ativo é centralizado, inclusive ao navegar por Anterior/Próximo. O cadeado preserva a posição escolhida manualmente no índice. Isso permite consultar outra parte do índice sem que o acompanhamento automático reposicione a lista.

Ao validar em celular, confira o menu recolhido, alvos de toque, foco por teclado, tabelas e blocos de código com rolagem horizontal. Em dispositivos dobráveis, repita a navegação com a tela dobrada e aberta, nas duas orientações, e confirme que o item ativo permanece acessível após a mudança de largura. Use o controle de pausa quando houver efeitos animados e respeite a preferência de movimento reduzido.

O GitPageDocs 0.0.21 usa `performance.mode: "auto"` nos efeitos dos temas: reduz moderadamente a densidade no desktop e usa um orçamento menor abaixo de 768px, mantendo as camadas do tema. Partículas ocultas ficam pausadas e retomam a mesma fase ao mudar a largura. Para manter a densidade completa, mescle `site.backgroundEffects.overrides.performance: { "mode": "full" }` em `gitpagedocs/config.json`; a mesma opção pode ser definida em `site.backgroundEffects.themes[themeId].performance`. Um override explícito de `layers` mantém a contagem completa quando não há mode definido nos overrides. Use `"auto"` explicitamente para aplicar o orçamento também às camadas personalizadas.
