import test from 'node:test';
import assert from 'node:assert/strict';
import { formatRichTextHtml } from '../src/shared/lib/richTextFormatting';
import { buildTemplateLinksHtml } from '../src/shared/lib/templateslinks/buildHtml';
import { buildJobTemplateHtml } from '../src/shared/lib/templatesjob/buildHtml';
import type { LinksTemplate } from '../src/shared/lib/templateslinks/types';
import type { JobTemplate } from '../src/shared/lib/templatesjob/types';

test('single selected font applies to whole content', () => {
    const html = formatRichTextHtml('hello **world**', ['3']);
    assert.equal(html, '<span class="rt-font-3">hello <strong>world</strong></span>');
});

test('single selected font does not apply per-chunk font markers', () => {
    const html = formatRichTextHtml('A /*3*chunk*/ B', ['4']);
    assert.ok(html.startsWith('<span class="rt-font-4">'));
    assert.ok(html.includes('/*3*chunk*/'));
    assert.ok(!html.includes('class="rt-font-3"'));
});

test('multiple selected fonts allow per-chunk font markers', () => {
    const html = formatRichTextHtml('A /*3*chunk*/ and /*12*next*/', ['3', '12']);
    assert.ok(html.includes('<span class="rt-font-3">chunk</span>'));
    assert.ok(html.includes('<span class="rt-font-12">next</span>'));
});

test('inline bold and italic still work', () => {
    const html = formatRichTextHtml('**bold** and /*italic*/', []);
    assert.equal(html, '<strong>bold</strong> and <em>italic</em>');
});

const palette = {
    background: '#111',
    surface: '#222',
    text: '#fff',
    mutedText: '#ccc',
    primary: '#09f',
    primaryText: '#fff',
    border: '#444',
    chip: '#333',
    shadow: '0 0 0 rgba(0,0,0,0)',
};

const linksTemplate: LinksTemplate = {
    id: 't1',
    name: 't1',
    description: 'template',
    layout: { style: 'stacked', containerMaxWidth: 900, avatarShape: 'rounded' },
    modes: { light: palette, dark: palette },
};

const jobTemplate: JobTemplate = {
    id: 'j1',
    name: 'j1',
    description: 'template',
    layout: { style: 'stacked', containerMaxWidth: 900, imageShape: 'rounded' },
    modes: { light: palette, dark: palette },
};

test('links builder renders rich text output correctly', () => {
    const html = buildTemplateLinksHtml(linksTemplate, {
        locale: 'en',
        profileName: 'Name',
        profileBio: 'Bio **bold** /*ital*/',
        bioFonts: ['2'],
        avatarUrl: '',
        websiteUrl: '',
        websiteLabel: '',
        mode: 'auto',
        links: [],
    });
    assert.ok(html.includes('class="bio"'));
    assert.ok(html.includes('<strong>bold</strong>'));
    assert.ok(html.includes('<em>ital</em>'));
    assert.ok(html.includes('rt-font-2'));
});

test('jobs builder renders rich text output correctly', () => {
    const html = buildJobTemplateHtml(jobTemplate, {
        locale: 'en',
        mode: 'auto',
        companyName: 'Company',
        companyWebsiteUrl: '',
        recruiterWhatsapp: '',
        recruiterEmail: '',
        jobTitle: 'Title',
        jobDescription: 'Desc **bold** /*ital*/',
        descriptionFonts: ['2'],
        workModel: 'remote',
        customWorkModel: '',
        contractModel: '',
        workSchedule: '',
        salary: '',
        salaryCurrency: 'USD',
        salaryCustomCurrency: '',
        applyUrl: 'https://example.com/apply',
        applyLabel: '',
        coverImageUrl: '',
        tags: [],
    });
    assert.ok(html.includes('class="desc"'));
    assert.ok(html.includes('<strong>bold</strong>'));
    assert.ok(html.includes('<em>ital</em>'));
    assert.ok(html.includes('rt-font-2'));
});
