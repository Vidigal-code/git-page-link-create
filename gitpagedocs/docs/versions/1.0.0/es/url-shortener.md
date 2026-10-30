# Acortador reversible y QR

/shorturl-create codifica la URL reversiblemente. AT2 usa diccionario de prefijos, gzip y Base64URL; AT1/AT0 son formatos decimales antiguos. El decoder rechaza destinos ajenos a HTTP/HTTPS. /shorturl lee c/code, hash o ruta; el fallback 404 recupera rutas profundas. La navegación ocurre en el navegador, sin HTTP 302 de una API. Comprimir no siempre reduce la URL.

buildShortUrlCandidates también genera refcodes, elimina duplicados y ordena por longitud. Transporte por ruta limita códigos a 1500 caracteres; hay alternativa por hash. En instantRenderer un refcode de ruta local puede abrir directamente el renderizador. El resolvedor reconoce AT y refcodes.

Base64URL/gzip no cifran datos. No incluya credenciales ni información confidencial en enlaces. HTML, documentos y URLs externos son entrada no confiable; el aislamiento depende del renderizador. El codec limita el payload a 999.999 bytes; navegador, mensajería y hosting pueden imponer límites menores. Solicitudes remotas dependen de disponibilidad y CORS. La base de producción es /git-page-link-create.

## Código y navegación

- [src/features/shorturl/model/createCandidates.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/shorturl/model/createCandidates.ts)
- [src/features/shorturl/model/resolveTargetUrl.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/shorturl/model/resolveTargetUrl.ts)
- [src/shared/lib/shorturl/shorturl.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/shared/lib/shorturl/shorturl.ts)
- [src/pages/shorturl-create.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/shorturl-create.tsx)
- [src/pages/shorturl.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/shorturl.tsx)
- [src/pages/404.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/404.tsx)

- [Project guide](?menu=es&lang=es&id=9)
- [Source reference](?menu=es&lang=es&id=10)
