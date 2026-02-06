import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/shared/lib/i18n';
import { decodeAudioDataUrl, getAudioFileName } from '@/shared/lib/audio';
import {
    RenderContainer,
    ErrorContainer,
    ErrorTitle,
    ErrorDescription,
    ButtonGroup,
} from '@/shared/styles/pages/render.styles';
import { AudioWrapper, RenderedAudio, FullScreenAudio } from '@/shared/styles/pages/render-audio.styles';

export default function RenderAudio() {
    const router = useRouter();
    const { t } = useI18n();
    const { data, fullscreen, source } = router.query;

    const [audioDataUrl, setAudioDataUrl] = useState('');
    const [audioExtension, setAudioExtension] = useState('mp3');
    const [audioSourceUrl, setAudioSourceUrl] = useState('');
    const [error, setError] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const isFullscreen = fullscreen === '1' || fullscreen === 'true';

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const sourceUrl = typeof source === 'string' ? source : '';
        if (sourceUrl) {
            const extension = sourceUrl.split('?')[0].split('.').pop() || 'mp3';
            setAudioSourceUrl(sourceUrl);
            setAudioExtension(extension);
            setAudioDataUrl('');
            setError(false);
            setIsReady(true);
            return;
        }

        const hash = window.location.hash || '';
        const hashData = hash.startsWith('#data=') ? hash.slice('#data='.length) : '';
        const payload = typeof data === 'string' ? data : hashData;

        if (!payload) {
            setError(true);
            setIsReady(true);
            return;
        }

        try {
            const decoded = decodeAudioDataUrl(payload);
            setAudioDataUrl(decoded.dataUrl);
            setAudioExtension(decoded.extension);
            setError(false);
        } catch {
            setError(true);
        } finally {
            setIsReady(true);
        }
    }, [data, source]);

    const handleDownload = () => {
        if (audioSourceUrl) {
            const link = document.createElement('a');
            link.href = audioSourceUrl;
            link.download = getAudioFileName(audioExtension);
            link.click();
            return;
        }

        if (!audioDataUrl) return;
        const link = document.createElement('a');
        link.href = audioDataUrl;
        link.download = getAudioFileName(audioExtension);
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
                    <title>{t('renderAudio.title')} - {t('common.appName')}</title>
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
                    <title>{t('renderAudio.title')} - {t('common.appName')}</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <FullScreenAudio controls src={audioSourceUrl || audioDataUrl || undefined} />
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{t('renderAudio.title')} - {t('common.appName')}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <RenderContainer>
                <Card title={t('renderAudio.title')}>
                    <ButtonGroup>
                        <Button onClick={handleDownload} disabled={!audioDataUrl && !audioSourceUrl}>
                            {t('renderAudio.download')}
                        </Button>
                    </ButtonGroup>
                </Card>

                <Card>
                    <AudioWrapper>
                        {audioSourceUrl || audioDataUrl ? (
                            <RenderedAudio controls src={audioSourceUrl || audioDataUrl} />
                        ) : (
                            <p>{t('render.error')}</p>
                        )}
                    </AudioWrapper>
                </Card>
            </RenderContainer>
        </>
    );
}
