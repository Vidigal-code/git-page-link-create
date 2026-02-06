import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { TextArea } from '@/shared/ui/Input';
import { ButtonGroup, FormSection } from '@/shared/styles/pages/create.styles';

interface RecoveryToolCardProps {
    title: string;
    pasteLabel: string;
    recoverLabel: string;
    clearLabel: string;
    hashValue: string;
    onHashChange: (value: string) => void;
    onRecover: () => void;
    onClear: () => void;
}

export function RecoveryToolCard({
    title,
    pasteLabel,
    recoverLabel,
    clearLabel,
    hashValue,
    onHashChange,
    onRecover,
    onClear,
}: RecoveryToolCardProps) {
    return (
        <Card title={title}>
            <FormSection>
                <TextArea
                    label={pasteLabel}
                    value={hashValue}
                    onChange={(event) => onHashChange(event.target.value)}
                    placeholder="html-H4sI..."
                    rows={3}
                />
                <ButtonGroup style={{ marginTop: '16px' }}>
                    <Button
                        onClick={onRecover}
                        disabled={!hashValue}
                    >
                        {recoverLabel}
                    </Button>
                    <Button
                        onClick={onClear}
                        variant="secondary"
                        disabled={!hashValue}
                        style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
                    >
                        {clearLabel}
                    </Button>
                </ButtonGroup>
            </FormSection>
        </Card>
    );
}
