import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/shared/lib/i18n';
import { decodeVideoDataUrl, getVideoFileName } from '@/shared/lib/video';
import {
    RenderContainer,
    ErrorContainer,
    ErrorTitle,
    ErrorDescription,
    ButtonGroup,
} from '@/shared/styles/pages/render.styles';
import { VideoWrapper, RenderedVideo, FullScreenVideo } from '@/shared/styles/pages/render-video.styles';

export default function RenderVideo() {
    const router = useRouter();
    const { t } = useI18n();
    const { data, fullscreen, source } = router.query;

    const [videoDataUrl, setVideoDataUrl] = useState('');
    const [videoBytes, setVideoBytes] = useState<Uint8Array | null>(null);
    const [videoMimeType, setVideoMimeType] = useState('video/mp4');
    const [videoExtension, setVideoExtension] = useState('mp4');
    const [videoSourceUrl, setVideoSourceUrl] = useState('');
    const [error, setError] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [videoBlobUrl, setVideoBlobUrl] = useState('');

    const isFullscreen = fullscreen === '1' || fullscreen === 'true';

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const sourceUrl = typeof source === 'string' ? source : '';
        if (sourceUrl) {
            const extension = sourceUrl.split('?')[0].split('.').pop() || 'mp4';
            setVideoSourceUrl(sourceUrl);
            setVideoExtension(extension);
            setVideoDataUrl('');
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
            const decoded = decodeVideoDataUrl(payload);
            setVideoDataUrl(decoded.dataUrl);
            setVideoBytes(decoded.bytes ?? null);
            setVideoMimeType(decoded.mimeType || 'video/mp4');
            setVideoExtension(decoded.extension);
            setError(false);
        } catch {
            setError(true);
        } finally {
            setIsReady(true);
        }
    }, [data]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            setVideoBlobUrl('');
            return;
        }

        try {
            const bytes = videoBytes
                ? videoBytes
                : (() => {
                    const base64 = videoDataUrl.split(',')[1] ?? '';
                    if (!base64) return null;
                    const binary = atob(base64);
                    const b = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i += 1) {
                        b[i] = binary.charCodeAt(i);
                    }
                    return b;
                })();

            if (!bytes) {
                setVideoBlobUrl('');
                return;
            }

            const blob = new Blob([bytes], { type: videoMimeType || 'video/mp4' });
            const url = URL.createObjectURL(blob);
            setVideoBlobUrl(url);
            return () => URL.revokeObjectURL(url);
        } catch {
            setVideoBlobUrl('');
        }
    }, [videoDataUrl, videoBytes, videoMimeType]);

    const handleDownload = () => {
        if (videoSourceUrl) {
            const link = document.createElement('a');
            link.href = videoSourceUrl;
            link.download = getVideoFileName(videoExtension);
            link.click();
            return;
        }

        if (videoBytes) {
            const blob = new Blob([videoBytes], { type: videoMimeType || 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = getVideoFileName(videoExtension);
            link.click();
            URL.revokeObjectURL(url);
            return;
        }

        if (!videoDataUrl) return;
        const link = document.createElement('a');
        link.href = videoDataUrl;
        link.download = getVideoFileName(videoExtension);
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
                    <title>{t('renderVideo.title')} - {t('common.appName')}</title>
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
        return (
            <>
                <Head>
                    <title>{t('renderVideo.title')} - {t('common.appName')}</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <FullScreenVideo controls src={videoSourceUrl || videoBlobUrl || undefined} />
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{t('renderVideo.title')} - {t('common.appName')}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <RenderContainer>
                <Card title={t('renderVideo.title')}>
                    <ButtonGroup>
                        <Button onClick={handleDownload} disabled={!videoDataUrl}>
                            {t('renderVideo.download')}
                        </Button>
                    </ButtonGroup>
                </Card>

                <Card>
                    <VideoWrapper>
                        {videoSourceUrl || videoBlobUrl ? (
                            <RenderedVideo controls src={videoSourceUrl || videoBlobUrl} />
                        ) : (
                            <p>{t('render.error')}</p>
                        )}
                    </VideoWrapper>
                </Card>
            </RenderContainer>
        </>
    );
}