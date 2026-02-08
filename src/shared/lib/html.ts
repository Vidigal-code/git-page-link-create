const OPEN_EXTERNAL_LINKS_SCRIPT = [
    '<script>',
    '(function(){',
    "  document.addEventListener('click', function(e){",
    '    try {',
    '      var t = e && e.target;',
    "      var a = t && t.closest ? t.closest('a') : null;",
    '      if(!a) return;',
    "      var href = (a.getAttribute('href') || '').trim();",
    '      if(!href) return;',
    // Only intercept external-ish links. Keep hash/relative navigation untouched.
    "      if(!/^(https?:\\/\\/|mailto:|tel:)/i.test(href)) return;",
    '      e.preventDefault();',
    "      window.open(href, '_blank', 'noopener,noreferrer');",
    '    } catch (_) {',
    '      // ignore',
    '    }',
    '  }, true);',
    '})();',
    '</script>',
].join('');

function ensureBaseTargetBlank(html: string): string {
    // If there is already a <base>, make sure it has a target.
    if (/<base\b/i.test(html)) {
        return html.replace(/<base\b([^>]*)>/i, (m, attrs) => {
            if (/\btarget\s*=/.test(attrs)) return m;
            return `<base${attrs} target="_blank">`;
        });
    }

    // Prefer injecting into <head> if available.
    if (/<head\b[^>]*>/i.test(html)) {
        return html.replace(/<head\b([^>]*)>/i, (m) => `${m}<base target="_blank">`);
    }

    // If HTML tag exists but no head, create one after <html>.
    if (/<html\b[^>]*>/i.test(html)) {
        return html.replace(/<html\b[^>]*>/i, (m) => `${m}<head><base target="_blank"></head>`);
    }

    // Fallback: wrap as a full HTML doc.
    return `<!doctype html><html><head><meta charset="utf-8" /><base target="_blank"></head><body>${html}</body></html>`;
}

function ensureOpenLinksScript(html: string): string {
    // If we can inject in head, do it there; otherwise append to the end.
    if (/<head\b[^>]*>/i.test(html) && !/OPEN_EXTERNAL_LINKS_SCRIPT_MARKER/i.test(html)) {
        // Add a marker comment to avoid double-injection if user reuses the same html.
        const marker = '<!-- OPEN_EXTERNAL_LINKS_SCRIPT_MARKER -->';
        return html.replace(/<\/head>/i, `${marker}${OPEN_EXTERNAL_LINKS_SCRIPT}</head>`);
    }
    return `${html}\n${OPEN_EXTERNAL_LINKS_SCRIPT}`;
}

/**
 * Prepares HTML to be rendered inside a sandboxed iframe:
 * - Make default link target `_blank` to avoid X-Frame-Options / CSP framing issues.
 * - Intercept external link clicks and open them in a new tab.
 */
export function prepareHtmlForIframe(html: string): string {
    const withBase = ensureBaseTargetBlank(html || '');
    return ensureOpenLinksScript(withBase);
}


