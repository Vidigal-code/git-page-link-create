import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { Input, TextArea } from '@/shared/ui/Input';
import {
    ButtonGroup,
    CheckboxContainer,
    CheckboxLabel,
    ErrorMessage,
    FileInput,
    FileInputLabel,
    FormSection,
    LinkDisplay,
    ResultSection,
    StyledCheckbox,
    SuccessMessage,
} from '@/shared/styles/pages/create.styles';

interface ContentTypeOption {
    value: string;
    label: string;
}

interface ContentToolCardProps {
    title: string;
    selectLabel: string;
    pasteLabel: string;
    uploadLabel: string;
    fullScreenLabel: string;
    sourceUrlLabel: string;
    sourceUrlPlaceholder: string;
    sourceUrlGenerateLabel: string;
    sourceUrlLinkTitle: string;
    generateLabel: string;
    processingLabel: string;
    previewLabel: string;
    clearLabel: string;
    copyLabel: string;
    openLabel: string;
    contentType: string;
    contentTypeOptions: ContentTypeOption[];
    onContentTypeChange: (value: string) => void;
    contentValue: string;
    isContentEditable: boolean;
    onContentChange: (value: string) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isFullScreen: boolean;
    onToggleFullScreen: () => void;
    contentSourceUrl: string;
    onContentSourceUrlChange: (value: string) => void;
    onGenerateContentSourceLink: () => void;
    contentSourceError: string;
    contentSourceLink: string;
    onCopyLink: (value: string) => void;
    onGenerateLink: () => void;
    isProcessing: boolean;
    onTogglePreview: () => void;
    onClearContent: () => void;
    errorMessage: string;
    successMessage: string;
}

export function ContentToolCard({
    title,
    selectLabel,
    pasteLabel,
    uploadLabel,
    fullScreenLabel,
    sourceUrlLabel,
    sourceUrlPlaceholder,
    sourceUrlGenerateLabel,
    sourceUrlLinkTitle,
    generateLabel,
    processingLabel,
    previewLabel,
    clearLabel,
    copyLabel,
    openLabel,
    contentType,
    contentTypeOptions,
    onContentTypeChange,
    contentValue,
    isContentEditable,
    onContentChange,
    fileInputRef,
    onFileUpload,
    isFullScreen,
    onToggleFullScreen,
    contentSourceUrl,
    onContentSourceUrlChange,
    onGenerateContentSourceLink,
    contentSourceError,
    contentSourceLink,
    onCopyLink,
    onGenerateLink,
    isProcessing,
    onTogglePreview,
    onClearContent,
    errorMessage,
    successMessage,
}: ContentToolCardProps) {
    return (
        <Card title={title}>
            <FormSection>
                <Select
                    label={selectLabel}
                    value={contentType}
                    onChange={(event) => onContentTypeChange(event.target.value)}
                    options={contentTypeOptions}
                />
            </FormSection>

            <FormSection>
                <TextArea
                    label={pasteLabel}
                    value={contentValue}
                    onChange={(event) => isContentEditable && onContentChange(event.target.value)}
                    placeholder={`Paste your ${contentType.toUpperCase()} content here...`}
                    rows={15}
                    readOnly={!isContentEditable}
                />
            </FormSection>

            <FormSection>
                <FileInput
                    ref={fileInputRef}
                    type="file"
                    accept={`.${contentType}`}
                    onChange={onFileUpload}
                    id="file-upload"
                />
                <FileInputLabel htmlFor="file-upload">
                    {uploadLabel}
                </FileInputLabel>

                <CheckboxContainer onClick={onToggleFullScreen}>
                    <StyledCheckbox
                        type="checkbox"
                        checked={isFullScreen}
                        readOnly
                    />
                    <CheckboxLabel>{fullScreenLabel}</CheckboxLabel>
                </CheckboxContainer>
            </FormSection>

            <FormSection>
                <Input
                    label={sourceUrlLabel}
                    value={contentSourceUrl}
                    onChange={(event) => onContentSourceUrlChange(event.target.value)}
                    placeholder={sourceUrlPlaceholder}
                />
                <ButtonGroup style={{ marginTop: '12px' }}>
                    <Button
                        onClick={onGenerateContentSourceLink}
                        disabled={!contentSourceUrl}
                    >
                        {sourceUrlGenerateLabel}
                    </Button>
                </ButtonGroup>
                {contentSourceError && <ErrorMessage>{contentSourceError}</ErrorMessage>}
                {contentSourceLink && (
                    <ResultSection>
                        <p><strong>{sourceUrlLinkTitle}:</strong></p>
                        <LinkDisplay>{contentSourceLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(contentSourceLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(contentSourceLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </ResultSection>
                )}
            </FormSection>

            <ButtonGroup>
                <Button
                    onClick={onGenerateLink}
                    disabled={isProcessing || contentValue.length === 0}
                >
                    {isProcessing ? processingLabel : generateLabel}
                </Button>

                <Button
                    onClick={onTogglePreview}
                    variant="secondary"
                    disabled={contentValue.length === 0}
                >
                    {previewLabel}
                </Button>

                <Button
                    onClick={onClearContent}
                    variant="secondary"
                    disabled={contentValue.length === 0}
                    style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
                >
                    {clearLabel}
                </Button>
            </ButtonGroup>

            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        </Card>
    );
}
