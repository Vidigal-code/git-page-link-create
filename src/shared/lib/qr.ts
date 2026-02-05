import QRCode from 'qrcode';

const DEFAULT_QR_WIDTH = 320;

export interface QrOptions {
    width?: number;
    margin?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export async function generateQrCodeDataUrl(text: string, options: QrOptions = {}): Promise<string> {
    const trimmed = text.trim();
    if (!trimmed) {
        throw new Error('QR input is empty');
    }

    return QRCode.toDataURL(trimmed, {
        width: options.width ?? DEFAULT_QR_WIDTH,
        margin: options.margin ?? 1,
        errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
    });
}

export async function generateQrCodeSvg(text: string, options: QrOptions = {}): Promise<string> {
    const trimmed = text.trim();
    if (!trimmed) {
        throw new Error('QR input is empty');
    }

    return QRCode.toString(trimmed, {
        type: 'svg',
        width: options.width ?? DEFAULT_QR_WIDTH,
        margin: options.margin ?? 1,
        errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
    });
}