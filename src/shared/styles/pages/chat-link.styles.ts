import styled from 'styled-components';

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
  background: transparent;
`;

export const Messages = styled.div`
  padding: 16px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  color: ${({ theme, $mine }) => ($mine ? theme.colors.background : theme.colors.text)};
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
  opacity: 0.85;
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
  background: ${({ theme }) => theme.colors.cardBackground};
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
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Composer = styled.div`
  padding: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 12px;
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


