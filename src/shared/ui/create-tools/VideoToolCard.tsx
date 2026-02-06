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
    LinkDisplay,
    ResultSection,
    StyledCheckbox,
    VideoFrame,
    VideoPlaceholder,
    VideoPreview,
    VideoSection,
} from '@/shared/styles/pages/create.styles';

interface VideoToolCardProps {
    title: string;
    description: string;
    uploadLabel: string;
    previewHint: string;
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
    videoDataUrl: string;
    videoSourceUrl: string;
    videoLink: string;
    videoRenderAllLink: string;
    videoSourceLink: string;
    videoError: string;
    isProcessing: boolean;
    compressVideo: boolean;
    compressProgress: number | null;
    videoInputRef: React.RefObject<HTMLInputElement>;
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onToggleCompress: () => void;
    onSourceUrlChange: (value: string) => void;
    onGenerateLink: () => void;
    onGenerateSourceLink: () => void;
    onGenerateRenderAll: () => void;
    onClear: () => void;
    onCopyLink: (value: string) => void;
}

export function VideoToolCard({
    title,
    description,
    uploadLabel,
    previewHint,
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
    videoDataUrl,
    videoSourceUrl,
    videoLink,
    videoRenderAllLink,
    videoSourceLink,
    videoError,
    isProcessing,
    compressVideo,
    compressProgress,
    videoInputRef,
    onUpload,
    onToggleCompress,
    onSourceUrlChange,
    onGenerateLink,
    onGenerateSourceLink,
    onGenerateRenderAll,
    onClear,
    onCopyLink,
}: VideoToolCardProps) {
    return (
        <Card title={title}>
            <VideoSection>
                <p style={{ margin: 0 }}>{description}</p>
                <FileInput
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={onUpload}
                    id="video-upload"
                />
                <FileInputLabel htmlFor="video-upload">
                    {uploadLabel}
                </FileInputLabel>
                <VideoPreview>
                    {videoDataUrl ? (
                        <VideoFrame controls src={videoDataUrl} />
                    ) : (
                        <VideoPlaceholder>{previewHint}</VideoPlaceholder>
                    )}
                </VideoPreview>
                <CheckboxContainer onClick={onToggleCompress}>
                    <StyledCheckbox
                        type="checkbox"
                        checked={compressVideo}
                        readOnly
                    />
                    <CheckboxLabel>{compressLabel}</CheckboxLabel>
                </CheckboxContainer>
                {compressVideo && isProcessing && (
                    <p style={{ margin: '8px 0 0', color: '#9aa4c7', fontSize: '0.9rem' }}>
                        {compressingLabel}
                        {compressProgress !== null ? ` ${compressProgress}%` : ''}
                    </p>
                )}
                <Input
                    label={urlLabel}
                    value={videoSourceUrl}
                    onChange={(event) => onSourceUrlChange(event.target.value)}
                    placeholder={urlPlaceholder}
                />
                <ButtonGroup>
                    <Button
                        onClick={onGenerateLink}
                        disabled={!videoDataUrl || isProcessing}
                    >
                        {generateLabel}
                    </Button>
                    <Button
                        onClick={onGenerateSourceLink}
                        variant="secondary"
                        disabled={!videoSourceUrl || isProcessing}
                    >
                        {generateUrlLabel}
                    </Button>
                    <Button
                        onClick={onGenerateRenderAll}
                        variant="secondary"
                        disabled={!videoDataUrl || isProcessing}
                    >
                        {renderAllLabel}
                    </Button>
                    <Button
                        onClick={onClear}
                        variant="secondary"
                        disabled={!videoDataUrl}
                        style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
                    >
                        {clearLabel}
                    </Button>
                </ButtonGroup>
                {videoError && <ErrorMessage>{videoError}</ErrorMessage>}
                {videoLink && (
                    <ResultSection>
                        <p><strong>{linkTitle}:</strong></p>
                        <LinkDisplay>{videoLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(videoLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(videoLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </ResultSection>
                )}
                {videoRenderAllLink && (
                    <ResultSection>
                        <p><strong>{renderAllTitle}:</strong></p>
                        <LinkDisplay>{videoRenderAllLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(videoRenderAllLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(videoRenderAllLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </ResultSection>
                )}
                {videoSourceLink && (
                    <ResultSection>
                        <p><strong>{urlLinkTitle}:</strong></p>
                        <LinkDisplay>{videoSourceLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(videoSourceLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(videoSourceLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </ResultSection>
                )}
            </VideoSection>
        </Card>
    );
}
