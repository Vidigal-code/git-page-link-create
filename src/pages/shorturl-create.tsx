import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useI18n } from '@/shared/lib/i18n';
import { withBasePath } from '@/shared/lib/basePath';
import { decodeRefCode, decodeShortUrlToken, encodeRefCode, encodeShortUrlToken } from '@/shared/lib/shorturl';
import {
    ButtonGroup,
    CheckboxContainer,
    CheckboxLabel,
    Container,
    ErrorMessage,
    FormSection,
    SuccessMessage,
    StyledCheckbox,
} from '@/shared/styles/pages/create.styles';

function isValidHttpUrl(value: string): boolean {
    if (!value) return false;
    try {
        const parsed = new URL(value);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

function truncateMiddle(value: string, maxChars: number): string {
    const s = value || '';
    if (!s) return '';
    if (maxChars <= 10) return s.slice(0, maxChars);
    if (s.length <= maxChars) return s;
    const keepStart = Math.ceil((maxChars - 3) * 0.6);
    const keepEnd = Math.floor((maxChars - 3) * 0.4);
    return `${s.slice(0, keepStart)}...${s.slice(s.length - keepEnd)}`;
}

export default function ShortUrlCreatePage() {
    const { t } = useI18n();
    const [longUrl, setLongUrl] = useState('');
    const [token, setToken] = useState('');
    const [shortLink, setShortLink] = useState('');
    const [altToken, setAltToken] = useState('');
    const [altShortLink, setAltShortLink] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [instantRenderer, setInstantRenderer] = useState(true);

    const silentFlagSuffix = useMemo(() => (instantRenderer ? '?z=1' : '?z=0'), [instantRenderer]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            // Default: checked. If user explicitly disabled before, keep it.
            const saved = window.localStorage.getItem('shorturlCreate.instantRenderer');
            if (saved === '0') setInstantRenderer(false);
            else setInstantRenderer(true);

            // Ensure we always have a value stored (helps other pages decide instantly)
            if (saved == null) {
                window.localStorage.setItem('shorturlCreate.instantRenderer', '1');
            }
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem('shorturlCreate.instantRenderer', instantRenderer ? '1' : '0');
        } catch {
            // ignore
        }
    }, [instantRenderer]);

    const normalizeComparableUrl = (value: string): string => {
        const trimmed = value.trim();
        if (!trimmed) return '';
        try {
            const u = new URL(trimmed);
            const path = `${u.pathname}${u.search}${u.hash}`;
            return path
                .replace(/\/([?#])/g, '$1') // remove slash before ?/#
                .replace('/render-all', '/ra')
                .replace('/render', '/r')
                .replace('#data=', '#d=')
                .replace('?data=', '?d=');
        } catch {
            return trimmed
                .replace(/\/([?#])/g, '$1')
                .replace('/render-all', '/ra')
                .replace('/render', '/r')
                .replace('#data=', '#d=')
                .replace('?data=', '?d=');
        }
    };

    const roundTripOk = useMemo(() => {
        if (!token || !longUrl) return false;
        try {
            const input = longUrl.trim();
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
    }, [token, longUrl]);

    const handleGenerate = () => {
        const input = longUrl.trim();
        setError('');
        setSuccess('');
        setToken('');
        setShortLink('');
        setAltToken('');
        setAltShortLink('');

        if (!isValidHttpUrl(input)) {
            setError(t('shorturlCreate.invalidUrl'));
            return;
        }

        if (typeof window === 'undefined') return;

        try {
            // Option A: compact AT2 token
            const generatedToken = encodeShortUrlToken(input, { mode: 'compact' });
            const atPathShort = withBasePath(`/s/${generatedToken}`);
            const atFullShort = `${window.location.origin}${atPathShort}${silentFlagSuffix}`;
            const atPathLong = withBasePath(`/shorturl/${generatedToken}`);
            const atFullLong = `${window.location.origin}${atPathLong}${silentFlagSuffix}`;

            // Option B: reference code (vh-/vp-/yt-/...) when possible
            const ref = encodeRefCode(input);
            const refPathShort = ref ? withBasePath(`/s/${ref}`) : '';
            const refFullShort = ref ? `${window.location.origin}${refPathShort}${silentFlagSuffix}` : '';
            const refPathLong = ref ? withBasePath(`/shorturl/${ref}`) : '';
            const refFullLong = ref ? `${window.location.origin}${refPathLong}${silentFlagSuffix}` : '';

            // Option C: direct internal renderer link (silent + instant) when possible
            const directInternal = (() => {
                if (!instantRenderer || !ref) return '';
                const decoded = decodeRefCode(ref);
                if (!decoded || decoded.kind !== 'path') return '';
                return `${window.location.origin}${decoded.path}`;
            })();

            // Choose the shortest full link as the primary output.
            const candidates: Array<{ t: string; link: string }> = [
                { t: generatedToken, link: atFullShort },
                { t: generatedToken, link: atFullLong },
            ];
            if (ref) {
                if (refFullShort) candidates.push({ t: ref, link: refFullShort });
                if (refFullLong) candidates.push({ t: ref, link: refFullLong });
            }
            if (directInternal && ref) {
                candidates.push({ t: ref, link: directInternal });
            }

            // Remove duplicates
            const uniq = new Map<string, { t: string; link: string }>();
            for (const c of candidates) {
                uniq.set(c.link, c);
            }
            const finalCandidates = Array.from(uniq.values()).sort((a, b) => a.link.length - b.link.length);
            const best = finalCandidates[0]!;
            const second = finalCandidates[1] || null;

            setToken(best.t);
            setShortLink(best.link);
            if (second) {
                setAltToken(second.t);
                setAltShortLink(second.link);
            }
            setSuccess(t('shorturlCreate.generated'));
        } catch (e) {
            setError(e instanceof Error ? e.message : t('shorturlCreate.error'));
        }
    };

    const handleClear = () => {
        setLongUrl('');
        setToken('');
        setShortLink('');
        setError('');
        setSuccess('');
    };

    const handleCopy = async (value: string) => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
            }
            setSuccess(t('create.linkCopied'));
        } catch {
            // ignore
        }
    };

    return (
        <>
            <Head>
                <title>{t('shorturlCreate.title')} - {t('common.appName')}</title>
                <meta name="robots" content="index, follow" />
            </Head>

            <Container>
                <FormSection>
                    <Card title={t('shorturlCreate.title')}>
                        <p style={{ marginTop: 0, opacity: 0.85 }}>
                            {t('shorturlCreate.description')}
                        </p>

                        <Input
                            label={t('shorturlCreate.longUrlLabel')}
                            placeholder={t('shorturlCreate.longUrlPlaceholder')}
                            value={longUrl}
                            onChange={(e) => setLongUrl(e.target.value)}
                        />

                        <CheckboxContainer>
                            <StyledCheckbox
                                type="checkbox"
                                id="instant-renderer-checkbox"
                                checked={instantRenderer}
                                onChange={(e) => setInstantRenderer(e.target.checked)}
                            />
                            <CheckboxLabel htmlFor="instant-renderer-checkbox">
                                {t('shorturlCreate.instantRenderer')}
                            </CheckboxLabel>
                        </CheckboxContainer>

                        <ButtonGroup>
                            <Button onClick={handleGenerate}>
                                {t('shorturlCreate.generate')}
                            </Button>
                            <Button onClick={handleClear} variant="secondary">
                                {t('shorturlCreate.clear')}
                            </Button>
                        </ButtonGroup>

                        {error && <ErrorMessage>{error}</ErrorMessage>}
                        {success && <SuccessMessage>{success}</SuccessMessage>}
                    </Card>

                    {shortLink && token && (
                        <div style={{ marginTop: 24 }}>
                            <Card title={t('shorturlCreate.resultTitle')}>
                                <p style={{ margin: '0 0 6px' }}>
                                    <strong>{t('shorturlCreate.shortLinkLabel')}:</strong>
                                </p>
                                <textarea
                                    readOnly
                                    value={truncateMiddle(shortLink, 180)}
                                    title={shortLink}
                                    aria-label={t('shorturlCreate.shortLinkLabel')}
                                    rows={2}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: 8,
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        color: 'inherit',
                                        fontFamily: 'monospace',
                                        resize: 'none',
                                        overflow: 'hidden',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                    }}
                                />

                                <p style={{ margin: '0 0 6px' }}>
                                    <strong>{t('shorturlCreate.tokenLabel')}:</strong>
                                </p>
                                <textarea
                                    readOnly
                                    value={truncateMiddle(token, 140)}
                                    title={token}
                                    aria-label={t('shorturlCreate.tokenLabel')}
                                    rows={2}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: 8,
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        color: 'inherit',
                                        fontFamily: 'monospace',
                                        resize: 'none',
                                        overflow: 'hidden',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                    }}
                                />

                                <ButtonGroup>
                                    <Button onClick={() => handleCopy(shortLink)}>
                                        {t('create.copyLink')}
                                    </Button>
                                    <Button onClick={() => handleCopy(token)} variant="secondary">
                                        {t('shorturlCreate.copyToken')}
                                    </Button>
                                    <Button
                                        onClick={() => window.open(shortLink, '_blank', 'noopener,noreferrer')}
                                        variant="secondary"
                                    >
                                        {t('create.openLink')}
                                    </Button>
                                </ButtonGroup>

                                {altShortLink && altToken && (
                                    <div style={{ marginTop: 18, opacity: 0.95 }}>
                                        <p style={{ margin: '0 0 6px' }}>
                                            <strong>{t('shorturlCreate.altTitle')}:</strong>
                                        </p>
                                        <textarea
                                            readOnly
                                            value={truncateMiddle(altShortLink, 180)}
                                            title={altShortLink}
                                            aria-label={t('shorturlCreate.altTitle')}
                                            rows={2}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: 8,
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.12)',
                                                color: 'inherit',
                                                fontFamily: 'monospace',
                                                resize: 'none',
                                                overflow: 'hidden',
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-word',
                                            }}
                                        />
                                        <ButtonGroup>
                                            <Button onClick={() => handleCopy(altShortLink)} variant="secondary">
                                                {t('create.copyLink')}
                                            </Button>
                                            <Button onClick={() => handleCopy(altToken)} variant="secondary">
                                                {t('shorturlCreate.copyToken')}
                                            </Button>
                                            <Button
                                                onClick={() => window.open(altShortLink, '_blank', 'noopener,noreferrer')}
                                                variant="secondary"
                                            >
                                                {t('create.openLink')}
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                )}

                                <p style={{ marginTop: 16, opacity: 0.75 }}>
                                    {roundTripOk ? t('shorturlCreate.roundTripOk') : t('shorturlCreate.roundTripFail')}
                                </p>
                            </Card>
                        </div>
                    )}
                </FormSection>
            </Container>
        </>
    );
}


