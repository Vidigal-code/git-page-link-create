import test from 'node:test';
import assert from 'node:assert/strict';
import * as XLSX from 'xlsx';
import { OFFICE_FILE_ACCEPT, getOfficeMimeType, isOfficeFileType } from '../src/shared/lib/officeFormats';
import { readSpreadsheet } from '../src/features/render-office/lib/officeDocument';

function workbookToBytes(workbook: XLSX.WorkBook): Uint8Array {
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

test('office format registry includes supported upload extensions', () => {
    for (const extension of ['doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt']) {
        assert.equal(isOfficeFileType(extension), true);
        assert.ok(OFFICE_FILE_ACCEPT.includes(`.${extension}`));
        assert.notEqual(getOfficeMimeType(extension), 'application/octet-stream');
    }
});

test('readSpreadsheet preserves every XLSX sheet and row', () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([
        ['Name', 'Value'],
        ['Alpha', 10],
    ]), 'Summary');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([
        ['Page'],
        ['Second sheet'],
    ]), 'Details');

    const sheets = readSpreadsheet(workbookToBytes(workbook), 'xlsx');

    assert.deepEqual(sheets.map((sheet) => sheet.name), ['Summary', 'Details']);
    assert.deepEqual(sheets[0].rows, [['Name', 'Value'], ['Alpha', '10']]);
    assert.deepEqual(sheets[1].rows, [['Page'], ['Second sheet']]);
});

test('readSpreadsheet loads CSV content as a sheet', () => {
    const bytes = new TextEncoder().encode('Name,Value\nAlpha,10\nBeta,20');
    const sheets = readSpreadsheet(bytes, 'csv');

    assert.equal(sheets.length, 1);
    assert.deepEqual(sheets[0].rows, [
        ['Name', 'Value'],
        ['Alpha', '10'],
        ['Beta', '20'],
    ]);
});
