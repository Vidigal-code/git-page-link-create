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
    const { hash, data, source, type } = router.query;
    const { t } = useI18n();

    const [content, setContent] = useState<string | Uint8Array>('');
    const [contentType, setContentType] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const resolvedSource = typeof source === 'string' ? source : '';
    const resolvedType = typeof type === 'string' ? type : '';

    const resolvedHash = typeof hash === 'string'
        ? hash
        : typeof data === 'string'
            ? data
            : '';

    const [fragmentData, setFragmentData] = useState<string>('');

    useEffect(() => {
        // Look for data in hash (fragment)
        const currentHash = window.location.hash;
        if (currentHash.startsWith('#data=')) {
            setFragmentData(currentHash.substring(6));
        }
    }, [hash, data]);

    const finalHash = fragmentData || resolvedHash;

    useEffect(() => {
        if (!resolvedSource) return;

        const fetchSource = async () => {
            setIsLoading(true);
            setError(false);

            if (!resolvedType) {
                setError(true);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(resolvedSource);
                if (!response.ok) {
                    throw new Error('Failed to fetch source');
                }

                if (resolvedType === 'xlsx') {
                    const buffer = await response.arrayBuffer();
                    setContent(new Uint8Array(buffer));
                } else {
                    const text = await response.text();
                    setContent(text);
                }
                setContentType(resolvedType);
                setIsLoading(false);
            } catch {
                setError(true);
                setIsLoading(false);
            }
        };

        fetchSource();
    }, [resolvedSource, resolvedType]);

    useEffect(() => {
        if (!finalHash || resolvedSource) return;

        // The hash format is now: [type]-[compressed_content]
        const separatorIndex = finalHash.indexOf('-');

        if (separatorIndex === -1) {
            // Fallback for old style or invalid links
            setError(true);
            setIsLoading(false);
            return;
        }

        try {
            const type = finalHash.substring(0, separatorIndex);
            const compressedContent = finalHash.substring(separatorIndex + 1);

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
                const hash = window.location.hash;
                router.replace(`${targetPath}${query}${hash}`);
                return;
            }

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
    }, [finalHash, resolvedSource]);

    const handleDownloadOriginal = async () => {
        if (!content || !contentType) return;
        const filename = `content${getFileExtension(contentType)}`;
        const mimeType = getMimeType(contentType);

        if (resolvedSource) {
            try {
                const response = await fetch(resolvedSource);
                if (!response.ok) {
                    throw new Error('Failed to fetch source');
                }
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
                URL.revokeObjectURL(url);
            } catch {
                setError(true);
            }
            return;
        }

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

        if (contentType === 'txt') {
            const strContent = typeof content === 'string' ? content : new TextDecoder().decode(content);
            return (
                <Card>
                    <ScrollableContent>
                        <pre style={{ margin: 0, padding: '16px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6' }}>
                            {strContent}
                        </pre>
                    </ScrollableContent>
                </Card>
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
