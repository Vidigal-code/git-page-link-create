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

function getUtf8ByteLength(value: string): number {
    if (!value) return 0;
    try {
        return new TextEncoder().encode(value).length;
    } catch {
        // Fallback: best-effort estimate
        return value.length;
    }
}

function formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes)) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
            // Build candidates independently so one failing codec (e.g. AT2 on huge URLs)
            // does not prevent other shorteners (e.g. RefCodes) from working.
            const candidates: Array<{ t: string; link: string }> = [];
            const maxSafeCodeLenForPath = 1500;
            const canUsePathTransport = (code: string) => code.length <= maxSafeCodeLenForPath;

            // Option A: compact AT2 token (may fail on extremely large URLs)
            try {
                const generatedToken = encodeShortUrlToken(input, { mode: 'compact' });
                if (canUsePathTransport(generatedToken)) {
                    const atPathShort = withBasePath(`/s/${generatedToken}`);
                    const atFullShort = `${window.location.origin}${atPathShort}${silentFlagSuffix}`;
                    const atPathLong = withBasePath(`/shorturl/${generatedToken}`);
                    const atFullLong = `${window.location.origin}${atPathLong}${silentFlagSuffix}`;
                    candidates.push({ t: generatedToken, link: atFullShort });
                    candidates.push({ t: generatedToken, link: atFullLong });
                }

                // Hash-transport: avoids server/request URI limits for very large codes
                const atHashPath = withBasePath(`/shorturl/${silentFlagSuffix}#c=${generatedToken}`);
                candidates.push({ t: generatedToken, link: `${window.location.origin}${atHashPath}` });
            } catch {
                // ignore AT failures; we can still shorten via refcodes
            }

            // Option B: reference code (vh-/vp-/yt-/...) when possible (safe)
            const ref = encodeRefCode(input);
            if (ref) {
                if (canUsePathTransport(ref)) {
                    const refPathShort = withBasePath(`/s/${ref}`);
                    const refFullShort = `${window.location.origin}${refPathShort}${silentFlagSuffix}`;
                    const refPathLong = withBasePath(`/shorturl/${ref}`);
                    const refFullLong = `${window.location.origin}${refPathLong}${silentFlagSuffix}`;
                    candidates.push({ t: ref, link: refFullShort });
                    candidates.push({ t: ref, link: refFullLong });
                }

                // Hash-transport: avoids server/request URI limits for very large codes
                const refHashPath = withBasePath(`/shorturl/${silentFlagSuffix}#c=${ref}`);
                candidates.push({ t: ref, link: `${window.location.origin}${refHashPath}` });

                // Option C: direct internal renderer link (silent + instant) when possible
                if (instantRenderer) {
                    const decoded = decodeRefCode(ref);
                    if (decoded && decoded.kind === 'path') {
                        candidates.push({ t: ref, link: `${window.location.origin}${decoded.path}` });
                    }
                }
            }

            if (candidates.length === 0) {
                throw new Error(t('shorturlCreate.error'));
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
                                    value={shortLink}
                                    title={shortLink}
                                    aria-label={t('shorturlCreate.shortLinkLabel')}
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: 8,
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        color: 'inherit',
                                        fontFamily: 'monospace',
                                        resize: 'vertical',
                                        maxHeight: 160,
                                        overflowY: 'auto',
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'anywhere',
                                        wordBreak: 'break-word',
                                    }}
                                />

                                <p style={{ margin: '0 0 6px' }}>
                                    <strong>{t('shorturlCreate.tokenLabel')}:</strong>
                                </p>
                                <textarea
                                    readOnly
                                    value={token}
                                    title={token}
                                    aria-label={t('shorturlCreate.tokenLabel')}
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: 8,
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        color: 'inherit',
                                        fontFamily: 'monospace',
                                        resize: 'vertical',
                                        maxHeight: 140,
                                        overflowY: 'auto',
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'anywhere',
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
                                            value={altShortLink}
                                            title={altShortLink}
                                            aria-label={t('shorturlCreate.altTitle')}
                                            rows={4}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: 8,
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.12)',
                                                color: 'inherit',
                                                fontFamily: 'monospace',
                                                resize: 'vertical',
                                                maxHeight: 160,
                                                overflowY: 'auto',
                                                whiteSpace: 'pre-wrap',
                                                overflowWrap: 'anywhere',
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

                            <div style={{ marginTop: 18 }}>
                                <Card title={t('shorturlCreate.compareTitle')}>
                                    <p style={{ marginTop: 0, opacity: 0.8 }}>
                                        {t('shorturlCreate.compareDescription')}
                                    </p>

                                    {(() => {
                                        const original = longUrl.trim();
                                        const originalChars = original.length;
                                        const originalBytes = getUtf8ByteLength(original);

                                        const rows: Array<{
                                            label: string;
                                            value: string;
                                            chars: number;
                                            bytes: number;
                                        }> = [
                                            {
                                                label: t('shorturlCreate.compareOriginal'),
                                                value: original,
                                                chars: originalChars,
                                                bytes: originalBytes,
                                            },
                                            {
                                                label: t('shorturlCreate.compareShort'),
                                                value: shortLink,
                                                chars: shortLink.length,
                                                bytes: getUtf8ByteLength(shortLink),
                                            },
                                        ];

                                        if (altShortLink) {
                                            rows.push({
                                                label: t('shorturlCreate.compareAlt'),
                                                value: altShortLink,
                                                chars: altShortLink.length,
                                                bytes: getUtf8ByteLength(altShortLink),
                                            });
                                        }

                                        const savings = (bytes: number) => {
                                            if (!originalBytes) return '—';
                                            const pct = ((originalBytes - bytes) / originalBytes) * 100;
                                            return `${pct.toFixed(1)}%`;
                                        };

                                        return (
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                                                                {t('shorturlCreate.compareColItem')}
                                                            </th>
                                                            <th style={{ textAlign: 'right', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                                                                {t('shorturlCreate.compareColChars')}
                                                            </th>
                                                            <th style={{ textAlign: 'right', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                                                                {t('shorturlCreate.compareColBytes')}
                                                            </th>
                                                            <th style={{ textAlign: 'right', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                                                                {t('shorturlCreate.compareColSavings')}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {rows.map((r) => (
                                                            <tr key={r.label}>
                                                                <td style={{ padding: '10px', verticalAlign: 'top', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                                                    <div style={{ fontWeight: 600, marginBottom: 6 }}>{r.label}</div>
                                                                    <div style={{
                                                                        fontFamily: 'monospace',
                                                                        opacity: 0.9,
                                                                        whiteSpace: 'pre-wrap',
                                                                        overflowWrap: 'anywhere',
                                                                        wordBreak: 'break-word',
                                                                        maxHeight: 90,
                                                                        overflowY: 'auto',
                                                                        padding: '8px',
                                                                        borderRadius: 8,
                                                                        background: 'rgba(255,255,255,0.03)',
                                                                        border: '1px solid rgba(255,255,255,0.08)'
                                                                    }}>
                                                                        {r.value}
                                                                    </div>
                                                                </td>
                                                                <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                                                    {r.chars.toLocaleString()}
                                                                </td>
                                                                <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                                                    {formatBytes(r.bytes)}
                                                                </td>
                                                                <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                                                    {r.label === t('shorturlCreate.compareOriginal') ? '—' : savings(r.bytes)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                    </div>
                                        );
                                    })()}
                                </Card>
                            </div>
                        </div>
                    )}
                </FormSection>
            </Container>
        </>
    );
}


