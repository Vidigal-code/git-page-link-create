import styled from 'styled-components';

export const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
`;

export const StyledCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 1200px;
  overflow: hidden;
  margin: auto 0;

  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

export const ScrollableContent = styled.div`
  width: 100%;
  max-height: 90vh; /* Keep card within viewport mostly, but allow internal scroll */
  overflow-y: auto;
  overflow-x: hidden;
  padding: 32px;

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
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text || '#a8a8a8'};
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    padding: 20px;
    max-height: 85vh;
  }
`;

export const MarkdownWrapper = styled.div`
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  word-wrap: break-word;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
    color: ${({ theme }) => theme.colors.text};
  }

  h1 { font-size: 2em; border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder || '#eaecef'}; padding-bottom: 0.3em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder || '#eaecef'}; padding-bottom: 0.3em; }

  p, blockquote, ul, ol, dl, table, pre {
    margin-top: 0;
    margin-bottom: 16px;
  }

  a { color: ${({ theme }) => theme.colors.primary}; text-decoration: none; }
  a:hover { text-decoration: underline; }

  blockquote {
    padding: 0 1em;
    color: ${({ theme }) => theme.colors.textSecondary};
    border-left: 0.25em solid ${({ theme }) => theme.colors.cardBorder || '#dfe2e5'};
  }

  pre {
    background: rgba(127, 127, 127, 0.1);
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 85%;
    line-height: 1.45;
  }

  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(127, 127, 127, 0.1);
    border-radius: 3px;
    font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
    color: ${({ theme }) => theme.colors.text};
  }

  pre > code {
    background-color: transparent;
    padding: 0;
  }
`;

export const PlainMarkdownWrapper = styled.div`
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 32px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #24292f;
  word-wrap: break-word;
  background: #ffffff;
  border: 1px solid #d0d7de;
  border-radius: 6px;

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
    color: #24292f;
  }

  h1 { font-size: 2em; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }

  p, blockquote, ul, ol, dl, table, pre {
    margin-top: 0;
    margin-bottom: 16px;
  }

  a { color: #0969da; text-decoration: none; }
  a:hover { text-decoration: underline; }

  blockquote {
    padding: 0 1em;
    color: #57606a;
    border-left: 0.25em solid #d0d7de;
  }

  pre {
    background: #f6f8fa;
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 85%;
    line-height: 1.45;
  }

  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: #f6f8fa;
    border-radius: 3px;
    font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
    color: #24292f;
  }

  table {
    display: block;
    width: 100%;
    overflow: auto;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #d0d7de;
    padding: 6px 13px;
  }

  tr:nth-child(2n) {
    background-color: #f6f8fa;
  }

  pre > code {
    background-color: transparent;
    padding: 0;
  }
`;

export const TableScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder || '#e1e4e8'};

  /* Ensure correct scroll behavior */
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
  min-width: 600px; /* Prevent crushing on small screens */

  th, td {
    padding: 12px 16px;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder || '#e1e4e8'};
    text-align: left;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
  }

  th {
    background-color: rgba(127, 127, 127, 0.1);
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    position: sticky;
    top: 0;
  }

  tr:nth-child(even) {
    background-color: rgba(127, 127, 127, 0.05);
  }

  tr:hover {
    background-color: rgba(127, 127, 127, 0.1);
  }
`;

export const FullScreenIframe = styled.iframe`
  width: 100vw;
  height: 100vh;
  border: none;
  position: absolute;
  top: 0;
  left: 0;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f4f6f8;
  color: #586069;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #fff5f5;
  color: #cb2431;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-align: center;
  padding: 20px;
`;

export const ErrorTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 16px;
`;

export const ErrorDescription = styled.p`
  color: #586069;
  margin-bottom: 24px;
`;