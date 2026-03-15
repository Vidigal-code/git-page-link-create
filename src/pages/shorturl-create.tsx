import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useI18n } from '@/shared/lib/i18n';
import { copyTextToClipboard, safeOpenUrl } from '@/shared/lib/browser';
import {
    decodeRefCode,
    decodeShortUrlToken,
    formatBytes,
    getUtf8ByteLength,
} from '@/shared/lib/shorturl';
import { useShortUrlCreate } from '@/features/shorturl/model/useShortUrlCreate';
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
    const { buildCandidates, isValidHttpUrl, roundTripOk, silentFlagSuffix } = useShortUrlCreate({
        inputUrl: longUrl,
        token,
        instantRenderer,
    });

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
            const candidates = buildCandidates(window.location.origin);
            if (candidates.length === 0) {
                throw new Error(t('shorturlCreate.error'));
            }
            const best = candidates[0]!;
            const second = candidates[1] || null;

            setToken(best.token);
            setShortLink(best.link);
            if (second) {
                setAltToken(second.token);
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
        const ok = await copyTextToClipboard(value);
        if (!ok) return;
        setSuccess(t('create.linkCopied'));
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
                                        onClick={() => safeOpenUrl(shortLink, '_blank', 'noopener,noreferrer')}
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
                                                onClick={() => safeOpenUrl(altShortLink, '_blank', 'noopener,noreferrer')}
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
                                                            <th style={{ textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.12)', whiteSpace: 'nowrap' }}>
                                                                {t('shorturlCreate.compareColItem')}
                                                            </th>
                                                            <th style={{ textAlign: 'right', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.12)', whiteSpace: 'nowrap' }}>
                                                                {t('shorturlCreate.compareColChars')}
                                                            </th>
                                                            <th style={{ textAlign: 'right', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.12)', whiteSpace: 'nowrap' }}>
                                                                {t('shorturlCreate.compareColBytes')}
                                                            </th>
                                                            <th style={{ textAlign: 'right', padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.12)', whiteSpace: 'nowrap' }}>
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
                                                                    {r.value === original ? '—' : savings(r.bytes)}
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


