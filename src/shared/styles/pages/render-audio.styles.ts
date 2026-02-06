import styled from 'styled-components';

export const AudioWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  border: 2px dashed ${({ theme }) => theme.colors.cardBorder || theme.colors.primary};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.cardBackground};
`;

export const RenderedAudio = styled.audio`
  width: 100%;
  max-width: 640px;
`;

export const FullScreenAudio = styled.audio`
  width: 100vw;
  height: 100vh;
`;
