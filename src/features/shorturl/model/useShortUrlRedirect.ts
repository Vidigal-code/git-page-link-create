import { useEffect, useMemo, useState } from 'react';
import { getShortUrlRedirectDelaySeconds } from '@/shared/lib/theme';
import { safeLocationReplace } from '@/shared/lib/browser';
import { resolveShortUrlTarget } from '@/features/shorturl/model/resolveTargetUrl';

export function useShortUrlRedirect(code: string, silentRedirect: boolean) {
    const [error, setError] = useState('');
    const [decodedUrl, setDecodedUrl] = useState('');
    const delaySeconds = useMemo(() => {
        const d = getShortUrlRedirectDelaySeconds();
        return Number.isFinite(d) ? Math.max(0, Math.min(60, Math.floor(d))) : 5;
    }, []);
    const [countdownSec, setCountdownSec] = useState<number>(delaySeconds);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!code) return;

        setError('');
        setDecodedUrl('');
        setCountdownSec(delaySeconds);

        try {
            const targetUrl = resolveShortUrlTarget(code);
            if (silentRedirect) {
                safeLocationReplace(targetUrl);
                return;
            }

            setDecodedUrl(targetUrl);
            const timeout = window.setTimeout(() => {
                safeLocationReplace(targetUrl);
            }, delaySeconds * 1000);

            const interval = window.setInterval(() => {
                setCountdownSec((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);

            return () => {
                window.clearTimeout(timeout);
                window.clearInterval(interval);
            };
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Invalid shorturl token');
        }
    }, [code, silentRedirect, delaySeconds]);

    return {
        error,
        setError,
        decodedUrl,
        setDecodedUrl,
        countdownSec,
        delaySeconds,
    };
}
