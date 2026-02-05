import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { StyledInput, StyledTextArea, InputLabel } from './Input.styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div>
            {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
            <StyledInput id={inputId} {...props} />
        </div>
    );
};

export const TextArea: React.FC<TextAreaProps> = ({ label, id, ...props }) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div>
            {label && <InputLabel htmlFor={textareaId}>{label}</InputLabel>}
            <StyledTextArea id={textareaId} {...props} />
        </div>
    );
};
