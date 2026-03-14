import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { Card } from '@/shared/ui/Card';
import { Input, TextArea } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { ReadOnlyTextarea } from '@/shared/ui/ReadOnlyTextarea';
import {
    buildTemplateLinksHtml,
    LinksTemplate,
    loadTemplatesLinks,
    SocialLinkInput,
    TemplateLinksFormData,
} from '@/shared/lib/templateslinks';
import { compress } from '@/shared/lib/compression';
import { encodePlatformType } from '@/shared/lib/shorturl/typeCodes';
import { copyTextToClipboard, safeOpenUrl } from '@/shared/lib/browser';
import { useI18n } from '@/shared/lib/i18n';
import { withBasePath } from '@/shared/lib/basePath';
import { SocialLinksForm, TemplateLivePreview, TemplateSelector } from '@/shared/ui/templateslinks';
import { RICH_TEXT_FONTS } from '@/shared/lib/richTextFormatting';
import {
    Actions,
    ErrorText,
    FontOptionButton,
    FontOptionsGrid,
    FontSelectorPanel,
    FormGrid,
    Grid,
    HelperText,
    MessageStack,
    LeftColumn,
    OutputBlock,
    PageContainer,
    ResultStack,
    RightColumn,
} from '@/shared/styles/pages/create-links.styles';

const createInitialLink = (): SocialLinkInput => ({
    id: `social-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    platform: 'instagram',
    url: '',
});

const initialFormData: TemplateLinksFormData = {
    profileName: '',
    profileBio: '',
    bioFonts: ['1'],
    avatarUrl: '',
    websiteUrl: '',
    websiteLabel: '',
    mode: 'auto',
    links: [createInitialLink()],
};

export default function CreateLinksPage() {
    const { t, locale } = useI18n();
    const [templates, setTemplates] = useState<LinksTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [formData, setFormData] = useState<TemplateLinksFormData>(initialFormData);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [finalHtml, setFinalHtml] = useState('');
    const [renderAllLink, setRenderAllLink] = useState('');

    const toggleBioFont = (fontId: string) => {
        setFormData((prev) => {
            const current = prev.bioFonts || [];
            const exists = current.includes(fontId);
            const next = exists ? current.filter((id) => id !== fontId) : [...current, fontId];
            return { ...prev, bioFonts: next };
        });
    };

    useEffect(() => {
        const load = async () => {
            try {
                const loaded = await loadTemplatesLinks();
                setTemplates(loaded);
                if (loaded[0]?.id) {
                    setSelectedTemplateId(loaded[0].id);
                }
            } catch {
                setError(t('createLinks.loadError'));
            }
        };
        void load();
    }, [t]);

    const selectedTemplate = useMemo(
        () => templates.find((template) => template.id === selectedTemplateId),
        [templates, selectedTemplateId],
    );

    const previewHtml = useMemo(() => {
        if (!selectedTemplate) return '';
        return buildTemplateLinksHtml(
            selectedTemplate,
            { ...formData, locale },
            {
                defaultWebsiteLabel: t('createLinks.defaultWebsiteLabel'),
                emptyLinksText: t('createLinks.emptyLinksText'),
                toggleTitle: t('createLinks.toggleThemeTitle'),
                switchToLight: t('createLinks.switchToLight'),
                switchToDark: t('createLinks.switchToDark'),
            },
        );
    }, [selectedTemplate, formData, locale, t]);

    const updateLink = (id: string, field: 'platform' | 'url' | 'customLabel', value: string) => {
        setFormData((prev) => ({
            ...prev,
            links: prev.links.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
        }));
    };

    const removeLink = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            links: prev.links.length > 1 ? prev.links.filter((item) => item.id !== id) : prev.links,
        }));
    };

    const handleGenerateFinalHtml = () => {
        if (!selectedTemplate) {
            setError(t('createLinks.templateRequired'));
            return;
        }
        if (!formData.profileName.trim()) {
            setError(t('createLinks.profileNameRequired'));
            return;
        }
        setError('');
        setSuccess('');
        setFinalHtml(previewHtml);
        setRenderAllLink('');
    };

    const handleCopyFinalHtml = async () => {
        if (!finalHtml) return;
        const copied = await copyTextToClipboard(finalHtml);
        if (copied) {
            setSuccess(t('createLinks.copySuccess'));
            return;
        }
        setError(t('createLinks.copyError'));
    };

    const handleGenerateRenderAllLink = async () => {
        if (!finalHtml) return;
        if (typeof window === 'undefined') return;
        const compressed = compress(finalHtml);
        const fullPath = withBasePath('/ra/');
        const link = `${window.location.origin}${fullPath}#d=${encodePlatformType('html')}-${compressed}`;
        setRenderAllLink(link);
        setSuccess(t('createLinks.renderAllGenerated'));
    };

    const handleCopyRenderAllLink = async () => {
        if (!renderAllLink) return;
        const copied = await copyTextToClipboard(renderAllLink);
        if (copied) {
            setSuccess(t('createLinks.linkCopied'));
            return;
        }
        setError(t('createLinks.copyError'));
    };

    const handleDownloadHtml = () => {
        if (!finalHtml || typeof window === 'undefined') return;
        const blob = new Blob([finalHtml], { type: 'text/html;charset=utf-8' });
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = 'custom-links-page.html';
        a.click();
        URL.revokeObjectURL(objectUrl);
        setSuccess(t('createLinks.downloadSuccess'));
    };

    return (
        <>
            <Head>
                <title>{t('createLinks.title')} - {t('common.appName')}</title>
                <meta name="description" content={t('createLinks.description')} />
            </Head>
            <PageContainer>
                <Grid>
                    <LeftColumn>
                        <TemplateSelector
                            title={t('createLinks.templateCardTitle')}
                            templateLabel={t('createLinks.templateLabel')}
                            modeLabel={t('createLinks.modeLabel')}
                            modeAutoLabel={t('createLinks.autoButton')}
                            modeLightLabel={t('createLinks.lightButton')}
                            modeDarkLabel={t('createLinks.darkButton')}
                            templates={templates}
                            selectedTemplateId={selectedTemplateId}
                            mode={formData.mode}
                            onTemplateChange={setSelectedTemplateId}
                            onModeChange={(value) => setFormData((prev) => ({ ...prev, mode: value }))}
                        />

                        <Card title={t('createLinks.profileCardTitle')}>
                            <FormGrid>
                                <Input
                                    label={t('createLinks.profileName')}
                                    value={formData.profileName}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, profileName: event.target.value }))}
                                    placeholder={t('createLinks.profileNamePlaceholder')}
                                />
                                <TextArea
                                    label={t('createLinks.profileBio')}
                                    value={formData.profileBio}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, profileBio: event.target.value }))}
                                    placeholder={t('createLinks.profileBioPlaceholder')}
                                    rows={3}
                                />
                                <div>
                                    <FontSelectorPanel>
                                        <HelperText>{t('createLinks.richTextHelp')}</HelperText>
                                        <HelperText>{t('createLinks.richTextFontsHelp')}</HelperText>
                                        <FontOptionsGrid>
                                        {RICH_TEXT_FONTS.map((font) => (
                                            <FontOptionButton
                                                key={font.id}
                                                type="button"
                                                $active={(formData.bioFonts || []).includes(font.id)}
                                                onClick={() => toggleBioFont(font.id)}
                                            >
                                                {`${font.id} - ${font.label}`}
                                            </FontOptionButton>
                                        ))}
                                        </FontOptionsGrid>
                                    </FontSelectorPanel>
                                </div>
                                <Input
                                    label={t('createLinks.avatarUrl')}
                                    value={formData.avatarUrl}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, avatarUrl: event.target.value }))}
                                    placeholder="https://"
                                />
                                <Input
                                    label={t('createLinks.website')}
                                    value={formData.websiteUrl}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, websiteUrl: event.target.value }))}
                                    placeholder="https://"
                                />
                                <Input
                                    label={t('createLinks.websiteLabel')}
                                    value={formData.websiteLabel}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, websiteLabel: event.target.value }))}
                                    placeholder={t('createLinks.websiteLabelPlaceholder')}
                                />
                            </FormGrid>
                        </Card>

                        <SocialLinksForm
                            title={t('createLinks.socialCardTitle')}
                            addLabel={t('createLinks.addSocial')}
                            removeLabel={t('createLinks.removeSocial')}
                            customLabelText={t('createLinks.customLabel')}
                            links={formData.links}
                            onAddLink={() => setFormData((prev) => ({ ...prev, links: [...prev.links, createInitialLink()] }))}
                            onRemoveLink={removeLink}
                            onChangeLink={updateLink}
                        />

                        <Card title={t('createLinks.finalizeTitle')}>
                            <ResultStack>
                                <Actions>
                                    <Button type="button" onClick={handleGenerateFinalHtml}>
                                        {t('createLinks.generateFinalHtml')}
                                    </Button>
                                    {finalHtml && (
                                        <Button type="button" variant="secondary" onClick={handleCopyFinalHtml}>
                                            {t('createLinks.copyHtml')}
                                        </Button>
                                    )}
                                    {finalHtml && (
                                        <Button type="button" variant="secondary" onClick={handleGenerateRenderAllLink}>
                                            {t('createLinks.generateRenderAll')}
                                        </Button>
                                    )}
                                    {finalHtml && (
                                        <Button type="button" variant="secondary" onClick={handleDownloadHtml}>
                                            {t('createLinks.downloadHtml')}
                                        </Button>
                                    )}
                                </Actions>

                                <MessageStack>
                                    <HelperText>{t('createLinks.finalizeHint')}</HelperText>
                                    {error && <ErrorText>{error}</ErrorText>}
                                    {success && <HelperText>{success}</HelperText>}
                                </MessageStack>

                                {renderAllLink && (
                                    <OutputBlock>
                                        <ReadOnlyTextarea value={renderAllLink} readOnly rows={4} aria-label={t('createLinks.renderAllOutput')} />
                                        <Actions>
                                            <Button type="button" onClick={handleCopyRenderAllLink}>
                                                {t('createLinks.copyRenderAll')}
                                            </Button>
                                            <Button type="button" variant="secondary" onClick={() => safeOpenUrl(renderAllLink, '_blank')}>
                                                {t('create.openLink')}
                                            </Button>
                                        </Actions>
                                    </OutputBlock>
                                )}

                                {finalHtml && (
                                    <OutputBlock>
                                        <ReadOnlyTextarea
                                            value={finalHtml}
                                            readOnly
                                            rows={16}
                                            aria-label={t('createLinks.finalHtmlOutput')}
                                        />
                                    </OutputBlock>
                                )}
                            </ResultStack>
                        </Card>
                    </LeftColumn>

                    <RightColumn>
                        <TemplateLivePreview
                            title={finalHtml ? t('createLinks.finalPreview') : t('createLinks.livePreview')}
                            html={finalHtml || previewHtml}
                        />
                    </RightColumn>
                </Grid>
            </PageContainer>
        </>
    );
}

