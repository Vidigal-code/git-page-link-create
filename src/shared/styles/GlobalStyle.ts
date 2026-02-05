import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html,
  body {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
  
  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #__next {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: all ${({ theme }) => theme.animations.transitionDuration};
    
    &:hover {
      ${({ theme }) => theme.animations.enableGlow && `
        text-shadow: ${theme.components.button.hoverGlow};
      `}
    }
  }
  
  button {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    cursor: pointer;
    border: none;
    background: none;
  }
  
  input,
  textarea,
  select {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 5px;
    
    &:hover {
      background: ${({ theme }) => theme.colors.primary};
    }
  }
  
  /* Selection styling */
  ::selection {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }
  
  /* Typing effect animation */
  @keyframes typing {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
  
  @keyframes blink {
    50% {
      border-color: transparent;
    }
  }
  
  /* Glow animation */
  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 5px ${({ theme }) => theme.colors.primary};
    }
    50% {
      box-shadow: 0 0 20px ${({ theme }) => theme.colors.primary};
    }
  }
`;
