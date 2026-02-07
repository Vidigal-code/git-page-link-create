import React, { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { marked } from 'marked';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { useI18n } from '@/shared/lib/i18n';
import { compress, compressBytes, decompress, decompressBytes } from '@/shared/lib/compression';
import { downloadFile, getFileExtension, getMimeType, getFileTypeFromFilename } from '@/shared/lib/download';
import { convertDocxToHtml } from '@/shared/lib/office-docx';
import { parseRecoveryInput } from '@/shared/lib/recovery';
import { uint8ArrayToBase64 } from '@/shared/lib/base64';
import {
    getMaxAudioUrlLength,
    getMaxCsvUrlLength,
    getMaxHtmlUrlLength,
    getMaxImageUrlLength,
    getMaxMarkdownUrlLength,
    getMaxOfficeUrlLength,
    getMaxPdfUrlLength,
    getMaxUrlLength,
    getMaxVideoUrlLength,
    getMaxXlsxUrlLength,
    loadAvailableThemes,
} from '@/shared/lib/theme';
import { withBasePath } from '@/shared/lib/basePath';
import { generateQrCodeDataUrl, generateQrCodeSvg } from '@/shared/lib/qr';
import { compressImageFile, encodeImageDataUrl, fileToDataUrl } from '@/shared/lib/image';
import { encodePdfDataUrl } from '@/shared/lib/pdf';
import { compressVideoFile, encodeVideoDataUrl } from '@/shared/lib/video';
import { compressAudioFile, encodeAudioDataUrl } from '@/shared/lib/audio';
import { getOfficeViewerUrl } from '@/shared/lib/office';
import {
    AudioToolCard,
    ContentToolCard,
    ImageToolCard,
    OfficeToolCard,
    PdfToolCard,
    QrToolCard,
    RecoveryToolCard,
    VideoToolCard,
} from '@/shared/ui/create-tools';
import {
    ButtonGroup,
    Container,
    EditorColumn,
    ErrorDescription,
    ErrorHint,
    ErrorPageContainer,
    ErrorTitle,
    LinkDisplay,
    MarkdownPreview,
    PreviewColumn,
    PreviewContent,
    PreviewFrame,
    ResultSection,
    SplitView,
    TablePreview,
} from '@/shared/styles/pages/create.styles';

type ContentType = 'html' | 'md' | 'csv' | 'txt' | 'xlsx' | 'xls' | 'docx' | 'pptx' | 'doc' | 'ppt' | 'image' | 'pdf' | 'video' | 'audio' | 'office' | 'recovery' | 'qr';
type ToolType = 'create' | 'recovery' | 'image' | 'pdf' | 'video' | 'audio' | 'office' | 'qr';
type RecoverableContentType = Exclude<ContentType, 'recovery' | 'qr' | 'office'>;

export default function Create() {
    const { t } = useI18n();
    const [contentType, setContentType] = useState<ContentType>('html');
    const [content, setContent] = useState<string | Uint8Array>('');
    const [selectedTool, setSelectedTool] = useState<ToolType>('create');
    const [generatedLink, setGeneratedLink] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);
    const officeInputRef = useRef<HTMLInputElement>(null);

    const [contentSourceUrl, setContentSourceUrl] = useState('');
    const [contentSourceLink, setContentSourceLink] = useState('');
    const [contentSourceError, setContentSourceError] = useState('');

    const [recoveryHash, setRecoveryHash] = useState('');
    const [isRecovered, setIsRecovered] = useState(false);
    const [recoveryType, setRecoveryType] = useState<RecoverableContentType>('html');
    const [qrInput, setQrInput] = useState('');
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [qrIsProcessing, setQrIsProcessing] = useState(false);
    const [qrHasError, setQrHasError] = useState(false);
    const [qrSvg, setQrSvg] = useState('');
    const [qrRenderLink, setQrRenderLink] = useState('');
    const [qrRenderAllLink, setQrRenderAllLink] = useState('');
    const [convertedRecoveredHtml, setConvertedRecoveredHtml] = useState<string | null>(null);
    const [isConvertingRecovered, setIsConvertingRecovered] = useState(false);
    const [qrSize, setQrSize] = useState(320);
    const [qrMargin, setQrMargin] = useState(1);
    const [qrCorrection, setQrCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');

    const [imageDataUrl, setImageDataUrl] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [imageRenderAllLink, setImageRenderAllLink] = useState('');
    const [imageError, setImageError] = useState('');
    const [imageSourceUrl, setImageSourceUrl] = useState('');
    const [imageSourceLink, setImageSourceLink] = useState('');
    const [compressImage, setCompressImage] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isImageProcessing, setIsImageProcessing] = useState(false);
    const [imageCompressProgress, setImageCompressProgress] = useState<number | null>(null);

    const [pdfDataUrl, setPdfDataUrl] = useState('');
    const [pdfLink, setPdfLink] = useState('');
    const [pdfRenderAllLink, setPdfRenderAllLink] = useState('');
    const [pdfError, setPdfError] = useState('');

    const [videoDataUrl, setVideoDataUrl] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [videoRenderAllLink, setVideoRenderAllLink] = useState('');
    const [videoError, setVideoError] = useState('');
    const [videoSourceUrl, setVideoSourceUrl] = useState('');
    const [videoSourceLink, setVideoSourceLink] = useState('');
    const [compressVideo, setCompressVideo] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isVideoProcessing, setIsVideoProcessing] = useState(false);
    const [videoCompressProgress, setVideoCompressProgress] = useState<number | null>(null);

    const [audioDataUrl, setAudioDataUrl] = useState('');
    const [audioLink, setAudioLink] = useState('');
    const [audioRenderAllLink, setAudioRenderAllLink] = useState('');
    const [audioError, setAudioError] = useState('');
    const [audioSourceUrl, setAudioSourceUrl] = useState('');
    const [audioSourceLink, setAudioSourceLink] = useState('');
    const [compressAudio, setCompressAudio] = useState(false);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isAudioProcessing, setIsAudioProcessing] = useState(false);
    const [audioCompressProgress, setAudioCompressProgress] = useState<number | null>(null);

    const [officeSourceUrl, setOfficeSourceUrl] = useState('');
    const [officeLink, setOfficeLink] = useState('');
    const [officeRenderAllLink, setOfficeRenderAllLink] = useState('');
    const [officeError, setOfficeError] = useState('');
    const [officeCode, setOfficeCode] = useState('');
    const [officeFile, setOfficeFile] = useState<File | null>(null);

    useEffect(() => {
        loadAvailableThemes();
    }, []);

    const contentTypeOptions = useMemo(() => [
        { value: 'html', label: t('home.html') },
        { value: 'md', label: t('home.markdown') },
        { value: 'csv', label: t('home.csv') },
        { value: 'txt', label: t('home.txt') },
        { value: 'xlsx', label: t('home.xlsx') },
        { value: 'xls', label: t('home.xls') },
        { value: 'docx', label: t('home.docx') },
        { value: 'pptx', label: t('home.pptx') },
        { value: 'image', label: t('home.image') },
        { value: 'pdf', label: t('home.pdf') },
        { value: 'video', label: t('home.video') },
        { value: 'audio', label: t('home.audio') },
        { value: 'qr', label: t('create.qrTitle') },
        { value: 'recovery', label: t('create.recoveryOption') },
    ], [t]);

    const recoveryTypeOptions = useMemo(() => (
        contentTypeOptions.filter((opt) => opt.value !== 'recovery' && opt.value !== 'qr')
    ), [contentTypeOptions]);

    const contentValue = typeof content === 'string'
        ? content
        : t('create.binaryContentPlaceholder');

    const uint8ArrayToDataUrl = (bytes: Uint8Array, mimeType: string) => (
        `data:${mimeType};base64,${uint8ArrayToBase64(bytes)}`
    );

    const isLikelyHtml = (value: string) => /<\s*(!doctype|html|head|body)\b/i.test(value);

    const handleContentTextChange = (value: string) => {
        if (contentType !== 'html' && contentType !== 'md' && contentType !== 'csv' && contentType !== 'txt') {
            setContent(value);
            return;
        }

        const parsed = parseRecoveryInput(value, { assumedType: contentType });
        if (!parsed) {
            setContent(value);
            return;
        }

        // Compressed payload: `H4sIA...` or `type-H4sIA...`
        if (parsed.isCompressed && typeof parsed.data === 'string') {
            try {
                const decompressed = decompress(parsed.data);
                if (contentType === 'html' && !isLikelyHtml(decompressed)) {
                    setContent(value);
                    return;
                }
                setContent(decompressed);
                return;
            } catch {
                setContent(value);
                return;
            }
        }

        // Direct Data URL -> bytes
        if (!parsed.isCompressed && parsed.data instanceof Uint8Array) {
            try {
                const decoded = new TextDecoder().decode(parsed.data);
                if (contentType === 'html' && !isLikelyHtml(decoded)) {
                    setContent(value);
                    return;
                }
                setContent(decoded);
                return;
            } catch {
                setContent(value);
                return;
            }
        }

        setContent(value);
    };

    const getMaxLengthForContentType = (type: ContentType) => {
        switch (type) {
            case 'html':
                return getMaxHtmlUrlLength();
            case 'md':
                return getMaxMarkdownUrlLength();
            case 'csv':
                return getMaxCsvUrlLength();
            case 'xlsx':
                return getMaxXlsxUrlLength();
            default:
                return getMaxUrlLength();
        }
    };

    const isValidUrl = (value: string) => {
        if (!value) return false;
        try {
            const parsed = new URL(value);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const extractOfficeUrlFromCode = (value: string) => {
        const match = value.match(/https?:\/\/[^\s"'<>]+/i);
        return match?.[0] || '';
    };

    const resolveOfficeSource = () => {
        const urlValue = officeSourceUrl.trim();
        if (urlValue) return urlValue;

        const codeValue = officeCode.trim();
        if (!codeValue) return '';

        const extracted = extractOfficeUrlFromCode(codeValue);
        return extracted || codeValue;
    };

    const hasOfficeSource = () => Boolean(officeSourceUrl.trim() || officeCode.trim() || officeFile);

    const resetContentMessages = () => {
        setError('');
        setSuccessMessage('');
    };

    const handleContentTypeChange = (newType: ContentType) => {
        setContentType(newType);
        setContent('');
        setGeneratedLink('');
        resetContentMessages();
        setIsProcessing(false);
        setContentSourceLink('');
        setContentSourceError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Mapping ContentType to ToolType
        const contentTypeToTool: Record<ContentType, ToolType> = {
            'pdf': 'pdf',
            'image': 'image',
            'video': 'video',
            'audio': 'audio',
            'docx': 'office',
            'pptx': 'office',
            'doc': 'office',
            'ppt': 'office',
            'xls': 'office',
            'xlsx': 'office',
            'qr': 'qr',
            'recovery': 'recovery',
            'html': 'create',
            'md': 'create',
            'csv': 'create',
            'txt': 'create',
            'office': 'office',
        };

        setSelectedTool(contentTypeToTool[newType] || 'create');
    };

    const handleClearContent = () => {
        setContent('');
        setGeneratedLink('');
        resetContentMessages();
        setIsProcessing(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        if (contentType === 'docx' && content instanceof Uint8Array && content.length > 0) {
            setIsConvertingRecovered(true);
            convertDocxToHtml(content.buffer as ArrayBuffer)
                .then(html => setConvertedRecoveredHtml(html))
                //.catch(err => console.error('Preview conversion error:', err))
                .finally(() => setIsConvertingRecovered(false));
        } else {
            setConvertedRecoveredHtml(null);
        }
    }, [content, contentType]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        if (contentType === 'xlsx') {
            reader.onload = (loadEvent) => {
                const buffer = loadEvent.target?.result as ArrayBuffer;
                setContent(new Uint8Array(buffer));
            };
            reader.readAsArrayBuffer(file);
        } else {
            reader.onload = (loadEvent) => {
                const text = loadEvent.target?.result as string;
                setContent(text);
            };
            reader.readAsText(file);
        }
    };

    const generateHashLink = (targetContent: string | Uint8Array, type: ContentType, fullScreen = false) => {
        const compressed = typeof targetContent === 'string'
            ? compress(targetContent)
            : compressBytes(targetContent);

        if (typeof window === 'undefined') return '';

        const baseUrl = window.location.origin;
        const fullPath = withBasePath(fullScreen ? 'render-all' : 'render');
        return `${baseUrl}${fullPath}#data=${type}-${compressed}`;
    };

    const handleGenerateLink = async () => {
        if (content.length === 0) {
            setError(t('create.emptyContent'));
            return;
        }

        setIsProcessing(true);
        resetContentMessages();
        setGeneratedLink('');

        try {
            const link = generateHashLink(content, contentType, isFullScreen);
            const maxLimit = getMaxLengthForContentType(contentType);

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

    const handleGenerateContentSourceLink = () => {
        if (!contentSourceUrl) return;
        if (!isValidUrl(contentSourceUrl)) {
            setContentSourceError(t('create.sourceUrlInvalid'));
            return;
        }

        if (typeof window === 'undefined') return;

        const baseUrl = window.location.origin;
        const fullPath = withBasePath(`render?source=${encodeURIComponent(contentSourceUrl)}&type=${contentType}`);
        const link = `${baseUrl}${fullPath}`;
        const maxLimit = getMaxUrlLength();

        if (link.length > maxLimit) {
            setContentSourceError(t('create.urlTooLong'));
            return;
        }

        setContentSourceError('');
        setContentSourceLink(link);
    };

    const handleCopyLink = (value: string) => {
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(value);
        }
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
            return <MarkdownPreview dangerouslySetInnerHTML={{ __html: htmlContent }} />;
        }

        if (contentType === 'csv' || contentType === 'xlsx' || contentType === 'xls') {
            type TableCell = string | number | null;
            type TableData = TableCell[][];
            let parsedData: TableData = [];

            try {
                if (contentType === 'csv') {
                    const strContent = typeof content === 'string' ? content : new TextDecoder().decode(content);
                    const result = Papa.parse<TableCell[]>(strContent);
                    parsedData = result.data as TableData;
                } else if (content instanceof Uint8Array) {
                    const workbook = XLSX.read(content, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    parsedData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as TableData;
                }

                if (parsedData.length === 0) return <p>No data</p>;

                return (
                    <PreviewContent>
                        <TablePreview>
                            <thead>
                                <tr>
                                    {parsedData[0]?.map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {parsedData.slice(1).map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex}>{cell}</td>
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

        if (contentType === 'docx') {
            if (isConvertingRecovered) return <p>Converting document...</p>;
            if (convertedRecoveredHtml) {
                return (
                    <div
                        style={{ background: '#fff', color: '#333', padding: '20px', borderRadius: '8px', maxHeight: '600px', overflowY: 'auto' }}
                        dangerouslySetInnerHTML={{ __html: convertedRecoveredHtml }}
                    />
                );
            }
            return <p>Binary file loaded (DOCX) - Support for direct preview coming from hash recovery.</p>;
        }

        if (['pdf', 'image', 'video', 'audio'].includes(contentType) && content instanceof Uint8Array) {
            const mimeType = getMimeType(contentType);
            const blob = new Blob([content as any], { type: mimeType });
            const url = URL.createObjectURL(blob);

            if (contentType === 'image') return <img src={url} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px' }} />;
            if (contentType === 'pdf') return <PreviewFrame src={url} title="PDF Preview" style={{ height: '600px' }} />;
            if (contentType === 'video') return <video src={url} controls style={{ maxWidth: '100%' }} />;
            if (contentType === 'audio') return <audio src={url} controls style={{ width: '100%' }} />;
        }

        if (contentType === 'txt') {
            const strContent = typeof content === 'string' ? content : new TextDecoder().decode(content);
            return (
                <pre style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                    maxWidth: '100%',
                    fontFamily: 'monospace',
                    padding: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                }}>
                    {strContent}
                </pre>
            );
        }

        return <p>Binary file loaded ({contentType.toUpperCase()}) - Use Download Original or view in the dedicated renderer after generating the link.</p>;

        return null;
    };

    const handleRecoverContent = () => {
        if (!recoveryHash) return;

        try {
            setIsRecovered(false);
            const parsed = parseRecoveryInput(recoveryHash, { assumedType: recoveryType });

            if (!parsed) {
                setError(t('create.invalidHash'));
                return;
            }

            const type = parsed.type as ContentType;
            const data = parsed.data;

            // Allow all supported types for recovery
            const supportedTypes: ContentType[] = ['html', 'md', 'csv', 'xlsx', 'xls', 'docx', 'pptx', 'txt', 'pdf', 'image', 'video', 'audio'];
            if (!supportedTypes.includes(type)) {
                setError(t('create.invalidHash'));
                return;
            }

            let recoveredData: string | Uint8Array;

            if (parsed.isCompressed && typeof data === 'string') {
                const isBinaryType = ['xlsx', 'xls', 'docx', 'pptx', 'image', 'pdf', 'video', 'audio'].includes(type);
                try {
                    recoveredData = isBinaryType
                        ? decompressBytes(data)
                        : decompress(data);
                } catch (e) {
                    //console.warn('Decompression failed, using raw content:', e);
                    recoveredData = data;
                }
            } else {
                recoveredData = data;
            }

            setContentType(type);
            setContent(recoveredData);
            setIsRecovered(true);
            setSuccessMessage(t('create.recoverySuccess'));
            setGeneratedLink('');
            setError('');
        } catch (error) {
            //console.error('Recovery error:', error);
            setIsRecovered(false);
            setError(t('create.invalidHash'));
        }
    };

    const handleDownloadRecovered = () => {
        if (!content) return;
        const filename = `recovered${getFileExtension(contentType)}`;
        const mimeType = getMimeType(contentType);
        downloadFile(content, filename, mimeType);
    };

    const handleViewRecovered = () => {
        const specializedTools: Partial<Record<ContentType, ToolType>> = {
            'pdf': 'pdf',
            'image': 'image',
            'video': 'video',
            'audio': 'audio',
            'docx': 'office',
            'pptx': 'office',
            'doc': 'office',
            'xls': 'office',
            'xlsx': 'office',
        };

        if (specializedTools[contentType]) {
            setSelectedTool(specializedTools[contentType] as ToolType);

            // Sync recovered data to specialized tool states
            if (content) {
                const mimeType = getMimeType(contentType);
                let dataUrl = '';
                if (content instanceof Uint8Array) {
                    dataUrl = uint8ArrayToDataUrl(content, mimeType);
                } else {
                    dataUrl = content;
                }

                switch (specializedTools[contentType]) {
                    case 'office':
                        setOfficeCode(dataUrl);
                        setOfficeFile(new File([], `recovered_file.${contentType}`, { type: mimeType }));
                        break;
                    case 'pdf':
                        setPdfDataUrl(dataUrl);
                        break;
                    case 'image':
                        setImageDataUrl(dataUrl);
                        break;
                    case 'video':
                        setVideoDataUrl(dataUrl);
                        break;
                    case 'audio':
                        setAudioDataUrl(dataUrl);
                        break;
                }
            }
        } else {
            setSelectedTool('create');
            setShowPreview(true);
        }
    };

    const handleGoToCreate = () => {
        const specializedTools: Partial<Record<ContentType, ToolType>> = {
            'pdf': 'pdf',
            'image': 'image',
            'video': 'video',
            'audio': 'audio',
            'docx': 'office',
            'pptx': 'office',
            'doc': 'office',
            'xls': 'office',
            'xlsx': 'office',
        };

        if (specializedTools[contentType]) {
            setSelectedTool(specializedTools[contentType] as ToolType);

            // Sync recovered data to specialized tool states
            if (content) {
                const mimeType = getMimeType(contentType);
                const dataUrl = content instanceof Uint8Array ? uint8ArrayToDataUrl(content, mimeType) : content;

                switch (specializedTools[contentType]) {
                    case 'office':
                        setOfficeCode(dataUrl);
                        setOfficeFile(new File([], `recovered_file.${contentType}`, { type: mimeType }));
                        break;
                    case 'pdf':
                        setPdfDataUrl(dataUrl);
                        break;
                    case 'image':
                        setImageDataUrl(dataUrl);
                        break;
                    case 'video':
                        setVideoDataUrl(dataUrl);
                        break;
                    case 'audio':
                        setAudioDataUrl(dataUrl);
                        break;
                }
            }
        } else {
            setSelectedTool('create');
        }
        setIsRecovered(false);
    };

    const processImageFile = async (file: File, shouldCompress: boolean) => {
        setIsImageProcessing(true);
        setImageCompressProgress(null);
        try {
            const dataUrl = shouldCompress
                ? await compressImageFile(file, {
                    targetUrlLength: getMaxImageUrlLength(),
                    onProgress: setImageCompressProgress,
                })
                : await fileToDataUrl(file);
            setImageDataUrl(dataUrl);
            setImageError('');
            setImageLink('');
            setImageRenderAllLink('');
            setImageSourceLink('');
        } catch {
            if (shouldCompress) {
                try {
                    const fallbackDataUrl = await fileToDataUrl(file);
                    setImageDataUrl(fallbackDataUrl);
                    setImageError(t('create.imageCompressionFallback'));
                } catch {
                    setImageError(t('create.imageError'));
                }
            } else {
                setImageError(t('create.imageError'));
            }
        } finally {
            setIsImageProcessing(false);
            setImageCompressProgress(null);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setImageError(t('create.imageInvalid'));
            return;
        }

        setImageFile(file);
        await processImageFile(file, compressImage);
    };

    const handleToggleCompressImage = async () => {
        const nextValue = !compressImage;
        setCompressImage(nextValue);
        if (imageFile) {
            await processImageFile(imageFile, nextValue);
        }
    };

    const handleGenerateImageLink = () => {
        if (!imageDataUrl || typeof window === 'undefined') return;
        setImageError('');

        const encoded = encodeImageDataUrl(imageDataUrl);
        const baseUrl = window.location.origin;
        const fullPath = withBasePath('render/image');
        const link = `${baseUrl}${fullPath}#data=${encoded}`;

        if (link.length > getMaxImageUrlLength()) {
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

        if (link.length > getMaxUrlLength()) {
            setImageError(t('create.urlTooLong'));
            return;
        }

        setImageRenderAllLink(link);
    };

    const handleGenerateImageSourceLink = () => {
        if (!imageSourceUrl) return;
        if (!isValidUrl(imageSourceUrl)) {
            setImageError(t('create.imageUrlInvalid'));
            return;
        }
        if (typeof window === 'undefined') return;
        const baseUrl = window.location.origin;
        const fullPath = withBasePath(`render/image?source=${encodeURIComponent(imageSourceUrl)}`);
        setImageSourceLink(`${baseUrl}${fullPath}`);
        setImageError('');
    };

    const handleClearImage = () => {
        setImageDataUrl('');
        setImageLink('');
        setImageRenderAllLink('');
        setImageError('');
        setImageSourceLink('');
        setImageSourceUrl('');
        setImageFile(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
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

    const handleGeneratePdfLink = () => {
        if (!pdfDataUrl || typeof window === 'undefined') return;
        setPdfError('');

        const encoded = encodePdfDataUrl(pdfDataUrl);
        const baseUrl = window.location.origin;
        const fullPath = withBasePath('render/pdf');
        const link = `${baseUrl}${fullPath}#data=${encoded}`;

        if (link.length > getMaxPdfUrlLength()) {
            setPdfError(t('create.urlTooLong'));
            return;
        }

        setPdfLink(link);
    };

    const handleGeneratePdfRenderAllLink = () => {
        if (!pdfDataUrl || typeof window === 'undefined') return;
        setPdfError('');

        const encoded = encodePdfDataUrl(pdfDataUrl);
        const baseUrl = window.location.origin;
        const fullPath = withBasePath('render/pdf?fullscreen=1');
        const link = `${baseUrl}${fullPath}#data=${encoded}`;

        if (link.length > getMaxPdfUrlLength()) {
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

    const processVideoFile = async (file: File, shouldCompress: boolean) => {
        setIsVideoProcessing(true);
        setVideoCompressProgress(null);
        try {
            const dataUrl = shouldCompress
                ? await compressVideoFile(file, {
                    targetUrlLength: getMaxVideoUrlLength(),
                    onProgress: setVideoCompressProgress,
                })
                : await fileToDataUrl(file);
            setVideoDataUrl(dataUrl);
            setVideoError('');
            setVideoLink('');
            setVideoRenderAllLink('');
            setVideoSourceLink('');
        } catch {
            if (shouldCompress) {
                try {
                    const fallbackDataUrl = await fileToDataUrl(file);
                    setVideoDataUrl(fallbackDataUrl);
                    setVideoError(t('create.videoCompressionFallback'));
                } catch {
                    setVideoError(t('create.videoError'));
                }
            } else {
                setVideoError(t('create.videoError'));
            }
        } finally {
            setIsVideoProcessing(false);
            setVideoCompressProgress(null);
        }
    };

    const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('video/')) {
            setVideoError(t('create.videoInvalid'));
            return;
        }

        setVideoFile(file);
        await processVideoFile(file, compressVideo);
    };

    const handleToggleCompressVideo = async () => {
        const nextValue = !compressVideo;
        setCompressVideo(nextValue);
        if (videoFile) {
            await processVideoFile(videoFile, nextValue);
        }
    };

    const handleGenerateVideoLink = () => {
        if (!videoDataUrl || typeof window === 'undefined') return;
        setVideoError('');

        const encoded = encodeVideoDataUrl(videoDataUrl);
        const baseUrl = window.location.origin;
        const fullPath = withBasePath('render/video');
        const link = `${baseUrl}${fullPath}#data=${encoded}`;

        if (link.length > getMaxVideoUrlLength()) {
            setVideoError(t('create.urlTooLong'));
            return;
        }

        setVideoLink(link);
    };

    const handleGenerateVideoRenderAllLink = () => {
        if (!videoDataUrl || typeof window === 'undefined') return;
        setVideoError('');

        const encoded = encodeVideoDataUrl(videoDataUrl);
        const baseUrl = window.location.origin;
        const fullPath = withBasePath('render/video?fullscreen=1');
        const link = `${baseUrl}${fullPath}#data=${encoded}`;

        if (link.length > getMaxVideoUrlLength()) {
            setVideoError(t('create.urlTooLong'));
            return;
        }

        setVideoRenderAllLink(link);
    };

    const handleGenerateVideoSourceLink = () => {
        if (!videoSourceUrl) return;
        if (!isValidUrl(videoSourceUrl)) {
            setVideoError(t('create.videoUrlInvalid'));
            return;
        }

        if (typeof window === 'undefined') return;
        const baseUrl = window.location.origin;
        const fullPath = withBasePath(`render/video?source=${encodeURIComponent(videoSourceUrl)}`);
        setVideoSourceLink(`${baseUrl}${fullPath}`);
        setVideoError('');
    };

    const handleClearVideo = () => {
        setVideoDataUrl('');
        setVideoLink('');
        setVideoRenderAllLink('');
        setVideoError('');
        setVideoSourceLink('');
        setVideoSourceUrl('');
        setVideoFile(null);
        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    };

    const processAudioFile = async (file: File, shouldCompress: boolean) => {
        setIsAudioProcessing(true);
        setAudioCompressProgress(null);
        try {
            const dataUrl = shouldCompress
                ? await compressAudioFile(file, {
                    targetUrlLength: getMaxAudioUrlLength(),
                    onProgress: setAudioCompressProgress,
                })
                : await fileToDataUrl(file);
            setAudioDataUrl(dataUrl);
            setAudioError('');
            setAudioLink('');
            setAudioRenderAllLink('');
            setAudioSourceLink('');
        } catch {
            if (shouldCompress) {
                try {
                    const fallbackDataUrl = await fileToDataUrl(file);
                    setAudioDataUrl(fallbackDataUrl);
                    setAudioError(t('create.audioCompressionFallback'));
                } catch {
                    setAudioError(t('create.audioError'));
                }
            } else {
                setAudioError(t('create.audioError'));
            }
        } finally {
            setIsAudioProcessing(false);
            setAudioCompressProgress(null);
        }
    };

    const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('audio/')) {
            setAudioError(t('create.audioInvalid'));
            return;
        }

        setAudioFile(file);
        await processAudioFile(file, compressAudio);
    };

    const handleToggleCompressAudio = async () => {
        const nextValue = !compressAudio;
        setCompressAudio(nextValue);
        if (audioFile) {
            await processAudioFile(audioFile, nextValue);
        }
    };

    const handleGenerateAudioLink = () => {
        if (!audioDataUrl || typeof window === 'undefined') return;
        setAudioError('');

        const encoded = encodeAudioDataUrl(audioDataUrl);
        const baseUrl = window.location.origin;
        const fullPath = withBasePath('render/audio');
        const link = `${baseUrl}${fullPath}#data=${encoded}`;

        if (link.length > getMaxAudioUrlLength()) {
            setAudioError(t('create.urlTooLong'));
            return;
        }

        setAudioLink(link);
    };

    const handleGenerateAudioRenderAllLink = () => {
        if (!audioDataUrl || typeof window === 'undefined') return;
        setAudioError('');

        const encoded = encodeAudioDataUrl(audioDataUrl);
        const baseUrl = window.location.origin;
        const fullPath = withBasePath('render/audio?fullscreen=1');
        const link = `${baseUrl}${fullPath}#data=${encoded}`;

        if (link.length > getMaxAudioUrlLength()) {
            setAudioError(t('create.urlTooLong'));
            return;
        }

        setAudioRenderAllLink(link);
    };

    const handleGenerateAudioSourceLink = () => {
        if (!audioSourceUrl) return;
        if (!isValidUrl(audioSourceUrl)) {
            setAudioError(t('create.audioUrlInvalid'));
            return;
        }

        if (typeof window === 'undefined') return;
        const baseUrl = window.location.origin;
        const fullPath = withBasePath(`render/audio?source=${encodeURIComponent(audioSourceUrl)}`);
        setAudioSourceLink(`${baseUrl}${fullPath}`);
        setAudioError('');
    };

    const handleClearAudio = () => {
        setAudioDataUrl('');
        setAudioLink('');
        setAudioRenderAllLink('');
        setAudioError('');
        setAudioSourceLink('');
        setAudioSourceUrl('');
        setAudioFile(null);
        if (audioInputRef.current) {
            audioInputRef.current.value = '';
        }
    };

    const handleOfficeCodeChange = (value: string) => {
        setOfficeCode(value);
        const extracted = extractOfficeUrlFromCode(value);
        if (extracted && !officeSourceUrl) {
            setOfficeSourceUrl(extracted);
        }
    };

    const handleOfficeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setOfficeFile(file);
        setOfficeLink('');
        setOfficeRenderAllLink('');

        try {
            const dataUrl = await fileToDataUrl(file);
            setOfficeCode(dataUrl);
            setOfficeError('');
        } catch {
            setOfficeError(t('create.officeUploadError'));
        }
    };

    const handleGenerateOfficeLink = () => {
        const sourceValue = resolveOfficeSource();
        if (!sourceValue) return;

        setOfficeError('');
        setOfficeLink('');

        if (sourceValue.startsWith('data:')) {
            // It's an uploaded file, generate hash link
            try {
                // Extract base64 part
                const base64Data = sourceValue.split(',')[1];
                const binaryString = atob(base64Data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                const compressed = compressBytes(bytes);
                const type = getFileTypeFromFilename(officeFile?.name || 'file.docx');

                if (typeof window === 'undefined') return;
                const baseUrl = window.location.origin;
                const fullPath = withBasePath('render/office');
                const link = `${baseUrl}${fullPath}#data=${type}-${compressed}`;

                if (link.length > getMaxOfficeUrlLength()) {
                    setOfficeError(t('create.urlTooLong'));
                    return;
                }

                setOfficeLink(link);
                return;
            } catch (err) {
                //console.error('Error generating office hash link:', err);
                setOfficeError(t('create.error'));
                return;
            }
        }

        if (!isValidUrl(sourceValue)) {
            setOfficeError(t('create.officeUrlInvalid'));
            return;
        }

        if (typeof window === 'undefined') return;
        const baseUrl = window.location.origin;
        const fullPath = withBasePath(`render/office?source=${encodeURIComponent(sourceValue)}`);
        const link = `${baseUrl}${fullPath}`;

        if (link.length > getMaxOfficeUrlLength()) {
            setOfficeError(t('create.urlTooLong'));
            return;
        }

        setOfficeLink(link);
    };

    const handleGenerateOfficeRenderAllLink = () => {
        const sourceValue = resolveOfficeSource();
        if (!sourceValue) return;

        setOfficeError('');
        setOfficeRenderAllLink('');

        if (sourceValue.startsWith('data:')) {
            // It's an uploaded file, generate hash link
            try {
                const base64Data = sourceValue.split(',')[1];
                const binaryString = atob(base64Data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                const compressed = compressBytes(bytes);
                const type = getFileTypeFromFilename(officeFile?.name || 'file.docx');

                if (typeof window === 'undefined') return;
                const baseUrl = window.location.origin;
                const fullPath = withBasePath('render/office?fullscreen=1');
                const link = `${baseUrl}${fullPath}#data=${type}-${compressed}`;

                if (link.length > getMaxOfficeUrlLength()) {
                    setOfficeError(t('create.urlTooLong'));
                    return;
                }

                setOfficeRenderAllLink(link);
                return;
            } catch (err) {
                //console.error('Error generating office hash link:', err);
                setOfficeError(t('create.error'));
                return;
            }
        }

        if (!isValidUrl(sourceValue)) {
            setOfficeError(t('create.officeUrlInvalid'));
            return;
        }

        if (typeof window === 'undefined') return;
        const baseUrl = window.location.origin;
        const fullPath = withBasePath(`render/office?source=${encodeURIComponent(sourceValue)}&fullscreen=1`);
        const link = `${baseUrl}${fullPath}`;

        if (link.length > getMaxOfficeUrlLength()) {
            setOfficeError(t('create.urlTooLong'));
            return;
        }

        setOfficeRenderAllLink(link);
    };

    const handleClearOffice = () => {
        setOfficeSourceUrl('');
        setOfficeLink('');
        setOfficeRenderAllLink('');
        setOfficeError('');
        setOfficeCode('');
        setOfficeFile(null);
        if (officeInputRef.current) {
            officeInputRef.current.value = '';
        }
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
        if (!qrDataUrl || typeof window === 'undefined') return;
        const html = `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>QR Code</title><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#111;}img{max-width:90vw;max-height:90vh;background:#fff;padding:16px;border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,0.35);}</style></head><body><img src="${qrDataUrl}" alt="QR code" /></body></html>`;
        const compressed = compress(html);
        const fullPath = withBasePath(`render?data=html-${compressed}`);
        const baseUrl = window.location.origin;
        setQrRenderLink(`${baseUrl}${fullPath}`);
    };

    const handleGenerateQrRenderAllLink = () => {
        if (!qrDataUrl || typeof window === 'undefined') return;
        const html = `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>QR Code</title><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#111;}img{max-width:90vw;max-height:90vh;background:#fff;padding:16px;border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,0.35);}</style></head><body><img src="${qrDataUrl}" alt="QR code" /></body></html>`;
        const compressed = compress(html);
        const baseUrl = window.location.origin;
        const fullPath = withBasePath(`render-all?data=html-${compressed}`);
        setQrRenderAllLink(`${baseUrl}${fullPath}`);
    };

    const renderSelectedTool = () => {
        switch (selectedTool) {
            case 'create':
                return (
                    <ContentToolCard
                        title={t('create.title')}
                        selectLabel={t('create.selectType')}
                        pasteLabel={t('create.pasteContent')}
                        uploadLabel={t('create.uploadFile')}
                        fullScreenLabel={t('create.fullScreenOption')}
                        sourceUrlLabel={t('create.sourceUrlLabel')}
                        sourceUrlPlaceholder={t('create.sourceUrlPlaceholder')}
                        sourceUrlGenerateLabel={t('create.sourceUrlGenerate')}
                        sourceUrlLinkTitle={t('create.sourceUrlLinkTitle')}
                        generateLabel={t('create.generateLink')}
                        processingLabel={t('create.processing')}
                        previewLabel={t('create.preview')}
                        clearLabel={t('create.clearContent')}
                        copyLabel={t('create.copyLink')}
                        openLabel={t('create.openLink')}
                        contentType={contentType}
                        contentValue={contentValue}
                        isContentEditable={typeof content === 'string'}
                        onContentChange={handleContentTextChange}
                        fileInputRef={fileInputRef}
                        onFileUpload={handleFileUpload}
                        isFullScreen={isFullScreen}
                        onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
                        contentSourceUrl={contentSourceUrl}
                        onContentSourceUrlChange={setContentSourceUrl}
                        onGenerateContentSourceLink={handleGenerateContentSourceLink}
                        contentSourceError={contentSourceError}
                        contentSourceLink={contentSourceLink}
                        onCopyLink={handleCopyLink}
                        onGenerateLink={handleGenerateLink}
                        isProcessing={isProcessing}
                        onTogglePreview={() => setShowPreview(!showPreview)}
                        onClearContent={handleClearContent}
                        errorMessage={error}
                        successMessage={successMessage}
                    />
                );
            case 'recovery':
                return (
                    <RecoveryToolCard
                        title={t('create.recoveryTitle')}
                        pasteLabel={t('create.pasteHash')}
                        recoverLabel={t('create.recoverButton')}
                        clearLabel={t('create.clearHash')}
                        recoveryType={recoveryType}
                        recoveryTypeOptions={recoveryTypeOptions}
                        onRecoveryTypeChange={(value) => setRecoveryType(value as RecoverableContentType)}
                        hashValue={recoveryHash}
                        onHashChange={(value) => {
                            setRecoveryHash(value);
                            setIsRecovered(false);
                        }}
                        onRecover={handleRecoverContent}
                        onClear={() => {
                            setRecoveryHash('');
                            setIsRecovered(false);
                        }}
                        isRecovered={isRecovered}
                        onDownload={handleDownloadRecovered}
                        onView={handleViewRecovered}
                        onCreateNew={handleGoToCreate}
                        downloadLabel={t('create.downloadFile')}
                        viewLabel={t('create.viewFile')}
                        createNewLabel={t('create.createNew')}
                        selectTypeLabel={t('create.selectType')}
                        recoveryHelp={t('create.recoveryHelp')}
                    />
                );
            case 'image':
                return (
                    <ImageToolCard
                        title={t('create.imageTitle')}
                        description={t('create.imageDescription')}
                        uploadLabel={t('create.imageUpload')}
                        previewHint={t('create.imagePreviewHint')}
                        previewAlt={t('create.imagePreviewAlt')}
                        compressLabel={t('create.imageCompressLabel')}
                        urlLabel={t('create.imageUrlLabel')}
                        urlPlaceholder={t('create.imageUrlPlaceholder')}
                        generateLabel={t('create.imageGenerate')}
                        generateUrlLabel={t('create.imageUrlGenerate')}
                        renderAllLabel={t('create.imageRenderAll')}
                        clearLabel={t('create.imageClear')}
                        linkTitle={t('create.imageLinkTitle')}
                        renderAllTitle={t('create.imageRenderAllTitle')}
                        urlLinkTitle={t('create.imageUrlLinkTitle')}
                        copyLabel={t('create.copyLink')}
                        openLabel={t('create.openLink')}
                        compressingLabel={t('create.compressing')}
                        imageDataUrl={imageDataUrl}
                        imageSourceUrl={imageSourceUrl}
                        imageLink={imageLink}
                        imageRenderAllLink={imageRenderAllLink}
                        imageSourceLink={imageSourceLink}
                        imageError={imageError}
                        isProcessing={isImageProcessing}
                        compressImage={compressImage}
                        compressProgress={imageCompressProgress}
                        imageInputRef={imageInputRef}
                        onUpload={handleImageUpload}
                        onToggleCompress={handleToggleCompressImage}
                        onSourceUrlChange={setImageSourceUrl}
                        onGenerateLink={handleGenerateImageLink}
                        onGenerateSourceLink={handleGenerateImageSourceLink}
                        onGenerateRenderAll={handleGenerateImageRenderAllLink}
                        onClear={handleClearImage}
                        onCopyLink={handleCopyLink}
                    />
                );
            case 'pdf':
                return (
                    <PdfToolCard
                        title={t('create.pdfTitle')}
                        description={t('create.pdfDescription')}
                        uploadLabel={t('create.pdfUpload')}
                        previewHint={t('create.pdfPreviewHint')}
                        generateLabel={t('create.pdfGenerate')}
                        renderAllLabel={t('create.pdfRenderAll')}
                        clearLabel={t('create.pdfClear')}
                        linkTitle={t('create.pdfLinkTitle')}
                        renderAllTitle={t('create.pdfRenderAllTitle')}
                        copyLabel={t('create.copyLink')}
                        openLabel={t('create.openLink')}
                        pdfDataUrl={pdfDataUrl}
                        pdfLink={pdfLink}
                        pdfRenderAllLink={pdfRenderAllLink}
                        pdfError={pdfError}
                        pdfInputRef={pdfInputRef}
                        onUpload={handlePdfUpload}
                        onGenerateLink={handleGeneratePdfLink}
                        onGenerateRenderAll={handleGeneratePdfRenderAllLink}
                        onClear={handleClearPdf}
                        onCopyLink={handleCopyLink}
                    />
                );
            case 'video':
                return (
                    <VideoToolCard
                        title={t('create.videoTitle')}
                        description={t('create.videoDescription')}
                        uploadLabel={t('create.videoUpload')}
                        previewHint={t('create.videoPreviewHint')}
                        compressLabel={t('create.videoCompressLabel')}
                        urlLabel={t('create.videoUrlLabel')}
                        urlPlaceholder={t('create.videoUrlPlaceholder')}
                        generateLabel={t('create.videoGenerate')}
                        generateUrlLabel={t('create.videoUrlGenerate')}
                        renderAllLabel={t('create.videoRenderAll')}
                        clearLabel={t('create.videoClear')}
                        linkTitle={t('create.videoLinkTitle')}
                        renderAllTitle={t('create.videoRenderAllTitle')}
                        urlLinkTitle={t('create.videoUrlLinkTitle')}
                        copyLabel={t('create.copyLink')}
                        openLabel={t('create.openLink')}
                        compressingLabel={t('create.compressing')}
                        videoDataUrl={videoDataUrl}
                        videoSourceUrl={videoSourceUrl}
                        videoLink={videoLink}
                        videoRenderAllLink={videoRenderAllLink}
                        videoSourceLink={videoSourceLink}
                        videoError={videoError}
                        isProcessing={isVideoProcessing}
                        compressVideo={compressVideo}
                        compressProgress={videoCompressProgress}
                        videoInputRef={videoInputRef}
                        onUpload={handleVideoUpload}
                        onToggleCompress={handleToggleCompressVideo}
                        onSourceUrlChange={setVideoSourceUrl}
                        onGenerateLink={handleGenerateVideoLink}
                        onGenerateSourceLink={handleGenerateVideoSourceLink}
                        onGenerateRenderAll={handleGenerateVideoRenderAllLink}
                        onClear={handleClearVideo}
                        onCopyLink={handleCopyLink}
                    />
                );
            case 'audio':
                return (
                    <AudioToolCard
                        title={t('create.audioTitle')}
                        description={t('create.audioDescription')}
                        uploadLabel={t('create.audioUpload')}
                        previewHint={t('create.audioPreviewHint')}
                        compressLabel={t('create.audioCompressLabel')}
                        urlLabel={t('create.audioUrlLabel')}
                        urlPlaceholder={t('create.audioUrlPlaceholder')}
                        generateLabel={t('create.audioGenerate')}
                        generateUrlLabel={t('create.audioUrlGenerate')}
                        renderAllLabel={t('create.audioRenderAll')}
                        clearLabel={t('create.audioClear')}
                        linkTitle={t('create.audioLinkTitle')}
                        renderAllTitle={t('create.audioRenderAllTitle')}
                        urlLinkTitle={t('create.audioUrlLinkTitle')}
                        copyLabel={t('create.copyLink')}
                        openLabel={t('create.openLink')}
                        compressingLabel={t('create.compressing')}
                        audioDataUrl={audioDataUrl}
                        audioSourceUrl={audioSourceUrl}
                        audioLink={audioLink}
                        audioRenderAllLink={audioRenderAllLink}
                        audioSourceLink={audioSourceLink}
                        audioError={audioError}
                        isProcessing={isAudioProcessing}
                        compressAudio={compressAudio}
                        compressProgress={audioCompressProgress}
                        audioInputRef={audioInputRef}
                        onUpload={handleAudioUpload}
                        onToggleCompress={handleToggleCompressAudio}
                        onSourceUrlChange={setAudioSourceUrl}
                        onGenerateLink={handleGenerateAudioLink}
                        onGenerateSourceLink={handleGenerateAudioSourceLink}
                        onGenerateRenderAll={handleGenerateAudioRenderAllLink}
                        onClear={handleClearAudio}
                        onCopyLink={handleCopyLink}
                    />
                );
            case 'office':
                return (
                    <OfficeToolCard
                        title={t('create.officeTitle')}
                        description={t('create.officeDescription')}
                        previewHint={t('create.officePreviewHint')}
                        pasteLabel={t('create.officePasteLabel')}
                        pastePlaceholder={t('create.officePastePlaceholder')}
                        uploadLabel={t('create.officeUploadLabel')}
                        urlLabel={t('create.officeUrlLabel')}
                        urlPlaceholder={t('create.officeUrlPlaceholder')}
                        generateLabel={t('create.officeUrlGenerate')}
                        renderAllLabel={t('create.officeRenderAll')}
                        clearLabel={t('create.officeClear')}
                        linkTitle={t('create.officeLinkTitle')}
                        renderAllTitle={t('create.officeRenderAllTitle')}
                        copyLabel={t('create.copyLink')}
                        openLabel={t('create.openLink')}
                        fileInputRef={officeInputRef}
                        officeCode={officeCode}
                        officeSourceUrl={officeSourceUrl}
                        officeLink={officeLink}
                        officeRenderAllLink={officeRenderAllLink}
                        officeError={officeError}
                        hasSource={hasOfficeSource()}
                        onSourceUrlChange={setOfficeSourceUrl}
                        onCodeChange={handleOfficeCodeChange}
                        onFileUpload={handleOfficeUpload}
                        onGenerateLink={handleGenerateOfficeLink}
                        onGenerateRenderAll={handleGenerateOfficeRenderAllLink}
                        onClear={handleClearOffice}
                        onCopyLink={handleCopyLink}
                        getViewerUrl={getOfficeViewerUrl}
                        isValidUrl={isValidUrl}
                        officeFile={officeFile}
                    />
                );
            case 'qr':
                return (
                    <QrToolCard
                        title={t('create.qrTitle')}
                        inputLabel={t('create.qrInputLabel')}
                        inputPlaceholder={t('create.qrInputPlaceholder')}
                        sizeLabel={t('create.qrSize')}
                        marginLabel={t('create.qrMargin')}
                        correctionLabel={t('create.qrErrorCorrection')}
                        levelLLabel={t('create.qrLevelL')}
                        levelMLabel={t('create.qrLevelM')}
                        levelQLabel={t('create.qrLevelQ')}
                        levelHLabel={t('create.qrLevelH')}
                        generateLabel={t('create.qrGenerate')}
                        downloadLabel={t('create.qrDownload')}
                        downloadSvgLabel={t('create.qrDownloadSvg')}
                        openLabel={t('create.qrOpen')}
                        popupLabel={t('create.qrPopup')}
                        copyLabel={t('create.qrCopy')}
                        renderLinkLabel={t('create.qrRenderLink')}
                        renderAllLinkLabel={t('create.qrRenderAllLink')}
                        clearLabel={t('create.qrClear')}
                        renderLinkTitle={t('create.qrRenderLinkTitle')}
                        renderAllLinkTitle={t('create.qrRenderAllLinkTitle')}
                        hintLabel={t('create.qrHint')}
                        processingLabel={t('create.processing')}
                        qrInput={qrInput}
                        qrDataUrl={qrDataUrl}
                        qrSvg={qrSvg}
                        qrRenderLink={qrRenderLink}
                        qrRenderAllLink={qrRenderAllLink}
                        qrIsProcessing={qrIsProcessing}
                        qrSize={qrSize}
                        qrMargin={qrMargin}
                        qrCorrection={qrCorrection}
                        onInputChange={setQrInput}
                        onSizeChange={setQrSize}
                        onMarginChange={setQrMargin}
                        onCorrectionChange={setQrCorrection}
                        onGenerate={handleGenerateQr}
                        onDownload={handleDownloadQr}
                        onDownloadSvg={handleDownloadQrSvg}
                        onOpen={handleOpenQr}
                        onOpenPopup={handleOpenQrPopup}
                        onCopy={handleCopyQrImage}
                        onGenerateRenderLink={handleGenerateQrRenderLink}
                        onGenerateRenderAllLink={handleGenerateQrRenderAllLink}
                        onClear={handleClearQr}
                        onCopyLink={handleCopyLink}
                    />
                );
            default:
                return null;
        }
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
                    <EditorColumn $showPreview={showPreview && selectedTool === 'create'}>
                        <Select
                            label={t('create.selectType')}
                            value={contentType}
                            options={contentTypeOptions}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleContentTypeChange(event.target.value as ContentType)}
                        />

                        {renderSelectedTool()}

                        {selectedTool === 'create' && generatedLink && (
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

                    {showPreview && selectedTool === 'create' && (
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