import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useI18n } from '@/shared/lib/i18n';
import { BASE_PATH, withBasePath } from '@/shared/lib/basePath';
import { decodeRefCode, decodeShortUrlToken } from '@/shared/lib/shorturl';
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
    LinkDisplay,
} from '@/shared/styles/pages/create.styles';

function extractCodeFromLocation(): string {
    if (typeof window === 'undefined') return '';

    // Prefer query param
    const params = new URLSearchParams(window.location.search);
    const code = params.get('c') || params.get('code');
    if (code) return code;

    // Fallback: hash `#c=...` / `#code=...`
    const hash = window.location.hash || '';
    if (hash.startsWith('#c=')) return hash.slice('#c='.length);
    if (hash.startsWith('#code=')) return hash.slice('#code='.length);

    // Fallback: path `/shorturl/AT...` (useful in dev/other hosts)
    const normalizedBase = BASE_PATH.startsWith('/') ? BASE_PATH : `/${BASE_PATH}`;
    const cleanBase = normalizedBase.endsWith('/') ? normalizedBase.slice(0, -1) : normalizedBase;
    let path = window.location.pathname;
    if (cleanBase && path.startsWith(cleanBase)) path = path.slice(cleanBase.length);
    if (!path.startsWith('/')) path = `/${path}`;

    const prefixes = ['/shorturl/', '/s/'];
    const prefix = prefixes.find((p) => path.startsWith(p));
    if (!prefix) return '';
    return path.slice(prefix.length).replace(/\/$/, '');
}

function extractTokenFromUserInput(value: string): string {
    const cleaned = value.trim();
    if (!cleaned) return '';

    // Raw token
    if (/^AT[0-9A-Za-z][0-9A-Za-z\-_]+$/i.test(cleaned)) return cleaned;

    // Full URL containing `/shorturl/<code>` or `/s/<code>`
    const matchPath = /\/(?:shorturl|s)\/(AT[0-9A-Za-z][0-9A-Za-z\-_]+|[a-z0-9]{1,3}-[^?#\s]+)/i.exec(cleaned);
    if (matchPath?.[1]) return matchPath[1];

    // URL containing `?c=...` or `?code=...`
    const matchQuery = /[?&](?:c|code)=(AT[0-9A-Za-z][0-9A-Za-z\-_]+)/i.exec(cleaned);
    if (matchQuery?.[1]) return matchQuery[1];

    // Hash containing `#c=...` or `#code=...`
    const matchHash = /#(?:c|code)=(AT[0-9A-Za-z][0-9A-Za-z\-_]+)/i.exec(cleaned);
    if (matchHash?.[1]) return matchHash[1];

    return cleaned;
}

export default function ShortUrlRedirectPage() {
    const router = useRouter();
    const { t } = useI18n();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [manualTokenInput, setManualTokenInput] = useState('');
    const [decodedUrl, setDecodedUrl] = useState('');
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

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!code) return;

        try {
            // 1) AT* tokens (legacy digits-only + new compact v2)
            if (code.trim().toUpperCase().startsWith('AT')) {
                const url = decodeShortUrlToken(code);
                window.location.replace(url);
                return;
            }

            // 2) Reference codes (vh-/vp-/yt-/...)
            const decoded = decodeRefCode(code);
            if (!decoded) {
                throw new Error('Invalid shorturl token');
            }
            if (decoded.kind === 'absolute') {
                window.location.replace(decoded.url);
                return;
            }

            const target = `${window.location.origin}${decoded.path}`;
            window.location.replace(target);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Invalid shorturl token');
        }
    }, [code]);

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
            if (token.trim().toUpperCase().startsWith('AT')) {
                const url = decodeShortUrlToken(token);
                setDecodedUrl(url);
            } else {
                const decoded = decodeRefCode(token);
                if (!decoded) throw new Error(t('shorturlDecoder.invalidToken'));
                if (decoded.kind === 'absolute') {
                    setDecodedUrl(decoded.url);
                } else {
                    setDecodedUrl(`${window.location.origin}${decoded.path}`);
                }
            }
            setSuccess(t('shorturlDecoder.decoded'));
        } catch (e) {
            setError(e instanceof Error ? e.message : t('shorturlDecoder.invalidToken'));
        }
    };

    const handleRedirect = () => {
        if (!decodedUrl || typeof window === 'undefined') return;
        window.location.replace(decodedUrl);
    };

    const handleCopy = async (value: string) => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
                setSuccess(t('create.linkCopied'));
            }
        } catch {
            // ignore
        }
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
                                    <LinkDisplay style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                                        {decodedUrl}
                                    </LinkDisplay>

                                    <ButtonGroup>
                                        <Button onClick={handleRedirect}>
                                            {t('shorturlDecoder.redirect')}
                                        </Button>
                                        <Button onClick={() => handleCopy(decodedUrl)} variant="secondary">
                                            {t('create.copyLink')}
                                        </Button>
                                        <Button
                                            onClick={() => window.open(decodedUrl, '_blank', 'noopener,noreferrer')}
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
                    <p style={{ margin: '0 0 6px', opacity: 0.85 }}>
                        <strong>{t('shorturlDecoder.codeLabel')}:</strong>
                    </p>
                    <LinkDisplay style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                        {code}
                    </LinkDisplay>
                </Card>
            </RenderContainer>
        </>
    );
}


