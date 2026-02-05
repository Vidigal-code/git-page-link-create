import React from 'react';
import styled from 'styled-components';
import { BsSun, BsMoon } from 'react-icons/bs';

const ToggleButton = styled.button`
    background: ${({ theme }) => theme.components.headerControls?.common.backgroundColor || 'transparent'};
    border: ${({ theme }) => theme.components.headerControls?.common.border || `2px solid ${theme.colors.primary}`};
    border-radius: ${({ theme }) => theme.components.headerControls?.common.borderRadius || '50%'};
    
    /* Use common height, fallback to fixed */
    height: ${({ theme }) => theme.components.headerControls?.common.height || '40px'};
    width: ${({ theme }) => theme.components.headerControls?.modeToggle.width || '40px'}; /* Configurable width */
    
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all ${({ theme }) => theme.animations.transitionDuration};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.2rem;

    &:hover {
        background: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.background};
        border-color: ${({ theme }) => theme.components.headerControls?.common.hoverBorderColor || theme.colors.primary};
        box-shadow: ${({ theme }) => theme.components.button.hoverGlow !== 'none'
        ? theme.components.button.hoverGlow
        : '0 0 10px rgba(0, 0, 0, 0.2)'};
        
        /* Only scale if it's the old circular style, otherwise just glow/color change */
        transform: ${({ theme }) => theme.components.headerControls ? 'none' : 'scale(1.05)'};
    }

    &:active {
        transform: scale(0.95);
    }

    @media (max-width: 768px) {
        /* Keep mobile style somewhat consistent or allow overrides if needed */
        width: 36px;
        height: 36px;
        font-size: 1.1rem;
        padding: 0;
        border-radius: 10%; /* Often better for mobile touch targets if space is tight */
    }
`;

interface ThemeModeToggleProps {
    currentMode: 'light' | 'dark';
    onToggle: () => void;
}

export const ThemeModeToggle: React.FC<ThemeModeToggleProps> = ({ currentMode, onToggle }) => {
    return (
        <ToggleButton
            onClick={onToggle}
            aria-label={currentMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={currentMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {currentMode === 'dark' ? <BsSun /> : <BsMoon />}
        </ToggleButton>
    );
};
