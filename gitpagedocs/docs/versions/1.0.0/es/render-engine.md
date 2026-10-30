# Contenido, archivos y renderizado

/create transforma texto/archivos en payloads. El contrato de tipos está en entities/content; compresión usa bytes UTF-8, gzip y Base64URL. /render y /render-all tienen alias /r y /ra, más páginas audio/vídeo/imagen/PDF/Office.

Markdown usa Marked; CSV/hojas sus parsers; Office separa payload/documento. Representación depende del tipo/opciones. No decodifique binarios indiscriminadamente como texto.

Fallos: tokens malformados, tipos desconocidos, archivos inválidos, URLs largas y CORS. Compresión no cifra. Revise aislamiento por renderizador; Base64 no implica sanitización universal.

## Código y navegación

- [src/pages/create.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/create.tsx)
- [src/entities/content/lib/contracts.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/entities/content/lib/contracts.ts)
- [src/shared/lib/compression.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/shared/lib/compression.ts)
- [src/pages/render/index.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/render/index.tsx)
- [src/pages/render-all/index.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/render-all/index.tsx)
- [src/features/render-office/lib/officeDocument.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/render-office/lib/officeDocument.ts)

- [Project guide](?menu=es&lang=es&id=9)
- [Source reference](?menu=es&lang=es&id=10)
