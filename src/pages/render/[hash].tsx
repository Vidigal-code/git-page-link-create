import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { marked } from 'marked';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/shared/lib/i18n';
import { decompress, decompressBytes } from '@/shared/lib/compression';
import { downloadFile, getMimeType, getFileExtension } from '@/shared/lib/download';

const RenderContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const IframeContainer = styled.div`
  width: 100%;
  min-height: 600px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 600px;
  border: none;
`;

const ScrollableContent = styled.div`
  width: 100%;
  max-height: 80vh; /* Allow scrolling within the card */
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px; /* Avoid scrollbar covering content */
  /* background-color removed to let card background show */
  
  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.textSecondary || '#c1c1c1'};
    border-radius: 4px;
    opacity: 0.5;
  }
`;

const MarkdownContent = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.colors.text};
  word-wrap: break-word; /* Ensure long words break */
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.text};
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  code {
    background-color: rgba(127, 127, 127, 0.1);
    color: ${({ theme }) => theme.colors.text};
    padding: 2px 6px;
    border-radius: 3px;
    font-family: monospace;
  }
  
  pre {
    background-color: rgba(127, 127, 127, 0.1);
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    color: ${({ theme }) => theme.colors.text};
    
    code {
        color: inherit;
        background-color: transparent;
    }
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.cardBorder || '#dfe2e5'};
    padding-left: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    
    th, td {
        border: 1px solid ${({ theme }) => theme.colors.cardBorder || '#dfe2e5'};
        padding: 6px 13px;
    }
    
    tr:nth-child(2n) {
        background-color: rgba(127, 127, 127, 0.05);
    }
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin: 20px 0;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder || '#e1e4e8'};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.textSecondary || '#c1c1c1'};
    border-radius: 4px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
  
  th, td {
    padding: 12px;
    text-align: left;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder || '#e1e4e8'};
    color: ${({ theme }) => theme.colors.text};
  }
  
  th {
    background-color: rgba(127, 127, 127, 0.1);
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    position: sticky;
    top: 0;
    z-index: 1; /* Keep header above content */
  }
  
  tr:nth-child(even) {
    background-color: rgba(127, 127, 127, 0.05);
  }
  
  tr:hover {
      background-color: rgba(127, 127, 127, 0.1);
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xlarge};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 16px;
`;

const ErrorDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 16px;
  align-items: center;
`;

interface ContentData {
    type: 'html' | 'md' | 'csv' | 'xls';
    compressed: string;
    createdAt: string;
}

export default function Render() {
    const router = useRouter();
    const { hash } = router.query;
    const { t } = useI18n();

    const [content, setContent] = useState<string | Uint8Array>('');
    const [contentType, setContentType] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!hash || typeof hash !== 'string') return;

        // The hash format is now: [type]-[compressed_content]
        const separatorIndex = hash.indexOf('-');

        if (separatorIndex === -1) {
            // Fallback for old style or invalid links
            setError(true);
            setIsLoading(false);
            return;
        }

        const type = hash.substring(0, separatorIndex);
        const compressedContent = hash.substring(separatorIndex + 1);

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
        } catch (err) {
            setError(true);
            setIsLoading(false);
        }
    }, [hash]);

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
            let parsedData: any[][] = [];

            try {
                if (contentType === 'csv') {
                    const strContent = typeof content === 'string' ? content : new TextDecoder().decode(content);
                    const result = Papa.parse(strContent);
                    parsedData = result.data as any[][];
                } else {
                    const workbook = XLSX.read(content, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    parsedData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
                }
            } catch (e) {
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
