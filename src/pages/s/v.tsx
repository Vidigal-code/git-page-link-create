import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useI18n } from '@/shared/lib/i18n';
import { fetchLinksRegister, findLinksByReference, type LinksRegisterEntry } from '@/shared/lib/linksRegister';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Container, FormSection, ButtonGroup, ErrorMessage, SuccessMessage } from '@/shared/styles/pages/create.styles';

function openUrl(url: string): void {
    if (typeof window === 'undefined') return;
    window.location.replace(url);
}

export default function LinksRegisterVPage() {
    const { t } = useI18n();
    const [ref, setRef] = useState('');
    const [title, setTitle] = useState<string>('');
    const [entries, setEntries] = useState<LinksRegisterEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            setSuccess(t('linksRegister.redirecting'));
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

    return (
        <>
            <Head>
                <title>{t('linksRegister.title')} - {t('common.appName')}</title>
                <meta name="robots" content="index, follow" />
            </Head>

            <Container>
                <FormSection>
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
                            <Button onClick={handleGo} disabled={loading}>
                                {loading ? t('linksRegister.loading') : t('linksRegister.go')}
                            </Button>
                        </ButtonGroup>

                        {error && <ErrorMessage>{error}</ErrorMessage>}
                        {success && <SuccessMessage>{success}</SuccessMessage>}
                    </Card>

                    {matches.length > 1 && (
                        <div style={{ marginTop: 18 }}>
                            <Card title={t('linksRegister.duplicatesTitle')}>
                                <p style={{ marginTop: 0, opacity: 0.8 }}>
                                    {t('linksRegister.duplicatesDescription')}
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
                                        <div
                                            key={`${m.ReferenceName}-${idx}`}
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
                                                <Button onClick={() => openUrl(m.LinkOriginal)} variant="secondary">
                                                    {t('linksRegister.open')}
                                                </Button>
                                            </div>

                                            <textarea
                                                readOnly
                                                value={m.LinkOriginal}
                                                rows={3}
                                                style={{
                                                    marginTop: 10,
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: 8,
                                                    background: 'rgba(0,0,0,0.15)',
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
                                        </div>
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


