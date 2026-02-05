import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { marked } from 'marked';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { TextArea } from '@/shared/ui/Input';
import { useI18n } from '@/shared/lib/i18n';
import { compress, compressBytes, decompress, decompressBytes } from '@/shared/lib/compression';
import { generateHash } from '@/shared/lib/crypto';
import { downloadFile, getMimeType, getFileExtension } from '@/shared/lib/download';
import { loadAvailableThemes, getMaxUrlLength } from '@/shared/lib/theme';

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SplitView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const EditorColumn = styled.div<{ $showPreview: boolean }>`
  flex: 1;
  width: 100%;
  transition: all 0.3s ease;
  
  @media (min-width: 1024px) {
    width: ${({ $showPreview }) => $showPreview ? '50%' : '100%'};
    max-width: ${({ $showPreview }) => $showPreview ? '50%' : '800px'};
    margin: ${({ $showPreview }) => $showPreview ? '0' : '0 auto'};
  }
`;

const PreviewColumn = styled.div`
  flex: 1;
  width: 100%;
  
  @media (min-width: 1024px) {
    width: 50%;
    position: sticky;
    top: 20px;
  }
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 12px 24px;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.transitionDuration};
  margin-top: 12px;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ResultSection = styled.div`
  margin-top: 32px;
`;

const LinkDisplay = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  padding: 16px;
  margin: 16px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.primary};
  font-family: monospace;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  cursor: pointer;
`;

const StyledCheckbox = styled.input`
  appearance: none;
  -webkit-appearance: none;
  margin-right: 12px;
  width: ${({ theme }) => theme.components.checkbox?.width || '20px'};
  height: ${({ theme }) => theme.components.checkbox?.height || '20px'};
  cursor: pointer;
  background-color: transparent;
  border-radius: ${({ theme }) => theme.components.checkbox?.borderRadius || '4px'};
  border: 1px solid ${({ theme }) => theme.components.checkbox?.borderColor || theme.colors.primary};
  display: grid;
  place-content: center;
  
  &::before {
    content: "";
    width: 12px;
    height: 12px;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em ${({ theme }) => theme.components.checkbox?.checkMarkColor || 'white'};
    transform-origin: center;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  &:checked {
    background-color: ${({ theme }) => theme.components.checkbox?.accentColor || theme.colors.primary};
    border-color: ${({ theme }) => theme.components.checkbox?.accentColor || theme.colors.primary};
  }

  &:checked::before {
    transform: scale(1);
  }

  &:hover {
    border-color: ${({ theme }) => theme.components.checkbox?.hoverBorderColor || theme.colors.primary};
  }
`;



const CheckboxLabel = styled.label`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  user-select: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 24px;
  align-items: center;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  padding: 12px;
  margin-top: 16px;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: 4px;
`;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.success};
  padding: 12px;
  margin-top: 16px;
  border: 1px solid ${({ theme }) => theme.colors.success};
  border-radius: 4px;
`;

const PreviewFrame = styled.iframe`
  width: 100%;
  height: 600px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  background: white;
`;

const PreviewContent = styled.div`
  width: 100%;
  min-height: 400px;
  max-height: 800px;
  overflow: auto;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.cardBackground};
`;

const MarkdownPreview = styled(PreviewContent)`
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.primary};
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  code {
    background-color: ${({ theme }) => theme.colors.background};
    padding: 2px 6px;
    border-radius: 3px;
    font-family: monospace;
  }
  
  pre {
    background-color: ${({ theme }) => theme.colors.background};
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
  }

  img {
    max-width: 100%;
  }
`;

const TablePreview = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px;
    text-align: left;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
  
  th {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
  
  tr:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

type ContentType = 'html' | 'md' | 'csv' | 'xlsx';

export default function Create() {
    const { t } = useI18n();
    const [contentType, setContentType] = useState<ContentType>('html');
    const [content, setContent] = useState<string | Uint8Array>('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [generatedFullLink, setGeneratedFullLink] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [recoveryHash, setRecoveryHash] = useState('');

    useEffect(() => {
        loadAvailableThemes();
    }, []);

    const contentTypeOptions = [
        { value: 'html', label: 'HTML' },
        { value: 'md', label: 'Markdown' },
        { value: 'csv', label: 'CSV' },
        { value: 'xlsx', label: 'XLSX' },
    ];

    const handleContentTypeChange = (newType: ContentType) => {
        setContentType(newType);
        setContent('');
        setGeneratedLink('');
        setGeneratedFullLink('');
        setError('');
        setSuccessMessage('');
        setIsProcessing(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClearContent = () => {
        setContent('');
        setGeneratedLink('');
        setGeneratedFullLink('');
        setError('');
        setSuccessMessage('');
        setIsProcessing(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRecoverContent = () => {
        if (!recoveryHash) return;

        try {
            const separatorIndex = recoveryHash.indexOf('-');
            if (separatorIndex === -1) {
                setError(t('create.invalidHash'));
                return;
            }

            const type = recoveryHash.substring(0, separatorIndex) as ContentType;
            const compressedContent = recoveryHash.substring(separatorIndex + 1);

            if (!['html', 'md', 'csv', 'xlsx'].includes(type)) {
                setError(t('create.invalidHash'));
                return;
            }

            let decompressed: string | Uint8Array;
            if (type === 'xlsx') {
                decompressed = decompressBytes(compressedContent);
            } else {
                decompressed = decompress(compressedContent);
            }

            setContentType(type);
            setContent(decompressed);
            setSuccessMessage(t('create.recoverySuccess'));
            setGeneratedLink('');
            setRecoveryHash(''); // Clear hash input on success
            setError('');
        } catch (err) {
            console.error('Recovery error:', err);
            setError(t('create.invalidHash'));
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        if (contentType === 'xlsx') {
            reader.onload = (event) => {
                const buffer = event.target?.result as ArrayBuffer;
                setContent(new Uint8Array(buffer));
            };
            reader.readAsArrayBuffer(file);
        } else {
            reader.onload = (event) => {
                const text = event.target?.result as string;
                setContent(text);
            };
            reader.readAsText(file);
        }
    };

    const generateHashLink = (targetContent: string | Uint8Array, type: ContentType, isFull: boolean = false) => {
        // Compress content
        const compressed = typeof targetContent === 'string'
            ? compress(targetContent)
            : compressBytes(targetContent);

        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

        // Use render-all for full link, standard render for normal link
        const path = isFull ? 'render-all' : 'render';
        return `${baseUrl}/${path}/${type}-${compressed}`;
    }

    const handleGenerateLink = async () => {
        if (content.length === 0) {
            setError(t('create.emptyContent'));
            return;
        }

        setIsProcessing(true);
        setError('');
        setSuccessMessage('');
        setGeneratedLink('');
        setGeneratedFullLink('');

        try {
            // Generate link based on isFullScreen state
            const link = generateHashLink(content, contentType, isFullScreen);

            // Check URL length limit check (approx 2000-2048 chars)
            const maxLimit = getMaxUrlLength();

            if (link.length > maxLimit) {
                setError(t('create.urlTooLong'));
                setIsProcessing(false);
                return;
            }

            setGeneratedLink(link);
            setGeneratedFullLink(''); // Ensure we only show one main link
            setSuccessMessage(t('create.linkGenerated'));
        } catch (err) {
            setError(t('create.error'));
            console.error('Error generating link:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopyLink = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        setSuccessMessage(t('create.linkCopied'));
    };

    const handleDownloadOriginal = () => {
        const filename = `content${getFileExtension(contentType)}`;
        const mimeType = getMimeType(contentType);
        downloadFile(content, filename, mimeType);
    };

    const renderPreview = () => {
        if (content.length === 0) return null;

        if (contentType === 'html') {
            const strContent = typeof content === 'string' ? content : new TextDecoder().decode(content);
            const base64Content = btoa(unescape(encodeURIComponent(strContent)));
            return (
                <PreviewFrame
                    src={`data:text/html;base64,${base64Content}`}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    title="Live Preview"
                />
            );
        }

        if (contentType === 'md') {
            const strContent = typeof content === 'string' ? content : new TextDecoder().decode(content);
            const htmlContent = marked(strContent);
            return (
                <MarkdownPreview dangerouslySetInnerHTML={{ __html: htmlContent }} />
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
                    // Check if content is Uint8Array
                    if (content instanceof Uint8Array) {
                        const workbook = XLSX.read(content, { type: 'array' });
                        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                        parsedData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
                    }
                }

                if (parsedData.length === 0) return <p>No data</p>;

                return (
                    <PreviewContent>
                        <TablePreview>
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
                        </TablePreview>
                    </PreviewContent>
                );
            } catch (e) {
                return <p>Error parsing data</p>;
            }
        }

        return null;
    };

    return (
        <>
            <Head>
                <title>{t('create.title')} - {t('common.appName')}</title>
                <meta name="description" content="Create shareable links for your HTML, Markdown, and CSV content" />
                <meta name="robots" content="index, follow" />
            </Head>

            <Container>
                <SplitView>
                    <EditorColumn $showPreview={showPreview}>
                        <Card title={t('create.title')}>
                            <FormSection>
                                <Select
                                    label={t('create.selectType')}
                                    value={contentType}
                                    onChange={(e) => handleContentTypeChange(e.target.value as ContentType)}
                                    options={contentTypeOptions}
                                />
                            </FormSection>

                            <FormSection>
                                <TextArea
                                    label={t('create.pasteContent')}
                                    value={typeof content === 'string' ? content : '[Binary file loaded - cannot edit]'}
                                    onChange={(e) => typeof content === 'string' && setContent(e.target.value)}
                                    placeholder={`Paste your ${contentType.toUpperCase()} content here...`}
                                    rows={15}
                                    readOnly={typeof content !== 'string'}
                                />
                            </FormSection>

                            <FormSection>
                                <FileInput
                                    ref={fileInputRef}
                                    type="file"
                                    accept={`.${contentType}`}
                                    onChange={handleFileUpload}
                                    id="file-upload"
                                />
                                <FileInputLabel htmlFor="file-upload">
                                    {t('create.uploadFile')}
                                </FileInputLabel>

                                <CheckboxContainer onClick={() => setIsFullScreen(!isFullScreen)}>
                                    <StyledCheckbox
                                        type="checkbox"
                                        checked={isFullScreen}
                                        readOnly
                                    />
                                    <CheckboxLabel>{t('create.fullScreenOption')}</CheckboxLabel>
                                </CheckboxContainer>
                            </FormSection>

                            <ButtonGroup>
                                <Button
                                    onClick={handleGenerateLink}
                                    disabled={isProcessing || content.length === 0}
                                >
                                    {isProcessing ? t('create.processing') : t('create.generateLink')}
                                </Button>

                                <Button
                                    onClick={() => setShowPreview(!showPreview)}
                                    variant="secondary"
                                    disabled={content.length === 0}
                                >
                                    {t('create.preview')}
                                </Button>

                                <Button
                                    onClick={handleClearContent}
                                    variant="secondary"
                                    disabled={content.length === 0}
                                    style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
                                >
                                    {t('create.clearContent')}
                                </Button>
                            </ButtonGroup>

                            {error && <ErrorMessage>{error}</ErrorMessage>}
                            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
                        </Card>

                        {/* Recovery Section */}
                        <div style={{ marginTop: '24px' }}>
                            <Card title={t('create.recoveryTitle')}>
                                <FormSection>
                                    <TextArea
                                        label={t('create.pasteHash')}
                                        value={recoveryHash}
                                        onChange={(e) => setRecoveryHash(e.target.value)}
                                        placeholder="html-H4sI..."
                                        rows={3}
                                    />
                                    <ButtonGroup style={{ marginTop: '16px' }}>
                                        <Button
                                            onClick={handleRecoverContent}
                                            disabled={!recoveryHash}
                                        >
                                            {t('create.recoverButton')}
                                        </Button>
                                        <Button
                                            onClick={() => setRecoveryHash('')}
                                            variant="secondary"
                                            disabled={!recoveryHash}
                                            style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
                                        >
                                            {t('create.clearHash')}
                                        </Button>
                                    </ButtonGroup>
                                </FormSection>
                            </Card>
                        </div>

                        {generatedLink && (
                            <ResultSection>
                                <Card title={t('create.generatedLink')}>
                                    <p><strong>{isFullScreen ? t('create.fullScreenOption') : t('create.generatedLink')}:</strong></p>
                                    <LinkDisplay>{generatedLink}</LinkDisplay>
                                    <ButtonGroup style={{ marginBottom: '20px' }}>
                                        <Button onClick={() => handleCopyLink(generatedLink)}>
                                            {t('create.copyLink')}
                                        </Button>
                                        <Button
                                            onClick={() => window.open(generatedLink, '_blank')}
                                            variant="secondary"
                                        >
                                            {t('create.openLink')}
                                        </Button>
                                    </ButtonGroup>

                                    <ButtonGroup>
                                        <Button variant="secondary" onClick={handleDownloadOriginal}>
                                            {t('create.downloadOriginal')}
                                        </Button>
                                    </ButtonGroup>
                                </Card>
                            </ResultSection>
                        )}
                    </EditorColumn>

                    {showPreview && (
                        <PreviewColumn>
                            <Card title={t('create.preview')}>
                                {renderPreview()}
                            </Card>
                        </PreviewColumn>
                    )}
                </SplitView>
            </Container>
        </>
    );
}
