import styled from 'styled-components';

export const PdfWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const PdfFrame = styled.iframe`
    width: 100%;
    min-height: 70vh;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder || '#e1e4e8'};
    border-radius: 12px;
    background: ${({ theme }) => theme.colors.cardBackground};
`;

export const FullScreenPdfFrame = styled.iframe`
    width: 100%;
    height: 100vh;
    border: none;
    background: #111;
`;