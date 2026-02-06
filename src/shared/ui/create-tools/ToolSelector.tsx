import React from 'react';
import { Select } from '@/shared/ui/Select';
import { ToolSelectorWrapper, ToolSelectorText, FormSection } from '@/shared/styles/pages/create.styles';

interface ToolOption {
    value: string;
    label: string;
}

interface ToolSelectorProps {
    title: string;
    label: string;
    value: string;
    options: ToolOption[];
    onChange: (value: string) => void;
}

export function ToolSelector({ title, label, value, options, onChange }: ToolSelectorProps) {
    return (
        <ToolSelectorWrapper>
            <ToolSelectorText>{title}</ToolSelectorText>
            <FormSection>
                <Select
                    label={label}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    options={options}
                />
            </FormSection>
        </ToolSelectorWrapper>
    );
}
