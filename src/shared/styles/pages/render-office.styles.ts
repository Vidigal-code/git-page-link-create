import styled from 'styled-components';

export const OfficeWrapper = styled.div`
  width: 100%;
  height: 70vh;
  min-height: 520px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.cardBackground};
`;

export const OfficeFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background: #fff;
`;

export const FullScreenOfficeFrame = styled.iframe`
  width: 100vw;
  height: 100vh;
  border: none;
  background: #fff;
`;
