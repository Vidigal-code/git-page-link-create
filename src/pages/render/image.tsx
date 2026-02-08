import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/shared/lib/i18n';
import { decodeImageDataUrl, getImageFileName } from '@/shared/lib/image';
import {
    RenderContainer,
    ErrorContainer,
    ErrorTitle,
    ErrorDescription,
    ButtonGroup,
} from '@/shared/styles/pages/render.styles';
import { ImageWrapper, RenderedImage } from '@/shared/styles/pages/render-image.styles';

export default function RenderImage() {
    const router = useRouter();
    const { t } = useI18n();
    const { data, source } = router.query;

    const [imageDataUrl, setImageDataUrl] = useState('');
    const [imageBytes, setImageBytes] = useState<Uint8Array | null>(null);
    const [imageExtension, setImageExtension] = useState('png');
    const [imageMimeType, setImageMimeType] = useState('image/png');
    const [imageSourceUrl, setImageSourceUrl] = useState('');
    const [imageBlobUrl, setImageBlobUrl] = useState('');
    const [error, setError] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const sourceUrl = typeof source === 'string' ? source : '';
        if (sourceUrl) {
            const extension = sourceUrl.split('?')[0].split('.').pop() || 'png';
            setImageSourceUrl(sourceUrl);
            setImageExtension(extension);
            setImageDataUrl('');
            setError(false);
            setIsReady(true);
            return;
        }

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
            const decoded = decodeImageDataUrl(payload);
            // Avoid rendering giant data URLs directly (can throw "URI Too Long" in some browsers).
            if (!decoded.bytes && decoded.dataUrl?.startsWith('data:') && decoded.dataUrl.length > 20_000) {
                const base64 = decoded.dataUrl.split(',')[1] ?? '';
                if (base64) {
                    const binary = atob(base64);
                    const bytes = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i += 1) {
                        bytes[i] = binary.charCodeAt(i);
                    }
                    setImageBytes(bytes);
                    setImageDataUrl('');
                } else {
                    setImageDataUrl(decoded.dataUrl);
                    setImageBytes(null);
                }
            } else {
                setImageDataUrl(decoded.dataUrl);
                setImageBytes(decoded.bytes ?? null);
            }
            setImageExtension(decoded.extension);
            setImageMimeType(decoded.mimeType || 'image/png');
            setError(false);
        } catch {
            setError(true);
        } finally {
            setIsReady(true);
        }
    }, [data]);

    // Note: we convert legacy huge `data:` payloads to bytes in the main decode effect above,
    // to avoid even a single render with an oversized `src=...`.

    useEffect(() => {
        if (!imageBytes || typeof window === 'undefined') {
            setImageBlobUrl('');
            return;
        }
        try {
            const blob = new Blob([imageBytes.slice().buffer as ArrayBuffer], { type: imageMimeType || 'image/png' });
            const url = URL.createObjectURL(blob);
            setImageBlobUrl(url);
            return () => URL.revokeObjectURL(url);
        } catch {
            setImageBlobUrl('');
        }
    }, [imageBytes, imageMimeType]);

    const handleDownload = () => {
        if (imageSourceUrl) {
            const link = document.createElement('a');
            link.href = imageSourceUrl;
            link.download = getImageFileName(imageExtension);
            link.click();
            return;
        }

        if (imageBytes) {
            const blob = new Blob([imageBytes.slice().buffer as ArrayBuffer], { type: imageMimeType || 'image/png' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = getImageFileName(imageExtension);
            link.click();
            URL.revokeObjectURL(url);
            return;
        }

        if (!imageDataUrl) return;
        const link = document.createElement('a');
        link.href = imageDataUrl;
        link.download = getImageFileName(imageExtension);
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
                    <title>{t('renderImage.title')} - {t('common.appName')}</title>
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

    return (
        <>
            <Head>
                <title>{t('renderImage.title')} - {t('common.appName')}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <RenderContainer>
                <Card title={t('renderImage.title')}>
                    <ButtonGroup>
                        <Button onClick={handleDownload} disabled={!imageSourceUrl && !imageBlobUrl && !imageDataUrl && !imageBytes}>
                            {t('renderImage.download')}
                        </Button>
                    </ButtonGroup>
                </Card>

                <Card>
                    <ImageWrapper>
                        {imageSourceUrl || imageBlobUrl || imageDataUrl ? (
                            <RenderedImage src={imageSourceUrl || imageBlobUrl || imageDataUrl} alt={t('renderImage.title')} />
                        ) : (
                            <p>{t('render.error')}</p>
                        )}
                    </ImageWrapper>
                </Card>
            </RenderContainer>
        </>
    );
}