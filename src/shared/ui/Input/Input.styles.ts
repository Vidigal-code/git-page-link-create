import styled from 'styled-components';

export const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.animations.transitionDuration};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    ${({ theme }) => theme.animations.enableGlow && `
      box-shadow: 0 0 10px ${theme.colors.primary};
    `}
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 12px 16px;
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  resize: vertical;
  transition: all ${({ theme }) => theme.animations.transitionDuration};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    ${({ theme }) => theme.animations.enableGlow && `
      box-shadow: 0 0 10px ${theme.colors.primary};
    `}
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 600;
`;
