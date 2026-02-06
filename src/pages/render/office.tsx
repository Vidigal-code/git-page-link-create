import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/shared/lib/i18n';
import { getOfficeViewerUrl } from '@/shared/lib/office';
import { decompressBytes } from '@/shared/lib/compression';
import { downloadFile } from '@/shared/lib/download';
import * as XLSX from 'xlsx';
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

    const [decodedData, setDecodedData] = useState<{ type: string; bytes: Uint8Array } | null>(null);
    const [tableData, setTableData] = useState<any[][] | null>(null);

    useEffect(() => {
        const hash = window.location.hash;
        if (!hash.startsWith('#data=')) return;

        try {
            const payload = hash.substring(6);
            const separatorIndex = payload.indexOf('-');
            if (separatorIndex === -1) return;

            const type = payload.substring(0, separatorIndex);
            const compressedContent = payload.substring(separatorIndex + 1);
            const bytes = decompressBytes(compressedContent);

            setDecodedData({ type, bytes });

            if (type === 'xlsx' || type === 'xls') {
                const workbook = XLSX.read(bytes, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
                setTableData(data);
            }
        } catch (err) {
            //console.error('Error decoding office data:', err);
            setError(true);
        }
    }, []);

    useEffect(() => {
        if (!sourceUrl && !window.location.hash.includes('data=')) {
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
                {decodedData ? (
                    <Card title={`${t('renderOffice.title')} (${decodedData.type.toUpperCase()})`}>
                        <ButtonGroup>
                            <Button onClick={() => downloadFile(decodedData.bytes, `file.${decodedData.type}`, 'application/octet-stream')}>
                                {t('create.downloadOriginal')}
                            </Button>
                        </ButtonGroup>
                        {tableData ? (
                            <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'inherit' }}>
                                    <tbody>
                                        {tableData.map((row, i) => (
                                            <tr key={i}>
                                                {row.map((cell, j) => (
                                                    <td key={j} style={{ border: '1px solid #444', padding: '8px' }}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{ marginTop: '20px', padding: '40px', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <p>Este arquivo ({decodedData.type.toUpperCase()}) não pode ser visualizado diretamente no navegador, mas você pode baixá-lo acima.</p>
                            </div>
                        )}
                    </Card>
                ) : (
                    <>
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
                    </>
                )}
            </RenderContainer>
        </>
    );
}
