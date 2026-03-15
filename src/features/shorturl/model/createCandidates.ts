import { withBasePath } from '@/shared/lib/basePath';
import { decodeRefCode, encodeRefCode, encodeShortUrlToken } from '@/shared/lib/shorturl';

export type ShortUrlCandidate = {
    token: string;
    link: string;
};

export function buildShortUrlCandidates(params: {
    origin: string;
    inputUrl: string;
    instantRenderer: boolean;
    silentFlagSuffix: '?z=0' | '?z=1';
}): ShortUrlCandidate[] {
    const { origin, inputUrl, instantRenderer, silentFlagSuffix } = params;
    const candidates: ShortUrlCandidate[] = [];
    const maxSafeCodeLenForPath = 1500;
    const canUsePathTransport = (code: string) => code.length <= maxSafeCodeLenForPath;

    try {
        const generatedToken = encodeShortUrlToken(inputUrl, { mode: 'compact' });
        if (canUsePathTransport(generatedToken)) {
            const atPathShort = withBasePath(`/s/${generatedToken}`);
            const atPathLong = withBasePath(`/shorturl/${generatedToken}`);
            candidates.push({ token: generatedToken, link: `${origin}${atPathShort}${silentFlagSuffix}` });
            candidates.push({ token: generatedToken, link: `${origin}${atPathLong}${silentFlagSuffix}` });
        }

        const atHashPath = withBasePath(`/shorturl/${silentFlagSuffix}#c=${generatedToken}`);
        candidates.push({ token: generatedToken, link: `${origin}${atHashPath}` });
    } catch {
        // Keep compatibility: AT codec failure should not block refcode candidates.
    }

    const ref = encodeRefCode(inputUrl);
    if (ref) {
        if (canUsePathTransport(ref)) {
            const refPathShort = withBasePath(`/s/${ref}`);
            const refPathLong = withBasePath(`/shorturl/${ref}`);
            candidates.push({ token: ref, link: `${origin}${refPathShort}${silentFlagSuffix}` });
            candidates.push({ token: ref, link: `${origin}${refPathLong}${silentFlagSuffix}` });
        }

        const refHashPath = withBasePath(`/shorturl/${silentFlagSuffix}#c=${ref}`);
        candidates.push({ token: ref, link: `${origin}${refHashPath}` });

        if (instantRenderer) {
            const decoded = decodeRefCode(ref);
            if (decoded && decoded.kind === 'path') {
                candidates.push({ token: ref, link: `${origin}${decoded.path}` });
            }
        }
    }

    const unique = new Map<string, ShortUrlCandidate>();
    for (const candidate of candidates) {
        unique.set(candidate.link, candidate);
    }
    return Array.from(unique.values()).sort((a, b) => a.link.length - b.link.length);
}

export function normalizeComparableUrl(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return '';
    try {
        const u = new URL(trimmed);
        const path = `${u.pathname}${u.search}${u.hash}`;
        return normalizePath(path);
    } catch {
        return normalizePath(trimmed);
    }
}

function normalizePath(value: string): string {
    return value
        .replace(/\/([?#])/g, '$1')
        .replace('/render-all', '/ra')
        .replace('/render', '/r')
        .replace('#data=', '#d=')
        .replace('?data=', '?d=');
}
