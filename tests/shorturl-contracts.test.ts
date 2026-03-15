import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeShortUrlToken } from '../src/shared/lib/shorturl/shorturl';
import { buildShortUrlCandidates, normalizeComparableUrl } from '../src/features/shorturl/model/createCandidates';
import { resolveShortUrlTarget } from '../src/features/shorturl/model/resolveTargetUrl';

test('buildShortUrlCandidates returns sorted and deduplicated links', () => {
    const candidates = buildShortUrlCandidates({
        origin: 'https://example.com',
        inputUrl: 'https://youtube.com/watch?v=abc123',
        instantRenderer: true,
        silentFlagSuffix: '?z=1',
    });

    assert.ok(candidates.length > 0);
    const links = candidates.map((item) => item.link);
    const unique = new Set(links);
    assert.equal(unique.size, links.length);
    for (let i = 1; i < links.length; i += 1) {
        assert.ok(links[i].length >= links[i - 1].length);
    }
});

test('resolveShortUrlTarget decodes AT tokens', () => {
    const input = 'https://example.com/r/#d=h-abc';
    const token = encodeShortUrlToken(input, { mode: 'compact' });
    const decoded = resolveShortUrlTarget(token);
    assert.equal(decoded, input);
});

test('normalizeComparableUrl keeps render aliases compatible', () => {
    const a = normalizeComparableUrl('https://site.com/render/#data=abc');
    const b = normalizeComparableUrl('/r#d=abc');
    assert.equal(a, b);
});
