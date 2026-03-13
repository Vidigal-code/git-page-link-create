import React from 'react';
import styled from 'styled-components';
import { Card } from '@/shared/ui/Card';
import { Select } from '@/shared/ui/Select';
import { LinksTemplate, TemplateMode } from '@/shared/lib/templateslinks';

interface TemplateSelectorProps {
    title: string;
    templateLabel: string;
    modeLabel: string;
    modeAutoLabel: string;
    modeLightLabel: string;
    modeDarkLabel: string;
    templates: LinksTemplate[];
    selectedTemplateId: string;
    mode: TemplateMode;
    onTemplateChange: (value: string) => void;
    onModeChange: (value: TemplateMode) => void;
}

const Description = styled.p`
  margin: 10px 0 0;
  color: ${({ theme }) => theme.colors.textSecondary || theme.colors.text};
  line-height: 1.5;
`;

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    title,
    templateLabel,
    modeLabel,
    modeAutoLabel,
    modeLightLabel,
    modeDarkLabel,
    templates,
    selectedTemplateId,
    mode,
    onTemplateChange,
    onModeChange,
}) => {
    const selected = templates.find((item) => item.id === selectedTemplateId);

    return (
        <Card title={title}>
            <Select
                label={templateLabel}
                value={selectedTemplateId}
                options={templates.map((template) => ({
                    value: template.id,
                    label: template.name,
                }))}
                onChange={(event) => onTemplateChange(event.target.value)}
            />
            <Select
                label={modeLabel}
                value={mode}
                options={[
                    { value: 'auto', label: modeAutoLabel },
                    { value: 'light', label: modeLightLabel },
                    { value: 'dark', label: modeDarkLabel },
                ]}
                onChange={(event) => onModeChange(event.target.value as TemplateMode)}
            />
            {selected?.description && <Description>{selected.description}</Description>}
        </Card>
    );
};

