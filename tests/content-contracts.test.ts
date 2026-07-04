import test from 'node:test';
import assert from 'node:assert/strict';
import { encodePlatformType } from '../src/shared/lib/shorturl/typeCodes';
import {
    generateContentHashLink,
    generateContentSourceLink,
    getMaxLengthForContentType,
    mapContentTypeToTool,
} from '../src/entities/content/lib/contracts';
import { buildOfficeDataLink, buildOfficeSourceLink } from '../src/features/create/lib/office';
import { generateHtmlRenderAllLink } from '../src/features/render-all/lib/generateHtmlRenderAllLink';
import { getOfficeHashPayload, hasOfficeDataPayload } from '../src/features/render-office/lib/payload';

test('generateContentHashLink keeps r/ra + #d contract', () => {
    const origin = 'https://example.com';
    const htmlLink = generateContentHashLink({
        origin,
        content: '<h1>Hello</h1>',
        type: 'html',
        fullScreen: false,
    });
    const fullScreen = generateContentHashLink({
        origin,
        content: '<h1>Hello</h1>',
        type: 'html',
        fullScreen: true,
    });

    assert.match(htmlLink, /^https:\/\/example\.com\/r\/#d=/);
    assert.match(fullScreen, /^https:\/\/example\.com\/ra\/#d=/);
    assert.ok(htmlLink.includes(`${encodePlatformType('html')}-`));
});

test('generateContentSourceLink keeps source + type query contract', () => {
    const link = generateContentSourceLink({
        origin: 'https://example.com',
        sourceUrl: 'https://target.dev/demo?a=1',
        type: 'md',
    });
    assert.match(link, /^https:\/\/example\.com\/r\/\?source=/);
    assert.ok(link.includes('&type=md'));
});

test('mapContentTypeToTool keeps expected routing', () => {
    assert.equal(mapContentTypeToTool('html'), 'create');
    assert.equal(mapContentTypeToTool('pdf'), 'pdf');
    assert.equal(mapContentTypeToTool('xlsx'), 'office');
    assert.equal(mapContentTypeToTool('recovery'), 'recovery');
});

test('getMaxLengthForContentType keeps specialization behavior', () => {
    assert.ok(getMaxLengthForContentType('html') > 0);
    assert.ok(getMaxLengthForContentType('md') > 0);
    assert.ok(getMaxLengthForContentType('xlsx') > 0);
    assert.ok(getMaxLengthForContentType('video') > 0);
});

test('generateHtmlRenderAllLink keeps /ra/#d contract', () => {
    const link = generateHtmlRenderAllLink('https://example.com', '<main>ok</main>');
    assert.match(link, /^https:\/\/example\.com\/ra\/#d=/);
    assert.ok(link.includes(`${encodePlatformType('html')}-`));
});

test('buildOfficeDataLink creates renderable upload links without source URL', () => {
    const link = buildOfficeDataLink({
        origin: 'https://example.com',
        dataUrl: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,SGVsbG8=',
        fileName: 'document.docx',
    });

    assert.match(link, /^https:\/\/example\.com\/render\/office#d=/);
    assert.ok(link.includes(`${encodePlatformType('docx')}-`));
    assert.ok(hasOfficeDataPayload(new URL(link).hash));
});

test('buildOfficeDataLink keeps fullscreen upload contract', () => {
    const link = buildOfficeDataLink({
        origin: 'https://example.com',
        dataUrl: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,SGVsbG8=',
        fileName: 'sheet.xlsx',
        fullscreen: true,
    });

    const url = new URL(link);

    assert.equal(url.pathname, '/render/office');
    assert.equal(url.searchParams.get('fullscreen'), '1');
    assert.ok(getOfficeHashPayload(url.hash).startsWith(`${encodePlatformType('xlsx')}-`));
});

test('buildOfficeSourceLink keeps public source URL contract', () => {
    const link = buildOfficeSourceLink({
        origin: 'https://example.com',
        sourceUrl: 'https://cdn.example.com/file.docx?a=1',
        fullscreen: true,
    });

    const url = new URL(link);

    assert.equal(url.pathname, '/render/office');
    assert.equal(url.searchParams.get('source'), 'https://cdn.example.com/file.docx?a=1');
    assert.equal(url.searchParams.get('fullscreen'), '1');
    assert.equal(url.hash, '');
});

test('office hash payload accepts #d and #data contracts', () => {
    assert.equal(getOfficeHashPayload('#d=docx-payload'), 'docx-payload');
    assert.equal(getOfficeHashPayload('#data=docx-payload'), 'docx-payload');
    assert.equal(hasOfficeDataPayload('#d=docx-payload'), true);
    assert.equal(hasOfficeDataPayload('#source=https%3A%2F%2Fexample.com'), false);
});
