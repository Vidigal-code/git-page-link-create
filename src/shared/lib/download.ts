/**
 * Download a file to the user's computer
 * @param content - The file content as string or bytes
 * @param filename - The name of the file to download
 * @param type - The MIME type of the file
 */
export function downloadFile(content: string | Uint8Array, filename: string, type: string): void {
    try {
        // Create a Blob from the content
        const blobPart: BlobPart = typeof content === 'string'
            ? content
            : (content.buffer as ArrayBuffer);
        const blob = new Blob([blobPart], { type });

        // Create a temporary URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        // Trigger the download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch {
        throw new Error('Failed to download file');
    }
}

/**
 * Get the appropriate MIME type for a file type
 * @param fileType - The file type (html, md, csv, xls)
 * @returns MIME type string
 */
export function getMimeType(fileType: string): string {
    const mimeTypes: Record<string, string> = {
        html: 'text/html',
        md: 'text/markdown',
        csv: 'text/csv',
        txt: 'text/plain',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        xls: 'application/vnd.ms-excel',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        image: 'image/png', // Default to png for recovered images
        pdf: 'application/pdf',
        video: 'video/mp4',
        audio: 'audio/mpeg',
    };

    return mimeTypes[fileType] || 'text/plain';
}

/**
 * Get the appropriate file extension for a file type
 * @param fileType - The file type (html, md, csv, xls)
 * @returns File extension with dot
 */
export function getFileExtension(fileType: string): string {
    const extensions: Record<string, string> = {
        html: '.html',
        md: '.md',
        csv: '.csv',
        txt: '.txt',
        xlsx: '.xlsx',
        xls: '.xls',
        docx: '.docx',
        pptx: '.pptx',
        image: '.png',
        pdf: '.pdf',
        video: '.mp4',
        audio: '.mp3',
    };

    return extensions[fileType] || '.txt';
}
