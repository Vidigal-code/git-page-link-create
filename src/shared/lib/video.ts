import { uint8ArrayToBase64 } from '@/shared/lib/base64';
import { decodeTypedBytesPayload, encodeTypedBytesPayload } from '@/shared/lib/shorturl/bytesPayload';

export interface VideoDataPayload {
    dataUrl: string;
    mimeType: string;
    extension: string;
    bytes?: Uint8Array;
}

export function encodeVideoDataUrl(dataUrl: string): string {
    const match = /^data:(video\/[a-zA-Z0-9.+-]+);base64,(.*)$/.exec(dataUrl);
    if (!match) return encodeURIComponent(dataUrl);
    const mimeType = match[1];
    const base64 = match[2] || '';
    if (!base64) return encodeURIComponent(dataUrl);

    const typeIdByMime: Record<string, number> = {
        'video/mp4': 1,
        'video/webm': 2,
        'video/ogg': 3,
        'video/x-matroska': 4,
    };
    const typeId = typeIdByMime[mimeType] ?? 0;

    try {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) {
            bytes[i] = binary.charCodeAt(i);
        }
        return encodeTypedBytesPayload(typeId, bytes);
    } catch {
        return encodeURIComponent(dataUrl);
    }
}

export function decodeVideoDataUrl(encoded: string): VideoDataPayload {
    const compact = decodeTypedBytesPayload(encoded);
    if (compact) {
        const mimeByTypeId: Record<number, string> = {
            1: 'video/mp4',
            2: 'video/webm',
            3: 'video/ogg',
            4: 'video/x-matroska',
        };
        const mimeType = mimeByTypeId[compact.typeId] || 'video/mp4';
        const extension = mimeType.split('/')[1] ?? 'mp4';
        const base64 = uint8ArrayToBase64(compact.bytes);
        const dataUrl = `data:${mimeType};base64,${base64}`;
        return { dataUrl, mimeType, extension, bytes: compact.bytes };
    }

    const dataUrl = decodeURIComponent(encoded);
    const match = /^data:(video\/[a-zA-Z0-9.+-]+);base64,/.exec(dataUrl);

    if (!match) {
        throw new Error('Invalid video data');
    }

    const mimeType = match[1];
    const extension = mimeType.split('/')[1] ?? 'mp4';

    return { dataUrl, mimeType, extension };
}

export function getVideoFileName(extension: string): string {
    const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4';
    return `video.${safeExtension}`;
}

export interface VideoCompressionOptions {
    videoBitsPerSecond?: number;
    audioBitsPerSecond?: number;
    mimeType?: string;
    onProgress?: (progress: number) => void;
    targetUrlLength?: number;
}

export function getSupportedVideoMimeType(preferred?: string): string {
    if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
        return preferred || 'video/webm';
    }

    const candidates = [
        preferred,
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
    ].filter(Boolean) as string[];

    const supported = candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate));
    return supported || 'video/webm';
}

export async function compressVideoFile(file: File, options: VideoCompressionOptions = {}): Promise<string> {
    if (typeof window === 'undefined') {
        throw new Error('Compression is only available in the browser');
    }

    if (!('MediaRecorder' in window)) {
        throw new Error('MediaRecorder not supported');
    }

    const {
        videoBitsPerSecond = 1_200_000,
        audioBitsPerSecond = 64_000,
    mimeType = 'video/webm;codecs=vp9',
        onProgress,
        targetUrlLength,
    } = options;

    const sourceUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = sourceUrl;
    video.muted = true;
    video.playsInline = true;

    try {
        await new Promise<void>((resolve, reject) => {
            video.onloadedmetadata = () => resolve();
            video.onerror = () => reject(new Error('Failed to load video'));
        });

        const duration = Number.isFinite(video.duration) ? video.duration : 0;
        const targetBytes = targetUrlLength
            ? Math.max(0, Math.floor(targetUrlLength / 1.37))
            : 0;
        const dynamicVideoBitsPerSecond = targetBytes && duration
            ? Math.max(200_000, Math.min(2_500_000, Math.floor(((targetBytes * 8) / duration) - audioBitsPerSecond)))
            : videoBitsPerSecond;
        const updateProgress = () => {
            if (!onProgress || !duration) return;
            const percent = Math.min(100, Math.max(0, Math.round((video.currentTime / duration) * 100)));
            onProgress(percent);
        };

        if (onProgress) {
            onProgress(0);
        }

        const videoWithCapture = video as HTMLVideoElement & { captureStream?: () => MediaStream };
        const stream = typeof videoWithCapture.captureStream === 'function'
            ? videoWithCapture.captureStream()
            : null;

        if (!stream) {
            throw new Error('captureStream not supported');
        }

        const resolvedMimeType = getSupportedVideoMimeType(mimeType);
        const recorder = new MediaRecorder(stream, {
            mimeType: resolvedMimeType,
            videoBitsPerSecond: dynamicVideoBitsPerSecond,
            audioBitsPerSecond,
        });

        const chunks: BlobPart[] = [];

        const dataPromise = new Promise<Blob>((resolve, reject) => {
            recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType || resolvedMimeType || 'video/webm' }));
            recorder.onerror = () => reject(new Error('Failed to record video'));
        });

        recorder.start(200);

    video.addEventListener('timeupdate', updateProgress);
        await video.play();

        await new Promise<void>((resolve) => {
            video.onended = () => resolve();
        });

    recorder.stop();
    video.removeEventListener('timeupdate', updateProgress);
    stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());

        const blob = await dataPromise;

        if (onProgress) {
            onProgress(100);
        }

        return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Failed to read compressed video'));
            reader.onload = () => {
                if (typeof reader.result !== 'string') {
                    reject(new Error('Invalid compressed video data'));
                    return;
                }
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    } finally {
        URL.revokeObjectURL(sourceUrl);
    }
}