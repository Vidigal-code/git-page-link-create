# Gerador de páginas de vagas

/create-jobs carrega templates, seleciona o primeiro disponível e mantém formulário e preview no navegador. Campos incluem empresa/site, WhatsApp e e-mail do recrutador, título/descrição, fontes, modalidade de trabalho, contrato/jornada, salário/moeda, link de candidatura, capa e tags.

Ao gerar, buildJobTemplateHtml produz HTML a partir do template e dos dados; generateHtmlRenderAllLink compacta o resultado para abrir no renderizador. O usuário pode copiar o HTML ou compartilhar o link. O contato WhatsApp pertence a esse formulário; não é o funcionamento de /chat-link.

Falhas de carregamento do template e validação aparecem na própria página. Imagens e links externos continuam dependendo de sua origem. O projeto não mantém candidaturas, não publica vagas em plataformas de emprego e não oferece autenticação de recrutador. Confirme conteúdo, URLs e preview antes de compartilhar.

## Código e navegação

- [src/pages/create-jobs.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/create-jobs.tsx)
- [src/features/render-all/lib/generateHtmlRenderAllLink.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/render-all/lib/generateHtmlRenderAllLink.ts)

- [Project guide](?menu=pt&lang=pt&id=9)
- [Source reference](?menu=pt&lang=pt&id=10)
