import React from 'react';
import { StyledCard, CardTitle, CardContent } from './Card.styles';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className }) => {
    return (
        <StyledCard className={className}>
            {title && <CardTitle>{title}</CardTitle>}
            <CardContent>{children}</CardContent>
        </StyledCard>
    );
};
