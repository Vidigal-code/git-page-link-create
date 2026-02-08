/**
 * ShortURL dictionary (frontend-only, no backend)
 *
 * We use a small, curated prefix dictionary to reduce repeated URL prefixes.
 * Encoding picks the LONGEST matching prefix, stores its id, and only encodes the remainder.
 *
 * This is deterministic and reversible as long as this list is stable.
 */

export type ShortUrlDictionaryEntry = {
    id: number; // 1..255
    prefix: string;
    note?: string;
};

import { BASE_PATH } from '@/shared/lib/basePath';

const PROD_ORIGIN = 'https://vidigal-code.github.io';

function joinOriginAndBasePath(origin: string, basePath: string): string {
    const o = origin.replace(/\/+$/, '');
    const b = (basePath || '').trim();
    if (!b) return o;
    const normalized = b.startsWith('/') ? b : `/${b}`;
    return `${o}${normalized}`;
}

const RAW_PREFIXES: ReadonlyArray<Omit<ShortUrlDictionaryEntry, 'id'>> = Object.freeze([
    /**
     * IMPORTANT: keep these first entries stable forever.
     * They are already encoded into previously generated tokens as numeric ids.
     */
    // Legacy site-specific prefixes (big wins for this repo)
    { prefix: 'https://vidigal-code.github.io/git-page-link-create/render/pdf/?fullscreen=1#data=data%3Aapplication%2Fpdf%3Bbase64%2C', note: '[legacy] PDF data-url, percent-encoded base64' },
    { prefix: 'https://vidigal-code.github.io/git-page-link-create/render/pdf/?fullscreen=1#data=', note: '[legacy] Render PDF data fragment' },
    { prefix: 'https://vidigal-code.github.io/git-page-link-create/render/', note: '[legacy] Render route base' },
    { prefix: 'https://vidigal-code.github.io/git-page-link-create/', note: '[legacy] Site base' },

    // Legacy general prefixes
    { prefix: 'https://', note: '[legacy] scheme' },
    { prefix: 'http://', note: '[legacy] scheme' },

    /**
     * New dynamic entries (safe to append):
     * - BasePath-aware production prefixes (GitHub Pages)
     * - Common localhost prefixes for dev
     */
    // GitHub Pages (basePath-aware) canonical routes used by link generator
    {
        prefix: `${joinOriginAndBasePath(PROD_ORIGIN, BASE_PATH)}/render/pdf?fullscreen=1#data=data%3Aapplication%2Fpdf%3Bbase64%2C`,
        note: 'PDF fullscreen base64 payload (encoded) [basePath-aware]',
    },
    {
        prefix: `${joinOriginAndBasePath(PROD_ORIGIN, BASE_PATH)}/render/pdf?fullscreen=1#data=`,
        note: 'PDF fullscreen payload [basePath-aware]',
    },
    {
        prefix: `${joinOriginAndBasePath(PROD_ORIGIN, BASE_PATH)}/render/pdf#data=data%3Aapplication%2Fpdf%3Bbase64%2C`,
        note: 'PDF base64 payload (encoded) [basePath-aware]',
    },
    {
        prefix: `${joinOriginAndBasePath(PROD_ORIGIN, BASE_PATH)}/render/pdf#data=`,
        note: 'PDF payload [basePath-aware]',
    },
    {
        prefix: `${joinOriginAndBasePath(PROD_ORIGIN, BASE_PATH)}/render-all#data=html-`,
        note: 'render-all html payload [basePath-aware]',
    },
    {
        prefix: `${joinOriginAndBasePath(PROD_ORIGIN, BASE_PATH)}/render#data=`,
        note: 'render payload [basePath-aware]',
    },
    {
        prefix: `${joinOriginAndBasePath(PROD_ORIGIN, BASE_PATH)}/render/`,
        note: 'render route base [basePath-aware]',
    },
    {
        prefix: `${joinOriginAndBasePath(PROD_ORIGIN, BASE_PATH)}/`,
        note: 'site base [basePath-aware]',
    },

    // Dev: localhost variants (these help a lot in local testing)
    { prefix: 'http://localhost:', note: 'dev origin (localhost with any port)' },
    { prefix: 'http://127.0.0.1:', note: 'dev origin (127.0.0.1 with any port)' },
    { prefix: 'http://0.0.0.0:', note: 'dev origin (0.0.0.0 with any port)' },
    { prefix: 'https://localhost:', note: 'dev origin (https localhost with any port)' },
]);

export const SHORTURL_DICTIONARY: ReadonlyArray<ShortUrlDictionaryEntry> = Object.freeze(
    RAW_PREFIXES.map((e, idx) => ({ id: idx + 1, ...e }))
);

const PREFIX_BY_ID = Object.freeze(
    SHORTURL_DICTIONARY.reduce<Record<number, string>>((acc, e) => {
        acc[e.id] = e.prefix;
        return acc;
    }, {})
);

export function getDictionaryPrefixById(id: number): string {
    return PREFIX_BY_ID[id] || '';
}

export function findBestDictionaryMatch(url: string): { id: number; remainder: string } {
    let best: { id: number; prefixLen: number } | null = null;

    for (const entry of SHORTURL_DICTIONARY) {
        if (!url.startsWith(entry.prefix)) continue;
        const prefixLen = entry.prefix.length;
        if (!best || prefixLen > best.prefixLen) {
            best = { id: entry.id, prefixLen };
        }
    }

    if (!best) return { id: 0, remainder: url };
    return { id: best.id, remainder: url.slice(best.prefixLen) };
}


