export interface RichTextFontOption {
    id: string;
    label: string;
    cssFontFamily: string;
}

export const RICH_TEXT_FONTS: RichTextFontOption[] = [
    { id: '1', label: 'Arial', cssFontFamily: 'Arial, Helvetica, sans-serif' },
    { id: '2', label: 'Verdana', cssFontFamily: 'Verdana, Geneva, sans-serif' },
    { id: '3', label: 'Tahoma', cssFontFamily: 'Tahoma, Geneva, sans-serif' },
    { id: '4', label: '"Trebuchet MS"', cssFontFamily: '"Trebuchet MS", Helvetica, sans-serif' },
    { id: '5', label: 'Georgia', cssFontFamily: 'Georgia, "Times New Roman", serif' },
    { id: '6', label: '"Times New Roman"', cssFontFamily: '"Times New Roman", Times, serif' },
    { id: '7', label: '"Courier New"', cssFontFamily: '"Courier New", Courier, monospace' },
    { id: '8', label: '"Segoe UI"', cssFontFamily: '"Segoe UI", Tahoma, Geneva, sans-serif' },
    { id: '9', label: 'Roboto', cssFontFamily: 'Roboto, Arial, sans-serif' },
    { id: '10', label: 'Poppins', cssFontFamily: 'Poppins, Arial, sans-serif' },
    { id: '11', label: 'Montserrat', cssFontFamily: 'Montserrat, Arial, sans-serif' },
    { id: '12', label: 'Inter', cssFontFamily: 'Inter, "Segoe UI", Arial, sans-serif' },
];

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function applyInlineStyles(escapedValue: string): string {
    const withBold = escapedValue.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
    // Keep font markers like /*1*text*/ literal when not in multi-font mode.
    const withItalic = withBold.replace(/\/\*(?!(?:1[0-2]|[1-9])\*)([\s\S]+?)\*\//g, '<em>$1</em>');
    return withItalic.replace(/\n/g, '<br />');
}

function ensureUniqueFontIds(fontIds: string[]): string[] {
    return fontIds.filter((value, index, arr) => value && arr.indexOf(value) === index);
}

export function buildRichTextFontsCss(): string {
    return RICH_TEXT_FONTS
        .map((font) => `.rt-font-${font.id}{font-family:${font.cssFontFamily}}`)
        .join('');
}

export function formatRichTextHtml(rawValue: string, selectedFontIds: string[] = []): string {
    const value = rawValue || '';
    const normalizedSelectedFonts = ensureUniqueFontIds(selectedFontIds);

    // Single selected font: apply to whole content and treat font markers as plain text.
    if (normalizedSelectedFonts.length === 1) {
        const html = applyInlineStyles(escapeHtml(value));
        return `<span class="rt-font-${normalizedSelectedFonts[0]}">${html}</span>`;
    }

    // Font markers only work when user selected multiple fonts.
    if (normalizedSelectedFonts.length < 2) {
        return applyInlineStyles(escapeHtml(value));
    }

    const fontMarkerRegex = /\/\*(1[0-2]|[1-9])\*([\s\S]*?)\*\//g;

    const chunks: string[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null = fontMarkerRegex.exec(value);

    while (match) {
        const before = value.slice(lastIndex, match.index);
        if (before) {
            chunks.push(applyInlineStyles(escapeHtml(before)));
        }
        const fontId = match[1];
        const content = match[2];
        chunks.push(`<span class="rt-font-${fontId}">${applyInlineStyles(escapeHtml(content))}</span>`);
        lastIndex = match.index + match[0].length;
        match = fontMarkerRegex.exec(value);
    }

    const remaining = value.slice(lastIndex);
    if (remaining) {
        chunks.push(applyInlineStyles(escapeHtml(remaining)));
    }

    return chunks.join('');
}

