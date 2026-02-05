import styled from 'styled-components';

export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  display: inline-block;
`;

export const SelectIcon = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${({ theme }) => theme.components.select.iconColor};
  font-size: 0.85rem;
  transition: all ${({ theme }) => theme.animations.transitionDuration};
  z-index: 1;
  line-height: 1;

  @media (max-width: 900px) {
    right: 16px;
    font-size: 0.9rem;
  }
`;

interface StyledSelectProps {
  $configKey?: 'languageSelect' | 'themeSelect';
}

export const StyledSelect = styled.select<StyledSelectProps>`
  width: ${({ theme, $configKey }) =>
    ($configKey && theme.components.headerControls?.[$configKey]?.width) || '100%'};
  
  /* Use headerControls common styles if configKey acts as a flag, or fallback to select config */
  /* Ensure right padding always accommodates the icon */
  padding: ${({ theme, $configKey }) => {
    if ($configKey && theme.components.headerControls?.common.padding) {
      // Extract left padding from headerControls, but force right padding for icon
      const leftPadding = theme.components.headerControls.common.padding.split(' ')[1] || '16px';
      return `0 40px 0 ${leftPadding}`;
    }
    return theme.components.select.padding;
  }};
    
  background-color: ${({ theme, $configKey }) =>
    ($configKey && theme.components.headerControls?.common.backgroundColor) || theme.components.select.backgroundColor};
    
  border: ${({ theme, $configKey }) =>
    ($configKey && theme.components.headerControls?.common.border) || theme.components.select.border};
    
  border-radius: ${({ theme, $configKey }) =>
    ($configKey && theme.components.headerControls?.common.borderRadius) || theme.components.select.borderRadius};
    
  color: ${({ theme }) => theme.colors.text};
  
  font-size: ${({ theme, $configKey }) =>
    ($configKey && theme.components.headerControls?.common.fontSize) || theme.typography.fontSize.base};
    
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.transitionDuration};
  text-align: ${({ theme }) => theme.components.select.textAlign};
  text-align-last: ${({ theme }) => theme.components.select.textAlign};
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  
  /* Text overflow handling */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* Height override if in header */
  ${({ theme, $configKey }) => $configKey && theme.components.headerControls?.common.height && `
      height: ${theme.components.headerControls.common.height};
      display: flex;
      align-items: center;
  `}
  
  &:hover {
    border-color: ${({ theme }) => theme.components.select.hoverBorderColor};
    ${({ theme }) => theme.animations.enableGlow && `
      box-shadow: ${theme.components.select.focusGlow};
    `}
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.components.select.focusBorderColor};
    box-shadow: ${({ theme }) => theme.components.select.focusGlow};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  option {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    padding: 12px;
    font-weight: 600;
    text-align: center;
  }

  @media (max-width: 900px) {
    /* Force full width on mobile/tablet to fix distinct layout */
    width: 100% !important;
    padding: 12px 45px 12px 20px;
    font-size: ${({ theme }) => theme.typography.fontSize.medium};
    height: 50px; /* Taller touch target */
  }
`;

export const SelectLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 600;
`;
