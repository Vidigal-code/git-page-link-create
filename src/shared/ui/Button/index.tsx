import React, { ButtonHTMLAttributes } from 'react';
import { StyledButton, SecondaryButton } from './Button.styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
    as?: 'button' | 'a';
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    children,
    as,
    ...props
}) => {
    const Component = variant === 'secondary' ? SecondaryButton : StyledButton;
    const PolymorphicComponent = Component as any;

    return <PolymorphicComponent as={as} {...props}>{children}</PolymorphicComponent>;
};
