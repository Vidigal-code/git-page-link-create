import React from 'react';
import { StyledSelect, SelectLabel, SelectWrapper, SelectIcon } from './Select.styles';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[];
    label?: string;
    configKey?: 'languageSelect' | 'themeSelect';
}

export const Select: React.FC<SelectProps> = ({ options, label, configKey, ...props }) => {
    return (
        <div>
            {label && <SelectLabel>{label}</SelectLabel>}
            <SelectWrapper>
                <StyledSelect $configKey={configKey} {...props}>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </StyledSelect>
                <SelectIcon>▼</SelectIcon>
            </SelectWrapper>
        </div>
    );
};
