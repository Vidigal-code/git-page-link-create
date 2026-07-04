import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { convertDocxToHtml } from '@/shared/lib/office-docx';
import {
    isOfficeDocumentType,
    isOfficePresentationType,
    isOfficeSpreadsheetType,
} from '@/shared/lib/officeFormats';

export interface OfficeSheet {
    name: string;
    rows: string[][];
}

export interface OfficeSlide {
    name: string;
    texts: string[];
    notes: string[];
}

export type OfficeDocumentView =
    | { kind: 'spreadsheet'; sheets: OfficeSheet[] }
    | { kind: 'document'; html: string }
    | { kind: 'presentation'; slides: OfficeSlide[] }
    | { kind: 'text'; text: string }
    | { kind: 'unsupported'; reason: string };

const EMPTY_CELL_VALUE = '';
const XML_TEXT_TAG_PATTERN = /<(?:a|w):t[^>]*>([\s\S]*?)<\/(?:a|w):t>/gi;
const XML_PARAGRAPH_BREAK_TAG_PATTERN = /<\/a:p>/gi;
const XML_TAG_PATTERN = /<[^>]+>/g;
const PRINTABLE_TEXT_PATTERN = /[ -~\u00a0-\uffff]{4,}/g;

const DOCX_SUPPLEMENTAL_PARTS: readonly { pattern: RegExp; title: string }[] = [
    { pattern: /^word\/header\d+\.xml$/i, title: 'Headers' },
    { pattern: /^word\/footer\d+\.xml$/i, title: 'Footers' },
    { pattern: /^word\/footnotes\.xml$/i, title: 'Footnotes' },
    { pattern: /^word\/endnotes\.xml$/i, title: 'Endnotes' },
    { pattern: /^word\/comments\.xml$/i, title: 'Comments' },
];

function toExactArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    const exactBytes = bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength
        ? bytes
        : bytes.slice();
    const copied = new Uint8Array(exactBytes.byteLength);
    copied.set(exactBytes);
    return copied.buffer as ArrayBuffer;
}

function normalizeCellValue(value: unknown): string {
    if (value === null || value === undefined) return EMPTY_CELL_VALUE;
    return String(value);
}

function worksheetToRows(sheet: XLSX.WorkSheet): string[][] {
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
        header: 1,
        raw: false,
        defval: EMPTY_CELL_VALUE,
    });
    return rows.map((row) => row.map(normalizeCellValue));
}

function readWorkbook(bytes: Uint8Array, type: string): XLSX.WorkBook {
    if (type === 'csv') {
        return XLSX.read(new TextDecoder().decode(bytes), { type: 'string', raw: false });
    }
    return XLSX.read(bytes, { type: 'array', cellDates: true, raw: false });
}

export function readSpreadsheet(bytes: Uint8Array, type: string): OfficeSheet[] {
    const workbook = readWorkbook(bytes, type);
    return workbook.SheetNames.map((name) => ({
        name,
        rows: worksheetToRows(workbook.Sheets[name]),
    }));
}

function decodeXmlEntities(value: string): string {
    return value
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
}

function normalizeText(value: string): string {
    return decodeXmlEntities(value)
        .replace(/\s+/g, ' ')
        .trim();
}

function extractOpenXmlText(xml: string): string[] {
    const matches = [...xml.matchAll(XML_TEXT_TAG_PATTERN)]
        .map((match) => normalizeText(match[1]))
        .filter(Boolean);

    if (matches.length > 0) return matches;

    return xml
        .replace(XML_PARAGRAPH_BREAK_TAG_PATTERN, '\n')
        .replace(XML_TAG_PATTERN, ' ')
        .split('\n')
        .map(normalizeText)
        .filter(Boolean);
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function buildSupplementalSectionHtml(title: string, texts: string[]): string {
    if (texts.length === 0) return '';

    const items = texts.map((text) => `<li>${escapeHtml(text)}</li>`).join('');
    return `<section><h2>${escapeHtml(title)}</h2><ul>${items}</ul></section>`;
}

async function readDocxSupplementalHtml(bytes: Uint8Array): Promise<string> {
    const zip = await JSZip.loadAsync(toExactArrayBuffer(bytes));
    const sections = await Promise.all(DOCX_SUPPLEMENTAL_PARTS.map(async (part) => {
        const paths = sortOpenXmlPartPaths(Object.keys(zip.files).filter((path) => part.pattern.test(path)));
        const texts = (await Promise.all(paths.map(async (path) => extractOpenXmlText(await readZipText(zip, path))))).flat();
        return buildSupplementalSectionHtml(part.title, texts);
    }));

    return sections.filter(Boolean).join('');
}

function getOpenXmlPartIndex(path: string): number {
    const match = path.match(/(\d+)\.xml$/);
    return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function sortOpenXmlPartPaths(paths: string[]): string[] {
    return [...paths].sort((left, right) => getOpenXmlPartIndex(left) - getOpenXmlPartIndex(right));
}

async function readZipText(zip: JSZip, path: string): Promise<string> {
    return zip.file(path)?.async('string') || '';
}

async function getPptxNotes(zip: JSZip, slideNumber: number): Promise<string[]> {
    const notesXml = await readZipText(zip, `ppt/notesSlides/notesSlide${slideNumber}.xml`);
    return notesXml ? extractOpenXmlText(notesXml) : [];
}

export async function readPptxPresentation(bytes: Uint8Array): Promise<OfficeSlide[]> {
    const zip = await JSZip.loadAsync(toExactArrayBuffer(bytes));
    const slidePaths = sortOpenXmlPartPaths(
        Object.keys(zip.files).filter((path) => /^ppt\/slides\/slide\d+\.xml$/i.test(path))
    );

    return Promise.all(slidePaths.map(async (path, index) => {
        const xml = await readZipText(zip, path);
        const slideNumber = getOpenXmlPartIndex(path);
        return {
            name: `Slide ${index + 1}`,
            texts: extractOpenXmlText(xml),
            notes: await getPptxNotes(zip, slideNumber),
        };
    }));
}

function decodeBytesAsText(bytes: Uint8Array): string {
    try {
        return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch {
        return new TextDecoder('windows-1252').decode(bytes);
    }
}

function extractPrintableText(bytes: Uint8Array): string {
    const decoded = decodeBytesAsText(bytes);
    return (decoded.match(PRINTABLE_TEXT_PATTERN) || [])
        .map(normalizeText)
        .filter(Boolean)
        .join('\n');
}

async function renderDocument(bytes: Uint8Array, type: string): Promise<OfficeDocumentView> {
    if (type === 'docx') {
        const html = await convertDocxToHtml(toExactArrayBuffer(bytes));
        const supplementalHtml = await readDocxSupplementalHtml(bytes);
        return {
            kind: 'document',
            html: `${html}${supplementalHtml}`,
        };
    }

    const text = extractPrintableText(bytes);
    return text
        ? { kind: 'text', text }
        : { kind: 'unsupported', reason: 'document_without_extractable_text' };
}

async function renderPresentation(bytes: Uint8Array, type: string): Promise<OfficeDocumentView> {
    if (type === 'pptx') {
        return {
            kind: 'presentation',
            slides: await readPptxPresentation(bytes),
        };
    }

    const text = extractPrintableText(bytes);
    return text
        ? { kind: 'text', text }
        : { kind: 'unsupported', reason: 'presentation_without_extractable_text' };
}

export async function renderOfficeDocument(bytes: Uint8Array, type: string): Promise<OfficeDocumentView> {
    if (isOfficeSpreadsheetType(type)) {
        return {
            kind: 'spreadsheet',
            sheets: readSpreadsheet(bytes, type),
        };
    }

    if (isOfficeDocumentType(type)) {
        return renderDocument(bytes, type);
    }

    if (isOfficePresentationType(type)) {
        return renderPresentation(bytes, type);
    }

    if (type === 'txt') {
        return {
            kind: 'text',
            text: decodeBytesAsText(bytes),
        };
    }

    return {
        kind: 'unsupported',
        reason: 'unsupported_office_type',
    };
}
