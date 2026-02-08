import { withBasePath } from '@/shared/lib/basePath';
import { SHORTURL_REF_CODES } from '@/shared/lib/shorturl/refcodes';

export type LinksRegisterEntry = {
    ReferenceName: string;
    Name?: string;
    LinkOriginal: string;
};

type LinksRegisterFileShape =
    | LinksRegisterEntry
    | (LinksRegisterEntry[])
    | { Name?: string; ReferenceName?: string; LinkOriginal?: string; items?: LinksRegisterEntry[]; Items?: LinksRegisterEntry[] };

export type LinksRegisterData = {
    title?: string;
    entries: LinksRegisterEntry[];
};

function isEntryLike(value: unknown): value is LinksRegisterEntry {
    if (!value || typeof value !== 'object') return false;
    const v = value as Record<string, unknown>;
    return typeof v.ReferenceName === 'string' && typeof v.LinkOriginal === 'string';
}

function normalizeEntries(raw: LinksRegisterFileShape): LinksRegisterData {
    if (Array.isArray(raw)) {
        return { entries: raw.filter(isEntryLike) };
    }
    if (isEntryLike(raw)) {
        return { title: raw.Name, entries: [raw] };
    }
    const obj = raw as Record<string, unknown>;
    const items = (obj.Items ?? obj.items);
    const title = typeof obj.Name === 'string' ? obj.Name : undefined;
    if (Array.isArray(items)) {
        return { title, entries: items.filter(isEntryLike) };
    }
    // Fallback: try single entry fields on the root
    if (typeof obj.ReferenceName === 'string' && typeof obj.LinkOriginal === 'string') {
        return { title, entries: [{ ReferenceName: obj.ReferenceName, LinkOriginal: obj.LinkOriginal, Name: title }] };
    }
    return { title, entries: [] };
}

export async function fetchLinksRegister(): Promise<LinksRegisterData> {
    const url = withBasePath('/links/LinksRegister.json');
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to load LinksRegister.json (${res.status})`);
    }
    const json = (await res.json()) as LinksRegisterFileShape;
    return normalizeEntries(json);
}

export function findLinksByReference(entries: LinksRegisterEntry[], ref: string): LinksRegisterEntry[] {
    const needle = ref.trim().toLowerCase();
    if (!needle) return [];
    return entries.filter((e) => (e.ReferenceName || '').trim().toLowerCase() === needle);
}

const SHORTURL_CODE_SET = Object.freeze(
    new Set(SHORTURL_REF_CODES.map((e) => (e.code || '').toLowerCase()))
);

function isLikelyShortUrlCode(slug: string): boolean {
    const s = (slug || '').trim();
    if (!s) return false;
    if (/^AT[0-9A-Za-z]/i.test(s)) return true;
    const m = /^([a-z0-9]{1,3})-/i.exec(s);
    if (!m?.[1]) return false;
    return SHORTURL_CODE_SET.has(m[1].toLowerCase());
}

/**
 * Builds a reference-link path that won't collide with shorturl token routing.
 * - For refs that look like shorturl tokens (e.g. `AT2...`), we use `/s/@<ref>/`.
 * - Otherwise we keep the classic `/s/<ref>/`.
 */
export function buildLinksRegisterReferencePath(referenceName: string, z?: '0' | '1'): string {
    const raw = (referenceName || '').trim();
    const safeRef = encodeURIComponent(raw);
    const needsEscape = isLikelyShortUrlCode(raw) || raw.toLowerCase() === 'v';
    const base = needsEscape ? `/s/@${safeRef}/` : `/s/${safeRef}/`;
    const zQuery = z === '0' || z === '1' ? `?z=${z}` : '';
    return withBasePath(`${base}${zQuery}`);
}


