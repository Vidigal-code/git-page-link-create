import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { marked } from 'marked';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { TextArea } from '@/shared/ui/Input';
import { useI18n } from '@/shared/lib/i18n';
import { compress, compressBytes, decompress, decompressBytes } from '@/shared/lib/compression';
import { downloadFile, getMimeType, getFileExtension } from '@/shared/lib/download';
import { loadAvailableThemes, getMaxUrlLength } from '@/shared/lib/theme';
import { withBasePath } from '@/shared/lib/basePath';
import {
        Container,
        SplitView,
        EditorColumn,
        PreviewColumn,
        FormSection,
        FileInput,
        FileInputLabel,
        ResultSection,
        LinkDisplay,
        CheckboxContainer,
        StyledCheckbox,
        CheckboxLabel,
        ButtonGroup,
        ErrorMessage,
        SuccessMessage,
        PreviewFrame,
        PreviewContent,
        MarkdownPreview,
        TablePreview,
} from './styleds/create.styles';

type ContentType = 'html' | 'md' | 'csv' | 'xlsx';

export default function Create() {
    const { t } = useI18n();
    const [contentType, setContentType] = useState<ContentType>('html');
    const [content, setContent] = useState<string | Uint8Array>('');
    const [generatedLink, setGeneratedLink] = useState('');
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
        } catch {
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

        if (typeof window === 'undefined') return '';

    const baseUrl = window.location.origin;
    const fullPath = withBasePath(`${isFull ? 'render-all' : 'render'}?data=${type}-${compressed}`);

        return `${baseUrl}${fullPath}`;
    };

    const handleGenerateLink = async () => {
        if (content.length === 0) {
            setError(t('create.emptyContent'));
            return;
        }

        setIsProcessing(true);
        setError('');
        setSuccessMessage('');
        setGeneratedLink('');

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
            setSuccessMessage(t('create.linkGenerated'));
        } catch {
            setError(t('create.error'));
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
            type TableCell = string | number | null;
            type TableData = TableCell[][];
            let parsedData: TableData = [];
            try {
                if (contentType === 'csv') {
                    const strContent = typeof content === 'string' ? content : new TextDecoder().decode(content);
                    const result = Papa.parse<TableCell[]>(strContent);
                    parsedData = result.data as TableData;
                } else {
                    // Check if content is Uint8Array
                    if (content instanceof Uint8Array) {
                        const workbook = XLSX.read(content, { type: 'array' });
                        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                        parsedData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as TableData;
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
            } catch {
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
