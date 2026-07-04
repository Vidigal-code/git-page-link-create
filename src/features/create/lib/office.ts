import { compressBytes } from '@/shared/lib/compression';
import { getFileTypeFromFilename } from '@/shared/lib/download';
import { base64ToUint8Array } from '@/shared/lib/base64';
import { withBasePath } from '@/shared/lib/basePath';
import { encodePlatformType } from '@/shared/lib/shorturl/typeCodes';

const OFFICE_RENDER_PATH = 'render/office';
const OFFICE_DATA_URL_PREFIX = 'data:';
const OFFICE_DATA_SEPARATOR = ',';
const OFFICE_PAYLOAD_HASH_PARAM = 'd';

export function extractOfficeUrlFromCode(value: string): string {
    const match = value.match(/https?:\/\/[^\s"'<>]+/i);
    return match?.[0] || '';
}

export function resolveOfficeSource(params: {
    officeSourceUrl: string;
    officeCode: string;
}): string {
    const urlValue = params.officeSourceUrl.trim();
    if (urlValue) return urlValue;

    const codeValue = params.officeCode.trim();
    if (!codeValue) return '';

    const extracted = extractOfficeUrlFromCode(codeValue);
    return extracted || codeValue;
}

export function isOfficeDataUrl(value: string): boolean {
    return value.trim().startsWith(OFFICE_DATA_URL_PREFIX);
}

export function extractBase64FromDataUrl(dataUrl: string): string {
    const separatorIndex = dataUrl.indexOf(OFFICE_DATA_SEPARATOR);
    return separatorIndex >= 0 ? dataUrl.slice(separatorIndex + 1) : '';
}

export function dataUrlToBytes(dataUrl: string): Uint8Array {
    const base64 = extractBase64FromDataUrl(dataUrl);
    if (!base64) throw new Error('invalid_data_url');
    return base64ToUint8Array(base64);
}

export function resolveOfficeFileType(fileName?: string): string {
    return getFileTypeFromFilename(fileName || 'file.docx');
}

export function createOfficeDataPayload(params: {
    dataUrl: string;
    fileName?: string;
}): string {
    const bytes = dataUrlToBytes(params.dataUrl);
    const type = resolveOfficeFileType(params.fileName);
    return `${encodePlatformType(type)}-${compressBytes(bytes)}`;
}

export function buildOfficeRenderPath(params: {
    sourceUrl?: string;
    fullscreen?: boolean;
} = {}): string {
    const searchParams = new URLSearchParams();
    if (params.sourceUrl) searchParams.set('source', params.sourceUrl);
    if (params.fullscreen) searchParams.set('fullscreen', '1');

    const query = searchParams.toString();
    return withBasePath(`${OFFICE_RENDER_PATH}${query ? `?${query}` : ''}`);
}

export function buildOfficeDataLink(params: {
    origin: string;
    dataUrl: string;
    fileName?: string;
    fullscreen?: boolean;
}): string {
    const payload = createOfficeDataPayload({
        dataUrl: params.dataUrl,
        fileName: params.fileName,
    });

    return `${params.origin}${buildOfficeRenderPath({ fullscreen: params.fullscreen })}#${OFFICE_PAYLOAD_HASH_PARAM}=${payload}`;
}

export function buildOfficeSourceLink(params: {
    origin: string;
    sourceUrl: string;
    fullscreen?: boolean;
}): string {
    return `${params.origin}${buildOfficeRenderPath({
        sourceUrl: params.sourceUrl,
        fullscreen: params.fullscreen,
    })}`;
}
