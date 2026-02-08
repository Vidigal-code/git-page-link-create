# `src/shared/lib/shorturl` (solo frontend, acortamiento reversible de URL)

Esta carpeta implementa un acortamiento de URL **100% en el frontend** y **totalmente reversible** para una app Next.js estática (funciona con `next export` + GitHub Pages).

Hay **dos capas**:

- **Tokens `AT*`**: codifican cualquier URL http(s) en un token reversible (sin backend/base de datos).
- **RefCodes (`xx-...`)**: códigos aún más cortos para prefijos comunes/repetidos (rutas internas de la app + sitios externos populares).

La app elige el **enlace más corto** entre los candidatos.

---

### API pública

La app importa desde:

- `index.ts`
  - `encodeShortUrlToken(originalUrl, options?)`
  - `decodeShortUrlToken(token)`
  - `encodeRefCode(url)`
  - `decodeRefCode(code)`

---

## `shorturl.ts` — tokens AT (genérico, diccionario + compresión)

### Exports

- **`encodeShortUrlToken(originalUrl: string, options?: ShortUrlCodecOptions): string`**
- **`decodeShortUrlToken(token: string): string`**
- **`buildSiteShortUrl(prettySiteOrigin: string, token: string, basePath = ''): string`**
- **`ShortUrlCodecOptions`**

### Formatos de token

Todos los tokens comienzan con `AT`.

- **Legacy (muy largo)**:
  - `AT0` / `AT1`
  - Formato: `AT` + versión + longitud (6 dígitos) + string decimal
  - Payload: bytes UTF-8 (opcionalmente gzip) convertidos a base-10 vía `base10.ts`

- **Compacto (por defecto, más corto)**:
  - `AT2`
  - Formato: `AT` + `2` + payload en Base64URL
  - Payload: `gzip([dictId][remainderBytes...])`
    - `dictId` ocupa 1 byte (0 = sin prefijo del diccionario)
    - `remainderBytes` es UTF-8 del “resto” de la URL
  - Codifica bytes gzip en Base64URL (sin `+`, `/` ni `=`)

### Seguridad / exactitud

- La decodificación valida que el resultado sea una URL **http(s)** (`assertHttpUrl`) y lanza error si no lo es.
- Hay un límite de tamaño (`MAX_PAYLOAD_LENGTH = 999_999`).

### Cuándo usarlo

- Usa **`mode: 'compact'`** (por defecto) en enlaces nuevos.
- Mantén el decode legacy porque pueden existir enlaces antiguos.

---

## `dictionary.ts` — diccionario de prefijos para AT2

### Propósito

El diccionario elimina prefijos repetidos para reducir el token.

- La codificación elige el **prefijo más largo que coincide**
- Guarda su **id numérico** (`1..255`) en el payload
- Solo codifica el **resto**

### Exports

- **`SHORTURL_DICTIONARY`**
- **`findBestDictionaryMatch(url)`** → `{ id, remainder }`
- **`getDictionaryPrefixById(id)`**

### Reglas de estabilidad (importante)

- Los `id`s quedan embebidos en tokens ya generados.
- **Nunca reordenes ni cambies** las primeras entradas “legacy”.
- Solo **añade al final** (append).

Nota: `BASE_PATH` se usa para generar prefijos compatibles con GitHub Pages.

---

## `refcodes.ts` — RefCodes (`xx-...`) para acortar al máximo

### Idea

Los RefCodes pueden ser más cortos que los tokens AT **cuando** la URL coincide con un prefijo conocido.

Ejemplos:

- `https://www.youtube.com/watch?v=...` → `y-...`
- URLs internas del renderizador de la app → `h-...`, `r-...`, etc.

### Exports

- **`SHORTURL_REF_CODES`**: tabla estable `{ code, prefix, note? }`
- **`encodeRefCode(url): string | null`**
  - Devuelve `null` si no hay coincidencia.
  - Usa **match del prefijo más largo**.
  - Usa aliases de encoding para aceptar formas equivalentes (ver abajo).
- **`decodeRefCode(code): DecodedRefCode | null`**
  - Devuelve:
    - `{ kind: 'absolute', url }` (prefijos externos), o
    - `{ kind: 'path', path }` (prefijos internos)

### Canonicalización & aliases

La codificación debe reconocer muchas formas equivalentes, por eso también:

- Canonicaliza separadores (ej.: `/render/#d=` → `/render#d=`).
- Acepta múltiples prefijos mediante **aliases**:
  - `#data=` y `#d=`
  - `?data=` y `?d=`
  - `/render` y `/r`
  - `/render-all` y `/ra`
  - nombres completos (`html-`) y códigos de 1 char (`h-`)

En la decodificación, cada `code` reconstruye usando el prefijo canónico definido en la tabla.

### GitHub Pages + `trailingSlash: true`

Al decodificar un path interno, `decodeRefCode` asegura una **barra final antes de `?` o `#`** para evitar redirects del hosting estático que pueden perder el fragmento (y causar bucles/404).

### Reglas de estabilidad (importante)

- **Los códigos deben ser únicos y estables** una vez publicados.
- Prefiere códigos cortos y en minúsculas (`[a-z0-9]{1,3}`) — el decoder normaliza a minúsculas.
- Añade nuevas entradas sin cambiar el significado de las existentes.

---

## `bytesPayload.ts` — bytes tipados compactos (`b-...`)

Empaqueta bytes (con 1 byte de type id) en un Base64URL corto:

- **`encodeTypedBytesPayload(typeId, bytes)`** → `b-<base64url>`
- **`decodeTypedBytesPayload(payload)`** → `{ typeId, bytes } | null`

Se usa para acortar payloads grandes `data:mime/type;base64,...` eliminando el “boilerplate” repetido de MIME.

---

## `typeCodes.ts` — códigos de tipo de 1 carácter

Para acortar prefijos de payload del renderizador (ej.: `html-...` → `h-...`):

- **`encodePlatformType(value)`**: tipo → código de 1 char cuando exista
- **`decodePlatformType(value)`**: código de 1 char → tipo completo

Regla: **no cambies** mappings existentes una vez compartidos los enlaces.

---

## `base10.ts` — conversión legacy solo dígitos (sin `BigInt`)

Conversiones reversibles usadas por tokens AT legacy:

- **`bytesToDecimalString(bytes)`**
- **`decimalStringToBytes(decimal, expectedLength?)`**

Usa “limbs” en base \(10^7\) para compatibilidad en el navegador (sin depender de `BigInt`).

---

### Cómo extender (checklist seguro)

- **Añadir nuevos RefCodes**:
  - Añade `{ code, prefix }` en `SHORTURL_REF_CODES`
  - Mantén `code` único y estable
  - Prefiere prefijos más específicos/impactantes al principio (gana el prefijo más largo)

- **Añadir entradas al diccionario**:
  - Solo **append** en `RAW_PREFIXES`
  - Nunca reordenes/eliminar los ítems legacy del inicio

- **Añadir nuevos type codes**:
  - Solo añade nuevos tipos/códigos y no cambies los existentes


