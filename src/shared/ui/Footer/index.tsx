import React from 'react';
import { StyledFooter, FooterContent, FooterText, FooterLink, GitHubIcon } from './Footer.styles';

export const Footer: React.FC = () => {
    return (
        <StyledFooter>
            <FooterContent>
                <FooterText>
                    Criado por: <strong>Kauan Vidigal</strong>
                </FooterText>
                <FooterText>
                    <GitHubIcon>⚡</GitHubIcon>
                    GitHub: <FooterLink href="https://github.com/Vidigal-code" target="_blank" rel="noopener noreferrer">
                        @Vidigal-code
                    </FooterLink>
                </FooterText>
            </FooterContent>
        </StyledFooter>
    );
};
