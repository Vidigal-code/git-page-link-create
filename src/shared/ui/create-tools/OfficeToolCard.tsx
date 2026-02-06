import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input, TextArea } from '@/shared/ui/Input';
import {
    ButtonGroup,
    ErrorMessage,
    FileInput,
    FileInputLabel,
    FormSection,
    LinkDisplay,
    OfficeFrame,
    OfficePlaceholder,
    OfficePreview,
    OfficeSection,
    ResultSection,
} from '@/shared/styles/pages/create.styles';

interface OfficeToolCardProps {
    title: string;
    description: string;
    previewHint: string;
    pasteLabel: string;
    pastePlaceholder: string;
    uploadLabel: string;
    urlLabel: string;
    urlPlaceholder: string;
    generateLabel: string;
    renderAllLabel: string;
    clearLabel: string;
    linkTitle: string;
    renderAllTitle: string;
    copyLabel: string;
    openLabel: string;
    fileInputRef: React.RefObject<HTMLInputElement>;
    officeCode: string;
    officeSourceUrl: string;
    officeLink: string;
    officeRenderAllLink: string;
    officeError: string;
    hasSource: boolean;
    onSourceUrlChange: (value: string) => void;
    onCodeChange: (value: string) => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onGenerateLink: () => void;
    onGenerateRenderAll: () => void;
    onClear: () => void;
    onCopyLink: (value: string) => void;
    getViewerUrl: (value: string) => string;
    isValidUrl: (value: string) => boolean;
}

export function OfficeToolCard({
    title,
    description,
    previewHint,
    pasteLabel,
    pastePlaceholder,
    uploadLabel,
    urlLabel,
    urlPlaceholder,
    generateLabel,
    renderAllLabel,
    clearLabel,
    linkTitle,
    renderAllTitle,
    copyLabel,
    openLabel,
    fileInputRef,
    officeCode,
    officeSourceUrl,
    officeLink,
    officeRenderAllLink,
    officeError,
    hasSource,
    onSourceUrlChange,
    onCodeChange,
    onFileUpload,
    onGenerateLink,
    onGenerateRenderAll,
    onClear,
    onCopyLink,
    getViewerUrl,
    isValidUrl,
}: OfficeToolCardProps) {
    return (
        <Card title={title}>
            <OfficeSection>
                <p style={{ margin: 0 }}>{description}</p>
                <FormSection>
                    <TextArea
                        label={pasteLabel}
                        value={officeCode}
                        onChange={(event) => onCodeChange(event.target.value)}
                        placeholder={pastePlaceholder}
                        rows={6}
                    />
                </FormSection>

                <FormSection>
                    <FileInput
                        ref={fileInputRef}
                        type="file"
                        accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        onChange={onFileUpload}
                        id="office-file-upload"
                    />
                    <FileInputLabel htmlFor="office-file-upload">
                        {uploadLabel}
                    </FileInputLabel>
                </FormSection>

                <FormSection>
                    <Input
                        label={urlLabel}
                        value={officeSourceUrl}
                        onChange={(event) => onSourceUrlChange(event.target.value)}
                        placeholder={urlPlaceholder}
                    />
                </FormSection>
                <OfficePreview>
                    {officeSourceUrl && isValidUrl(officeSourceUrl) ? (
                        <OfficeFrame
                            title={title}
                            src={getViewerUrl(officeSourceUrl)}
                        />
                    ) : (
                        <OfficePlaceholder>{previewHint}</OfficePlaceholder>
                    )}
                </OfficePreview>
                <ButtonGroup>
                    <Button
                        onClick={onGenerateLink}
                        disabled={!hasSource}
                    >
                        {generateLabel}
                    </Button>
                    <Button
                        onClick={onGenerateRenderAll}
                        variant="secondary"
                        disabled={!hasSource}
                    >
                        {renderAllLabel}
                    </Button>
                    <Button
                        onClick={onClear}
                        variant="secondary"
                        disabled={!hasSource}
                        style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
                    >
                        {clearLabel}
                    </Button>
                </ButtonGroup>
                {officeError && <ErrorMessage>{officeError}</ErrorMessage>}
                {officeLink && (
                    <ResultSection>
                        <p><strong>{linkTitle}:</strong></p>
                        <LinkDisplay>{officeLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(officeLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(officeLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </ResultSection>
                )}
                {officeRenderAllLink && (
                    <ResultSection>
                        <p><strong>{renderAllTitle}:</strong></p>
                        <LinkDisplay>{officeRenderAllLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(officeRenderAllLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(officeRenderAllLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </ResultSection>
                )}
            </OfficeSection>
        </Card>
    );
}
