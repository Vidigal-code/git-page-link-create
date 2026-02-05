import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { marked } from 'marked';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/shared/lib/i18n';
import { decompress, decompressBytes } from '@/shared/lib/compression';
import { downloadFile, getMimeType, getFileExtension } from '@/shared/lib/download';
import {
        RenderContainer,
        IframeContainer,
        StyledIframe,
        ScrollableContent,
        MarkdownContent,
        TableContainer,
        StyledTable,
        ErrorContainer,
        ErrorTitle,
        ErrorDescription,
        ButtonGroup,
} from '@/shared/styles/pages/render.styles';

type TableCell = string | number | null;
type TableData = TableCell[][];

export default function Render() {
    const router = useRouter();
    const { hash, data } = router.query;
    const { t } = useI18n();

    const [content, setContent] = useState<string | Uint8Array>('');
    const [contentType, setContentType] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const resolvedHash = typeof hash === 'string'
        ? hash
        : typeof data === 'string'
            ? data
            : '';

    useEffect(() => {
        if (!resolvedHash) return;

        // The hash format is now: [type]-[compressed_content]
    const separatorIndex = resolvedHash.indexOf('-');

        if (separatorIndex === -1) {
            // Fallback for old style or invalid links
            setError(true);
            setIsLoading(false);
            return;
        }

    const type = resolvedHash.substring(0, separatorIndex);
    const compressedContent = resolvedHash.substring(separatorIndex + 1);

        try {
            if (type === 'xlsx') {
                const decompressed = decompressBytes(compressedContent);
                setContent(decompressed);
            } else {
                const decompressed = decompress(compressedContent);
                setContent(decompressed);
            }
            setContentType(type);
            setIsLoading(false);
        } catch {
            setError(true);
            setIsLoading(false);
        }
    }, [resolvedHash]);

    const handleDownloadOriginal = () => {
        if (!content || !contentType) return;
        const filename = `content${getFileExtension(contentType)}`;
        const mimeType = getMimeType(contentType);
        downloadFile(content, filename, mimeType);
    };

    const renderContent = () => {
        if (contentType === 'html') {
            const strContent = typeof content === 'string' ? content : new TextDecoder().decode(content);
            const base64Content = btoa(unescape(encodeURIComponent(strContent)));
            return (
                <IframeContainer>
                    <StyledIframe
                        src={`data:text/html;base64,${base64Content}`}
                        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                        title="Rendered HTML Content"
                    />
                </IframeContainer>
            );
        }

        if (contentType === 'md') {
            const strContent = typeof content === 'string' ? content : new TextDecoder().decode(content);
            const htmlContent = marked(strContent);
            return (
                <Card>
                    <ScrollableContent>
                        <MarkdownContent dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    </ScrollableContent>
                </Card>
            );
        }

        if (contentType === 'csv' || contentType === 'xlsx') {
            let parsedData: TableData = [];

            try {
                if (contentType === 'csv') {
                    const strContent = typeof content === 'string' ? content : new TextDecoder().decode(content);
                    const result = Papa.parse<TableCell[]>(strContent);
                    parsedData = result.data as TableData;
                } else {
                    const workbook = XLSX.read(content, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    parsedData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as TableData;
                }
            } catch {
                return (
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
                );
            }

            return (
                <Card>
                    <ScrollableContent>
                        <TableContainer>
                            <StyledTable>
                                <thead>
                                    <tr>
                                        {parsedData[0]?.map((header, i) => (
                                            <th key={i}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedData.slice(1).map((row, i) => (
                                        <tr key={i}>
                                            {row.map((cell, j) => (
                                                <td key={j}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </StyledTable>
                        </TableContainer>
                    </ScrollableContent>
                </Card>
            );
        }

        return null;
    };

    if (isLoading) {
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
                    <title>{t('render.notFound')} - {t('common.appName')}</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>

                <RenderContainer>
                    <ErrorContainer>
                        <ErrorTitle>{t('notFound.title')}</ErrorTitle>
                        <ErrorDescription>{t('notFound.description')}</ErrorDescription>
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
                <title>{t('render.title')} - {t('common.appName')}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <RenderContainer>
                <Card title={t('render.title')}>
                    <ButtonGroup>
                        <Button onClick={handleDownloadOriginal}>
                            {t('render.downloadOriginal')}
                        </Button>
                    </ButtonGroup>
                </Card>

                {renderContent()}
            </RenderContainer>
        </>
    );
}
