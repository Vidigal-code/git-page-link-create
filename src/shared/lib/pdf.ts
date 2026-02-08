import { uint8ArrayToBase64 } from '@/shared/lib/base64';
import { decodeTypedBytesPayload, encodeTypedBytesPayload } from '@/shared/lib/shorturl/bytesPayload';

export interface PdfDataPayload {
    dataUrl: string;
    /**
     * When provided, this is the raw decoded PDF bytes (more efficient than base64).
     * New links use a compact `b-<base64url>` payload in the hash.
     */
    bytes?: Uint8Array;
}

export function encodePdfDataUrl(dataUrl: string): string {
    // New compact format: store typed bytes as base64url to avoid encodeURIComponent bloat
    const base64 = dataUrl.split(',')[1] ?? '';
    if (!base64) {
        return encodeURIComponent(dataUrl);
    }
    try {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) {
            bytes[i] = binary.charCodeAt(i);
        }
        // typeId 1 => application/pdf
        return encodeTypedBytesPayload(1, bytes);
    } catch {
        return encodeURIComponent(dataUrl);
    }
}

export function decodePdfDataUrl(encoded: string): PdfDataPayload {
    // New compact payload
    const compact = decodeTypedBytesPayload(encoded);
    if (compact) {
        if (compact.typeId !== 1) {
            throw new Error('Invalid PDF data');
        }
        // Rebuild dataUrl only for download compatibility
        const base64 = uint8ArrayToBase64(compact.bytes);
        return { dataUrl: `data:application/pdf;base64,${base64}`, bytes: compact.bytes };
    }

    const dataUrl = decodeURIComponent(encoded);
    const match = /^data:application\/pdf;base64,/.exec(dataUrl);

    if (!match) {
        throw new Error('Invalid PDF data');
    }

    return { dataUrl };
}

export function getPdfFileName(): string {
    return 'document.pdf';
}