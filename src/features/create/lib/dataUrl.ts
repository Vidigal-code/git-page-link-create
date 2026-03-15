import { uint8ArrayToBase64 } from '@/shared/lib/base64';

export function uint8ArrayToDataUrl(bytes: Uint8Array, mimeType: string): string {
    return `data:${mimeType};base64,${uint8ArrayToBase64(bytes)}`;
}

export async function blobUrlToDataUrl(blobUrl: string): Promise<string> {
    const res = await fetch(blobUrl);
    if (!res.ok) throw new Error('blob_fetch_failed');
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('blob_read_failed'));
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
        reader.readAsDataURL(blob);
    });
}

export async function resolveDataUrlForEncoding(value: string): Promise<string> {
    const v = (value || '').trim();
    if (!v) return '';
    if (v.startsWith('blob:')) {
        const dataUrl = await blobUrlToDataUrl(v);
        return dataUrl || '';
    }
    return v;
}

export function getExtensionFromMimeType(mimeType: string): string {
    const m = (mimeType || '').toLowerCase().trim();
    if (!m) return '';
    if (m === 'application/pdf') return '.pdf';
    if (m === 'image/jpeg') return '.jpg';
    if (m === 'image/jpg') return '.jpg';
    if (m === 'image/png') return '.png';
    if (m === 'image/gif') return '.gif';
    if (m === 'image/webp') return '.webp';
    if (m === 'image/svg+xml') return '.svg';
    if (m === 'video/webm') return '.webm';
    if (m === 'video/mp4') return '.mp4';
    if (m === 'audio/ogg') return '.ogg';
    if (m === 'audio/wav') return '.wav';
    if (m === 'audio/mpeg') return '.mp3';
    if (m === 'text/html') return '.html';
    if (m === 'text/markdown') return '.md';
    if (m === 'text/csv') return '.csv';
    if (m === 'text/plain') return '.txt';
    return '';
}
