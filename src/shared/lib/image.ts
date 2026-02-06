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

export interface ImageCompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    mimeType?: string;
    targetUrlLength?: number;
    onProgress?: (progress: number) => void;
}

export async function compressImageFile(file: File, options: ImageCompressionOptions = {}): Promise<string> {
    const {
        maxWidth = 1920,
        maxHeight = 1920,
        quality = 0.85,
        mimeType = 'image/webp',
        targetUrlLength,
        onProgress,
    } = options;

    const objectUrl = URL.createObjectURL(file);

    try {
        let width = 0;
        let height = 0;
        let bitmap: ImageBitmap | null = null;

        if ('createImageBitmap' in window) {
            bitmap = await createImageBitmap(file);
            width = bitmap.width;
            height = bitmap.height;
        } else {
            const image = new Image();
            image.src = objectUrl;
            await image.decode();
            width = image.naturalWidth;
            height = image.naturalHeight;
            bitmap = image as unknown as ImageBitmap;
        }

        const targetBytes = targetUrlLength
            ? Math.max(0, Math.floor(targetUrlLength / 1.37))
            : 0;

        const sizes = [1, 0.85, 0.7, 0.55];
        const qualities = [quality, 0.75, 0.65, 0.55, 0.45];
        let attempt = 0;
        const totalAttempts = sizes.length * qualities.length;

        let bestDataUrl = '';

        for (const sizeScale of sizes) {
            const scale = Math.min(1, (maxWidth / width) * sizeScale, (maxHeight / height) * sizeScale);
            const targetWidth = Math.max(1, Math.round(width * scale));
            const targetHeight = Math.max(1, Math.round(height * scale));

            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Canvas not supported');
            }

            ctx.drawImage(bitmap as CanvasImageSource, 0, 0, targetWidth, targetHeight);

            for (const qualityStep of qualities) {
                attempt += 1;
                if (onProgress) {
                    onProgress(Math.min(99, Math.round((attempt / totalAttempts) * 100)));
                }

                let dataUrl = canvas.toDataURL(mimeType, qualityStep);
                if (!dataUrl || dataUrl === 'data:,') {
                    dataUrl = canvas.toDataURL('image/jpeg', qualityStep);
                }

                if (!bestDataUrl || dataUrl.length < bestDataUrl.length) {
                    bestDataUrl = dataUrl;
                }

                if (targetUrlLength && dataUrl.length <= targetUrlLength) {
                    if (onProgress) {
                        onProgress(100);
                    }
                    return dataUrl;
                }
            }
        }

        if (onProgress) {
            onProgress(100);
        }

        return bestDataUrl || (await fileToDataUrl(file));
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}