import styled from 'styled-components';

// Fixed palette for chat transcript UI (independent from site themes)
const CHAT_BG = '#0b141a';
const CHAT_PANEL = '#111b21';
const CHAT_BORDER = '#2a3942';
const CHAT_TEXT = '#e9edef';
const CHAT_TEXT_MUTED = '#8696a0';
const CHAT_ACCENT = '#00a884';
const CHAT_BUBBLE_MINE = '#005c4b';
const CHAT_BUBBLE_OTHER = '#202c33';

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
  border: 1px solid ${CHAT_BORDER};
  border-radius: 14px;
  overflow: hidden;
  background: ${CHAT_BG};
`;

export const Messages = styled.div`
  padding: 16px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${CHAT_BG};
`;

export const EmptyState = styled.div`
  margin: auto;
  text-align: center;
  color: ${CHAT_TEXT_MUTED};
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
  background: ${({ $mine }) => ($mine ? CHAT_BUBBLE_MINE : CHAT_BUBBLE_OTHER)};
  color: ${CHAT_TEXT};
  box-shadow: 0 8px 22px rgba(0,0,0,0.25);
  border: 1px solid ${CHAT_BORDER};
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
  opacity: 0.85;
  color: ${CHAT_TEXT_MUTED};
`;

export const BubbleText = styled.p`
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.55;
`;

export const Quote = styled.div`
  margin: 0 0 8px;
  padding: 10px 10px 8px;
  border-left: 3px solid ${CHAT_ACCENT};
  background: ${CHAT_PANEL};
  color: ${CHAT_TEXT};
  border-radius: 10px;
`;

export const QuoteName = styled.div`
  font-weight: 700;
  margin-bottom: 2px;
  font-size: 0.9rem;
  color: ${CHAT_TEXT};
`;

export const QuoteText = styled.div`
  opacity: 0.95;
  font-size: 0.95rem;
  line-height: 1.4;
  white-space: pre-wrap;
  color: ${CHAT_TEXT_MUTED};
`;

export const Composer = styled.div`
  padding: 14px;
  border-top: 1px solid ${CHAT_BORDER};
  background: ${CHAT_PANEL};
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* Force fixed colors for inputs inside the chat composer (avoid theme clashes) */
  label {
    color: ${CHAT_TEXT_MUTED};
  }

  input, textarea, select {
    background: ${CHAT_BG} !important;
    color: ${CHAT_TEXT} !important;
    border-color: ${CHAT_BORDER} !important;
  }

  input::placeholder, textarea::placeholder {
    color: ${CHAT_TEXT_MUTED} !important;
    opacity: 0.75;
  }
`;

export const ReplyBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${CHAT_BG};
  border: 1px solid ${CHAT_BORDER};
`;

export const ReplyText = styled.div`
  font-size: 0.95rem;
  color: ${CHAT_TEXT_MUTED};
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


