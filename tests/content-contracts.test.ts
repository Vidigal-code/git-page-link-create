import test from 'node:test';
import assert from 'node:assert/strict';
import { encodePlatformType } from '../src/shared/lib/shorturl/typeCodes';
import {
    generateContentHashLink,
    generateContentSourceLink,
    getMaxLengthForContentType,
    mapContentTypeToTool,
} from '../src/entities/content/lib/contracts';
import { generateHtmlRenderAllLink } from '../src/features/render-all/lib/generateHtmlRenderAllLink';

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
