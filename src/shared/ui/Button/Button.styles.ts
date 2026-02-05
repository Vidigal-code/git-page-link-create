import styled from 'styled-components';

export const StyledButton = styled.button`
  padding: ${({ theme }) => theme.components.button.padding};
  border-radius: ${({ theme }) => theme.components.button.borderRadius};
  border: ${({ theme }) => theme.components.button.border};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.transitionDuration};
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
    ${({ theme }) => theme.animations.enableGlow && `
      box-shadow: ${theme.components.button.hoverGlow};
    `}
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const SecondaryButton = styled(StyledButton)`
  border-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.secondary};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.background};
  }
`;
