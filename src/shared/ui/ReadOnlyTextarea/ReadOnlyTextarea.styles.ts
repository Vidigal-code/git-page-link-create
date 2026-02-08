import styled from 'styled-components';

export const StyledReadOnlyTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder || theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text || 'inherit'};
  font-size: ${({ theme }) => theme.typography.fontSize?.base || '1rem'};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;

  resize: vertical;
  max-height: 160px;
  overflow-y: auto;

  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    ${({ theme }) =>
      theme.animations.enableGlow &&
      `
        box-shadow: 0 0 10px ${theme.colors.primary};
      `}
  }
`;


