import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input, TextArea } from '@/shared/ui/Input';
import { safeOpenUrl } from '@/shared/lib/browser';
import { OFFICE_FILE_ACCEPT } from '@/shared/lib/officeFormats';
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

const FILE_SIZE_UNIT_LABEL = 'KB';
const BYTES_PER_KILOBYTE = 1024;
const READY_STATUS_COLOR = '#4caf50';

function formatFileSize(bytes: number): string {
    return `${(bytes / BYTES_PER_KILOBYTE).toFixed(2)} ${FILE_SIZE_UNIT_LABEL}`;
}

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
    uploadedFileLabel: string;
    uploadedSizeLabel: string;
    uploadedTypeLabel: string;
    uploadedReadyLabel: string;
    genericFileTypeLabel: string;
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
    officeFile: File | null;
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
    uploadedFileLabel,
    uploadedSizeLabel,
    uploadedTypeLabel,
    uploadedReadyLabel,
    genericFileTypeLabel,
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
    officeFile,
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
                        accept={OFFICE_FILE_ACCEPT}
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
                    {officeFile ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <p><strong>{uploadedFileLabel}:</strong> {officeFile.name}</p>
                            <p><strong>{uploadedSizeLabel}:</strong> {formatFileSize(officeFile.size)}</p>
                            <p><strong>{uploadedTypeLabel}:</strong> {officeFile.type || genericFileTypeLabel}</p>
                            <div style={{ marginTop: '10px', color: READY_STATUS_COLOR }}>
                                {uploadedReadyLabel}
                            </div>
                        </div>
                    ) : officeSourceUrl && isValidUrl(officeSourceUrl) ? (
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
                                onClick={() => safeOpenUrl(officeLink, '_blank')}
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
                                onClick={() => safeOpenUrl(officeRenderAllLink, '_blank')}
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
