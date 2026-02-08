# `src/shared/lib/shorturl` (frontend-only, reversible URL shortening)

This folder implements **frontend-only**, **fully reversible** URL “shortening” for a static Next.js app (works with `next export` + GitHub Pages).

There are **two layers**:

- **`AT*` tokens**: encode any http(s) URL into a reversible token (no backend/database).
- **RefCodes (`xx-...`)**: extra-short codes for common, repeated URL prefixes (internal app routes + popular external sites).

The app chooses the **shortest resulting link** between candidates.

---

### Public API

The app imports from:

- `index.ts`
  - `encodeShortUrlToken(originalUrl, options?)`
  - `decodeShortUrlToken(token)`
  - `encodeRefCode(url)`
  - `decodeRefCode(code)`

---

## `shorturl.ts` — AT tokens (generic, dictionary + compression)

### Exports

- **`encodeShortUrlToken(originalUrl: string, options?: ShortUrlCodecOptions): string`**
- **`decodeShortUrlToken(token: string): string`**
- **`buildSiteShortUrl(prettySiteOrigin: string, token: string, basePath = ''): string`**
- **`ShortUrlCodecOptions`**

### Token formats

All tokens start with `AT`.

- **Legacy (very long)**:
  - `AT0` / `AT1`
  - Format: `AT` + version + length(6 digits) + decimal-string
  - Payload: UTF-8 bytes (optionally gzip) converted to a base-10 string via `base10.ts`

- **Compact (default, shortest)**:
  - `AT2`
  - Format: `AT` + `2` + Base64URL payload
  - Payload: `gzip([dictId][remainderBytes...])`
    - `dictId` is 1 byte (0 = no dictionary prefix)
    - `remainderBytes` is UTF-8 of the URL remainder
  - Encodes gzip bytes using Base64URL (no `+`, `/`, or `=`)

### Safety / correctness

- Decoding validates the result is a valid **http(s)** URL (`assertHttpUrl`) and throws otherwise.
- There’s a payload size guard (`MAX_PAYLOAD_LENGTH = 999_999`).

### When to use

- Use **`mode: 'compact'`** (default) for all new links.
- Keep legacy decoding because old links may exist.

---

## `dictionary.ts` — prefix dictionary for AT2

### Purpose

The dictionary removes repeated URL prefixes to shrink tokens further.

- Encoding picks the **longest matching prefix**
- Stores its **numeric id** (`1..255`) into the payload
- Only encodes the **remainder**

### Exports

- **`SHORTURL_DICTIONARY`**
- **`findBestDictionaryMatch(url)`** → `{ id, remainder }`
- **`getDictionaryPrefixById(id)`**

### Stability rules (important)

- `id` values are embedded in previously generated tokens.
- **Never reorder or change** the first “legacy” entries.
- Only **append** new entries at the end.

Also note `BASE_PATH` is used to generate basePath-aware prefixes for GitHub Pages.

---

## `refcodes.ts` — RefCodes (`xx-...`) for maximum shrinking

### Idea

RefCodes are even shorter than AT tokens **when a URL matches a known prefix**.

Example:

- `https://www.youtube.com/watch?v=...` → `y-...`
- Internal renderer URLs (this app) → `h-...`, `r-...`, etc.

### Exports

- **`SHORTURL_REF_CODES`**: stable table `{ code, prefix, note? }`
- **`encodeRefCode(url): string | null`**
  - Returns `null` if no prefix matches.
  - Uses **longest-prefix match**.
  - Uses extra alias prefixes to match multiple equivalent forms (see below).
- **`decodeRefCode(code): DecodedRefCode | null`**
  - Returns either:
    - `{ kind: 'absolute', url }` (external prefixes), or
    - `{ kind: 'path', path }` (internal prefixes)

### Canonicalization & aliases

Encoding must match many equivalent URL shapes, so it also:

- Canonicalizes separators (e.g. `/render/#d=` → `/render#d=`).
- Accepts multiple prefixes via **encoding aliases**:
  - `#data=` and `#d=`
  - `?data=` and `?d=`
  - `/render` and `/r`
  - `/render-all` and `/ra`
  - full type names (`html-`) and 1-char type codes (`h-`)

Decoding always reconstructs using the canonical prefix for a given code.

### GitHub Pages + `trailingSlash: true` note

When decoding an internal path, `decodeRefCode` ensures a **trailing slash before `?` or `#`** to avoid static-host redirects that can drop fragments (and cause loops/404s).

### Stability rules (important)

- **Codes must be unique and stable** once published.
- Prefer short, lowercase codes (`[a-z0-9]{1,3}`) — decoder normalizes to lowercase.
- Add new entries without changing existing meanings.

---

## `bytesPayload.ts` — compact typed bytes (`b-...`)

This helper packs raw bytes (plus a 1-byte type id) into a short Base64URL string:

- **`encodeTypedBytesPayload(typeId, bytes)`** → `b-<base64url>`
- **`decodeTypedBytesPayload(payload)`** → `{ typeId, bytes } | null`

Used to shrink large `data:mime/type;base64,...` payloads by removing repetitive MIME boilerplate from the URL.

---

## `typeCodes.ts` — 1-char content type codes

To shorten renderer payload prefixes (e.g. `html-...` → `h-...`):

- **`encodePlatformType(value)`**: type → 1-char code when available
- **`decodePlatformType(value)`**: 1-char code → full type

Stability rule: **do not change** existing mappings once links are shared.

---

## `base10.ts` — legacy digits-only bigint conversion (no `BigInt`)

Implements reversible conversions used by legacy AT tokens:

- **`bytesToDecimalString(bytes)`**
- **`decimalStringToBytes(decimal, expectedLength?)`**

Uses base \(10^7\) “limbs” for browser compatibility (no reliance on `BigInt`).

---

### Extending the system (safe checklist)

- **Add new RefCodes**:
  - Append a new `{ code, prefix }` to `SHORTURL_REF_CODES`
  - Keep `code` unique and stable
  - Prefer placing higher-impact / more-specific prefixes earlier (longest match wins)

- **Add dictionary entries**:
  - Only **append** to `RAW_PREFIXES`
  - Never reorder/remove the first legacy items

- **Add new type codes**:
  - Only append new types/codes and never change existing mappings


