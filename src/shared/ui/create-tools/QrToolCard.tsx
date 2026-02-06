import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input, TextArea } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import {
    ButtonGroup,
    LinkDisplay,
    QrImage,
    QrOptionsGrid,
    QrPlaceholder,
    QrPreview,
    QrSection,
} from '@/shared/styles/pages/create.styles';

interface QrToolCardProps {
    title: string;
    inputLabel: string;
    inputPlaceholder: string;
    sizeLabel: string;
    marginLabel: string;
    correctionLabel: string;
    levelLLabel: string;
    levelMLabel: string;
    levelQLabel: string;
    levelHLabel: string;
    generateLabel: string;
    downloadLabel: string;
    downloadSvgLabel: string;
    openLabel: string;
    popupLabel: string;
    copyLabel: string;
    renderLinkLabel: string;
    renderAllLinkLabel: string;
    clearLabel: string;
    renderLinkTitle: string;
    renderAllLinkTitle: string;
    hintLabel: string;
    processingLabel: string;
    qrInput: string;
    qrDataUrl: string;
    qrSvg: string;
    qrRenderLink: string;
    qrRenderAllLink: string;
    qrIsProcessing: boolean;
    qrSize: number;
    qrMargin: number;
    qrCorrection: 'L' | 'M' | 'Q' | 'H';
    onInputChange: (value: string) => void;
    onSizeChange: (value: number) => void;
    onMarginChange: (value: number) => void;
    onCorrectionChange: (value: 'L' | 'M' | 'Q' | 'H') => void;
    onGenerate: () => void;
    onDownload: () => void;
    onDownloadSvg: () => void;
    onOpen: () => void;
    onOpenPopup: () => void;
    onCopy: () => void;
    onGenerateRenderLink: () => void;
    onGenerateRenderAllLink: () => void;
    onClear: () => void;
    onCopyLink: (value: string) => void;
}

export function QrToolCard({
    title,
    inputLabel,
    inputPlaceholder,
    sizeLabel,
    marginLabel,
    correctionLabel,
    levelLLabel,
    levelMLabel,
    levelQLabel,
    levelHLabel,
    generateLabel,
    downloadLabel,
    downloadSvgLabel,
    openLabel,
    popupLabel,
    copyLabel,
    renderLinkLabel,
    renderAllLinkLabel,
    clearLabel,
    renderLinkTitle,
    renderAllLinkTitle,
    hintLabel,
    processingLabel,
    qrInput,
    qrDataUrl,
    qrSvg,
    qrRenderLink,
    qrRenderAllLink,
    qrIsProcessing,
    qrSize,
    qrMargin,
    qrCorrection,
    onInputChange,
    onSizeChange,
    onMarginChange,
    onCorrectionChange,
    onGenerate,
    onDownload,
    onDownloadSvg,
    onOpen,
    onOpenPopup,
    onCopy,
    onGenerateRenderLink,
    onGenerateRenderAllLink,
    onClear,
    onCopyLink,
}: QrToolCardProps) {
    return (
        <Card title={title}>
            <QrSection>
                <TextArea
                    label={inputLabel}
                    value={qrInput}
                    onChange={(event) => onInputChange(event.target.value)}
                    placeholder={inputPlaceholder}
                    rows={3}
                />
                <QrOptionsGrid>
                    <Input
                        label={sizeLabel}
                        type="number"
                        min={120}
                        max={800}
                        value={qrSize}
                        onChange={(event) => onSizeChange(Number(event.target.value))}
                    />
                    <Input
                        label={marginLabel}
                        type="number"
                        min={0}
                        max={8}
                        value={qrMargin}
                        onChange={(event) => onMarginChange(Number(event.target.value))}
                    />
                    <Select
                        label={correctionLabel}
                        value={qrCorrection}
                        onChange={(event) => onCorrectionChange(event.target.value as 'L' | 'M' | 'Q' | 'H')}
                        options={[
                            { value: 'L', label: levelLLabel },
                            { value: 'M', label: levelMLabel },
                            { value: 'Q', label: levelQLabel },
                            { value: 'H', label: levelHLabel },
                        ]}
                    />
                </QrOptionsGrid>
                <QrPreview>
                    {qrDataUrl ? (
                        <QrImage src={qrDataUrl} alt="QR code" />
                    ) : (
                        <QrPlaceholder>{hintLabel}</QrPlaceholder>
                    )}
                </QrPreview>
                <ButtonGroup>
                    <Button
                        onClick={onGenerate}
                        disabled={!qrInput.trim() || qrIsProcessing}
                    >
                        {qrIsProcessing ? processingLabel : generateLabel}
                    </Button>
                    <Button
                        onClick={onDownload}
                        variant="secondary"
                        disabled={!qrDataUrl}
                    >
                        {downloadLabel}
                    </Button>
                    <Button
                        onClick={onDownloadSvg}
                        variant="secondary"
                        disabled={!qrSvg}
                    >
                        {downloadSvgLabel}
                    </Button>
                    <Button
                        onClick={onOpen}
                        variant="secondary"
                        disabled={!qrDataUrl}
                    >
                        {openLabel}
                    </Button>
                    <Button
                        onClick={onOpenPopup}
                        variant="secondary"
                        disabled={!qrDataUrl}
                    >
                        {popupLabel}
                    </Button>
                    <Button
                        onClick={onCopy}
                        variant="secondary"
                        disabled={!qrDataUrl}
                    >
                        {copyLabel}
                    </Button>
                    <Button
                        onClick={onGenerateRenderLink}
                        variant="secondary"
                        disabled={!qrDataUrl}
                    >
                        {renderLinkLabel}
                    </Button>
                    <Button
                        onClick={onGenerateRenderAllLink}
                        variant="secondary"
                        disabled={!qrDataUrl}
                    >
                        {renderAllLinkLabel}
                    </Button>
                    <Button
                        onClick={onClear}
                        variant="secondary"
                        disabled={!qrInput && !qrDataUrl}
                        style={{ borderColor: '#d32f2f', color: '#d32f2f' }}
                    >
                        {clearLabel}
                    </Button>
                </ButtonGroup>
                {qrRenderLink && (
                    <div style={{ marginTop: 20 }}>
                        <p><strong>{renderLinkTitle}:</strong></p>
                        <LinkDisplay>{qrRenderLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(qrRenderLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(qrRenderLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </div>
                )}
                {qrRenderAllLink && (
                    <div style={{ marginTop: 20 }}>
                        <p><strong>{renderAllLinkTitle}:</strong></p>
                        <LinkDisplay>{qrRenderAllLink}</LinkDisplay>
                        <ButtonGroup>
                            <Button onClick={() => onCopyLink(qrRenderAllLink)}>
                                {copyLabel}
                            </Button>
                            <Button
                                onClick={() => window.open(qrRenderAllLink, '_blank')}
                                variant="secondary"
                            >
                                {openLabel}
                            </Button>
                        </ButtonGroup>
                    </div>
                )}
            </QrSection>
        </Card>
    );
}
