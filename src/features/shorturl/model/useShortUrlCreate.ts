import { useMemo } from 'react';
import { decodeRefCode, decodeShortUrlToken, isValidHttpUrl } from '@/shared/lib/shorturl';
import { buildShortUrlCandidates, normalizeComparableUrl } from '@/features/shorturl/model/createCandidates';

export function useShortUrlCreate(params: {
    inputUrl: string;
    token: string;
    instantRenderer: boolean;
}) {
    const { inputUrl, token, instantRenderer } = params;
    const silentFlagSuffix = useMemo<'?z=0' | '?z=1'>(
        () => (instantRenderer ? '?z=1' : '?z=0'),
        [instantRenderer],
    );

    const roundTripOk = useMemo(() => {
        if (!token || !inputUrl || typeof window === 'undefined') return false;
        try {
            const input = inputUrl.trim();
            if (token.trim().toUpperCase().startsWith('AT')) {
                return decodeShortUrlToken(token) === input;
            }
            const decoded = decodeRefCode(token);
            if (!decoded) return false;
            const decodedUrl = decoded.kind === 'absolute'
                ? decoded.url
                : `${window.location.origin}${decoded.path}`;
            return normalizeComparableUrl(decodedUrl) === normalizeComparableUrl(input);
        } catch {
            return false;
        }
    }, [token, inputUrl]);

    return {
        isValidHttpUrl,
        roundTripOk,
        silentFlagSuffix,
        buildCandidates: (origin: string) => buildShortUrlCandidates({
            origin,
            inputUrl: inputUrl.trim(),
            instantRenderer,
            silentFlagSuffix,
        }),
    };
}
