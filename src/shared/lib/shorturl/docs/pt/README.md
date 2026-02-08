# `src/shared/lib/shorturl` (somente frontend, encurtamento reversível de URL)

Esta pasta implementa encurtamento de URL **100% no frontend** e **totalmente reversível** para um app Next.js estático (funciona com `next export` + GitHub Pages).

Existem **duas camadas**:

- **Tokens `AT*`**: codificam qualquer URL http(s) em um token reversível (sem backend/banco).
- **RefCodes (`xx-...`)**: códigos ainda menores para prefixos comuns/repetidos (rotas internas do app + sites externos populares).

O app escolhe o **menor link resultante** entre os candidatos.

---

### API pública

O app importa de:

- `index.ts`
  - `encodeShortUrlToken(originalUrl, options?)`
  - `decodeShortUrlToken(token)`
  - `encodeRefCode(url)`
  - `decodeRefCode(code)`

---

## `shorturl.ts` — tokens AT (genérico, dicionário + compressão)

### Exports

- **`encodeShortUrlToken(originalUrl: string, options?: ShortUrlCodecOptions): string`**
- **`decodeShortUrlToken(token: string): string`**
- **`buildSiteShortUrl(prettySiteOrigin: string, token: string, basePath = ''): string`**
- **`ShortUrlCodecOptions`**

### Formatos de token

Todos os tokens começam com `AT`.

- **Legado (bem longo)**:
  - `AT0` / `AT1`
  - Formato: `AT` + versão + tamanho (6 dígitos) + string decimal
  - Payload: bytes UTF-8 (opcionalmente gzip) convertidos para base-10 via `base10.ts`

- **Compacto (padrão, menor)**:
  - `AT2`
  - Formato: `AT` + `2` + payload em Base64URL
  - Payload: `gzip([dictId][remainderBytes...])`
    - `dictId` tem 1 byte (0 = sem prefixo do dicionário)
    - `remainderBytes` é UTF-8 do “resto” da URL
  - Codifica bytes gzip em Base64URL (sem `+`, `/` ou `=`)

### Segurança / exatidão

- A decodificação valida se o resultado é uma URL **http(s)** (`assertHttpUrl`) e lança erro caso não seja.
- Existe um limite de tamanho (`MAX_PAYLOAD_LENGTH = 999_999`).

### Quando usar

- Use **`mode: 'compact'`** (padrão) em todos os links novos.
- Mantenha o decode do legado porque links antigos podem existir.

---

## `dictionary.ts` — dicionário de prefixos para AT2

### Objetivo

O dicionário remove prefixos repetidos para reduzir o token.

- A codificação escolhe o **maior prefixo que combina**
- Guarda o **id numérico** (`1..255`) no payload
- Só codifica o **resto**

### Exports

- **`SHORTURL_DICTIONARY`**
- **`findBestDictionaryMatch(url)`** → `{ id, remainder }`
- **`getDictionaryPrefixById(id)`**

### Regras de estabilidade (importante)

- Os `id`s ficam embutidos em tokens já gerados.
- **Nunca reordene ou altere** as primeiras entradas “legadas”.
- Apenas **adicione no final** (append).

Observação: `BASE_PATH` é usado para gerar prefixos compatíveis com GitHub Pages.

---

## `refcodes.ts` — RefCodes (`xx-...`) para encurtar ao máximo

### Ideia

RefCodes podem ser menores que AT tokens **quando** a URL combina com um prefixo conhecido.

Exemplos:

- `https://www.youtube.com/watch?v=...` → `y-...`
- URLs internas do renderizador do app → `h-...`, `r-...`, etc.

### Exports

- **`SHORTURL_REF_CODES`**: tabela estável `{ code, prefix, note? }`
- **`encodeRefCode(url): string | null`**
  - Retorna `null` se nenhum prefixo combinar.
  - Usa **match de maior prefixo**.
  - Usa aliases de encoding para aceitar formas equivalentes (ver abaixo).
- **`decodeRefCode(code): DecodedRefCode | null`**
  - Retorna:
    - `{ kind: 'absolute', url }` (prefixos externos), ou
    - `{ kind: 'path', path }` (prefixos internos)

### Canonicalização & aliases

A codificação precisa reconhecer várias formas equivalentes, então também:

- Canonicaliza separadores (ex.: `/render/#d=` → `/render#d=`).
- Aceita múltiplos prefixos via **aliases**:
  - `#data=` e `#d=`
  - `?data=` e `?d=`
  - `/render` e `/r`
  - `/render-all` e `/ra`
  - nomes completos (`html-`) e códigos de 1 char (`h-`)

Na decodificação, cada `code` reconstrói usando o prefixo canônico definido na tabela.

### GitHub Pages + `trailingSlash: true`

Ao decodificar um path interno, `decodeRefCode` garante uma **barra final antes de `?` ou `#`** para evitar redirects do host estático que podem dropar fragmentos (e causar loop/404).

### Regras de estabilidade (importante)

- **Códigos devem ser únicos e estáveis** após publicados.
- Prefira códigos curtos e minúsculos (`[a-z0-9]{1,3}`) — o decoder normaliza para minúsculo.
- Adicione novas entradas sem mudar o significado das existentes.

---

## `bytesPayload.ts` — bytes tipados compactos (`b-...`)

Empacota bytes (com 1 byte de type id) em Base64URL curto:

- **`encodeTypedBytesPayload(typeId, bytes)`** → `b-<base64url>`
- **`decodeTypedBytesPayload(payload)`** → `{ typeId, bytes } | null`

Usado para encurtar payloads grandes do tipo `data:mime/type;base64,...` removendo “boilerplate” repetido de MIME.

---

## `typeCodes.ts` — códigos de tipo com 1 caractere

Para encurtar prefixos de payload do renderizador (ex.: `html-...` → `h-...`):

- **`encodePlatformType(value)`**: tipo → código de 1 char quando disponível
- **`decodePlatformType(value)`**: código de 1 char → tipo completo

Regra: **não altere** mapeamentos existentes após links serem compartilhados.

---

## `base10.ts` — conversão legada digits-only (sem `BigInt`)

Conversões reversíveis usadas nos tokens AT legados:

- **`bytesToDecimalString(bytes)`**
- **`decimalStringToBytes(decimal, expectedLength?)`**

Usa “limbs” em base \(10^7\) para compatibilidade no browser (sem depender de `BigInt`).

---

### Como estender (checklist seguro)

- **Adicionar novos RefCodes**:
  - Adicione `{ code, prefix }` em `SHORTURL_REF_CODES`
  - Garanta `code` único e estável
  - Prefira colocar prefixos mais específicos/impactantes antes (maior prefixo vence)

- **Adicionar itens no dicionário**:
  - Apenas **append** em `RAW_PREFIXES`
  - Nunca reordene/remova os itens legados do começo

- **Adicionar novos type codes**:
  - Só adicione novos tipos/códigos e nunca altere os existentes


