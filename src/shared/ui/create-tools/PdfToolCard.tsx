import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import {
    ButtonGroup,
    ErrorMessage,
    FileInput,
    FileInputLabel,
    LinkDisplay,
    PdfFrame,
    PdfPlaceholder,
    PdfPreview,
    PdfSection,
    ResultSection,
} from '@/shared/styles/pages/create.styles';

interface PdfToolCardProps {
    title: string;
    description: string;
    uploadLabel: string;
    previewHint: string;
    generateLabel: string;
    renderAllLabel: string;
    clearLabel: string;
    linkTitle: string;
    renderAllTitle: string;
    copyLabel: string;
    openLabel: string;
    pdfDataUrl: string;
    pdfLink: string;
    pdfRenderAllLink: string;
    pdfError: string;
    pdfInputRef: React.RefObject<HTMLInputElement>;
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onGenerateLink: () => void;
    onGenerateRenderAll: () => void;
    onClear: () => void;
    onCopyLink: (value: string) => void;
}

export function PdfToolCard({
    title,
    description,
    uploadLabel,
    previewHint,
    generateLabel,
    renderAllLabel,
    clearLabel,
    linkTitle,
    renderAllTitle,
    copyLabel,
    openLabel,
    pdfDataUrl,
    pdfLink,
    pdfRenderAllLink,
    pdfError,
    pdfInputRef,
    onUpload,
    onGenerateLink,
    onGenerateRenderAll,
    onClear,
    onCopyLink,
}: PdfToolCardProps) {
    return (
        <Card title={title}>
            <PdfSection>
                <p style={{ margin: 0 }}>{description}</p>
                <FileInput
                    ref={pdfInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={onUpload}
                    id="pdf-upload"
                />
                <FileInputLabel htmlFor="pdf-upload">
                    {uploadLabel}
                </FileInputLabel>
                <PdfPreview>
                    {pdfDataUrl ? (
                        <PdfFrame title="PDF preview" src={pdfDataUrl} />
                    ) : (
                        <PdfPlaceholder>{previewHint}</PdfPlaceholder>
                    )}
                </PdfPreview>
                <ButtonGroup>
                    <Button
                        onClick={onGenerateLink}
                        disabled={!pdfDataUrl}
                    >
                        {generateLabel}
                    </Button>
                    <Button
                        onClick={onGenerateRenderAll}
                        variant="secondary"
                        disabled={!pdfDataUrl}
                    >
                        {renderAllLabel}
                    </Button>
                    <Button
                        onClick={onClear}
                        variant="secondary"
                        disabled={!pdfDataUrl}
                        style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
                    >
                        {clearLabel}
                    </Button>
                </ButtonGroup>
                {pdfError && <ErrorMessage>{pdfError}</ErrorMessage>}
                {pdfLink && (
                    <ResultSection>
                        <p><strong>{linkTitle}:</strong></p>
                        <LinkDisplay>{pdfLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(pdfLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(pdfLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </ResultSection>
                )}
                {pdfRenderAllLink && (
                    <ResultSection>
                        <p><strong>{renderAllTitle}:</strong></p>
                        <LinkDisplay>{pdfRenderAllLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(pdfRenderAllLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(pdfRenderAllLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </ResultSection>
                )}
            </PdfSection>
        </Card>
    );
}
