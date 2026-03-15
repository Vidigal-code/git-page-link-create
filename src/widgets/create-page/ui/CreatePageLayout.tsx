import React from 'react';
import { Select } from '@/shared/ui/Select';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { safeOpenUrl } from '@/shared/lib/browser';
import {
    Container,
    EditorColumn,
    LinkDisplay,
    PreviewColumn,
    ResultSection,
    SplitView,
    ButtonGroup,
} from '@/shared/styles/pages/create.styles';

type Option = { value: string; label: string };

type CreatePageLayoutProps = {
    selectLabel: string;
    previewTitle: string;
    generatedTitle: string;
    generatedLabel: string;
    fullScreenLabel: string;
    copyLabel: string;
    openLabel: string;
    downloadOriginalLabel: string;
    contentType: string;
    options: Option[];
    onChangeType: (value: string) => void;
    showPreview: boolean;
    isCreateTool: boolean;
    generatedLink: string;
    isFullScreen: boolean;
    onCopyGenerated: () => void;
    onDownloadOriginal: () => void;
    toolNode: React.ReactNode;
    previewNode: React.ReactNode;
};

export function CreatePageLayout(props: CreatePageLayoutProps) {
    return (
        <Container>
            <SplitView>
                <EditorColumn $showPreview={props.showPreview && props.isCreateTool}>
                    <Select
                        label={props.selectLabel}
                        value={props.contentType}
                        options={props.options}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => props.onChangeType(event.target.value)}
                    />

                    {props.toolNode}

                    {props.isCreateTool && props.generatedLink && (
                        <ResultSection>
                            <Card title={props.generatedTitle}>
                                <p>
                                    <strong>{props.isFullScreen ? props.fullScreenLabel : props.generatedLabel}:</strong>
                                </p>
                                <LinkDisplay>{props.generatedLink}</LinkDisplay>
                                <ButtonGroup style={{ marginBottom: '20px' }}>
                                    <Button onClick={props.onCopyGenerated}>
                                        {props.copyLabel}
                                    </Button>
                                    <Button onClick={() => safeOpenUrl(props.generatedLink, '_blank')} variant="secondary">
                                        {props.openLabel}
                                    </Button>
                                </ButtonGroup>

                                <ButtonGroup>
                                    <Button variant="secondary" onClick={props.onDownloadOriginal}>
                                        {props.downloadOriginalLabel}
                                    </Button>
                                </ButtonGroup>
                            </Card>
                        </ResultSection>
                    )}
                </EditorColumn>

                {props.showPreview && props.isCreateTool && (
                    <PreviewColumn>
                        <Card title={props.previewTitle}>
                            {props.previewNode}
                        </Card>
                    </PreviewColumn>
                )}
            </SplitView>
        </Container>
    );
}
