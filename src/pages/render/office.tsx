import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/shared/lib/i18n';
import { getOfficeViewerUrl } from '@/shared/lib/office';
import {
    RenderContainer,
    ErrorContainer,
    ErrorTitle,
    ErrorDescription,
    ButtonGroup,
} from '@/shared/styles/pages/render.styles';
import { OfficeWrapper, OfficeFrame, FullScreenOfficeFrame } from '@/shared/styles/pages/render-office.styles';

export default function RenderOffice() {
    const router = useRouter();
    const { t } = useI18n();
    const { source, fullscreen } = router.query;
    const [error, setError] = useState(false);

    const sourceUrl = useMemo(() => (typeof source === 'string' ? source : ''), [source]);
    const isFullscreen = fullscreen === '1' || fullscreen === 'true';

    useEffect(() => {
        if (!sourceUrl) {
            setError(true);
            return;
        }
        setError(false);
    }, [sourceUrl]);

    if (error) {
        return (
            <>
                <Head>
                    <title>{t('renderOffice.title')} - {t('common.appName')}</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>

                <RenderContainer>
                    <ErrorContainer>
                        <ErrorTitle>{t('renderError.title')}</ErrorTitle>
                        <ErrorDescription>{t('renderOffice.missingSource')}</ErrorDescription>
                        <p style={{ marginBottom: '24px', fontStyle: 'italic', color: '#666' }}>{t('renderOffice.hint')}</p>
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

    const viewerUrl = getOfficeViewerUrl(sourceUrl);

    if (isFullscreen) {
        return (
            <>
                <Head>
                    <title>{t('renderOffice.title')} - {t('common.appName')}</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <FullScreenOfficeFrame src={viewerUrl} title={t('renderOffice.title')} />
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{t('renderOffice.title')} - {t('common.appName')}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <RenderContainer>
                <Card title={t('renderOffice.title')}>
                    <ButtonGroup>
                        <Button onClick={() => window.open(sourceUrl, '_blank')}>
                            {t('renderOffice.openSource')}
                        </Button>
                    </ButtonGroup>
                </Card>

                <OfficeWrapper>
                    <OfficeFrame src={viewerUrl} title={t('renderOffice.title')} />
                </OfficeWrapper>
            </RenderContainer>
        </>
    );
}
