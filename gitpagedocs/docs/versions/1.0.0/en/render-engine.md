# Content, files and rendering

/create transforms text/files into renderer payloads. The type contract lives in entities/content; compression uses UTF-8 bytes, gzip and Base64URL. /render and /render-all have /r and /ra aliases plus dedicated audio, video, image, PDF and Office pages.

Markdown uses Marked; CSV/spreadsheets use their parsers; Office separates payload/document modules. Representation depends on detected type and page options. Binary content must not be indiscriminately decoded as text.

Failures include malformed tokens, unknown types, invalid files, long URLs and CORS-blocked remote resources. Compressed content is not encrypted. Inspect each renderer's isolation behavior; Base64 does not imply universal sanitization.

## Code and navigation

- [src/pages/create.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/create.tsx)
- [src/entities/content/lib/contracts.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/entities/content/lib/contracts.ts)
- [src/shared/lib/compression.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/shared/lib/compression.ts)
- [src/pages/render/index.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/render/index.tsx)
- [src/pages/render-all/index.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/render-all/index.tsx)
- [src/features/render-office/lib/officeDocument.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/render-office/lib/officeDocument.ts)

- [Project guide](?menu=en&lang=en&id=9)
- [Source reference](?menu=en&lang=en&id=10)
