import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import {
    ButtonGroup,
    CheckboxContainer,
    CheckboxLabel,
    ErrorMessage,
    FileInput,
    FileInputLabel,
    ImagePlaceholder,
    ImagePreview,
    ImagePreviewImage,
    ImageSection,
    LinkDisplay,
    ResultSection,
    StyledCheckbox,
} from '@/shared/styles/pages/create.styles';

interface ImageToolCardProps {
    title: string;
    description: string;
    uploadLabel: string;
    previewHint: string;
    previewAlt: string;
    compressLabel: string;
    urlLabel: string;
    urlPlaceholder: string;
    generateLabel: string;
    generateUrlLabel: string;
    renderAllLabel: string;
    clearLabel: string;
    linkTitle: string;
    renderAllTitle: string;
    urlLinkTitle: string;
    copyLabel: string;
    openLabel: string;
    compressingLabel: string;
    imageDataUrl: string;
    imageSourceUrl: string;
    imageLink: string;
    imageRenderAllLink: string;
    imageSourceLink: string;
    imageError: string;
    isProcessing: boolean;
    compressImage: boolean;
    compressProgress: number | null;
    imageInputRef: React.RefObject<HTMLInputElement>;
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onToggleCompress: () => void;
    onSourceUrlChange: (value: string) => void;
    onGenerateLink: () => void;
    onGenerateSourceLink: () => void;
    onGenerateRenderAll: () => void;
    onClear: () => void;
    onCopyLink: (value: string) => void;
}

export function ImageToolCard({
    title,
    description,
    uploadLabel,
    previewHint,
    previewAlt,
    compressLabel,
    urlLabel,
    urlPlaceholder,
    generateLabel,
    generateUrlLabel,
    renderAllLabel,
    clearLabel,
    linkTitle,
    renderAllTitle,
    urlLinkTitle,
    copyLabel,
    openLabel,
    compressingLabel,
    imageDataUrl,
    imageSourceUrl,
    imageLink,
    imageRenderAllLink,
    imageSourceLink,
    imageError,
    isProcessing,
    compressImage,
    compressProgress,
    imageInputRef,
    onUpload,
    onToggleCompress,
    onSourceUrlChange,
    onGenerateLink,
    onGenerateSourceLink,
    onGenerateRenderAll,
    onClear,
    onCopyLink,
}: ImageToolCardProps) {
    return (
        <Card title={title}>
            <ImageSection>
                <p style={{ margin: 0 }}>{description}</p>
                <FileInput
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onUpload}
                    id="image-upload"
                />
                <FileInputLabel htmlFor="image-upload">
                    {uploadLabel}
                </FileInputLabel>
                <ImagePreview>
                    {imageDataUrl ? (
                        <ImagePreviewImage src={imageDataUrl} alt={previewAlt} />
                    ) : (
                        <ImagePlaceholder>{previewHint}</ImagePlaceholder>
                    )}
                </ImagePreview>
                <CheckboxContainer onClick={onToggleCompress}>
                    <StyledCheckbox
                        type="checkbox"
                        checked={compressImage}
                        readOnly
                    />
                    <CheckboxLabel>{compressLabel}</CheckboxLabel>
                </CheckboxContainer>
                {compressImage && isProcessing && (
                    <p style={{ margin: '8px 0 0', color: '#9aa4c7', fontSize: '0.9rem' }}>
                        {compressingLabel}
                        {compressProgress !== null ? ` ${compressProgress}%` : ''}
                    </p>
                )}
                <Input
                    label={urlLabel}
                    value={imageSourceUrl}
                    onChange={(event) => onSourceUrlChange(event.target.value)}
                    placeholder={urlPlaceholder}
                />
                <ButtonGroup>
                    <Button
                        onClick={onGenerateLink}
                        disabled={!imageDataUrl || isProcessing}
                    >
                        {generateLabel}
                    </Button>
                    <Button
                        onClick={onGenerateSourceLink}
                        variant="secondary"
                        disabled={!imageSourceUrl || isProcessing}
                    >
                        {generateUrlLabel}
                    </Button>
                    <Button
                        onClick={onGenerateRenderAll}
                        variant="secondary"
                        disabled={!imageDataUrl || isProcessing}
                    >
                        {renderAllLabel}
                    </Button>
                    <Button
                        onClick={onClear}
                        variant="secondary"
                        disabled={!imageDataUrl}
                        style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
                    >
                        {clearLabel}
                    </Button>
                </ButtonGroup>
                {imageError && <ErrorMessage>{imageError}</ErrorMessage>}
                {imageLink && (
                    <ResultSection>
                        <p><strong>{linkTitle}:</strong></p>
                        <LinkDisplay>{imageLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(imageLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(imageLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </ResultSection>
                )}
                {imageRenderAllLink && (
                    <ResultSection>
                        <p><strong>{renderAllTitle}:</strong></p>
                        <LinkDisplay>{imageRenderAllLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(imageRenderAllLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(imageRenderAllLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </ResultSection>
                )}
                {imageSourceLink && (
                    <ResultSection>
                        <p><strong>{urlLinkTitle}:</strong></p>
                        <LinkDisplay>{imageSourceLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(imageSourceLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(imageSourceLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </ResultSection>
                )}
            </ImageSection>
        </Card>
    );
}
