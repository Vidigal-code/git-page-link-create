# Conteúdo, arquivos e renderização

/create transforma entrada textual ou arquivos em payloads reconhecidos pelos renderizadores. O contrato de tipos fica em entities/content; compressão trabalha com bytes UTF-8, gzip e Base64URL. /render e /render-all têm atalhos /r e /ra, além das páginas específicas de áudio, vídeo, imagem, PDF e Office.

Markdown passa pelo parser Marked; CSV/planilhas usam os parsers correspondentes; Office tem módulos separados para payload/documento. A representação apropriada depende do tipo detectado e das opções da página. Conteúdo binário não deve passar por decodificação textual indiscriminada.

Falhas possíveis: token malformado, tipo não reconhecido, arquivo inválido, URL longa e recurso remoto bloqueado por CORS. Conteúdo compactado não é criptografado. Para analisar isolamento de HTML e outros formatos, consulte o renderizador específico; não assuma sanitização universal por usar Base64.

## Código e navegação

- [src/pages/create.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/create.tsx)
- [src/entities/content/lib/contracts.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/entities/content/lib/contracts.ts)
- [src/shared/lib/compression.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/shared/lib/compression.ts)
- [src/pages/render/index.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/render/index.tsx)
- [src/pages/render-all/index.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/render-all/index.tsx)
- [src/features/render-office/lib/officeDocument.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/render-office/lib/officeDocument.ts)

- [Project guide](?menu=pt&lang=pt&id=9)
- [Source reference](?menu=pt&lang=pt&id=10)
