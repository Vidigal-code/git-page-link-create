import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ReadOnlyTextarea } from '@/shared/ui/ReadOnlyTextarea';
import { useI18n } from '@/shared/lib/i18n';
import { withBasePath } from '@/shared/lib/basePath';
import { copyTextToClipboard, safeLocationReplace, safeOpenUrl } from '@/shared/lib/browser';
import {
    RenderContainer,
    ErrorContainer,
    ErrorTitle,
    ErrorDescription,
    ButtonGroup,
} from '@/shared/styles/pages/render.styles';
import {
    Container,
    FormSection,
    ErrorMessage,
    SuccessMessage,
} from '@/shared/styles/pages/create.styles';
import { extractCodeFromLocation, extractTokenFromUserInput } from '@/shared/lib/shorturl';
import { resolveShortUrlTarget } from '@/features/shorturl/model/resolveTargetUrl';
import { useShortUrlRedirect } from '@/features/shorturl/model/useShortUrlRedirect';

export default function ShortUrlRedirectPage() {
    const router = useRouter();
    const { t } = useI18n();
    const [success, setSuccess] = useState<string>('');
    const [manualTokenInput, setManualTokenInput] = useState('');
    const [silentRedirect] = useState(() => {
        if (typeof window === 'undefined') return true;
        try {
            const params = new URLSearchParams(window.location.search);
            const z = params.get('z');
            if (z === '1') return true;
            if (z === '0') return false;
            const saved = window.localStorage.getItem('shorturlCreate.instantRenderer');
            return saved !== '0'; // default: enabled
        } catch {
            return true;
        }
    });

    const code = useMemo(() => {
        const q = router.query.c ?? router.query.code;
        if (typeof q === 'string') return q;
        return extractCodeFromLocation();
    }, [router.query.c, router.query.code]);
    const {
        error,
        setError,
        decodedUrl,
        setDecodedUrl,
        countdownSec,
    } = useShortUrlRedirect(code, silentRedirect);

    const handleDecode = () => {
        setError('');
        setSuccess('');
        setDecodedUrl('');

        const token = extractTokenFromUserInput(manualTokenInput);
        if (!token) {
            setError(t('shorturlDecoder.missingToken'));
            return;
        }

        try {
            const url = resolveShortUrlTarget(token);
            setDecodedUrl(url);
            setSuccess(t('shorturlDecoder.decoded'));
        } catch (e) {
            setError(e instanceof Error ? e.message : t('shorturlDecoder.invalidToken'));
        }
    };

    const handleRedirect = () => {
        if (!decodedUrl || typeof window === 'undefined') return;
        safeLocationReplace(decodedUrl);
    };

    const handleCopy = async (value: string) => {
        const ok = await copyTextToClipboard(value);
        if (!ok) return;
        setSuccess(t('create.linkCopied'));
    };

    // When visiting `/shorturl` without a token, act as a decoder UI.
    if (!code) {
        return (
            <>
                <Head>
                    <title>{t('shorturlDecoder.title')} - {t('common.appName')}</title>
                    <meta name="robots" content="index, follow" />
                </Head>

                <Container>
                    <FormSection>
                        <Card title={t('shorturlDecoder.title')}>
                            <p style={{ marginTop: 0, opacity: 0.85 }}>
                                {t('shorturlDecoder.description')}
                            </p>

                            <Input
                                label={t('shorturlDecoder.tokenLabel')}
                                placeholder={t('shorturlDecoder.tokenPlaceholder')}
                                value={manualTokenInput}
                                onChange={(e) => setManualTokenInput(e.target.value)}
                            />

                            <ButtonGroup>
                                <Button onClick={handleDecode}>
                                    {t('shorturlDecoder.decode')}
                                </Button>
                                <Link href={withBasePath('/shorturl-create')} passHref legacyBehavior>
                                    <Button as="a" variant="secondary">
                                        {t('shorturlDecoder.openCreator')}
                                    </Button>
                                </Link>
                            </ButtonGroup>

                            {error && <ErrorMessage>{error}</ErrorMessage>}
                            {success && <SuccessMessage>{success}</SuccessMessage>}
                        </Card>

                        {decodedUrl && (
                            <div style={{ marginTop: 24 }}>
                                <Card title={t('shorturlDecoder.resultTitle')}>
                                    <p style={{ margin: '0 0 6px' }}>
                                        <strong>{t('shorturlDecoder.decodedUrlLabel')}:</strong>
                                    </p>
                                    <ReadOnlyTextarea readOnly value={decodedUrl} rows={3} />

                                    <ButtonGroup>
                                        <Button onClick={handleRedirect}>
                                            {t('shorturlDecoder.redirect')}
                                        </Button>
                                        <Button onClick={() => handleCopy(decodedUrl)} variant="secondary">
                                            {t('create.copyLink')}
                                        </Button>
                                        <Button
                                            onClick={() => safeOpenUrl(decodedUrl, '_blank', 'noopener,noreferrer')}
                                            variant="secondary"
                                        >
                                            {t('create.openLink')}
                                        </Button>
                                    </ButtonGroup>
                                </Card>
                            </div>
                        )}
                    </FormSection>
                </Container>
            </>
        );
    }

    // If we reached this point, we have `code` and will attempt redirect (or show error).
    if (error) {
        return (
            <>
                <Head>
                    <title>{t('shorturlDecoder.title')} - {t('common.appName')}</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <RenderContainer>
                    <ErrorContainer>
                        <ErrorTitle>{t('renderError.title')}</ErrorTitle>
                        <ErrorDescription>{t('renderError.description')}</ErrorDescription>
                        <p style={{ marginBottom: '24px', fontStyle: 'italic', color: '#666' }}>
                            {error}
                        </p>
                        <ButtonGroup style={{ justifyContent: 'center' }}>
                            <Button onClick={() => window.history.back()} variant="secondary">
                                {t('notFound.goBack')}
                            </Button>
                            <Link href={withBasePath('/')} passHref legacyBehavior>
                                <Button as="a">{t('notFound.backHome')}</Button>
                            </Link>
                        </ButtonGroup>
                    </ErrorContainer>
                </RenderContainer>
            </>
        );
    }

    // Silent mode: when a short code is present we don't render any "Redirecting..." UI.
    // This avoids flashing a card before leaving the page.
    if (code && silentRedirect) {
        // Blank page: no layout (handled in _app) and no UI flash.
        return null;
    }

    return (
        <>
            <Head>
                <title>{t('shorturlDecoder.redirectingTitle')} - {t('common.appName')}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <RenderContainer>
                <Card title={t('shorturlDecoder.redirectingTitle')}>
                    <p style={{ margin: '0 0 10px', opacity: 0.85 }}>
                        <strong>{t('shorturlDecoder.codeLabel')}:</strong>
                    </p>
                    <textarea
                        readOnly
                        value={code}
                        aria-label={t('shorturlDecoder.codeLabel')}
                        rows={6}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: 8,
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: 'inherit',
                            fontFamily: 'monospace',
                            resize: 'vertical',
                            maxHeight: 220,
                            overflowY: 'auto',
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word',
                        }}
                    />

                    {decodedUrl && (
                        <>
                            <p style={{ margin: '14px 0 6px', opacity: 0.85 }}>
                                <strong>{t('shorturlDecoder.decodedUrlLabel')}:</strong>
                            </p>
                            <textarea
                                readOnly
                                value={decodedUrl}
                                aria-label={t('shorturlDecoder.decodedUrlLabel')}
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
                                    maxHeight: 180,
                                    overflowY: 'auto',
                                    whiteSpace: 'pre-wrap',
                                    overflowWrap: 'anywhere',
                                    wordBreak: 'break-word',
                                }}
                            />
                        </>
                    )}

                    <p style={{ marginTop: 14, opacity: 0.8 }}>
                        {t('shorturlDecoder.redirectingIn')} {countdownSec}s…
                    </p>

                    {decodedUrl && (
                        <ButtonGroup>
                            <Button onClick={handleRedirect}>
                                {t('shorturlDecoder.redirect')}
                            </Button>
                            <Button onClick={() => handleCopy(decodedUrl)} variant="secondary">
                                {t('create.copyLink')}
                            </Button>
                        </ButtonGroup>
                    )}
                </Card>
            </RenderContainer>
        </>
    );
}


