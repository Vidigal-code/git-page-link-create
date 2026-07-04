import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/shared/lib/i18n';
import { getOfficeViewerUrl } from '@/shared/lib/office';
import { downloadFile } from '@/shared/lib/download';
import { getOfficeMimeType } from '@/shared/lib/officeFormats';
import { safeOpenUrl } from '@/shared/lib/browser';
import { getOfficeHashPayload, hasOfficeDataPayload } from '@/features/render-office/lib/payload';
import { decodeOfficePayload, type DecodedOfficePayload } from '@/features/render-office/lib/officePayload';
import {
    renderOfficeDocument,
    type OfficeDocumentView,
    type OfficeSheet,
    type OfficeSlide,
} from '@/features/render-office/lib/officeDocument';
import {
    RenderContainer,
    ErrorContainer,
    ErrorTitle,
    ErrorDescription,
    ButtonGroup,
} from '@/shared/styles/pages/render.styles';
import {
    DocxContent,
    FullScreenOfficeFrame,
    OfficeCell,
    OfficeContentPanel,
    OfficeFrame,
    OfficeList,
    OfficeSheetSection,
    OfficeSheetTitle,
    OfficeSlideSection,
    OfficeSlideTitle,
    OfficeStatusPanel,
    OfficeTable,
    OfficeTextContent,
    OfficeWrapper,
} from '@/shared/styles/pages/render-office.styles';

function getPayloadFromLocation(hash: string, query: Record<string, unknown>): string {
    const hashPayload = getOfficeHashPayload(hash);
    if (hashPayload) return hashPayload;

    const shortPayload = query.d;
    if (typeof shortPayload === 'string') return shortPayload;

    const legacyPayload = query.data;
    return typeof legacyPayload === 'string' ? legacyPayload : '';
}

function renderSheet(sheet: OfficeSheet) {
    return (
        <OfficeSheetSection key={sheet.name}>
            <OfficeSheetTitle>{sheet.name}</OfficeSheetTitle>
            <OfficeTable>
                <tbody>
                    {sheet.rows.map((row, rowIndex) => (
                        <tr key={`${sheet.name}-${rowIndex}`}>
                            {row.map((cell, cellIndex) => (
                                <OfficeCell key={`${sheet.name}-${rowIndex}-${cellIndex}`}>
                                    {cell}
                                </OfficeCell>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </OfficeTable>
        </OfficeSheetSection>
    );
}

function renderSlideList(items: string[], emptyLabel: string) {
    if (items.length === 0) return <p>{emptyLabel}</p>;

    return (
        <OfficeList>
            {items.map((item, index) => (
                <li key={`${index}-${item}`}>{item}</li>
            ))}
        </OfficeList>
    );
}

function renderSlide(slide: OfficeSlide, emptyLabel: string, notesLabel: string) {
    return (
        <OfficeSlideSection key={slide.name}>
            <OfficeSlideTitle>{slide.name}</OfficeSlideTitle>
            {renderSlideList(slide.texts, emptyLabel)}
            {slide.notes.length > 0 && (
                <>
                    <h3>{notesLabel}</h3>
                    {renderSlideList(slide.notes, emptyLabel)}
                </>
            )}
        </OfficeSlideSection>
    );
}

function renderDocumentView(view: OfficeDocumentView, labels: {
    empty: string;
    unsupported: string;
    notes: string;
}) {
    switch (view.kind) {
        case 'spreadsheet':
            return view.sheets.length > 0
                ? <>{view.sheets.map(renderSheet)}</>
                : <OfficeStatusPanel>{labels.empty}</OfficeStatusPanel>;
        case 'document':
            return <DocxContent dangerouslySetInnerHTML={{ __html: view.html }} />;
        case 'presentation':
            return view.slides.length > 0
                ? <>{view.slides.map((slide) => renderSlide(slide, labels.empty, labels.notes))}</>
                : <OfficeStatusPanel>{labels.empty}</OfficeStatusPanel>;
        case 'text':
            return (
                <OfficeContentPanel>
                    <OfficeTextContent>{view.text || labels.empty}</OfficeTextContent>
                </OfficeContentPanel>
            );
        case 'unsupported':
            return <OfficeStatusPanel>{labels.unsupported}</OfficeStatusPanel>;
        default:
            return <OfficeStatusPanel>{labels.unsupported}</OfficeStatusPanel>;
    }
}

export default function RenderOffice() {
    const router = useRouter();
    const { t } = useI18n();
    const { source, fullscreen } = router.query;
    const [error, setError] = useState(false);
    const [decodedData, setDecodedData] = useState<DecodedOfficePayload | null>(null);
    const [documentView, setDocumentView] = useState<OfficeDocumentView | null>(null);
    const [isLoadingDocument, setIsLoadingDocument] = useState(false);

    const sourceUrl = useMemo(() => (typeof source === 'string' ? source : ''), [source]);
    const isFullscreen = fullscreen === '1' || fullscreen === 'true';

    useEffect(() => {
        if (!router.isReady) return undefined;

        const dataPayload = getPayloadFromLocation(window.location.hash, router.query);
        if (!dataPayload) return undefined;

        let isActive = true;
        setIsLoadingDocument(true);
        setDocumentView(null);

        try {
            const decoded = decodeOfficePayload(dataPayload);
            if (!decoded) {
                setError(true);
                setIsLoadingDocument(false);
                return undefined;
            }

            setDecodedData(decoded);
            renderOfficeDocument(decoded.bytes, decoded.type)
                .then((view) => {
                    if (!isActive) return;
                    setDocumentView(view);
                    setError(false);
                })
                .catch(() => {
                    if (!isActive) return;
                    setError(true);
                })
                .finally(() => {
                    if (!isActive) return;
                    setIsLoadingDocument(false);
                });
        } catch {
            setError(true);
            setIsLoadingDocument(false);
        }

        return () => {
            isActive = false;
        };
    }, [router.isReady, router.query]);

    useEffect(() => {
        if (!router.isReady) return;

        const hasData = sourceUrl
            || hasOfficeDataPayload(window.location.hash)
            || typeof router.query.data === 'string'
            || typeof router.query.d === 'string';

        setError(!hasData);
    }, [router.isReady, sourceUrl, router.query]);

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

    if (isFullscreen && !decodedData) {
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
                {decodedData ? (
                    <Card title={`${t('renderOffice.title')} (${decodedData.type.toUpperCase()})`}>
                        <ButtonGroup>
                            <Button onClick={() => downloadFile(decodedData.bytes, `file.${decodedData.type}`, getOfficeMimeType(decodedData.type))}>
                                {t('create.downloadOriginal')}
                            </Button>
                        </ButtonGroup>
                        {isLoadingDocument && <OfficeStatusPanel>{t('renderOffice.loading')}</OfficeStatusPanel>}
                        {!isLoadingDocument && documentView && renderDocumentView(documentView, {
                            empty: t('renderOffice.empty'),
                            unsupported: t('renderOffice.unsupported'),
                            notes: t('renderOffice.notes'),
                        })}
                    </Card>
                ) : (
                    <>
                        <Card title={t('renderOffice.title')}>
                            <ButtonGroup>
                                <Button onClick={() => safeOpenUrl(sourceUrl, '_blank')}>
                                    {t('renderOffice.openSource')}
                                </Button>
                            </ButtonGroup>
                        </Card>

                        <OfficeWrapper>
                            <OfficeFrame src={viewerUrl} title={t('renderOffice.title')} />
                        </OfficeWrapper>
                    </>
                )}
            </RenderContainer>
        </>
    );
}
