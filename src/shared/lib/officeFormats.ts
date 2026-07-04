export type OfficeFileType = 'doc' | 'docx' | 'xls' | 'xlsx' | 'csv' | 'ppt' | 'pptx' | 'txt';

export type OfficeFileCategory = 'document' | 'spreadsheet' | 'presentation' | 'text';

interface OfficeFormatConfig {
    extension: OfficeFileType;
    mimeType: string;
    category: OfficeFileCategory;
}

const OFFICE_FORMATS: readonly OfficeFormatConfig[] = [
    {
        extension: 'doc',
        mimeType: 'application/msword',
        category: 'document',
    },
    {
        extension: 'docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        category: 'document',
    },
    {
        extension: 'xls',
        mimeType: 'application/vnd.ms-excel',
        category: 'spreadsheet',
    },
    {
        extension: 'xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'spreadsheet',
    },
    {
        extension: 'csv',
        mimeType: 'text/csv',
        category: 'spreadsheet',
    },
    {
        extension: 'ppt',
        mimeType: 'application/vnd.ms-powerpoint',
        category: 'presentation',
    },
    {
        extension: 'pptx',
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        category: 'presentation',
    },
    {
        extension: 'txt',
        mimeType: 'text/plain',
        category: 'text',
    },
];

const OFFICE_FORMAT_BY_EXTENSION = OFFICE_FORMATS.reduce<Record<string, OfficeFormatConfig>>((formats, format) => {
    formats[format.extension] = format;
    return formats;
}, {});

export const OFFICE_FILE_ACCEPT = OFFICE_FORMATS.map((format) => `.${format.extension}`).join(',');

export function getOfficeFormatExtensions(): OfficeFileType[] {
    return OFFICE_FORMATS.map((format) => format.extension);
}

export function isOfficeFileType(type: string): type is OfficeFileType {
    return type in OFFICE_FORMAT_BY_EXTENSION;
}

export function getOfficeFileCategory(type: string): OfficeFileCategory | '' {
    return OFFICE_FORMAT_BY_EXTENSION[type]?.category || '';
}

export function getOfficeMimeType(type: string): string {
    return OFFICE_FORMAT_BY_EXTENSION[type]?.mimeType || 'application/octet-stream';
}

export function isOfficeSpreadsheetType(type: string): boolean {
    return getOfficeFileCategory(type) === 'spreadsheet';
}

export function isOfficeDocumentType(type: string): boolean {
    return getOfficeFileCategory(type) === 'document';
}

export function isOfficePresentationType(type: string): boolean {
    return getOfficeFileCategory(type) === 'presentation';
}
