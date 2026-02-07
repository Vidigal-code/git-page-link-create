import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { marked } from 'marked';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useI18n } from '@/shared/lib/i18n';
import { decompress, decompressBytes } from '@/shared/lib/compression';
import Link from 'next/link';
import { Button } from '@/shared/ui/Button';
import {
    PageWrapper,
    StyledCard,
    ScrollableContent,
    PlainMarkdownWrapper,
    TableScrollWrapper,
    StyledTable,
    FullScreenIframe,
    LoadingContainer,
    ErrorContainer,
    ErrorTitle,
    ErrorDescription,
} from '@/shared/styles/pages/render-all.styles';

export default function RenderAll() {
    const router = useRouter();
    const { hash, data } = router.query;
    const { t } = useI18n();

    const [content, setContent] = useState<string | Uint8Array>('');
    const [contentType, setContentType] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [htmlBlobUrl, setHtmlBlobUrl] = useState('');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (contentType !== 'html') {
            setHtmlBlobUrl('');
            return;
        }

        const strContent = typeof content === 'string' ? content : new TextDecoder().decode(content);
        const blob = new Blob([strContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        setHtmlBlobUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [content, contentType]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const hashValue = window.location.hash || '';
        const hashData = hashValue.startsWith('#data=') ? hashValue.slice('#data='.length) : '';
        const resolvedHash = typeof hash === 'string'
            ? hash
            : typeof data === 'string'
                ? data
                : hashData;

        if (!resolvedHash) {
            setError(true);
            setIsLoading(false);
            return;
        }

        const separatorIndex = resolvedHash.indexOf('-');

        if (separatorIndex === -1) {
            setError(true);
            setIsLoading(false);
            return;
        }

        try {
            const type = resolvedHash.substring(0, separatorIndex);
            const compressedContent = resolvedHash.substring(separatorIndex + 1);

            // Redirect to specialized renderers if applicable
            const specializedRedirects: Record<string, string> = {
                'pdf': '/render/pdf',
                'image': '/render/image',
                'video': '/render/video',
                'audio': '/render/audio',
                'docx': '/render/office',
                'pptx': '/render/office',
                'doc': '/render/office',
                'xls': '/render/office',
                'xlsx': '/render/office',
            };

            if (specializedRedirects[type]) {
                const targetPath = specializedRedirects[type];
                const query = window.location.search;
                const isFullscreen = query.includes('fullscreen=1') || query.includes('fullscreen=true');
                const finalQuery = isFullscreen ? query : (query ? `${query}&fullscreen=1` : '?fullscreen=1');
                const hash = window.location.hash;
                router.replace(`${targetPath}${finalQuery}${hash}`);
                return;
            }

            if (type === 'xlsx') {
                try {
                    const decompressed = decompressBytes(compressedContent);
                    setContent(decompressed);
                } catch (e) {
                    //console.warn('Decompression failed for xlsx, using raw content:', e);
                    // For xlsx, raw content might not be useful as a string, but we pass it anyway
                    setContent(compressedContent);
                }
            } else {
                try {
                    const decompressed = decompress(compressedContent);
                    setContent(decompressed);
                } catch (e) {
                    //console.warn('Decompression failed, using raw content:', e);
                    setContent(compressedContent);
                }
            }
            setContentType(type);
            setIsLoading(false);
        } catch {
            setError(true);
            setIsLoading(false);
        }
    }, [hash, data]);

    if (isLoading) return <LoadingContainer>{t('create.processing')}</LoadingContainer>; // reusing processing string or similar

    if (error) {
        return (
            <ErrorContainer>
                <Head>
                    <title>{t('render.notFound')} - {t('common.appName')}</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <ErrorTitle>{t('notFound.title')}</ErrorTitle>
                <ErrorDescription>{t('notFound.description')}</ErrorDescription>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Button onClick={() => window.history.back()} variant="secondary">
                        {t('notFound.goBack')}
                    </Button>
                    <Link href="/" passHref legacyBehavior>
                        <Button as="a">{t('notFound.backHome')}</Button>
                    </Link>
                </div>
            </ErrorContainer>
        );
    }

    if (contentType === 'html') {
        return (
            <>
                <Head>
                    <title>Rendered HTML</title>
                </Head>
                <FullScreenIframe
                    src={htmlBlobUrl || undefined}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                    title="Rendered Content"
                />
            </>
        );
    }

    if (contentType === 'md') {
        const strContent = typeof content === 'string' ? content : new TextDecoder().decode(content);
        const htmlContent = marked(strContent);
        return (
            <PageWrapper>
                <Head>
                    <title>Rendered Markdown</title>
                </Head>
                <StyledCard>
                    <ScrollableContent>
                        <PlainMarkdownWrapper dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    </ScrollableContent>
                </StyledCard>
            </PageWrapper>
        );
    }

    if (contentType === 'txt') {
        const strContent = typeof content === 'string' ? content : new TextDecoder().decode(content);
        return (
            <PageWrapper>
                <Head>
                    <title>Rendered Text</title>
                </Head>
                <StyledCard>
                    <ScrollableContent>
                        <pre style={{
                            margin: 0,
                            padding: '16px',
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-all',
                            maxWidth: '100%',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            lineHeight: '1.6',
                        }}>
                            {strContent}
                        </pre>
                    </ScrollableContent>
                </StyledCard>
            </PageWrapper>
        );
    }

    if (contentType === 'csv' || contentType === 'xlsx') {
        type TableCell = string | number | null;
        type TableData = TableCell[][];
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
                <ErrorContainer>
                    <Head>
                        <title>{t('renderError.title')} - {t('common.appName')}</title>
                    </Head>
                    <ErrorTitle>{t('renderError.title')}</ErrorTitle>
                    <ErrorDescription>{t('renderError.description')}</ErrorDescription>
                    <p style={{ marginBottom: '24px', fontStyle: 'italic', color: '#666' }}>{t('renderError.hint')}</p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Button onClick={() => window.history.back()} variant="secondary">
                            {t('notFound.goBack')}
                        </Button>
                        <Link href="/" passHref legacyBehavior>
                            <Button as="a">{t('notFound.backHome')}</Button>
                        </Link>
                    </div>
                </ErrorContainer>
            );
        }

        return (
            <PageWrapper>
                <Head>
                    <title>Rendered Table</title>
                </Head>
                <StyledCard>
                    <ScrollableContent>
                        <TableScrollWrapper>
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
                        </TableScrollWrapper>
                    </ScrollableContent>
                </StyledCard>
            </PageWrapper>
        );
    }

    return <ErrorContainer>Unsupported content type for this viewer.</ErrorContainer>;
}
