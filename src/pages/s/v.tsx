import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTheme } from 'styled-components';
import { useI18n } from '@/shared/lib/i18n';
import { fetchLinksRegister, findLinksByReference, type LinksRegisterEntry } from '@/shared/lib/linksRegister';
import { withBasePath } from '@/shared/lib/basePath';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { ReadOnlyTextarea } from '@/shared/ui/ReadOnlyTextarea';
import { Container, FormSection, ButtonGroup, ErrorMessage } from '@/shared/styles/pages/create.styles';

function openUrl(url: string): void {
    if (typeof window === 'undefined') return;
    window.location.replace(url);
}

function parseQueryParamFromAsPath(asPath: string, key: string): string {
    const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = new RegExp(`[?&]${safeKey}=([^&#]+)`, 'i').exec(asPath);
    if (!m?.[1]) return '';
    try {
        return decodeURIComponent(m[1]);
    } catch {
        return m[1];
    }
}

export default function LinksRegisterVPage() {
    const { t } = useI18n();
    const router = useRouter();
    const theme = useTheme();
    const [title, setTitle] = useState<string>('');
    const [entries, setEntries] = useState<LinksRegisterEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copiedKey, setCopiedKey] = useState<string>('');
    const [refInput, setRefInput] = useState('');
    const [autoRedirectDone, setAutoRedirectDone] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        setError('');
        fetchLinksRegister()
            .then((data) => {
                if (!alive) return;
                setTitle(data.title || '');
                setEntries(data.entries);
            })
            .catch((e) => {
                if (!alive) return;
                setError(e instanceof Error ? e.message : t('linksRegister.errorLoad'));
            })
            .finally(() => {
                if (!alive) return;
                setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, []);

    const asPath = router.asPath || '';
    const refFromQuery = useMemo(() => {
        const qRef = router.query.ref;
        const fromQuery = typeof qRef === 'string' ? qRef : Array.isArray(qRef) ? qRef[0] : '';
        return (fromQuery || parseQueryParamFromAsPath(asPath, 'ref') || '').trim();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.ref, asPath]);

    useEffect(() => {
        if (!router.isReady) return;
        if (refFromQuery && !refInput.trim()) {
            setRefInput(refFromQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady, refFromQuery]);

    const requestedRef = refInput.trim();
    const matches = useMemo(() => findLinksByReference(entries, requestedRef), [entries, requestedRef]);

    const handleCopy = async (key: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKey(key);
            window.setTimeout(() => setCopiedKey(''), 1200);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        if (!router.isReady) return;
        if (loading) return;
        if (!refFromQuery) return;
        if (autoRedirectDone) return;
        if (!requestedRef) return;
        if (matches.length !== 1) return; // duplicates: show list instead
        setAutoRedirectDone(true);
        setIsRedirecting(true);
        openUrl(matches[0]!.LinkOriginal);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady, loading, requestedRef, matches.length, refFromQuery, autoRedirectDone]);

    const go404 = () => {
        const target = withBasePath('/404');
        if (typeof window !== 'undefined') {
            window.location.replace(target);
        }
    };

    const handleGo = () => {
        setError('');
        const ref = refInput.trim();
        if (!ref) {
            setError(t('linksRegister.missingRef'));
            return;
        }
        const m = findLinksByReference(entries, ref);
        if (m.length === 0) {
            go404();
            return;
        }
        if (m.length === 1) {
            setIsRedirecting(true);
            openUrl(m[0]!.LinkOriginal);
            return;
        }
        // duplicates: render list below
    };

    // While redirecting, render blank to avoid UI flash.
    if (isRedirecting) return null;

    return (
        <>
            <Head>
                <title>{t('linksRegister.title')} - {t('common.appName')}</title>
                <meta name="robots" content="index, follow" />
            </Head>

            <Container>
                <FormSection>
                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    <Card title={t('linksRegister.title')}>
                        <p style={{ marginTop: 0, opacity: 0.85 }}>
                            {t('linksRegister.description')}
                        </p>
                        {title && (
                            <p style={{ marginTop: 8, opacity: 0.75 }}>
                                <strong>{t('linksRegister.registerName')}:</strong> {title}
                            </p>
                        )}
                        <Input
                            label={t('linksRegister.refLabel')}
                            placeholder={t('linksRegister.refPlaceholder')}
                            value={refInput}
                            onChange={(e) => setRefInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleGo();
                            }}
                        />
                        <ButtonGroup>
                            <Button
                                onClick={handleGo}
                                disabled={loading}
                                style={{ padding: '8px 14px', fontSize: '0.85rem', letterSpacing: '0.5px' }}
                            >
                                {loading ? t('linksRegister.loading') : t('linksRegister.go')}
                            </Button>
                        </ButtonGroup>
                    </Card>

                    {matches.length > 1 && (
                        <div style={{ marginTop: 18 }}>
                            <Card title={t('linksRegister.duplicatesTitle')}>
                                <p style={{ marginTop: 0, opacity: 0.8 }}>
                                    {t('linksRegister.duplicatesDescription')}
                                </p>

                                <p style={{ marginTop: 8, opacity: 0.75 }}>
                                    <strong>{t('linksRegister.refLabel')}:</strong> {requestedRef}
                                </p>

                                <div
                                    style={{
                                        marginTop: 10,
                                        border: `1px solid ${theme.colors.cardBorder}`,
                                        borderRadius: 12,
                                        padding: 12,
                                        background: theme.colors.cardBackground,
                                    }}
                                >
                                    <div style={{ fontWeight: 800 }}>
                                        {t('linksRegister.duplicatesInfoTitle')}
                                    </div>
                                    <div style={{ marginTop: 6, opacity: 0.85 }}>
                                        {t('linksRegister.duplicatesInfoRef')} <strong>{requestedRef}</strong>{' '}
                                        <span style={{ opacity: 0.7 }}>•</span>{' '}
                                        {t('linksRegister.duplicatesInfoCount')} <strong>{matches.length}</strong>
                                    </div>
                                    <div style={{ marginTop: 6, opacity: 0.75 }}>
                                        {t('linksRegister.duplicatesInfoSource')}{' '}
                                        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace' }}>
                                            LinksRegister.json
                                        </span>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 12,
                                        maxHeight: 420,
                                        overflowY: 'auto',
                                        paddingRight: 6,
                                    }}
                                >
                                    {matches.map((m, idx) => (
                                        (() => {
                                            const key = `${m.ReferenceName}-${idx}`;
                                            const isCopied = copiedKey === key;
                                            const isRefCopied = copiedKey === `${key}-ref`;
                                            const refUrl = typeof window === 'undefined'
                                                ? ''
                                                : `${window.location.origin}${withBasePath(`/s/${encodeURIComponent(m.ReferenceName)}/?z=1`)}`;
                                            return (
                                        <div
                                            key={key}
                                            style={{
                                                border: `1px solid ${theme.colors.cardBorder}`,
                                                borderRadius: 12,
                                                padding: 12,
                                                background: theme.colors.cardBackground,
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, marginBottom: 4 }}>
                                                        {m.Name || t('linksRegister.item')}
                                                    </div>
                                                    <div style={{ opacity: 0.8, fontSize: 13 }}>
                                                        <strong>{t('linksRegister.refLabel')}:</strong> {m.ReferenceName}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                    <Button
                                                        onClick={() => handleCopy(key, m.LinkOriginal)}
                                                        variant="secondary"
                                                        style={{ padding: '8px 14px', fontSize: '0.85rem', letterSpacing: '0.5px' }}
                                                    >
                                                        {isCopied ? t('create.linkCopied') : t('create.copyLink')}
                                                    </Button>
                                                    <Button
                                                        onClick={() => refUrl && handleCopy(`${key}-ref`, refUrl)}
                                                        variant="secondary"
                                                        style={{ padding: '8px 14px', fontSize: '0.85rem', letterSpacing: '0.5px' }}
                                                    >
                                                        {isRefCopied ? t('create.linkCopied') : t('home.linksRegisterCopyRef')}
                                                    </Button>
                                                    <Button
                                                        onClick={() => refUrl && window.open(refUrl, '_blank', 'noopener,noreferrer')}
                                                        variant="secondary"
                                                        style={{ padding: '8px 14px', fontSize: '0.85rem', letterSpacing: '0.5px' }}
                                                    >
                                                        {t('home.linksRegisterOpenRef')}
                                                    </Button>
                                                    <Button
                                                        onClick={() => window.open(m.LinkOriginal, '_blank', 'noopener,noreferrer')}
                                                        variant="secondary"
                                                        style={{ padding: '8px 14px', fontSize: '0.85rem', letterSpacing: '0.5px' }}
                                                    >
                                                        {t('linksRegister.open')}
                                                    </Button>
                                                </div>
                                            </div>

                                            <ReadOnlyTextarea
                                                readOnly
                                                value={m.LinkOriginal}
                                                rows={3}
                                                style={{ marginTop: 10 }}
                                            />
                                        </div>
                                            );
                                        })()
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}
                </FormSection>
            </Container>
        </>
    );
}


