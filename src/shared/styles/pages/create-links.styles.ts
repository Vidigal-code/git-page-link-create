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

export const FontSelectorPanel = styled.div`
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.cardBackground};
`;

export const FontOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 8px;
`;

export const FontOptionButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  min-height: 40px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.cardBorder)};
  background: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.transitionDuration};
  text-align: left;
  position: relative;

  ${({ theme, $active }) => $active && `
    box-shadow: 0 0 0 2px ${theme.colors.primary}33;
    font-weight: 700;
  `}

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FullPreviewFrame = styled.iframe`
  width: 100%;
  min-height: 74vh;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 14px;
  background: #fff;
`;

