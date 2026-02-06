import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { marked } from 'marked';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { Input, TextArea } from '@/shared/ui/Input';
import { useI18n } from '@/shared/lib/i18n';
import { compress, compressBytes, decompress, decompressBytes } from '@/shared/lib/compression';
import { downloadFile, getMimeType, getFileExtension } from '@/shared/lib/download';
import { loadAvailableThemes, getMaxUrlLength } from '@/shared/lib/theme';
import { withBasePath } from '@/shared/lib/basePath';
import { generateQrCodeDataUrl, generateQrCodeSvg } from '@/shared/lib/qr';
import { fileToDataUrl, encodeImageDataUrl } from '@/shared/lib/image';
import { encodePdfDataUrl } from '@/shared/lib/pdf';
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
    QrSection,
    ImageSection,
    ImagePreview,
    ImagePreviewImage,
    ImagePlaceholder,
    PdfSection,
    PdfPreview,
    PdfFrame,
    PdfPlaceholder,
    QrOptionsGrid,
    QrPreview,
    QrImage,
    QrPlaceholder,
    ErrorPageContainer,
    ErrorTitle,
    ErrorDescription,
    ErrorHint,
} from '@/shared/styles/pages/create.styles';

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
    const imageInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);

    const [recoveryHash, setRecoveryHash] = useState('');
    const [qrInput, setQrInput] = useState('');
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [qrIsProcessing, setQrIsProcessing] = useState(false);
    const [qrHasError, setQrHasError] = useState(false);
    const [qrSvg, setQrSvg] = useState('');
    const [qrRenderLink, setQrRenderLink] = useState('');
    const [qrRenderAllLink, setQrRenderAllLink] = useState('');
    const [qrSize, setQrSize] = useState(320);
    const [qrMargin, setQrMargin] = useState(1);
    const [qrCorrection, setQrCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');

    const [imageDataUrl, setImageDataUrl] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [imageRenderAllLink, setImageRenderAllLink] = useState('');
    const [imageError, setImageError] = useState('');

    const [pdfDataUrl, setPdfDataUrl] = useState('');
    const [pdfLink, setPdfLink] = useState('');
    const [pdfRenderAllLink, setPdfRenderAllLink] = useState('');
    const [pdfError, setPdfError] = useState('');

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setImageError(t('create.imageInvalid'));
            return;
        }

        try {
            const dataUrl = await fileToDataUrl(file);
            setImageDataUrl(dataUrl);
            setImageLink('');
            setImageRenderAllLink('');
            setImageError('');
        } catch {
            setImageError(t('create.imageError'));
        }
    };

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setPdfError(t('create.pdfInvalid'));
            return;
        }

        try {
            const dataUrl = await fileToDataUrl(file);
            setPdfDataUrl(dataUrl);
            setPdfLink('');
            setPdfRenderAllLink('');
            setPdfError('');
        } catch {
            setPdfError(t('create.pdfError'));
        }
    };

    const handleGenerateImageLink = () => {
        if (!imageDataUrl || typeof window === 'undefined') return;
        setImageError('');

        const encoded = encodeImageDataUrl(imageDataUrl);
        const baseUrl = window.location.origin;
        const fullPath = withBasePath('render/image');
        const link = `${baseUrl}${fullPath}#data=${encoded}`;

        const maxLimit = getMaxUrlLength();
        if (link.length > maxLimit) {
            setImageError(t('create.urlTooLong'));
            return;
        }

        setImageLink(link);
    };

    const handleGenerateImageRenderAllLink = () => {
        if (!imageDataUrl || typeof window === 'undefined') return;
        setImageError('');

        const html = `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Image</title><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#111;}img{max-width:90vw;max-height:90vh;background:#fff;padding:16px;border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,0.35);}</style></head><body><img src="${imageDataUrl}" alt="Image" /></body></html>`;
        const compressed = compress(html);
        const baseUrl = window.location.origin;
        const fullPath = withBasePath('render-all');
        const link = `${baseUrl}${fullPath}#data=html-${compressed}`;

        const maxLimit = getMaxUrlLength();
        if (link.length > maxLimit) {
            setImageError(t('create.urlTooLong'));
            return;
        }

        setImageRenderAllLink(link);
    };

    const handleClearImage = () => {
        setImageDataUrl('');
        setImageLink('');
        setImageRenderAllLink('');
        setImageError('');
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    const handleGeneratePdfLink = () => {
        if (!pdfDataUrl || typeof window === 'undefined') return;
        setPdfError('');

        const encoded = encodePdfDataUrl(pdfDataUrl);
        const baseUrl = window.location.origin;
        const fullPath = withBasePath('render/pdf');
        const link = `${baseUrl}${fullPath}#data=${encoded}`;

        const maxLimit = getMaxUrlLength();
        if (link.length > maxLimit) {
            setPdfError(t('create.urlTooLong'));
            return;
        }

        setPdfLink(link);
    };

    const handleGeneratePdfRenderAllLink = () => {
        if (!pdfDataUrl || typeof window === 'undefined') return;
        setPdfError('');

        const baseUrl = window.location.origin;
        const encoded = encodePdfDataUrl(pdfDataUrl);
        const fullPath = withBasePath('render/pdf?fullscreen=1');
        const link = `${baseUrl}${fullPath}#data=${encoded}`;

        const maxLimit = getMaxUrlLength();
        if (link.length > maxLimit) {
            setPdfError(t('create.urlTooLong'));
            return;
        }

        setPdfRenderAllLink(link);
    };

    const handleClearPdf = () => {
        setPdfDataUrl('');
        setPdfLink('');
        setPdfRenderAllLink('');
        setPdfError('');
        if (pdfInputRef.current) {
            pdfInputRef.current.value = '';
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

    const handleGenerateQr = async () => {
        try {
            setQrIsProcessing(true);
            const dataUrl = await generateQrCodeDataUrl(qrInput, {
                width: qrSize,
                margin: qrMargin,
                errorCorrectionLevel: qrCorrection,
            });
            const svgContent = await generateQrCodeSvg(qrInput, {
                width: qrSize,
                margin: qrMargin,
                errorCorrectionLevel: qrCorrection,
            });
            setQrDataUrl(dataUrl);
            setQrSvg(svgContent);
        } catch {
            setQrHasError(true);
        } finally {
            setQrIsProcessing(false);
        }
    };

    const handleClearQr = () => {
        setQrInput('');
        setQrDataUrl('');
        setQrSvg('');
        setQrRenderLink('');
        setQrRenderAllLink('');
    };

    const handleDownloadQr = () => {
        if (!qrDataUrl || typeof window === 'undefined') return;
        const link = document.createElement('a');
        link.href = qrDataUrl;
        link.download = 'qrcode.png';
        link.click();
    };

    const handleCopyQrImage = async () => {
        if (!qrDataUrl || !navigator.clipboard) return;
        const response = await fetch(qrDataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob }),
        ]);
        setSuccessMessage(t('create.qrCopied'));
    };

    const handleOpenQr = async () => {
        if (!qrDataUrl) return;
        const response = await fetch(qrDataUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const newWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
            URL.revokeObjectURL(blobUrl);
            return;
        }
        newWindow.addEventListener('beforeunload', () => URL.revokeObjectURL(blobUrl));
    };

    const handleOpenQrPopup = async () => {
        if (!qrDataUrl) return;
        const response = await fetch(qrDataUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const size = Math.max(320, Math.min(qrSize, 800));
        const left = window.screenX + (window.outerWidth - size) / 2;
        const top = window.screenY + (window.outerHeight - size) / 2;
        const popup = window.open(
            blobUrl,
            '_blank',
            `noopener,noreferrer,width=${size},height=${size},left=${left},top=${top}`
        );
        if (!popup) {
            URL.revokeObjectURL(blobUrl);
            return;
        }
        popup.addEventListener('beforeunload', () => URL.revokeObjectURL(blobUrl));
    };

    const handleDownloadQrSvg = () => {
        if (!qrSvg) return;
        const blob = new Blob([qrSvg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qrcode.svg';
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleGenerateQrRenderLink = () => {
        if (!qrDataUrl) return;
        const html = `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>QR Code</title><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#111;}img{max-width:90vw;max-height:90vh;background:#fff;padding:16px;border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,0.35);}</style></head><body><img src="${qrDataUrl}" alt="QR code" /></body></html>`;
        const compressed = compress(html);
        const fullPath = withBasePath(`render?data=html-${compressed}`);
        const baseUrl = window.location.origin;
        setQrRenderLink(`${baseUrl}${fullPath}`);
    };

    const handleGenerateQrRenderAllLink = () => {
        if (!qrDataUrl) return;
        const html = `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>QR Code</title><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#111;}img{max-width:90vw;max-height:90vh;background:#fff;padding:16px;border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,0.35);}</style></head><body><img src="${qrDataUrl}" alt="QR code" /></body></html>`;
        const compressed = compress(html);
        const baseUrl = window.location.origin;
        const fullPath = withBasePath(`render-all?data=html-${compressed}`);
        setQrRenderAllLink(`${baseUrl}${fullPath}`);
    };

    if (qrHasError) {
        return (
            <>
                <Head>
                    <title>{t('renderError.title')} - {t('common.appName')}</title>
                </Head>
                <Container>
                    <ErrorPageContainer>
                        <ErrorTitle>{t('renderError.title')}</ErrorTitle>
                        <ErrorDescription>{t('renderError.description')}</ErrorDescription>
                        <ErrorHint>{t('renderError.hint')}</ErrorHint>
                        <ButtonGroup style={{ justifyContent: 'center' }}>
                            <Button onClick={() => setQrHasError(false)} variant="secondary">
                                {t('notFound.goBack')}
                            </Button>
                            <Button onClick={() => window.location.href = '/'}>
                                {t('notFound.backHome')}
                            </Button>
                        </ButtonGroup>
                    </ErrorPageContainer>
                </Container>
            </>
        );
    }

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

                        <div style={{ marginTop: '24px' }}>
                            <Card title={t('create.imageTitle')}>
                                <ImageSection>
                                    <p style={{ margin: 0 }}>{t('create.imageDescription')}</p>
                                    <FileInput
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        id="image-upload"
                                    />
                                    <FileInputLabel htmlFor="image-upload">
                                        {t('create.imageUpload')}
                                    </FileInputLabel>
                                    <ImagePreview>
                                        {imageDataUrl ? (
                                            <ImagePreviewImage src={imageDataUrl} alt={t('create.imagePreviewAlt')} />
                                        ) : (
                                            <ImagePlaceholder>{t('create.imagePreviewHint')}</ImagePlaceholder>
                                        )}
                                    </ImagePreview>
                                    <ButtonGroup>
                                        <Button
                                            onClick={handleGenerateImageLink}
                                            disabled={!imageDataUrl}
                                        >
                                            {t('create.imageGenerate')}
                                        </Button>
                                        <Button
                                            onClick={handleGenerateImageRenderAllLink}
                                            variant="secondary"
                                            disabled={!imageDataUrl}
                                        >
                                            {t('create.imageRenderAll')}
                                        </Button>
                                        <Button
                                            onClick={handleClearImage}
                                            variant="secondary"
                                            disabled={!imageDataUrl}
                                            style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
                                        >
                                            {t('create.imageClear')}
                                        </Button>
                                    </ButtonGroup>
                                    {imageError && <ErrorMessage>{imageError}</ErrorMessage>}
                                    {imageLink && (
                                        <ResultSection>
                                            <p><strong>{t('create.imageLinkTitle')}:</strong></p>
                                            <LinkDisplay>{imageLink}</LinkDisplay>
                                            <ButtonGroup>
                                                <Button onClick={() => handleCopyLink(imageLink)}>
                                                    {t('create.copyLink')}
                                                </Button>
                                                <Button
                                                    onClick={() => window.open(imageLink, '_blank')}
                                                    variant="secondary"
                                                >
                                                    {t('create.openLink')}
                                                </Button>
                                            </ButtonGroup>
                                        </ResultSection>
                                    )}
                                    {imageRenderAllLink && (
                                        <ResultSection>
                                            <p><strong>{t('create.imageRenderAllTitle')}:</strong></p>
                                            <LinkDisplay>{imageRenderAllLink}</LinkDisplay>
                                            <ButtonGroup>
                                                <Button onClick={() => handleCopyLink(imageRenderAllLink)}>
                                                    {t('create.copyLink')}
                                                </Button>
                                                <Button
                                                    onClick={() => window.open(imageRenderAllLink, '_blank')}
                                                    variant="secondary"
                                                >
                                                    {t('create.openLink')}
                                                </Button>
                                            </ButtonGroup>
                                        </ResultSection>
                                    )}
                                </ImageSection>
                            </Card>
                        </div>

                        <div style={{ marginTop: '24px' }}>
                            <Card title={t('create.pdfTitle')}>
                                <PdfSection>
                                    <p style={{ margin: 0 }}>{t('create.pdfDescription')}</p>
                                    <FileInput
                                        ref={pdfInputRef}
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handlePdfUpload}
                                        id="pdf-upload"
                                    />
                                    <FileInputLabel htmlFor="pdf-upload">
                                        {t('create.pdfUpload')}
                                    </FileInputLabel>
                                    <PdfPreview>
                                        {pdfDataUrl ? (
                                            <PdfFrame src={pdfDataUrl} title={t('create.pdfPreviewAlt')} />
                                        ) : (
                                            <PdfPlaceholder>{t('create.pdfPreviewHint')}</PdfPlaceholder>
                                        )}
                                    </PdfPreview>
                                    <ButtonGroup>
                                        <Button
                                            onClick={handleGeneratePdfLink}
                                            disabled={!pdfDataUrl}
                                        >
                                            {t('create.pdfGenerate')}
                                        </Button>
                                        <Button
                                            onClick={handleGeneratePdfRenderAllLink}
                                            variant="secondary"
                                            disabled={!pdfDataUrl}
                                        >
                                            {t('create.pdfRenderAll')}
                                        </Button>
                                        <Button
                                            onClick={handleClearPdf}
                                            variant="secondary"
                                            disabled={!pdfDataUrl}
                                            style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
                                        >
                                            {t('create.pdfClear')}
                                        </Button>
                                    </ButtonGroup>
                                    {pdfError && <ErrorMessage>{pdfError}</ErrorMessage>}
                                    {pdfLink && (
                                        <ResultSection>
                                            <p><strong>{t('create.pdfLinkTitle')}:</strong></p>
                                            <LinkDisplay>{pdfLink}</LinkDisplay>
                                            <ButtonGroup>
                                                <Button onClick={() => handleCopyLink(pdfLink)}>
                                                    {t('create.copyLink')}
                                                </Button>
                                                <Button
                                                    onClick={() => window.open(pdfLink, '_blank')}
                                                    variant="secondary"
                                                >
                                                    {t('create.openLink')}
                                                </Button>
                                            </ButtonGroup>
                                        </ResultSection>
                                    )}
                                    {pdfRenderAllLink && (
                                        <ResultSection>
                                            <p><strong>{t('create.pdfRenderAllTitle')}:</strong></p>
                                            <LinkDisplay>{pdfRenderAllLink}</LinkDisplay>
                                            <ButtonGroup>
                                                <Button onClick={() => handleCopyLink(pdfRenderAllLink)}>
                                                    {t('create.copyLink')}
                                                </Button>
                                                <Button
                                                    onClick={() => window.open(pdfRenderAllLink, '_blank')}
                                                    variant="secondary"
                                                >
                                                    {t('create.openLink')}
                                                </Button>
                                            </ButtonGroup>
                                        </ResultSection>
                                    )}
                                </PdfSection>
                            </Card>
                        </div>

                        <div style={{ marginTop: '24px' }}>
                            <Card title={t('create.qrTitle')}>
                                <QrSection>
                                    <TextArea
                                        label={t('create.qrInputLabel')}
                                        value={qrInput}
                                        onChange={(e) => setQrInput(e.target.value)}
                                        placeholder={t('create.qrInputPlaceholder')}
                                        rows={3}
                                    />
                                    <QrOptionsGrid>
                                        <Input
                                            label={t('create.qrSize')}
                                            type="number"
                                            min={120}
                                            max={800}
                                            value={qrSize}
                                            onChange={(e) => setQrSize(Number(e.target.value))}
                                        />
                                        <Input
                                            label={t('create.qrMargin')}
                                            type="number"
                                            min={0}
                                            max={8}
                                            value={qrMargin}
                                            onChange={(e) => setQrMargin(Number(e.target.value))}
                                        />
                                        <Select
                                            label={t('create.qrErrorCorrection')}
                                            value={qrCorrection}
                                            onChange={(e) => setQrCorrection(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                                            options={[
                                                { value: 'L', label: t('create.qrLevelL') },
                                                { value: 'M', label: t('create.qrLevelM') },
                                                { value: 'Q', label: t('create.qrLevelQ') },
                                                { value: 'H', label: t('create.qrLevelH') },
                                            ]}
                                        />
                                    </QrOptionsGrid>
                                    <QrPreview>
                                        {qrDataUrl ? (
                                            <QrImage src={qrDataUrl} alt="QR code" />
                                        ) : (
                                            <QrPlaceholder>{t('create.qrHint')}</QrPlaceholder>
                                        )}
                                    </QrPreview>
                                    <ButtonGroup>
                                        <Button
                                            onClick={handleGenerateQr}
                                            disabled={!qrInput.trim() || qrIsProcessing}
                                        >
                                            {qrIsProcessing ? t('create.processing') : t('create.qrGenerate')}
                                        </Button>
                                        <Button
                                            onClick={handleDownloadQr}
                                            variant="secondary"
                                            disabled={!qrDataUrl}
                                        >
                                            {t('create.qrDownload')}
                                        </Button>
                                        <Button
                                            onClick={handleDownloadQrSvg}
                                            variant="secondary"
                                            disabled={!qrSvg}
                                        >
                                            {t('create.qrDownloadSvg')}
                                        </Button>
                                        <Button
                                            onClick={handleOpenQr}
                                            variant="secondary"
                                            disabled={!qrDataUrl}
                                        >
                                            {t('create.qrOpen')}
                                        </Button>
                                        <Button
                                            onClick={handleOpenQrPopup}
                                            variant="secondary"
                                            disabled={!qrDataUrl}
                                        >
                                            {t('create.qrPopup')}
                                        </Button>
                                        <Button
                                            onClick={handleCopyQrImage}
                                            variant="secondary"
                                            disabled={!qrDataUrl}
                                        >
                                            {t('create.qrCopy')}
                                        </Button>
                                        <Button
                                            onClick={handleGenerateQrRenderLink}
                                            variant="secondary"
                                            disabled={!qrDataUrl}
                                        >
                                            {t('create.qrRenderLink')}
                                        </Button>
                                        <Button
                                            onClick={handleGenerateQrRenderAllLink}
                                            variant="secondary"
                                            disabled={!qrDataUrl}
                                        >
                                            {t('create.qrRenderAllLink')}
                                        </Button>
                                        <Button
                                            onClick={handleClearQr}
                                            variant="secondary"
                                            disabled={!qrInput && !qrDataUrl}
                                            style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
                                        >
                                            {t('create.qrClear')}
                                        </Button>
                                    </ButtonGroup>
                                    {qrRenderLink && (
                                        <ResultSection>
                                            <p><strong>{t('create.qrRenderLinkTitle')}:</strong></p>
                                            <LinkDisplay>{qrRenderLink}</LinkDisplay>
                                            <ButtonGroup>
                                                <Button onClick={() => handleCopyLink(qrRenderLink)}>
                                                    {t('create.copyLink')}
                                                </Button>
                                                <Button
                                                    onClick={() => window.open(qrRenderLink, '_blank')}
                                                    variant="secondary"
                                                >
                                                    {t('create.openLink')}
                                                </Button>
                                            </ButtonGroup>
                                        </ResultSection>
                                    )}
                                    {qrRenderAllLink && (
                                        <ResultSection>
                                            <p><strong>{t('create.qrRenderAllLinkTitle')}:</strong></p>
                                            <LinkDisplay>{qrRenderAllLink}</LinkDisplay>
                                            <ButtonGroup>
                                                <Button onClick={() => handleCopyLink(qrRenderAllLink)}>
                                                    {t('create.copyLink')}
                                                </Button>
                                                <Button
                                                    onClick={() => window.open(qrRenderAllLink, '_blank')}
                                                    variant="secondary"
                                                >
                                                    {t('create.openLink')}
                                                </Button>
                                            </ButtonGroup>
                                        </ResultSection>
                                    )}
                                </QrSection>
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
