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

export const FullScreenAudioWrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background};
`;

export const FullScreenAudioCard = styled.div`
  width: 100%;
  max-width: 720px;
  padding: 18px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => theme.colors.cardBackground};
`;

export const FullScreenAudio = styled.audio`
  width: 100%;
  max-width: 720px;
`;
