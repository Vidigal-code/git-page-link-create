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
    FormGrid,
    Grid,
    HelperText,
    LeftColumn,
    MessageStack,
    OutputBlock,
    PageContainer,
    ProgressDivider,
    ProgressFill,
    ProgressTrack,
    ResultStack,
    RightColumn,
} from '@/shared/styles/pages/create-links.styles';
import { TemplateLivePreview } from '@/shared/ui/templateslinks';
import {
    buildPortfolioTemplateHtml,
    loadTemplatesPortfolio,
    PortfolioEducationItem,
    PortfolioExperienceItem,
    PortfolioSocialLink,
    PortfolioTemplate,
    PortfolioTemplateFormData,
} from '@/shared/lib/templatesportfolio';

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createSocial = (): PortfolioSocialLink => ({ id: createId(), label: '', url: '' });
const createEducation = (): PortfolioEducationItem => ({ id: createId(), title: '', institution: '', period: '', description: '', imageUrl: '' });
const createExperience = (): PortfolioExperienceItem => ({ id: createId(), role: '', company: '', period: '', description: '', current: false });

const initialData: PortfolioTemplateFormData = {
    mode: 'auto',
    heroName: '',
    heroImageUrl: '',
    heroDescription: '',
    socialLinks: [createSocial()],
    educationItems: [createEducation()],
    skills: [],
    experienceItems: [createExperience()],
    contact: {
        email: '',
        phone: '',
        location: '',
        website: '',
        websiteLabel: '',
    },
    footerText: '',
};

const STEPS = ['template', 'education', 'skills', 'experience', 'contact'] as const;

export default function CreatePortfolioPage() {
    const { t, locale } = useI18n();
    const [templates, setTemplates] = useState<PortfolioTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [formData, setFormData] = useState<PortfolioTemplateFormData>(initialData);
    const [stepIndex, setStepIndex] = useState(0);
    const [skillInput, setSkillInput] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [finalHtml, setFinalHtml] = useState('');
    const [renderAllLink, setRenderAllLink] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const loaded = await loadTemplatesPortfolio();
                setTemplates(loaded);
                if (loaded[0]?.id) setSelectedTemplateId(loaded[0].id);
            } catch {
                setError(t('createPortfolio.loadError'));
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
        return buildPortfolioTemplateHtml(
            selectedTemplate,
            { ...formData, locale },
            {
                sectionAbout: t('createPortfolio.sectionAbout'),
                sectionEducation: t('createPortfolio.sectionEducation'),
                sectionSkills: t('createPortfolio.sectionSkills'),
                sectionExperience: t('createPortfolio.sectionExperience'),
                sectionContact: t('createPortfolio.sectionContact'),
                currentLabel: t('createPortfolio.currentLabel'),
                emptySkills: t('createPortfolio.emptySkills'),
                footerDefault: t('createPortfolio.footerDefault'),
                toggleTitle: t('createPortfolio.toggleThemeTitle'),
                switchToLight: t('createPortfolio.switchToLight'),
                switchToDark: t('createPortfolio.switchToDark'),
                previousLabel: t('createPortfolio.paginationPrevious'),
                nextLabel: t('createPortfolio.paginationNext'),
                pageLabel: t('createPortfolio.paginationPage'),
                experienceFilterLabel: t('createPortfolio.experienceFilterLabel'),
                experienceFilterPlaceholder: t('createPortfolio.experienceFilterPlaceholder'),
                skillsFilterLabel: t('createPortfolio.skillsFilterLabel'),
                skillsFilterPlaceholder: t('createPortfolio.skillsFilterPlaceholder'),
                educationFilterLabel: t('createPortfolio.educationFilterLabel'),
                educationFilterPlaceholder: t('createPortfolio.educationFilterPlaceholder'),
            },
        );
    }, [selectedTemplate, formData, locale, t]);

    const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100);

    const updateSocial = (id: string, field: keyof Omit<PortfolioSocialLink, 'id'>, value: string) => {
        setFormData((prev) => ({
            ...prev,
            socialLinks: prev.socialLinks.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
        }));
    };

    const updateEducation = (id: string, field: keyof Omit<PortfolioEducationItem, 'id'>, value: string) => {
        setFormData((prev) => ({
            ...prev,
            educationItems: prev.educationItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
        }));
    };

    const updateExperience = (id: string, field: keyof Omit<PortfolioExperienceItem, 'id'>, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            experienceItems: prev.experienceItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
        }));
    };

    const addSkill = () => {
        const normalized = skillInput.trim();
        if (!normalized) return;
        if (formData.skills.some((item) => item.toLowerCase() === normalized.toLowerCase())) return;
        setFormData((prev) => ({ ...prev, skills: [...prev.skills, normalized] }));
        setSkillInput('');
    };

    const removeSkill = (skill: string) => {
        setFormData((prev) => ({ ...prev, skills: prev.skills.filter((item) => item !== skill) }));
    };

    const handleGenerateFinalHtml = () => {
        if (!selectedTemplate) {
            setError(t('createPortfolio.templateRequired'));
            return;
        }
        if (!formData.heroName.trim()) {
            setError(t('createPortfolio.nameRequired'));
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
            setSuccess(t('createPortfolio.copySuccess'));
            return;
        }
        setError(t('createPortfolio.copyError'));
    };

    const handleGenerateRenderAllLink = () => {
        if (!finalHtml || typeof window === 'undefined') return;
        const compressed = compress(finalHtml);
        const fullPath = withBasePath('/ra/');
        const link = `${window.location.origin}${fullPath}#d=${encodePlatformType('html')}-${compressed}`;
        setRenderAllLink(link);
        setSuccess(t('createPortfolio.renderAllGenerated'));
    };

    const handleCopyRenderAllLink = async () => {
        if (!renderAllLink) return;
        const copied = await copyTextToClipboard(renderAllLink);
        if (copied) {
            setSuccess(t('createPortfolio.linkCopied'));
            return;
        }
        setError(t('createPortfolio.copyError'));
    };

    const handleDownloadHtml = () => {
        if (!finalHtml || typeof window === 'undefined') return;
        const blob = new Blob([finalHtml], { type: 'text/html;charset=utf-8' });
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = 'portfolio-page.html';
        a.click();
        URL.revokeObjectURL(objectUrl);
        setSuccess(t('createPortfolio.downloadSuccess'));
    };

    return (
        <>
            <Head>
                <title>{t('createPortfolio.title')} - {t('common.appName')}</title>
                <meta name="description" content={t('createPortfolio.description')} />
            </Head>
            <PageContainer>
                <Grid>
                    <LeftColumn>
                        <Card title={t('createPortfolio.progressTitle')}>
                            <HelperText>{`${t('createPortfolio.stepLabel')} ${stepIndex + 1}/${STEPS.length}`}</HelperText>
                            <ProgressTrack>
                                <ProgressFill $width={progress} />
                            </ProgressTrack>
                            <ProgressDivider />
                            <Actions>
                                <Button type="button" variant="secondary" onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))} disabled={stepIndex === 0}>
                                    {t('createPortfolio.backButton')}
                                </Button>
                                <Button type="button" onClick={() => setStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1))} disabled={stepIndex === STEPS.length - 1}>
                                    {t('createPortfolio.nextButton')}
                                </Button>
                            </Actions>
                        </Card>

                        {stepIndex === 0 && (
                            <>
                                <Card title={t('createPortfolio.templateCardTitle')}>
                                    <FormGrid>
                                        <Select
                                            label={t('createPortfolio.templateLabel')}
                                            value={selectedTemplateId}
                                            options={templates.map((template) => ({ value: template.id, label: template.name }))}
                                            onChange={(event) => setSelectedTemplateId(event.target.value)}
                                        />
                                        <Select
                                            label={t('createPortfolio.modeLabel')}
                                            value={formData.mode}
                                            options={[
                                                { value: 'auto', label: t('createPortfolio.autoButton') },
                                                { value: 'light', label: t('createPortfolio.lightButton') },
                                                { value: 'dark', label: t('createPortfolio.darkButton') },
                                            ]}
                                            onChange={(event) => setFormData((prev) => ({ ...prev, mode: event.target.value as PortfolioTemplateFormData['mode'] }))}
                                        />
                                    </FormGrid>
                                </Card>
                                <Card title={t('createPortfolio.heroTitle')}>
                                    <FormGrid>
                                        <Input label={t('createPortfolio.nameLabel')} value={formData.heroName} onChange={(event) => setFormData((prev) => ({ ...prev, heroName: event.target.value }))} placeholder={t('createPortfolio.namePlaceholder')} />
                                        <Input label={t('createPortfolio.imageLabel')} value={formData.heroImageUrl} onChange={(event) => setFormData((prev) => ({ ...prev, heroImageUrl: event.target.value }))} placeholder="https://" />
                                        <TextArea label={t('createPortfolio.descriptionLabel')} value={formData.heroDescription} onChange={(event) => setFormData((prev) => ({ ...prev, heroDescription: event.target.value }))} placeholder={t('createPortfolio.descriptionPlaceholder')} rows={4} />
                                    </FormGrid>
                                </Card>
                                <Card title={t('createPortfolio.socialTitle')}>
                                    <FormGrid>
                                        {formData.socialLinks.map((item) => (
                                            <div key={item.id} style={{ display: 'grid', gap: '8px' }}>
                                                <Input label={t('createPortfolio.socialLabel')} value={item.label} onChange={(event) => updateSocial(item.id, 'label', event.target.value)} placeholder={t('createPortfolio.socialLabelPlaceholder')} />
                                                <Input label={t('createPortfolio.socialUrl')} value={item.url} onChange={(event) => updateSocial(item.id, 'url', event.target.value)} placeholder="https://" />
                                                <Actions>
                                                    <Button type="button" variant="secondary" onClick={() => setFormData((prev) => ({ ...prev, socialLinks: prev.socialLinks.filter((s) => s.id !== item.id) || [createSocial()] }))}>
                                                        {t('createPortfolio.removeItem')}
                                                    </Button>
                                                </Actions>
                                            </div>
                                        ))}
                                        <Actions><Button type="button" onClick={() => setFormData((prev) => ({ ...prev, socialLinks: [...prev.socialLinks, createSocial()] }))}>{t('createPortfolio.addSocial')}</Button></Actions>
                                    </FormGrid>
                                </Card>
                            </>
                        )}

                        {stepIndex === 1 && (
                            <Card title={t('createPortfolio.educationTitle')}>
                                <FormGrid>
                                    {formData.educationItems.map((item) => (
                                        <div key={item.id} style={{ display: 'grid', gap: '8px' }}>
                                            <Input label={t('createPortfolio.educationName')} value={item.title} onChange={(event) => updateEducation(item.id, 'title', event.target.value)} placeholder={t('createPortfolio.educationNamePlaceholder')} />
                                            <Input label={t('createPortfolio.educationInstitution')} value={item.institution} onChange={(event) => updateEducation(item.id, 'institution', event.target.value)} placeholder={t('createPortfolio.educationInstitutionPlaceholder')} />
                                            <Input label={t('createPortfolio.educationPeriod')} value={item.period} onChange={(event) => updateEducation(item.id, 'period', event.target.value)} placeholder={t('createPortfolio.educationPeriodPlaceholder')} />
                                            <Input label={t('createPortfolio.educationImage')} value={item.imageUrl} onChange={(event) => updateEducation(item.id, 'imageUrl', event.target.value)} placeholder="https://" />
                                            <TextArea label={t('createPortfolio.educationDescription')} value={item.description} onChange={(event) => updateEducation(item.id, 'description', event.target.value)} placeholder={t('createPortfolio.educationDescriptionPlaceholder')} rows={3} />
                                            <Actions><Button type="button" variant="secondary" onClick={() => setFormData((prev) => ({ ...prev, educationItems: prev.educationItems.filter((e) => e.id !== item.id) || [createEducation()] }))}>{t('createPortfolio.removeItem')}</Button></Actions>
                                        </div>
                                    ))}
                                    <Actions><Button type="button" onClick={() => setFormData((prev) => ({ ...prev, educationItems: [...prev.educationItems, createEducation()] }))}>{t('createPortfolio.addEducation')}</Button></Actions>
                                </FormGrid>
                            </Card>
                        )}

                        {stepIndex === 2 && (
                            <Card title={t('createPortfolio.skillsTitle')}>
                                <FormGrid>
                                    <Input label={t('createPortfolio.skillLabel')} value={skillInput} onChange={(event) => setSkillInput(event.target.value)} placeholder={t('createPortfolio.skillPlaceholder')} />
                                    <Actions><Button type="button" onClick={addSkill}>{t('createPortfolio.addSkill')}</Button></Actions>
                                    {formData.skills.length > 0 && (
                                        <Actions>
                                            {formData.skills.map((skill) => (
                                                <Button key={skill} type="button" variant="secondary" onClick={() => removeSkill(skill)}>{`${skill} ×`}</Button>
                                            ))}
                                        </Actions>
                                    )}
                                </FormGrid>
                            </Card>
                        )}

                        {stepIndex === 3 && (
                            <Card title={t('createPortfolio.experienceTitle')}>
                                <FormGrid>
                                    {formData.experienceItems.map((item) => (
                                        <div key={item.id} style={{ display: 'grid', gap: '8px' }}>
                                            <Input label={t('createPortfolio.experienceRole')} value={item.role} onChange={(event) => updateExperience(item.id, 'role', event.target.value)} placeholder={t('createPortfolio.experienceRolePlaceholder')} />
                                            <Input label={t('createPortfolio.experienceCompany')} value={item.company} onChange={(event) => updateExperience(item.id, 'company', event.target.value)} placeholder={t('createPortfolio.experienceCompanyPlaceholder')} />
                                            <Input label={t('createPortfolio.experiencePeriod')} value={item.period} onChange={(event) => updateExperience(item.id, 'period', event.target.value)} placeholder={t('createPortfolio.experiencePeriodPlaceholder')} />
                                            <TextArea label={t('createPortfolio.experienceDescription')} value={item.description} onChange={(event) => updateExperience(item.id, 'description', event.target.value)} placeholder={t('createPortfolio.experienceDescriptionPlaceholder')} rows={3} />
                                            <label style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                                                <input type="checkbox" checked={item.current} onChange={(event) => updateExperience(item.id, 'current', event.target.checked)} />
                                                <span>{t('createPortfolio.currentJob')}</span>
                                            </label>
                                            <Actions><Button type="button" variant="secondary" onClick={() => setFormData((prev) => ({ ...prev, experienceItems: prev.experienceItems.filter((e) => e.id !== item.id) || [createExperience()] }))}>{t('createPortfolio.removeItem')}</Button></Actions>
                                        </div>
                                    ))}
                                    <Actions><Button type="button" onClick={() => setFormData((prev) => ({ ...prev, experienceItems: [...prev.experienceItems, createExperience()] }))}>{t('createPortfolio.addExperience')}</Button></Actions>
                                </FormGrid>
                            </Card>
                        )}

                        {stepIndex === 4 && (
                            <>
                                <Card title={t('createPortfolio.contactTitle')}>
                                    <FormGrid>
                                        <Input label={t('createPortfolio.contactEmail')} value={formData.contact.email} onChange={(event) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, email: event.target.value } }))} placeholder="email@site.com" />
                                        <Input label={t('createPortfolio.contactPhone')} value={formData.contact.phone} onChange={(event) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, phone: event.target.value } }))} placeholder="+1 555 123 4567" />
                                        <Input label={t('createPortfolio.contactLocation')} value={formData.contact.location} onChange={(event) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, location: event.target.value } }))} placeholder={t('createPortfolio.contactLocationPlaceholder')} />
                                        <Input label={t('createPortfolio.contactWebsite')} value={formData.contact.website} onChange={(event) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, website: event.target.value } }))} placeholder="https://" />
                                        <Input label={t('createPortfolio.contactWebsiteLabel')} value={formData.contact.websiteLabel} onChange={(event) => setFormData((prev) => ({ ...prev, contact: { ...prev.contact, websiteLabel: event.target.value } }))} placeholder={t('createPortfolio.contactWebsiteLabelPlaceholder')} />
                                        <Input label={t('createPortfolio.footerLabel')} value={formData.footerText} onChange={(event) => setFormData((prev) => ({ ...prev, footerText: event.target.value }))} placeholder={t('createPortfolio.footerPlaceholder')} />
                                    </FormGrid>
                                </Card>
                                <Card title={t('createPortfolio.finalizeTitle')}>
                                    <ResultStack>
                                        <Actions>
                                            <Button type="button" onClick={handleGenerateFinalHtml}>{t('createPortfolio.generateFinalHtml')}</Button>
                                            {finalHtml && <Button type="button" variant="secondary" onClick={handleCopyFinalHtml}>{t('createPortfolio.copyHtml')}</Button>}
                                            {finalHtml && <Button type="button" variant="secondary" onClick={handleGenerateRenderAllLink}>{t('createPortfolio.generateRenderAll')}</Button>}
                                            {finalHtml && <Button type="button" variant="secondary" onClick={handleDownloadHtml}>{t('createPortfolio.downloadHtml')}</Button>}
                                        </Actions>
                                        <MessageStack>
                                            <HelperText>{t('createPortfolio.finalizeHint')}</HelperText>
                                            {error && <ErrorText>{error}</ErrorText>}
                                            {success && <HelperText>{success}</HelperText>}
                                        </MessageStack>
                                        {renderAllLink && (
                                            <OutputBlock>
                                                <ReadOnlyTextarea value={renderAllLink} readOnly rows={4} aria-label={t('createPortfolio.renderAllOutput')} />
                                                <Actions>
                                                    <Button type="button" onClick={handleCopyRenderAllLink}>{t('createPortfolio.copyRenderAll')}</Button>
                                                    <Button type="button" variant="secondary" onClick={() => safeOpenUrl(renderAllLink, '_blank')}>{t('create.openLink')}</Button>
                                                </Actions>
                                            </OutputBlock>
                                        )}
                                        {finalHtml && (
                                            <OutputBlock>
                                                <ReadOnlyTextarea value={finalHtml} readOnly rows={16} aria-label={t('createPortfolio.finalHtmlOutput')} />
                                            </OutputBlock>
                                        )}
                                    </ResultStack>
                                </Card>
                            </>
                        )}
                    </LeftColumn>

                    <RightColumn>
                        <TemplateLivePreview title={finalHtml ? t('createPortfolio.finalPreview') : t('createPortfolio.livePreview')} html={finalHtml || previewHtml} />
                    </RightColumn>
                </Grid>
            </PageContainer>
        </>
    );
}

