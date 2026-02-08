import pako from 'pako';
import { bytesToDecimalString, decimalStringToBytes } from '@/shared/lib/shorturl/base10';
import { base64ToUint8Array, normalizeUrlSafeBase64, uint8ArrayToBase64 } from '@/shared/lib/base64';
import { findBestDictionaryMatch, getDictionaryPrefixById } from '@/shared/lib/shorturl/dictionary';

export type ShortUrlCodecOptions = {
    /**
     * If true (default), gzip is applied before encoding to reduce payload size.
     * Decoding always expects the same mode encoded in the token version.
     */
    gzip?: boolean;
    /**
     * Encoding mode:
     * - `compact` (default): shortest possible (Base64URL + gzip + dictionary)
     * - `digits`: legacy digits-only token (very long)
     */
    mode?: 'compact' | 'digits';
};

const TOKEN_PREFIX = 'AT';
const VERSION_GZIP_UTF8_DECIMAL = '1';
const VERSION_GZIP_UTF8_B64URL_DICT = '2';

// 6 digits => supports up to 999,999 bytes in the gzip payload
const LENGTH_DIGITS = 6;
const MAX_PAYLOAD_LENGTH = 999_999;

function assertHttpUrl(value: string): void {
    let parsed: URL;
    try {
        parsed = new URL(value);
    } catch {
        throw new Error('Decoded value is not a valid URL');
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('Decoded URL protocol is not allowed');
    }
}

function padFixedWidthDecimal(value: number, width: number): string {
    if (!Number.isFinite(value) || value < 0) throw new Error('Invalid length');
    const s = String(Math.trunc(value));
    if (s.length > width) throw new Error('Length overflow');
    return s.padStart(width, '0');
}

function toBase64Url(base64: string): string {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64url: string): string {
    return normalizeUrlSafeBase64(b64url);
}

/**
 * Encodes a full URL into a digits-only token (prefixed with `AT`) that is reversible
 * purely on the frontend (no database).
 *
 * Token format:
 * - `AT` + version(1 digit) + length(6 digits) + decimal(bigint-as-string)
 *
 * The decimal portion is a reversible encoding of the (optionally gzipped) UTF-8 bytes.
 */
export function encodeShortUrlToken(originalUrl: string, options: ShortUrlCodecOptions = {}): string {
    const gzip = options.gzip ?? true;
    if (!originalUrl) throw new Error('URL is required');

    const mode = options.mode ?? 'compact';

    // Keep exact string fidelity (including `#...`) using UTF-8 bytes.
    if (mode === 'compact') {
        const match = findBestDictionaryMatch(originalUrl);
        const remainderBytes = new TextEncoder().encode(match.remainder);
        const structured = new Uint8Array(1 + remainderBytes.length);
        structured[0] = match.id;
        structured.set(remainderBytes, 1);

        const payloadBytes = gzip ? pako.gzip(structured) : structured;
        if (payloadBytes.length > MAX_PAYLOAD_LENGTH) {
            throw new Error(`URL too large to encode (payloadBytes=${payloadBytes.length})`);
        }

        const b64 = uint8ArrayToBase64(payloadBytes);
        const b64url = toBase64Url(b64);
        const version = gzip ? VERSION_GZIP_UTF8_B64URL_DICT : '3';
        // Version 3 reserved for non-gzip b64url+dict; not used for now
        return `${TOKEN_PREFIX}${version}${b64url}`;
    }

    // Legacy digits-only mode
    const utf8 = new TextEncoder().encode(originalUrl);
    const payloadBytes = gzip ? pako.gzip(utf8) : utf8;
    if (payloadBytes.length > MAX_PAYLOAD_LENGTH) {
        throw new Error(`URL too large to encode (payloadBytes=${payloadBytes.length})`);
    }

    const len = padFixedWidthDecimal(payloadBytes.length, LENGTH_DIGITS);
    const dec = bytesToDecimalString(payloadBytes);
    const version = gzip ? VERSION_GZIP_UTF8_DECIMAL : '0';
    return `${TOKEN_PREFIX}${version}${len}${dec}`;
}

/**
 * Decodes an `AT...` token back to the original URL string.
 * Throws on invalid tokens or when the decoded URL isn't http(s).
 */
export function decodeShortUrlToken(token: string): string {
    const cleaned = token.trim();
    if (cleaned.length < TOKEN_PREFIX.length + 2) {
        throw new Error('Invalid shorturl token (too short)');
    }
    if (!cleaned.toUpperCase().startsWith(TOKEN_PREFIX)) {
        throw new Error('Invalid shorturl token (missing AT prefix)');
    }

    const version = cleaned.slice(TOKEN_PREFIX.length, TOKEN_PREFIX.length + 1);
    const payload = cleaned.slice(TOKEN_PREFIX.length + 1);

    // v2: compact base64url (gzip + dict)
    if (version === VERSION_GZIP_UTF8_B64URL_DICT) {
        if (!/^[a-zA-Z0-9\-_]+$/.test(payload)) {
            throw new Error('Invalid shorturl token (bad base64url payload)');
        }
        const base64 = fromBase64Url(payload);
        const payloadBytes = base64ToUint8Array(base64);
        const structured = pako.ungzip(payloadBytes);
        if (structured.length < 1) throw new Error('Invalid shorturl token (empty payload)');

        const dictId = structured[0] ?? 0;
        const remainderBytes = structured.slice(1);
        const remainder = new TextDecoder().decode(remainderBytes);
        const prefix = dictId ? getDictionaryPrefixById(dictId) : '';
        const url = `${prefix}${remainder}`;
        assertHttpUrl(url);
        return url;
    }

    // v0/v1: legacy digits-only
    const digits = `${version}${payload}`;
    if (!/^\d+$/.test(digits)) {
        throw new Error('Invalid shorturl token (digits only expected for legacy versions)');
    }
    const lenStr = digits.slice(1, 1 + LENGTH_DIGITS);
    const dec = digits.slice(1 + LENGTH_DIGITS);

    const expectedLength = Number(lenStr);
    if (!Number.isFinite(expectedLength) || expectedLength < 0 || expectedLength > MAX_PAYLOAD_LENGTH) {
        throw new Error('Invalid shorturl token (bad length header)');
    }

    const payloadBytes = decimalStringToBytes(dec, expectedLength);
    let utf8: Uint8Array;

    if (version === VERSION_GZIP_UTF8_DECIMAL) {
        utf8 = pako.ungzip(payloadBytes);
    } else if (version === '0') {
        utf8 = payloadBytes;
    } else {
        throw new Error('Unsupported shorturl token version');
    }

    const url = new TextDecoder().decode(utf8);
    assertHttpUrl(url);
    return url;
}

/**
 * Builds a pretty short URL path for this site:
 * `.../shorturl/AT...`
 *
 * Note: On GitHub Pages + Next export, deep paths are recovered by `404.tsx`,
 * so `/shorturl/<token>` will be redirected to `/shorturl?code=<token>` automatically.
 */
export function buildSiteShortUrl(prettySiteOrigin: string, token: string, basePath = ''): string {
    const origin = prettySiteOrigin.replace(/\/+$/, '');
    const base = basePath ? `/${basePath.replace(/^\/+|\/+$/g, '')}` : '';
    return `${origin}${base}/shorturl/${token}`;
}


