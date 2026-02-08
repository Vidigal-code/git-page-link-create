import { withBasePath } from '@/shared/lib/basePath';

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


