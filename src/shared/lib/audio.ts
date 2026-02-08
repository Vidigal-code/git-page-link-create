import { decodeTypedBytesPayload, encodeTypedBytesPayload } from '@/shared/lib/shorturl/bytesPayload';

export interface AudioDataPayload {
    dataUrl: string;
    mimeType: string;
    extension: string;
    bytes?: Uint8Array;
}

export interface AudioCompressionOptions {
    audioBitsPerSecond?: number;
    mimeType?: string;
    onProgress?: (progress: number) => void;
    targetUrlLength?: number;
}

export function encodeAudioDataUrl(dataUrl: string): string {
    // Allow optional MIME parameters (e.g. `audio/webm;codecs=opus`)
    const match = /^data:(audio\/[a-zA-Z0-9.+-]+)(?:;[^,]*?)?;base64,(.*)$/.exec(dataUrl);
    if (!match) return encodeURIComponent(dataUrl);
    const mimeType = match[1];
    const base64 = match[2] || '';
    if (!base64) return encodeURIComponent(dataUrl);

    const typeIdByMime: Record<string, number> = {
        'audio/mpeg': 1,
        'audio/mp3': 2,
        'audio/wav': 3,
        'audio/ogg': 4,
        'audio/webm': 5,
        'audio/aac': 6,
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

export function decodeAudioDataUrl(encoded: string): AudioDataPayload {
    const compact = decodeTypedBytesPayload(encoded);
    if (compact) {
        const mimeByTypeId: Record<number, string> = {
            1: 'audio/mpeg',
            2: 'audio/mp3',
            3: 'audio/wav',
            4: 'audio/ogg',
            5: 'audio/webm',
            6: 'audio/aac',
        };
        const mimeType = mimeByTypeId[compact.typeId] || 'audio/mpeg';
        const extension = mimeType.split('/')[1] ?? 'mp3';
        // IMPORTANT: do NOT rebuild a huge base64 data URL here (memory heavy).
        // Use `bytes` + mimeType instead.
        return { dataUrl: '', mimeType, extension, bytes: compact.bytes };
    }

    const dataUrl = decodeURIComponent(encoded);
    const match = /^data:(audio\/[a-zA-Z0-9.+-]+)(?:;[^,]*?)?;base64,/.exec(dataUrl);

    if (!match) {
        throw new Error('Invalid audio data');
    }

    const mimeType = match[1];
    const extension = mimeType.split('/')[1] ?? 'mp3';

    return { dataUrl, mimeType, extension };
}

export function getAudioFileName(extension: string): string {
    const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp3';
    return `audio.${safeExtension}`;
}

export function getSupportedAudioMimeType(preferred?: string): string {
    if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
        return preferred || 'audio/webm;codecs=opus';
    }

    const candidates = [
        preferred,
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/ogg',
    ].filter(Boolean) as string[];

    const supported = candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate));
    return supported || 'audio/webm';
}

export async function compressAudioFile(file: File, options: AudioCompressionOptions = {}): Promise<string> {
    if (typeof window === 'undefined') {
        throw new Error('Compression is only available in the browser');
    }

    if (!('MediaRecorder' in window)) {
        throw new Error('MediaRecorder not supported');
    }

    const {
        audioBitsPerSecond = 96_000,
        mimeType = 'audio/webm;codecs=opus',
        onProgress,
        targetUrlLength,
    } = options;

    const sourceUrl = URL.createObjectURL(file);
    const audio = document.createElement('audio');
    audio.src = sourceUrl;
    audio.muted = true;

    try {
        await new Promise<void>((resolve, reject) => {
            audio.onloadedmetadata = () => resolve();
            audio.onerror = () => reject(new Error('Failed to load audio'));
        });

        const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
        const targetBytes = targetUrlLength
            ? Math.max(0, Math.floor(targetUrlLength / 1.37))
            : 0;
        const dynamicAudioBitsPerSecond = targetBytes && duration
            ? Math.max(32_000, Math.min(192_000, Math.floor((targetBytes * 8) / duration)))
            : audioBitsPerSecond;

        const updateProgress = () => {
            if (!onProgress || !duration) return;
            const percent = Math.min(100, Math.max(0, Math.round((audio.currentTime / duration) * 100)));
            onProgress(percent);
        };

        if (onProgress) {
            onProgress(0);
        }

        const audioWithCapture = audio as HTMLAudioElement & { captureStream?: () => MediaStream };
        const stream = typeof audioWithCapture.captureStream === 'function'
            ? audioWithCapture.captureStream()
            : null;

        if (!stream) {
            throw new Error('captureStream not supported');
        }

        const resolvedMimeType = getSupportedAudioMimeType(mimeType);
        const recorder = new MediaRecorder(stream, {
            mimeType: resolvedMimeType,
            audioBitsPerSecond: dynamicAudioBitsPerSecond,
        });

        const chunks: BlobPart[] = [];

        const dataPromise = new Promise<Blob>((resolve, reject) => {
            recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType || resolvedMimeType || 'audio/webm' }));
            recorder.onerror = () => reject(new Error('Failed to record audio'));
        });

        recorder.start(200);
        audio.addEventListener('timeupdate', updateProgress);
        await audio.play();
        await new Promise<void>((resolve) => {
            audio.onended = () => resolve();
        });

        recorder.stop();
        audio.removeEventListener('timeupdate', updateProgress);
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());

        const blob = await dataPromise;

        if (onProgress) {
            onProgress(100);
        }

        return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Failed to read compressed audio'));
            reader.onload = () => {
                if (typeof reader.result !== 'string') {
                    reject(new Error('Invalid compressed audio data'));
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
