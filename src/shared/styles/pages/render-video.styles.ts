import styled from 'styled-components';

export const VideoWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
`;

export const RenderedVideo = styled.video`
    width: 100%;
    max-height: 75vh;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder || '#e1e4e8'};
    background: #000;
`;

export const FullScreenVideo = styled.video`
    width: 100%;
    height: 100vh;
    background: #000;
`;