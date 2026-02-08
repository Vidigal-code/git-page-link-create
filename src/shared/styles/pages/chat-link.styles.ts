import styled from 'styled-components';

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

type Rgba = { r: number; g: number; b: number; a: number };

function parseToRgba(color: string): Rgba | null {
  const c = (color || '').trim();
  if (!c) return null;

  // #RGB / #RRGGBB
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c);
  if (hex?.[1]) {
    const h = hex[1];
    const full = h.length === 3
      ? `${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`
      : h;
    const n = Number.parseInt(full, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }

  // rgb()/rgba()
  const rgb = /^rgba?\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i.exec(c);
  if (rgb) {
    const r = Math.max(0, Math.min(255, Number(rgb[1])));
    const g = Math.max(0, Math.min(255, Number(rgb[2])));
    const b = Math.max(0, Math.min(255, Number(rgb[3])));
    const a = rgb[4] != null ? clamp01(Number(rgb[4])) : 1;
    return { r, g, b, a };
  }

  return null;
}

function compositeOverBase(fg: Rgba, base: Rgba): { r: number; g: number; b: number } {
  const a = clamp01(fg.a);
  return {
    r: Math.round(fg.r * a + base.r * (1 - a)),
    g: Math.round(fg.g * a + base.g * (1 - a)),
    b: Math.round(fg.b * a + base.b * (1 - a)),
  };
}

function toRgbForContrast(color: string, baseColor: string): { r: number; g: number; b: number } | null {
  const fg = parseToRgba(color);
  if (!fg) return null;
  if (fg.a >= 0.999) return { r: fg.r, g: fg.g, b: fg.b };
  const base = parseToRgba(baseColor) ?? { r: 255, g: 255, b: 255, a: 1 };
  const baseRgb = base.a >= 0.999 ? base : compositeOverBase(base, { r: 255, g: 255, b: 255, a: 1 });
  return compositeOverBase(fg, { ...baseRgb, a: 1 });
}

function contrastRatio(bg: { r: number; g: number; b: number }, fg: { r: number; g: number; b: number }): number {
  // WCAG relative luminance
  const toLin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const Lbg = 0.2126 * toLin(bg.r) + 0.7152 * toLin(bg.g) + 0.0722 * toLin(bg.b);
  const Lfg = 0.2126 * toLin(fg.r) + 0.7152 * toLin(fg.g) + 0.0722 * toLin(fg.b);
  const L1 = Math.max(Lbg, Lfg);
  const L2 = Math.min(Lbg, Lfg);
  return (L1 + 0.05) / (L2 + 0.05);
}

function pickReadableOnBackground(background: string, baseBackground: string): { text: string; muted: string; subtle: string } {
  const bg = toRgbForContrast(background, baseBackground) ?? { r: 0, g: 0, b: 0 };
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 11, g: 11, b: 12 };
  const cw = contrastRatio(bg, white);
  const cb = contrastRatio(bg, black);
  const useWhite = cw >= cb;
  return {
    text: useWhite ? '#ffffff' : '#0b0b0c',
    muted: useWhite ? 'rgba(255,255,255,0.78)' : 'rgba(11,11,12,0.70)',
    subtle: useWhite ? 'rgba(255,255,255,0.60)' : 'rgba(11,11,12,0.55)',
  };
}

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 980px;
  margin: 0 auto;
`;

export const IntroText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

export const TopBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
`;

export const TopBarLeft = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

export const SmallNote = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ChatShell = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  min-height: 520px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 14px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

export const Messages = styled.div`
  padding: 16px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${({ theme }) => theme.colors.background};
`;

export const EmptyState = styled.div`
  margin: auto;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 40px 16px;
  line-height: 1.6;
`;

export const MessageRow = styled.div<{ $mine?: boolean }>`
  display: flex;
  justify-content: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
`;

export const Bubble = styled.div<{ $mine?: boolean }>`
  max-width: min(640px, 92%);
  padding: 12px 12px 10px;
  border-radius: 14px;
  background: ${({ theme, $mine }) => ($mine ? theme.colors.primary : theme.colors.cardBackground)};
  color: ${({ theme, $mine }) => {
    const bg = $mine ? theme.colors.primary : theme.colors.cardBackground;
    return pickReadableOnBackground(bg, theme.colors.background).text;
  }};
  box-shadow: 0 8px 22px rgba(0,0,0,0.25);
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`;

export const BubbleHeader = styled.div`
  display: flex;
  gap: 10px;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 6px;
`;

export const BubbleName = styled.span`
  font-weight: 700;
`;

export const BubbleMeta = styled.span`
  font-size: 0.85rem;
  opacity: 0.75;
`;

export const BubbleText = styled.p`
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.55;
`;

export const Quote = styled.div`
  margin: 0 0 8px;
  padding: 10px 10px 8px;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 10px;
`;

export const QuoteName = styled.div`
  font-weight: 700;
  margin-bottom: 2px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const QuoteText = styled.div`
  opacity: 0.95;
  font-size: 0.95rem;
  line-height: 1.4;
  white-space: pre-wrap;
  opacity: 0.8;
`;

export const Composer = styled.div`
  padding: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => theme.colors.cardBackground};
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* Ensure inputs remain readable across all templates */
  input, textarea, select {
    ${({ theme }) => {
      const c = pickReadableOnBackground(theme.colors.background, theme.colors.background);
      const border = theme.colors.cardBorder;
      return `
        background: ${theme.colors.background} !important;
        color: ${c.text} !important;
        border-color: ${border} !important;
      `;
    }}
  }

  input::placeholder, textarea::placeholder {
    ${({ theme }) => {
      const c = pickReadableOnBackground(theme.colors.background, theme.colors.background);
      return `color: ${c.muted} !important; opacity: 0.75;`;
    }}
  }
`;

export const ReplyBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`;

export const ReplyText = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr auto;
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const LinkBox = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.9rem;
  overflow: auto;
  white-space: nowrap;
`;


