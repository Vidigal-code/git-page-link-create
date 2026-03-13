import styled from 'styled-components';

export const PageContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 18px;
  align-self: flex-start;

  @media (max-width: 1100px) {
    position: static;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  gap: 12px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;

  > * {
    min-width: 190px;
  }

  @media (max-width: 680px) {
    flex-direction: column;
    align-items: stretch;

    > * {
      width: 100%;
      min-width: 0;
    }
  }
`;

export const HelperText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary || theme.colors.text};
`;

export const ErrorText = styled.p`
  margin: 0;
  color: #d14343;
`;

export const ResultStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const MessageStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
`;

export const OutputBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FullPreviewFrame = styled.iframe`
  width: 100%;
  min-height: 74vh;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 14px;
  background: #fff;
`;

