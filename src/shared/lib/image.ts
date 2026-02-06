export interface ImageDataPayload {
    dataUrl: string;
    mimeType: string;
    extension: string;
}

export async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                reject(new Error('Invalid image data'));
                return;
            }
            resolve(reader.result);
        };

        reader.readAsDataURL(file);
    });
}

export function encodeImageDataUrl(dataUrl: string): string {
    return encodeURIComponent(dataUrl);
}

export function decodeImageDataUrl(encoded: string): ImageDataPayload {
    const dataUrl = decodeURIComponent(encoded);
    const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,/.exec(dataUrl);

    if (!match) {
        throw new Error('Invalid image data');
    }

    const mimeType = match[1];
    const extension = mimeType.split('/')[1] ?? 'png';

    return { dataUrl, mimeType, extension };
}

export function getImageFileName(extension: string): string {
    const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
    return `image.${safeExtension}`;
}