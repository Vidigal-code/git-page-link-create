import React, { useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { Card } from '@/shared/ui/Card';
import { Input, TextArea } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { ReadOnlyTextarea } from '@/shared/ui/ReadOnlyTextarea';
import { useI18n } from '@/shared/lib/i18n';
import { copyTextToClipboard, safeOpenUrl } from '@/shared/lib/browser';
import { withBasePath } from '@/shared/lib/basePath';
import { compress } from '@/shared/lib/compression';
import { encodePlatformType } from '@/shared/lib/shorturl/typeCodes';
import {
    Actions,
    ErrorText,
    FontOptionButton,
    FontOptionsGrid,
    FontSelectorPanel,
    FormGrid,
    Grid,
    HelperText,
    LeftColumn,
    MessageStack,
    OutputBlock,
    PageContainer,
    ResultStack,
    RightColumn,
} from '@/shared/styles/pages/create-links.styles';
import {
    buildJobTemplateHtml,
    JobSalaryCurrency,
    JobTemplate,
    JobTemplateFormData,
    JobWorkModel,
    loadTemplatesJob,
} from '@/shared/lib/templatesjob';
import { TemplateLivePreview } from '@/shared/ui/templateslinks';
import { RICH_TEXT_FONTS } from '@/shared/lib/richTextFormatting';

const initialData: JobTemplateFormData = {
    mode: 'auto',
    companyName: '',
    companyWebsiteUrl: '',
    recruiterWhatsapp: '',
    recruiterEmail: '',
    jobTitle: '',
    jobDescription: '',
    descriptionFonts: ['1'],
    workModel: 'remote',
    customWorkModel: '',
    contractModel: '',
    workSchedule: '',
    salary: '',
    salaryCurrency: 'BRL',
    salaryCustomCurrency: '',
    applyUrl: '',
    applyLabel: '',
    coverImageUrl: '',
    tags: [],
};

export default function CreateJobsPage() {
    const { t, locale } = useI18n();
    const [templates, setTemplates] = useState<JobTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [formData, setFormData] = useState<JobTemplateFormData>(initialData);
    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [finalHtml, setFinalHtml] = useState('');
    const [renderAllLink, setRenderAllLink] = useState('');

    const toggleDescriptionFont = (fontId: string) => {
        setFormData((prev) => {
            const current = prev.descriptionFonts || [];
            const exists = current.includes(fontId);
            const next = exists ? current.filter((id) => id !== fontId) : [...current, fontId];
            return { ...prev, descriptionFonts: next };
        });
    };

    useEffect(() => {
        const load = async () => {
            try {
                const loaded = await loadTemplatesJob();
                setTemplates(loaded);
                if (loaded[0]?.id) {
                    setSelectedTemplateId(loaded[0].id);
                }
            } catch {
                setError(t('createJobs.loadError'));
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
        return buildJobTemplateHtml(
            selectedTemplate,
            { ...formData, locale },
            {
                applyNowLabel: t('createJobs.defaultApplyLabel'),
                tagsTitle: t('createJobs.tagsTitle'),
                toggleThemeTitle: t('createJobs.toggleThemeTitle'),
                switchToLight: t('createJobs.switchToLight'),
                switchToDark: t('createJobs.switchToDark'),
                workModelTitle: t('createJobs.workModelLabel'),
                contractTitle: t('createJobs.contractModel'),
                scheduleTitle: t('createJobs.workSchedule'),
                salaryTitle: t('createJobs.salary'),
                companyWebsiteLabel: t('createJobs.companyWebsite'),
                contactTitle: t('createJobs.contactTitle'),
                recruiterWhatsappLabel: t('createJobs.recruiterWhatsapp'),
                recruiterEmailLabel: t('createJobs.recruiterEmail'),
                workModels: {
                    remote: t('createJobs.workModelRemote'),
                    hybrid: t('createJobs.workModelHybrid'),
                    onsite: t('createJobs.workModelOnsite'),
                    custom: t('createJobs.workModelCustom'),
                },
            },
        );
    }, [selectedTemplate, formData, locale, t]);

    const addTag = () => {
        const normalized = tagInput.trim();
        if (!normalized) return;
        if (formData.tags.some((tag) => tag.toLowerCase() === normalized.toLowerCase())) return;
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, normalized] }));
        setTagInput('');
    };

    const removeTag = (tag: string) => {
        setFormData((prev) => ({ ...prev, tags: prev.tags.filter((item) => item !== tag) }));
    };

    const handleGenerateFinalHtml = () => {
        if (!selectedTemplate) {
            setError(t('createJobs.templateRequired'));
            return;
        }
        if (!formData.jobTitle.trim()) {
            setError(t('createJobs.jobTitleRequired'));
            return;
        }
        if (!formData.jobDescription.trim()) {
            setError(t('createJobs.jobDescriptionRequired'));
            return;
        }
        if (!formData.applyUrl.trim()) {
            setError(t('createJobs.applyUrlRequired'));
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
            setSuccess(t('createJobs.copySuccess'));
            return;
        }
        setError(t('createJobs.copyError'));
    };

    const handleGenerateRenderAllLink = () => {
        if (!finalHtml || typeof window === 'undefined') return;
        const compressed = compress(finalHtml);
        const fullPath = withBasePath('/ra/');
        const link = `${window.location.origin}${fullPath}#d=${encodePlatformType('html')}-${compressed}`;
        setRenderAllLink(link);
        setSuccess(t('createJobs.renderAllGenerated'));
    };

    const handleCopyRenderAllLink = async () => {
        if (!renderAllLink) return;
        const copied = await copyTextToClipboard(renderAllLink);
        if (copied) {
            setSuccess(t('createJobs.linkCopied'));
            return;
        }
        setError(t('createJobs.copyError'));
    };

    const handleDownloadHtml = () => {
        if (!finalHtml || typeof window === 'undefined') return;
        const blob = new Blob([finalHtml], { type: 'text/html;charset=utf-8' });
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = 'job-page.html';
        a.click();
        URL.revokeObjectURL(objectUrl);
        setSuccess(t('createJobs.downloadSuccess'));
    };

    return (
        <>
            <Head>
                <title>{t('createJobs.title')} - {t('common.appName')}</title>
                <meta name="description" content={t('createJobs.description')} />
            </Head>
            <PageContainer>
                <Grid>
                    <LeftColumn>
                        <Card title={t('createJobs.templateCardTitle')}>
                            <Select
                                label={t('createJobs.templateLabel')}
                                value={selectedTemplateId}
                                options={templates.map((template) => ({
                                    value: template.id,
                                    label: template.name,
                                }))}
                                onChange={(event) => setSelectedTemplateId(event.target.value)}
                            />
                            <Select
                                label={t('createJobs.modeLabel')}
                                value={formData.mode}
                                options={[
                                    { value: 'auto', label: t('createJobs.autoButton') },
                                    { value: 'light', label: t('createJobs.lightButton') },
                                    { value: 'dark', label: t('createJobs.darkButton') },
                                ]}
                                onChange={(event) => setFormData((prev) => ({ ...prev, mode: event.target.value as JobTemplateFormData['mode'] }))}
                            />
                            {selectedTemplate?.description && <HelperText>{selectedTemplate.description}</HelperText>}
                        </Card>

                        <Card title={t('createJobs.formCardTitle')}>
                            <FormGrid>
                                <Input
                                    label={t('createJobs.companyName')}
                                    value={formData.companyName}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, companyName: event.target.value }))}
                                    placeholder={t('createJobs.companyNamePlaceholder')}
                                />
                                <Input
                                    label={t('createJobs.companyWebsite')}
                                    value={formData.companyWebsiteUrl}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, companyWebsiteUrl: event.target.value }))}
                                    placeholder="https://"
                                />
                                <Input
                                    label={t('createJobs.recruiterWhatsapp')}
                                    value={formData.recruiterWhatsapp}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, recruiterWhatsapp: event.target.value }))}
                                    placeholder={t('createJobs.recruiterWhatsappPlaceholder')}
                                />
                                <Input
                                    label={t('createJobs.recruiterEmail')}
                                    value={formData.recruiterEmail}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, recruiterEmail: event.target.value }))}
                                    placeholder="recruiter@company.com"
                                />
                                <Input
                                    label={t('createJobs.jobTitle')}
                                    value={formData.jobTitle}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, jobTitle: event.target.value }))}
                                    placeholder={t('createJobs.jobTitlePlaceholder')}
                                />
                                <Select
                                    label={t('createJobs.workModelLabel')}
                                    value={formData.workModel}
                                    options={[
                                        { value: 'remote', label: t('createJobs.workModelRemote') },
                                        { value: 'hybrid', label: t('createJobs.workModelHybrid') },
                                        { value: 'onsite', label: t('createJobs.workModelOnsite') },
                                        { value: 'custom', label: t('createJobs.workModelCustom') },
                                    ]}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, workModel: event.target.value as JobWorkModel }))}
                                />
                                {formData.workModel === 'custom' && (
                                    <Input
                                        label={t('createJobs.customWorkModel')}
                                        value={formData.customWorkModel}
                                        onChange={(event) => setFormData((prev) => ({ ...prev, customWorkModel: event.target.value }))}
                                        placeholder={t('createJobs.customWorkModelPlaceholder')}
                                    />
                                )}
                                <TextArea
                                    label={t('createJobs.jobDescription')}
                                    value={formData.jobDescription}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, jobDescription: event.target.value }))}
                                    placeholder={t('createJobs.jobDescriptionPlaceholder')}
                                    rows={5}
                                />
                                <div>
                                    <FontSelectorPanel>
                                        <HelperText>{t('createJobs.richTextHelp')}</HelperText>
                                        <HelperText>{t('createJobs.richTextFontsHelp')}</HelperText>
                                        <FontOptionsGrid>
                                        {RICH_TEXT_FONTS.map((font) => (
                                            <FontOptionButton
                                                key={font.id}
                                                type="button"
                                                $active={(formData.descriptionFonts || []).includes(font.id)}
                                                onClick={() => toggleDescriptionFont(font.id)}
                                            >
                                                {`${font.id} - ${font.label}`}
                                            </FontOptionButton>
                                        ))}
                                        </FontOptionsGrid>
                                    </FontSelectorPanel>
                                </div>
                                <Input
                                    label={t('createJobs.applyUrl')}
                                    value={formData.applyUrl}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, applyUrl: event.target.value }))}
                                    placeholder="https://"
                                />
                                <Input
                                    label={t('createJobs.applyLabel')}
                                    value={formData.applyLabel}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, applyLabel: event.target.value }))}
                                    placeholder={t('createJobs.applyLabelPlaceholder')}
                                />
                                <Input
                                    label={t('createJobs.contractModel')}
                                    value={formData.contractModel}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, contractModel: event.target.value }))}
                                    placeholder={t('createJobs.contractModelPlaceholder')}
                                />
                                <Input
                                    label={t('createJobs.workSchedule')}
                                    value={formData.workSchedule}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, workSchedule: event.target.value }))}
                                    placeholder={t('createJobs.workSchedulePlaceholder')}
                                />
                                <Input
                                    label={t('createJobs.salary')}
                                    value={formData.salary}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, salary: event.target.value }))}
                                    placeholder={t('createJobs.salaryPlaceholder')}
                                />
                                <Select
                                    label={t('createJobs.salaryCurrency')}
                                    value={formData.salaryCurrency}
                                    options={[
                                        { value: 'BRL', label: t('createJobs.salaryCurrencyBrl') },
                                        { value: 'USD', label: t('createJobs.salaryCurrencyUsd') },
                                        { value: 'EUR', label: t('createJobs.salaryCurrencyEur') },
                                        { value: 'custom', label: t('createJobs.salaryCurrencyCustom') },
                                    ]}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, salaryCurrency: event.target.value as JobSalaryCurrency }))}
                                />
                                {formData.salaryCurrency === 'custom' && (
                                    <Input
                                        label={t('createJobs.salaryCustomCurrency')}
                                        value={formData.salaryCustomCurrency}
                                        onChange={(event) => setFormData((prev) => ({ ...prev, salaryCustomCurrency: event.target.value }))}
                                        placeholder={t('createJobs.salaryCustomCurrencyPlaceholder')}
                                    />
                                )}
                                <Input
                                    label={t('createJobs.coverImageUrl')}
                                    value={formData.coverImageUrl}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, coverImageUrl: event.target.value }))}
                                    placeholder="https://"
                                />
                            </FormGrid>
                        </Card>

                        <Card title={t('createJobs.tagsTitle')}>
                            <FormGrid>
                                <Input
                                    label={t('createJobs.addTagLabel')}
                                    value={tagInput}
                                    onChange={(event) => setTagInput(event.target.value)}
                                    placeholder={t('createJobs.addTagPlaceholder')}
                                />
                                <Actions>
                                    <Button type="button" onClick={addTag}>
                                        {t('createJobs.addTagButton')}
                                    </Button>
                                </Actions>
                                {formData.tags.length > 0 && (
                                    <Actions>
                                        {formData.tags.map((tag) => (
                                            <Button key={tag} type="button" variant="secondary" onClick={() => removeTag(tag)}>
                                                {`${tag} ×`}
                                            </Button>
                                        ))}
                                    </Actions>
                                )}
                            </FormGrid>
                        </Card>

                        <Card title={t('createJobs.finalizeTitle')}>
                            <ResultStack>
                                <Actions>
                                    <Button type="button" onClick={handleGenerateFinalHtml}>
                                        {t('createJobs.generateFinalHtml')}
                                    </Button>
                                    {finalHtml && (
                                        <Button type="button" variant="secondary" onClick={handleCopyFinalHtml}>
                                            {t('createJobs.copyHtml')}
                                        </Button>
                                    )}
                                    {finalHtml && (
                                        <Button type="button" variant="secondary" onClick={handleGenerateRenderAllLink}>
                                            {t('createJobs.generateRenderAll')}
                                        </Button>
                                    )}
                                    {finalHtml && (
                                        <Button type="button" variant="secondary" onClick={handleDownloadHtml}>
                                            {t('createJobs.downloadHtml')}
                                        </Button>
                                    )}
                                </Actions>

                                <MessageStack>
                                    <HelperText>{t('createJobs.finalizeHint')}</HelperText>
                                    {error && <ErrorText>{error}</ErrorText>}
                                    {success && <HelperText>{success}</HelperText>}
                                </MessageStack>

                                {renderAllLink && (
                                    <OutputBlock>
                                        <ReadOnlyTextarea value={renderAllLink} readOnly rows={4} aria-label={t('createJobs.renderAllOutput')} />
                                        <Actions>
                                            <Button type="button" onClick={handleCopyRenderAllLink}>
                                                {t('createJobs.copyRenderAll')}
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
                                            aria-label={t('createJobs.finalHtmlOutput')}
                                        />
                                    </OutputBlock>
                                )}
                            </ResultStack>
                        </Card>
                    </LeftColumn>

                    <RightColumn>
                        <TemplateLivePreview
                            title={finalHtml ? t('createJobs.finalPreview') : t('createJobs.livePreview')}
                            html={finalHtml || previewHtml}
                        />
                    </RightColumn>
                </Grid>
            </PageContainer>
        </>
    );
}

