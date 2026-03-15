import { decodeRefCode, decodeShortUrlToken } from '@/shared/lib/shorturl';
import { getSiteOrigin } from '@/shared/lib/browser';

export function resolveShortUrlTarget(code: string): string {
    if (code.trim().toUpperCase().startsWith('AT')) {
        return decodeShortUrlToken(code);
    }

    const decoded = decodeRefCode(code);
    if (!decoded) {
        throw new Error('Invalid shorturl token');
    }

    if (decoded.kind === 'absolute') return decoded.url;
    return `${getSiteOrigin()}${decoded.path}`;
}
