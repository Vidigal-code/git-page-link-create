import styled from 'styled-components';

export const StyledFooter = styled.footer`
  height: ${({ theme }) => theme.components.footer.height};
  background-color: ${({ theme }) => theme.components.footer.backgroundColor};
  border-top: ${({ theme }) => theme.components.footer.borderTop};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  padding: 0 20px;
`;

export const FooterContent = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
`;

export const FooterText = styled.p`
  margin: 4px 0;
`;

export const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 600;
  transition: all ${({ theme }) => theme.animations.transitionDuration};
  
  &:hover {
    ${({ theme }) => theme.animations.enableGlow && `
      text-shadow: ${theme.components.button.hoverGlow};
    `}
  }
`;

export const GitHubIcon = styled.span`
  margin-right: 4px;
`;
