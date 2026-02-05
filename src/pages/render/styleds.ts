import styled from 'styled-components';

export const RenderContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

export const IframeContainer = styled.div`
  width: 100%;
  min-height: 600px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
`;

export const StyledIframe = styled.iframe`
  width: 100%;
  height: 600px;
  border: none;
`;

export const ScrollableContent = styled.div`
  width: 100%;
  max-height: 80vh; /* Allow scrolling within the card */
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px; /* Avoid scrollbar covering content */

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.textSecondary || '#c1c1c1'};
    border-radius: 4px;
    opacity: 0.5;
  }
`;

export const MarkdownContent = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.colors.text};
  word-wrap: break-word; /* Ensure long words break */

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.text};
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }

  code {
    background-color: rgba(127, 127, 127, 0.1);
    color: ${({ theme }) => theme.colors.text};
    padding: 2px 6px;
    border-radius: 3px;
    font-family: monospace;
  }

  pre {
    background-color: rgba(127, 127, 127, 0.1);
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    color: ${({ theme }) => theme.colors.text};

    code {
      color: inherit;
      background-color: transparent;
    }
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
  }

  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.cardBorder || '#dfe2e5'};
    padding-left: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  table {
    border-collapse: collapse;
    width: 100%;

    th, td {
      border: 1px solid ${({ theme }) => theme.colors.cardBorder || '#dfe2e5'};
      padding: 6px 13px;
    }

    tr:nth-child(2n) {
      background-color: rgba(127, 127, 127, 0.05);
    }
  }
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  margin: 20px 0;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder || '#e1e4e8'};
  background-color: ${({ theme }) => theme.colors.cardBackground};

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.textSecondary || '#c1c1c1'};
    border-radius: 4px;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;

  th, td {
    padding: 12px;
    text-align: left;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder || '#e1e4e8'};
    color: ${({ theme }) => theme.colors.text};
  }

  th {
    background-color: rgba(127, 127, 127, 0.1);
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    position: sticky;
    top: 0;
    z-index: 1; /* Keep header above content */
  }

  tr:nth-child(even) {
    background-color: rgba(127, 127, 127, 0.05);
  }

  tr:hover {
    background-color: rgba(127, 127, 127, 0.1);
  }
`;

export const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

export const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xlarge};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 16px;
`;

export const ErrorDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 16px;
  align-items: center;
`;