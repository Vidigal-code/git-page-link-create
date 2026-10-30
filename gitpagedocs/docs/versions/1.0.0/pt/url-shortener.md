# Encurtador reversível e QR Code

/shorturl-create codifica a URL reversivelmente. O token AT2 usa dicionário de prefixos, gzip e Base64URL; AT1/AT0 são formatos decimais legados. O decoder rejeita destinos fora de HTTP/HTTPS. /shorturl lê c/code, hash ou caminho; o fallback 404 recupera caminhos profundos no hosting estático. A navegação ocorre no navegador, sem resposta HTTP 302 de uma API. Compressão não garante URL menor em todos os casos.

buildShortUrlCandidates também gera refcodes, elimina links repetidos e ordena pelo comprimento. Transporte por caminho é limitado a códigos de até 1500 caracteres; há alternativa por hash. No modo instantRenderer, um refcode que representa caminho local pode abrir diretamente o renderizador. O resolvedor reconhece tokens AT e refcodes.

Base64URL/gzip não criptografam dados. Não coloque credenciais ou informação confidencial em links. HTML, documentos e URLs de terceiros são entrada não confiável; o comportamento de isolamento depende do renderizador e deve ser revisado antes de aceitar conteúdo sensível. O limite de payload do codec é 999.999 bytes; navegador, mensageiro e hospedagem podem impor limites menores à URL. Requisições remotas dependem de disponibilidade e CORS. O caminho de produção é /git-page-link-create.

## Código e navegação

- [src/features/shorturl/model/createCandidates.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/shorturl/model/createCandidates.ts)
- [src/features/shorturl/model/resolveTargetUrl.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/shorturl/model/resolveTargetUrl.ts)
- [src/shared/lib/shorturl/shorturl.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/shared/lib/shorturl/shorturl.ts)
- [src/pages/shorturl-create.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/shorturl-create.tsx)
- [src/pages/shorturl.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/shorturl.tsx)
- [src/pages/404.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/404.tsx)

- [Project guide](?menu=pt&lang=pt&id=9)
- [Source reference](?menu=pt&lang=pt&id=10)
