import styled from 'styled-components';

export const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.components.card.borderRadius};
  padding: ${({ theme }) => theme.components.card.padding};
  box-shadow: ${({ theme }) => theme.components.card.boxShadow};
  transition: all ${({ theme }) => theme.animations.transitionDuration};
  
  &:hover {
    ${({ theme }) => theme.animations.enableGlow && `
      box-shadow: 0 0 30px rgba(0, 255, 65, 0.4);
    `}
  }
`;

export const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  font-weight: 700;
`;

export const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;
