import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { TextArea } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
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
    // New props for improved recovery flow
    isRecovered: boolean;
    onDownload: () => void;
    onView: () => void;
    onCreateNew: () => void;
    downloadLabel: string;
    viewLabel: string;
    createNewLabel: string;
    selectTypeLabel: string;
    recoveryHelp?: string;
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
    isRecovered,
    onDownload,
    onView,
    onCreateNew,
    downloadLabel,
    viewLabel,
    createNewLabel,
    selectTypeLabel,
    recoveryHelp,
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
                {recoveryHelp && (
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '8px', lineHeight: '1.4' }}>
                        {recoveryHelp}
                    </p>
                )}
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

            {isRecovered && (
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>

                    <ButtonGroup style={{ marginTop: '20px' }}>
                        <Button onClick={onView} variant="secondary">
                            {viewLabel}
                        </Button>
                        <Button onClick={onDownload} variant="secondary">
                            {downloadLabel}
                        </Button>
                        <Button onClick={onCreateNew}>
                            {createNewLabel}
                        </Button>
                    </ButtonGroup>
                </div>
            )}
        </Card>
    );
}
