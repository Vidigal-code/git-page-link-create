import styled from 'styled-components';
import Link from 'next/link';

export const StyledHeader = styled.header`
  height: ${({ theme }) => theme.components.header.height};
  background-color: ${({ theme }) => theme.components.header.backgroundColor};
  border-bottom: ${({ theme }) => theme.components.header.borderBottom};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: relative;
  
  @media (max-width: 900px) {
    height: 60px;
    padding: 0 15px;
  }
`;

export const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSize.xlarge};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  white-space: nowrap;
  ${({ theme }) => theme.animations.enableGlow && `
    text-shadow: 0 0 10px ${theme.colors.primary};
  `}
  
  &:hover {
    ${({ theme }) => theme.animations.enableGlow && `
      text-shadow: 0 0 20px ${theme.colors.primary};
    `}
  }

  @media (max-width: 1024px) {
      font-size: ${({ theme }) => theme.typography.fontSize.large};
  }

  @media (max-width: 900px) {
    font-size: ${({ theme }) => theme.typography.fontSize.large};
  }
`;

export const Nav = styled.nav`
  display: flex;
  gap: 30px;
  align-items: center;
  
  @media (max-width: 900px) {
    display: none;
  }
`;

export const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 600;
  transition: all ${({ theme }) => theme.animations.transitionDuration};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledNavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  
  /* Match Select styles for standardization via new headerControls config */
  height: ${({ theme }) => theme.components.headerControls?.common.height};
  padding: ${({ theme }) => theme.components.headerControls?.common.padding || theme.components.select.padding};
  background-color: ${({ theme }) => theme.components.headerControls?.common.backgroundColor || theme.components.select.backgroundColor};
  border: ${({ theme }) => theme.components.headerControls?.common.border || theme.components.select.border};
  border-radius: ${({ theme }) => theme.components.headerControls?.common.borderRadius || theme.components.select.borderRadius};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.components.headerControls?.common.fontSize || theme.typography.fontSize.base};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  transition: all ${({ theme }) => theme.animations.transitionDuration};
  
  /* Granular Width overrides */
  &[href="/"] {
      width: ${({ theme }) => theme.components.headerControls?.homeButton.width || 'auto'};
  }
  &[href="/create"] {
      width: ${({ theme }) => theme.components.headerControls?.createButton.width || 'auto'};
  }
  
  &:hover {
    border-color: ${({ theme }) => theme.components.headerControls?.common.hoverBorderColor || theme.components.select.hoverBorderColor};
    ${({ theme }) => theme.animations.enableGlow && `
      box-shadow: ${theme.components.select.focusGlow};
    `}
  }
`;

export const Controls = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  
  /* Fix overflow issue */
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  
  > div {
    min-width: 120px;
  }
  
  /* Redesign: Group styling */
  border: 1px solid ${({ theme }) => theme.colors.cardBorder || '#dfe2e5'};
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.cardBackground ? `${theme.colors.cardBackground}80` : 'transparent'};
  
  @media (max-width: 1024px) {
      gap: 10px;
      padding: 6px 12px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

// Hamburger Button
export const HamburgerButton = styled.button<{ isOpen: boolean }>`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
  
  @media (max-width: 900px) {
    display: flex;
    visibility: ${({ isOpen }) => (isOpen ? 'hidden' : 'visible')};
  }

  &:focus {
    outline: none;
  }
`;

export const HamburgerLine = styled.div<{ isOpen: boolean }>`
  width: 30px;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  transition: all 0.3s ease;
  transform-origin: center;

  ${({ isOpen }) => isOpen && `
    &:nth-child(1) {
      transform: rotate(45deg) translateY(10px);
    }
    
    &:nth-child(2) {
      opacity: 0;
      transform: translateX(-20px);
    }
    
    &:nth-child(3) {
      transform: rotate(-45deg) translateY(-10px);
    }
  `}
`;

// Mobile Menu Overlay
export const MobileMenuOverlay = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 900px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 999;
  }
`;

// Mobile Menu Container
export const MobileMenuContainer = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: fixed;
    top: 0;
    right: 0;
    width: 85%;
    max-width: 350px;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.background};
    border-left: 2px solid ${({ theme }) => theme.colors.primary};
    padding: 80px 25px 30px;
    transform: translateX(${({ isOpen }) => (isOpen ? '0' : '100%')});
    transition: transform 0.3s ease;
    z-index: 1000;
    overflow-y: auto;
    gap: 0;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 30px;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  padding: 5px;
  line-height: 1;
  transition: transform 0.2s ease;

  &:hover {
    transform: rotate(90deg);
  }

  &:focus {
    outline: none;
  }
`;

export const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`;

export const MobileNavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 600;
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  transition: all ${({ theme }) => theme.animations.transitionDuration};
  padding: 15px 20px;
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 4px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.cardBackground};
    ${({ theme }) => theme.animations.enableGlow && `
      box-shadow: 0 0 10px ${theme.colors.primary}33;
    `}
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const MobileControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 0 10px;
  
  > div {
    width: 100%;
    min-width: 0; /* Allow flex children to shrink/grow properly */
  }

  > button {
    margin: 10px auto 0;
  }
`;
