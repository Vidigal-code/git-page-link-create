import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useI18n } from '@/shared/lib/i18n';
import { fetchLinksRegister, findLinksByReference, type LinksRegisterEntry } from '@/shared/lib/linksRegister';
import { withBasePath } from '@/shared/lib/basePath';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { ReadOnlyTextarea } from '@/shared/ui/ReadOnlyTextarea';
import { Container, FormSection, ButtonGroup, ErrorMessage, SuccessMessage } from '@/shared/styles/pages/create.styles';

function openUrl(url: string): void {
    if (typeof window === 'undefined') return;
    window.location.replace(url);
}

export default function LinksRegisterVPage() {
    const { t } = useI18n();
    const router = useRouter();
    const [ref, setRef] = useState('');
    const [title, setTitle] = useState<string>('');
    const [entries, setEntries] = useState<LinksRegisterEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [autoGoOnce, setAutoGoOnce] = useState(false);
    const [isSilent, setIsSilent] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string>('');

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

    const matches = useMemo(() => findLinksByReference(entries, ref), [entries, ref]);

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
        const qRef = router.query.ref;
        const qZ = router.query.z;
        const refStr = typeof qRef === 'string' ? qRef : Array.isArray(qRef) ? qRef[0] : '';
        const zStr = typeof qZ === 'string' ? qZ : Array.isArray(qZ) ? qZ[0] : '';

        if (refStr && !ref.trim()) {
            setRef(refStr);
            setAutoGoOnce(true);
        }
        setIsSilent(zStr === '1');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady]);

    const handleGo = () => {
        setError('');
        setSuccess('');
        const m = matches;
        if (!ref.trim()) {
            setError(t('linksRegister.missingRef'));
            return;
        }
        if (m.length === 0) {
            setError(t('linksRegister.noMatch'));
            return;
        }
        if (m.length === 1) {
            if (isSilent) {
                setIsRedirecting(true);
            } else {
                setSuccess(t('linksRegister.redirecting'));
            }
            openUrl(m[0]!.LinkOriginal);
            return;
        }
        // duplicates: show list below
        setSuccess(t('linksRegister.multipleFound'));
    };

    useEffect(() => {
        if (!autoGoOnce) return;
        if (loading) return;
        if (!ref.trim()) return;
        setAutoGoOnce(false);
        handleGo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoGoOnce, loading, ref]);

    // Silent mode: render a blank page while redirecting (prevents UI flash).
    if (isSilent && isRedirecting) {
        return null;
    }

    const showDuplicatesOnly = Boolean(router.query.ref) && !loading && ref.trim() && matches.length > 1;

    return (
        <>
            <Head>
                <title>{t('linksRegister.title')} - {t('common.appName')}</title>
                <meta name="robots" content="index, follow" />
            </Head>

            <Container>
                <FormSection>
                    {!showDuplicatesOnly && (
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
                                value={ref}
                                onChange={(e) => setRef(e.target.value)}
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

                            {error && <ErrorMessage>{error}</ErrorMessage>}
                            {success && <SuccessMessage>{success}</SuccessMessage>}
                        </Card>
                    )}

                    {matches.length > 1 && (
                        <div style={{ marginTop: 18 }}>
                            <Card title={t('linksRegister.duplicatesTitle')}>
                                <p style={{ marginTop: 0, opacity: 0.8 }}>
                                    {t('linksRegister.duplicatesDescription')}
                                </p>

                                <p style={{ marginTop: 8, opacity: 0.75 }}>
                                    <strong>{t('linksRegister.refLabel')}:</strong> {ref}
                                </p>

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
                                                : `${window.location.origin}${withBasePath(`/s/${encodeURIComponent(m.ReferenceName)}/`)}`;
                                            return (
                                        <div
                                            key={key}
                                            style={{
                                                border: '1px solid rgba(255,255,255,0.12)',
                                                borderRadius: 12,
                                                padding: 12,
                                                background: 'rgba(255,255,255,0.03)',
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


