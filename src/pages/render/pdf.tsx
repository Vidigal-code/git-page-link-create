import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/shared/lib/i18n';
import { decodePdfDataUrl, getPdfFileName } from '@/shared/lib/pdf';
import {
    RenderContainer,
    ErrorContainer,
    ErrorTitle,
    ErrorDescription,
    ButtonGroup,
} from '@/shared/styles/pages/render.styles';
import { PdfWrapper, PdfFrame } from '@/shared/styles/pages/render-pdf.styles';

export default function RenderPdf() {
    const router = useRouter();
    const { t } = useI18n();
    const { data, fullscreen } = router.query;

    const [pdfDataUrl, setPdfDataUrl] = useState('');
    const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
    const [error, setError] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = useState('');

    const isFullscreen = fullscreen === '1' || fullscreen === 'true';

    // Some browsers show "I/O error" when rendering blob-PDFs inside an iframe.
    // For fullscreen mode, prefer navigating directly to the blob URL once ready.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!isFullscreen) return;
        if (!pdfBlobUrl) return;
        window.location.replace(pdfBlobUrl);
    }, [isFullscreen, pdfBlobUrl]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const hash = window.location.hash || '';
        const hashData = hash.startsWith('#data=') ? hash.slice('#data='.length)
            : hash.startsWith('#d=') ? hash.slice('#d='.length)
                : '';
        const payload = typeof data === 'string' ? data : hashData;

        if (!payload) {
            setError(true);
            setIsReady(true);
            return;
        }

        try {
            const decoded = decodePdfDataUrl(payload);
            setPdfDataUrl(decoded.dataUrl);
            setPdfBytes(decoded.bytes ?? null);
            setError(false);
        } catch {
            setError(true);
        } finally {
            setIsReady(true);
        }
    }, [data]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            setPdfBlobUrl('');
            return;
        }

        try {
            const bytes = pdfBytes
                ? pdfBytes
                : (() => {
                    const base64 = pdfDataUrl.split(',')[1] ?? '';
                    if (!base64) return null;
                    const binary = atob(base64);
                    const b = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i += 1) {
                        b[i] = binary.charCodeAt(i);
                    }
                    return b;
                })();

            if (!bytes) {
                setPdfBlobUrl('');
                return;
            }

            const blob = new Blob([bytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfBlobUrl(url);
            // IMPORTANT: In fullscreen mode we navigate to `blob:`. If we revoke on unmount,
            // the browser may fail to load the PDF and show "I/O error".
            if (isFullscreen) return;
            return () => URL.revokeObjectURL(url);
        } catch {
            setPdfBlobUrl('');
        }
    }, [pdfDataUrl, pdfBytes, isFullscreen]);

    const handleDownload = () => {
        if (pdfBytes) {
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = getPdfFileName();
            link.click();
            URL.revokeObjectURL(url);
            return;
        }
        if (!pdfDataUrl) return;
        const link = document.createElement('a');
        link.href = pdfDataUrl;
        link.download = getPdfFileName();
        link.click();
    };

    if (!isReady) {
        return (
            <RenderContainer>
                <Card>
                    <p>Loading...</p>
                </Card>
            </RenderContainer>
        );
    }

    if (error) {
        return (
            <>
                <Head>
                    <title>{t('renderPdf.title')} - {t('common.appName')}</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>

                <RenderContainer>
                    <ErrorContainer>
                        <ErrorTitle>{t('renderError.title')}</ErrorTitle>
                        <ErrorDescription>{t('renderError.description')}</ErrorDescription>
                        <p style={{ marginBottom: '24px', fontStyle: 'italic', color: '#666' }}>{t('renderError.hint')}</p>
                        <ButtonGroup style={{ justifyContent: 'center' }}>
                            <Button onClick={() => window.history.back()} variant="secondary">
                                {t('notFound.goBack')}
                            </Button>
                            <Link href="/" passHref legacyBehavior>
                                <Button as="a">{t('notFound.backHome')}</Button>
                            </Link>
                        </ButtonGroup>
                    </ErrorContainer>
                </RenderContainer>
            </>
        );
    }

    if (isFullscreen) {
        // Blank while we build the blob URL; once ready we navigate to it.
        return (
            <>
                <Head>
                    <title>{t('renderPdf.title')} - {t('common.appName')}</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{t('renderPdf.title')} - {t('common.appName')}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <RenderContainer>
                <Card title={t('renderPdf.title')}>
                    <ButtonGroup>
                        <Button onClick={handleDownload} disabled={!pdfBytes && !pdfDataUrl}>
                            {t('renderPdf.download')}
                        </Button>
                    </ButtonGroup>
                </Card>

                <Card>
                    <PdfWrapper>
                        {pdfBlobUrl ? (
                            <PdfFrame src={pdfBlobUrl} title={t('renderPdf.title')} />
                        ) : (
                            <p>{t('render.error')}</p>
                        )}
                    </PdfWrapper>
                </Card>
            </RenderContainer>
        </>
    );
}