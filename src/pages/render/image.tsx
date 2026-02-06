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
    const { data } = router.query;

    const [imageDataUrl, setImageDataUrl] = useState('');
    const [imageExtension, setImageExtension] = useState('png');
    const [error, setError] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const hash = window.location.hash || '';
        const hashData = hash.startsWith('#data=') ? hash.slice('#data='.length) : '';
        const payload = typeof data === 'string' ? data : hashData;

        if (!payload) {
            setError(true);
            setIsReady(true);
            return;
        }

        try {
            const decoded = decodeImageDataUrl(payload);
            setImageDataUrl(decoded.dataUrl);
            setImageExtension(decoded.extension);
            setError(false);
        } catch {
            setError(true);
        } finally {
            setIsReady(true);
        }
    }, [data]);

    const handleDownload = () => {
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
                        <Button onClick={handleDownload} disabled={!imageDataUrl}>
                            {t('renderImage.download')}
                        </Button>
                    </ButtonGroup>
                </Card>

                <Card>
                    <ImageWrapper>
                        {imageDataUrl ? (
                            <RenderedImage src={imageDataUrl} alt={t('renderImage.title')} />
                        ) : (
                            <p>{t('render.error')}</p>
                        )}
                    </ImageWrapper>
                </Card>
            </RenderContainer>
        </>
    );
}