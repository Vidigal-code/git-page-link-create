import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { marked } from 'marked';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useI18n } from '@/shared/lib/i18n';
import { decompress, decompressBytes } from '@/shared/lib/compression';
import Link from 'next/link';
import { Button } from '@/shared/ui/Button';

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
`;

const StyledCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 1200px;
  overflow: hidden;
  margin: auto 0;
  
  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

const ScrollableContent = styled.div`
  width: 100%;
  max-height: 90vh; /* Keep card within viewport mostly, but allow internal scroll */
  overflow-y: auto;
  overflow-x: hidden;
  padding: 32px;
  
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
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text || '#a8a8a8'};
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    padding: 20px;
    max-height: 85vh;
  }
`;

const MarkdownWrapper = styled.div`
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  word-wrap: break-word;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
    color: ${({ theme }) => theme.colors.text};
  }

  h1 { font-size: 2em; border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder || '#eaecef'}; padding-bottom: 0.3em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder || '#eaecef'}; padding-bottom: 0.3em; }
  
  p, blockquote, ul, ol, dl, table, pre {
    margin-top: 0;
    margin-bottom: 16px;
  }

  a { color: ${({ theme }) => theme.colors.primary}; text-decoration: none; }
  a:hover { text-decoration: underline; }

  blockquote {
    padding: 0 1em;
    color: ${({ theme }) => theme.colors.textSecondary};
    border-left: 0.25em solid ${({ theme }) => theme.colors.cardBorder || '#dfe2e5'};
  }

  pre {
    background: rgba(127, 127, 127, 0.1);
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 85%;
    line-height: 1.45;
  }
  
  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(127, 127, 127, 0.1);
    border-radius: 3px;
    font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
    color: ${({ theme }) => theme.colors.text};
  }
  
  pre > code {
    background-color: transparent;
    padding: 0;
  }
`;

const TableScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder || '#e1e4e8'};
  
  /* Ensure correct scroll behavior */
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
  min-width: 600px; /* Prevent crushing on small screens */
  
  th, td {
    padding: 12px 16px;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder || '#e1e4e8'};
    text-align: left;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
  }
  
  th {
    background-color: rgba(127, 127, 127, 0.1);
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    position: sticky;
    top: 0;
  }
  
  tr:nth-child(even) {
    background-color: rgba(127, 127, 127, 0.05);
  }
  
  tr:hover {
    background-color: rgba(127, 127, 127, 0.1);
  }
`;

const FullScreenIframe = styled.iframe`
  width: 100vw;
  height: 100vh;
  border: none;
  position: absolute;
  top: 0;
  left: 0;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f4f6f8;
    color: #586069;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;



const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #fff5f5;
    color: #cb2431;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    text-align: center;
    padding: 20px;
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 16px;
`;

const ErrorDescription = styled.p`
  color: #586069;
  margin-bottom: 24px;
`;

export default function RenderAll() {
    const router = useRouter();
    const { hash } = router.query;
    const { t } = useI18n();

    const [content, setContent] = useState<string | Uint8Array>('');
    const [contentType, setContentType] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!hash || typeof hash !== 'string') return;

        const separatorIndex = hash.indexOf('-');

        if (separatorIndex === -1) {
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
            console.error('Error decompressing content:', err);
            setError(true);
            setIsLoading(false);
        }
    }, [hash]);

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
        // ... rest of code
        const strContent = typeof content === 'string' ? content : new TextDecoder().decode(content);
        const base64Content = btoa(unescape(encodeURIComponent(strContent)));
        return (
            <>
                <Head>
                    <title>Rendered HTML</title>
                </Head>
                <FullScreenIframe
                    src={`data:text/html;base64,${base64Content}`}
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
                        <MarkdownWrapper dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    </ScrollableContent>
                </StyledCard>
            </PageWrapper>
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
