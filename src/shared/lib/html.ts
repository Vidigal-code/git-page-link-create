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
    "      if(/^(https?:\\/\\/|mailto:|tel:)/i.test(href)) {",
    "         a.setAttribute('target', '_blank');",
    "         a.setAttribute('rel', 'noopener noreferrer');",
    "         return;",
    "      }",
    "      var isHash = href.startsWith('#');",
    "      if (!isHash && !href.startsWith('javascript:')) {",
    "         e.preventDefault();",
    "      }",
    '    } catch (_) {',
    '    }',
    '  }, true);',
    '})();',
    '</script>',
].join('');

const MOBILE_SCROLL_STYLE = [
    '<style>',
    '  html, body {',
    '      overflow-y: auto !important;',
    '      -webkit-overflow-scrolling: touch !important;',
    '  }',
    '</style>',
].join('');

function ensureViewportAndScroll(html: string): string {
    const viewportMeta = '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">';
    const injections = `${viewportMeta}${MOBILE_SCROLL_STYLE}`;

    // Prefer injecting into <head> if available.
    if (/<head\b[^>]*>/i.test(html)) {
        return html.replace(/<head\b([^>]*)>/i, (m) => `${m}${injections}`);
    }

    // If HTML tag exists but no head, create one after <html>.
    if (/<html\b[^>]*>/i.test(html)) {
        return html.replace(/<html\b[^>]*>/i, (m) => `${m}<head>${injections}</head>`);
    }

    // Fallback: wrap as a full HTML doc.
    return `<!doctype html><html><head><meta charset="utf-8" />${injections}</head><body>${html}</body></html>`;
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
 * - Make mobile scrolling work perfectly.
 * - Intercept external link clicks and open them in a new tab safely.
 */
export function prepareHtmlForIframe(html: string): string {
    const withScroll = ensureViewportAndScroll(html || '');
    return ensureOpenLinksScript(withScroll);
}
