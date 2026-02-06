export interface PdfDataPayload {
    dataUrl: string;
}

export function encodePdfDataUrl(dataUrl: string): string {
    return encodeURIComponent(dataUrl);
}

export function decodePdfDataUrl(encoded: string): PdfDataPayload {
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