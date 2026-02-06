import styled from 'styled-components';

export const ImageWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
`;

export const RenderedImage = styled.img`
    max-width: 100%;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder || '#e1e4e8'};
    background: ${({ theme }) => theme.colors.cardBackground};
`;