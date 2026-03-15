import { compress, compressBytes } from '@/shared/lib/compression';
import {
    getMaxCsvUrlLength,
    getMaxHtmlUrlLength,
    getMaxMarkdownUrlLength,
    getMaxUrlLength,
    getMaxXlsxUrlLength,
} from '@/shared/lib/theme';
import { encodePlatformType } from '@/shared/lib/shorturl/typeCodes';
import { withBasePath } from '@/shared/lib/basePath';
import type { ContentType, ToolType } from '@/entities/content/model/types';

export function isValidHttpUrl(value: string): boolean {
    if (!value) return false;
    try {
        const parsed = new URL(value);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

export function getMaxLengthForContentType(type: ContentType): number {
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
}

export function generateContentHashLink(params: {
    origin: string;
    content: string | Uint8Array;
    type: ContentType;
    fullScreen?: boolean;
}): string {
    const compressed = typeof params.content === 'string'
        ? compress(params.content)
        : compressBytes(params.content);
    const fullPath = withBasePath(params.fullScreen ? '/ra/' : '/r/');
    return `${params.origin}${fullPath}#d=${encodePlatformType(params.type)}-${compressed}`;
}

export function generateContentSourceLink(params: {
    origin: string;
    sourceUrl: string;
    type: ContentType;
}): string {
    const fullPath = withBasePath(`/r/?source=${encodeURIComponent(params.sourceUrl)}&type=${params.type}`);
    return `${params.origin}${fullPath}`;
}

export function mapContentTypeToTool(type: ContentType): ToolType {
    const contentTypeToTool: Record<ContentType, ToolType> = {
        pdf: 'pdf',
        image: 'image',
        video: 'video',
        audio: 'audio',
        docx: 'office',
        pptx: 'office',
        doc: 'office',
        ppt: 'office',
        xls: 'office',
        xlsx: 'office',
        qr: 'qr',
        recovery: 'recovery',
        html: 'create',
        md: 'create',
        csv: 'create',
        txt: 'create',
        office: 'office',
    };
    return contentTypeToTool[type] || 'create';
}
