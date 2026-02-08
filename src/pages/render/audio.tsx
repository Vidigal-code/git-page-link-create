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
    const [audioBytes, setAudioBytes] = useState<Uint8Array | null>(null);
    const [audioMimeType, setAudioMimeType] = useState('audio/mpeg');
    const [audioExtension, setAudioExtension] = useState('mp3');
    const [audioSourceUrl, setAudioSourceUrl] = useState('');
    const [error, setError] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [audioBlobUrl, setAudioBlobUrl] = useState('');

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
            const decoded = decodeAudioDataUrl(payload);
            // Avoid giant legacy data URLs (can throw "URI Too Long" in some browsers).
            if (!decoded.bytes && decoded.dataUrl?.startsWith('data:') && decoded.dataUrl.length > 20_000) {
                const base64 = decoded.dataUrl.split(',')[1] ?? '';
                if (base64) {
                    const binary = atob(base64);
                    const bytes = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i += 1) {
                        bytes[i] = binary.charCodeAt(i);
                    }
                    setAudioBytes(bytes);
                    setAudioDataUrl('');
                } else {
                    setAudioDataUrl(decoded.dataUrl);
                    setAudioBytes(null);
                }
            } else {
                setAudioDataUrl(decoded.dataUrl);
                setAudioBytes(decoded.bytes ?? null);
            }
            setAudioMimeType(decoded.mimeType || 'audio/mpeg');
            setAudioExtension(decoded.extension);
            setError(false);
        } catch {
            setError(true);
        } finally {
            setIsReady(true);
        }
    }, [data, source]);
    // Note: we convert legacy huge `data:` payloads to bytes in the main decode effect above,
    // to avoid even a single render with an oversized `src=...`.

    useEffect(() => {
        if (!audioBytes || typeof window === 'undefined') {
            setAudioBlobUrl('');
            return;
        }
        try {
            const blob = new Blob([audioBytes], { type: audioMimeType || 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            setAudioBlobUrl(url);
            return () => URL.revokeObjectURL(url);
        } catch {
            setAudioBlobUrl('');
        }
    }, [audioBytes, audioMimeType]);

    const handleDownload = () => {
        if (audioSourceUrl) {
            const link = document.createElement('a');
            link.href = audioSourceUrl;
            link.download = getAudioFileName(audioExtension);
            link.click();
            return;
        }

        if (audioBytes) {
            const blob = new Blob([audioBytes], { type: audioMimeType || 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = getAudioFileName(audioExtension);
            link.click();
            URL.revokeObjectURL(url);
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
                <FullScreenAudio controls src={audioSourceUrl || audioBlobUrl || audioDataUrl || undefined} />
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
                        <Button onClick={handleDownload} disabled={!audioSourceUrl && !audioBlobUrl && !audioDataUrl && !audioBytes}>
                            {t('renderAudio.download')}
                        </Button>
                    </ButtonGroup>
                </Card>

                <Card>
                    <AudioWrapper>
                        {audioSourceUrl || audioBlobUrl || audioDataUrl ? (
                            <RenderedAudio controls src={audioSourceUrl || audioBlobUrl || audioDataUrl} />
                        ) : (
                            <p>{t('render.error')}</p>
                        )}
                    </AudioWrapper>
                </Card>
            </RenderContainer>
        </>
    );
}
