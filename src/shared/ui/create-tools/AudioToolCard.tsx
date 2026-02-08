import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import {
    AudioPlaceholder,
    AudioPlayer,
    AudioPreview,
    AudioSection,
    ButtonGroup,
    CheckboxContainer,
    CheckboxLabel,
    ErrorMessage,
    FileInput,
    FileInputLabel,
    LinkDisplay,
    ResultSection,
    StyledCheckbox,
} from '@/shared/styles/pages/create.styles';

interface AudioToolCardProps {
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
    audioDataUrl: string;
    audioSourceUrl: string;
    audioLink: string;
    audioRenderAllLink: string;
    audioSourceLink: string;
    audioError: string;
    isProcessing: boolean;
    compressAudio: boolean;
    compressProgress: number | null;
    audioInputRef: React.RefObject<HTMLInputElement>;
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onToggleCompress: () => void;
    onSourceUrlChange: (value: string) => void;
    onGenerateLink: () => void;
    onGenerateSourceLink: () => void;
    onGenerateRenderAll: () => void;
    onClear: () => void;
    onCopyLink: (value: string) => void;

    // Recording
    recordTitle: string;
    micLabel: string;
    recordStartLabel: string;
    recordStopLabel: string;
    recordingLabel: string;
    devices: MediaDeviceInfo[];
    selectedDeviceId: string;
    onDeviceChange: (deviceId: string) => void;
    isRecording: boolean;
    recordingSeconds: number;
    recordingPercent: number;
    recordingError: string;
    onStartRecording: () => void;
    onStopRecording: () => void;
}

export function AudioToolCard({
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
    audioDataUrl,
    audioSourceUrl,
    audioLink,
    audioRenderAllLink,
    audioSourceLink,
    audioError,
    isProcessing,
    compressAudio,
    compressProgress,
    audioInputRef,
    onUpload,
    onToggleCompress,
    onSourceUrlChange,
    onGenerateLink,
    onGenerateSourceLink,
    onGenerateRenderAll,
    onClear,
    onCopyLink,
    recordTitle,
    micLabel,
    recordStartLabel,
    recordStopLabel,
    recordingLabel,
    devices,
    selectedDeviceId,
    onDeviceChange,
    isRecording,
    recordingSeconds,
    recordingPercent,
    recordingError,
    onStartRecording,
    onStopRecording,
}: AudioToolCardProps) {
    return (
        <Card title={title}>
            <AudioSection>
                <p style={{ margin: 0 }}>{description}</p>

                <div style={{ marginTop: 14 }}>
                    <p style={{ margin: 0, fontWeight: 700 }}>{recordTitle}</p>
                    {devices.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                            <Select
                                label={micLabel}
                                value={selectedDeviceId}
                                options={devices.map((d, idx) => ({
                                    value: d.deviceId,
                                    label: d.label || `Microphone ${idx + 1}`,
                                }))}
                                onChange={(event) => onDeviceChange(event.target.value)}
                                disabled={isRecording}
                            />
                        </div>
                    )}

                    <ButtonGroup style={{ marginTop: 12 }}>
                        {!isRecording ? (
                            <Button onClick={onStartRecording} variant="secondary">
                                {recordStartLabel}
                            </Button>
                        ) : (
                            <Button onClick={onStopRecording} variant="secondary">
                                {recordStopLabel}
                            </Button>
                        )}
                    </ButtonGroup>

                    {isRecording && (
                        <p style={{ margin: '10px 0 0', opacity: 0.85 }}>
                            {recordingLabel} {recordingSeconds}s • {recordingPercent}%
                        </p>
                    )}

                    {recordingError && (
                        <ErrorMessage>{recordingError}</ErrorMessage>
                    )}
                </div>

                <FileInput
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={onUpload}
                    id="audio-upload"
                />
                <FileInputLabel htmlFor="audio-upload">
                    {uploadLabel}
                </FileInputLabel>
                <AudioPreview>
                    {audioDataUrl ? (
                        <AudioPlayer controls src={audioDataUrl} />
                    ) : (
                        <AudioPlaceholder>{previewHint}</AudioPlaceholder>
                    )}
                </AudioPreview>
                <CheckboxContainer onClick={onToggleCompress}>
                    <StyledCheckbox
                        type="checkbox"
                        checked={compressAudio}
                        readOnly
                    />
                    <CheckboxLabel>{compressLabel}</CheckboxLabel>
                </CheckboxContainer>
                {compressAudio && isProcessing && (
                    <p style={{ margin: '8px 0 0', color: '#9aa4c7', fontSize: '0.9rem' }}>
                        {compressingLabel}
                        {compressProgress !== null ? ` ${compressProgress}%` : ''}
                    </p>
                )}
                <Input
                    label={urlLabel}
                    value={audioSourceUrl}
                    onChange={(event) => onSourceUrlChange(event.target.value)}
                    placeholder={urlPlaceholder}
                />
                <ButtonGroup>
                    <Button
                        onClick={onGenerateLink}
                        disabled={!audioDataUrl || isProcessing}
                    >
                        {generateLabel}
                    </Button>
                    <Button
                        onClick={onGenerateSourceLink}
                        variant="secondary"
                        disabled={!audioSourceUrl || isProcessing}
                    >
                        {generateUrlLabel}
                    </Button>
                    <Button
                        onClick={onGenerateRenderAll}
                        variant="secondary"
                        disabled={!audioDataUrl || isProcessing}
                    >
                        {renderAllLabel}
                    </Button>
                    <Button
                        onClick={onClear}
                        variant="secondary"
                        disabled={!audioDataUrl && !audioSourceUrl}
                        style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
                    >
                        {clearLabel}
                    </Button>
                </ButtonGroup>
                {audioError && <ErrorMessage>{audioError}</ErrorMessage>}
                {audioLink && (
                    <ResultSection>
                        <p><strong>{linkTitle}:</strong></p>
                        <LinkDisplay>{audioLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(audioLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(audioLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </ResultSection>
                )}
                {audioRenderAllLink && (
                    <ResultSection>
                        <p><strong>{renderAllTitle}:</strong></p>
                        <LinkDisplay>{audioRenderAllLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(audioRenderAllLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(audioRenderAllLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </ResultSection>
                )}
                {audioSourceLink && (
                    <ResultSection>
                        <p><strong>{urlLinkTitle}:</strong></p>
                        <LinkDisplay>{audioSourceLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(audioSourceLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(audioSourceLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </ResultSection>
                )}
            </AudioSection>
        </Card>
    );
}
