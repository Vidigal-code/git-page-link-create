import { JobSalaryCurrency, JobTemplate, JobTemplateFormData, JobWorkModel } from './types';
import { buildRichTextFontsCss, formatRichTextHtml } from '@/shared/lib/richTextFormatting';

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function isValidHttpUrl(value: string): boolean {
    if (!value) return false;
    try {
        const parsed = new URL(value);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

function isValidEmail(value: string): boolean {
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizeWhatsAppUrl(value: string): string {
    const raw = value.trim();
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) {
        return isValidHttpUrl(raw) ? raw : '';
    }
    const digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    return `https://wa.me/${digits}`;
}

function resolveImageRadius(shape: JobTemplate['layout']['imageShape']): string {
    if (shape === 'circle') return '50%';
    if (shape === 'square') return '12px';
    return '20px';
}

function resolveWorkModelLabel(
    model: JobWorkModel,
    custom: string,
    labels: Record<JobWorkModel, string>,
): string {
    if (model === 'custom') return custom.trim() || labels.custom;
    return labels[model];
}

function parseFlexibleNumber(raw: string): number | null {
    const normalized = raw.trim();
    if (!normalized) return null;
    const cleaned = normalized.replace(/[^\d,.-]/g, '');
    if (!cleaned) return null;

    const commaIndex = cleaned.lastIndexOf(',');
    const dotIndex = cleaned.lastIndexOf('.');
    let canonical = cleaned;

    if (commaIndex !== -1 && dotIndex !== -1) {
        if (commaIndex > dotIndex) {
            canonical = cleaned.replace(/\./g, '').replace(',', '.');
        } else {
            canonical = cleaned.replace(/,/g, '');
        }
    } else if (commaIndex !== -1) {
        const commaCount = (cleaned.match(/,/g) || []).length;
        const decimalDigits = cleaned.length - commaIndex - 1;
        canonical = commaCount === 1 && decimalDigits <= 2
            ? cleaned.replace(',', '.')
            : cleaned.replace(/,/g, '');
    } else if (dotIndex !== -1) {
        const dotCount = (cleaned.match(/\./g) || []).length;
        const decimalDigits = cleaned.length - dotIndex - 1;
        canonical = dotCount === 1 && decimalDigits <= 2
            ? cleaned
            : cleaned.replace(/\./g, '');
    }

    const parsed = Number(canonical);
    return Number.isFinite(parsed) ? parsed : null;
}

function formatSalaryDisplay(
    salaryRaw: string,
    currency: JobSalaryCurrency,
    customCurrency: string,
    locale: string,
): string {
    const raw = salaryRaw.trim();
    if (!raw) return '';
    const parsed = parseFlexibleNumber(raw);
    if (parsed === null) return raw;

    if (currency === 'custom') {
        const number = new Intl.NumberFormat(locale).format(parsed);
        const suffix = customCurrency.trim();
        return suffix ? `${number} ${suffix}` : number;
    }

    const localeByCurrency: Record<Exclude<JobSalaryCurrency, 'custom'>, string> = {
        BRL: 'pt-BR',
        USD: 'en-US',
        EUR: 'es-ES',
    };

    return new Intl.NumberFormat(localeByCurrency[currency], {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(parsed);
}

interface BuildJobHtmlLocaleTexts {
    applyNowLabel?: string;
    tagsTitle?: string;
    workModelTitle?: string;
    switchToLight?: string;
    switchToDark?: string;
    toggleThemeTitle?: string;
    workModels?: Record<JobWorkModel, string>;
    contractTitle?: string;
    scheduleTitle?: string;
    salaryTitle?: string;
    companyWebsiteLabel?: string;
    contactTitle?: string;
    recruiterWhatsappLabel?: string;
    recruiterEmailLabel?: string;
}

export function buildJobTemplateHtml(
    template: JobTemplate,
    formData: JobTemplateFormData,
    localeTexts: BuildJobHtmlLocaleTexts = {},
): string {
    const light = template.modes.light;
    const dark = template.modes.dark;
    const lang = formData.locale || 'en';
    const mode = formData.mode;
    const bgEffect = template.effects?.backgroundEffect || 'mesh';
    const hoverEffect = template.effects?.hoverEffect || 'lift';
    const imageRadius = resolveImageRadius(template.layout.imageShape);
    const applyNowLabel = localeTexts.applyNowLabel || 'Apply now';
    const tagsTitle = localeTexts.tagsTitle || 'Tags';
    const toggleThemeTitle = localeTexts.toggleThemeTitle || 'Toggle color theme';
    const switchToLight = localeTexts.switchToLight || 'Switch to light mode';
    const switchToDark = localeTexts.switchToDark || 'Switch to dark mode';
    const workModels = localeTexts.workModels || {
        remote: 'Remote',
        hybrid: 'Hybrid',
        onsite: 'Onsite',
        custom: 'Custom',
    };
    const contractTitle = localeTexts.contractTitle || 'Contract';
    const scheduleTitle = localeTexts.scheduleTitle || 'Schedule';
    const salaryTitle = localeTexts.salaryTitle || 'Salary';
    const companyWebsiteLabel = localeTexts.companyWebsiteLabel || 'Official website';
    const contactTitle = localeTexts.contactTitle || 'Recruiter contact';
    const recruiterWhatsappLabel = localeTexts.recruiterWhatsappLabel || 'WhatsApp';
    const recruiterEmailLabel = localeTexts.recruiterEmailLabel || 'Recruiter e-mail';

    const title = escapeHtml(formData.jobTitle.trim() || 'Job Opportunity');
    const company = escapeHtml(formData.companyName.trim() || 'Company');
    const description = formatRichTextHtml(formData.jobDescription.trim() || '', formData.descriptionFonts || []);
    const workModel = escapeHtml(resolveWorkModelLabel(formData.workModel, formData.customWorkModel, workModels));
    const contractModel = formData.contractModel.trim();
    const workSchedule = formData.workSchedule.trim();
    const salaryDisplay = formatSalaryDisplay(
        formData.salary,
        formData.salaryCurrency,
        formData.salaryCustomCurrency,
        lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US',
    );
    const applyUrl = isValidHttpUrl(formData.applyUrl) ? escapeHtml(formData.applyUrl) : '';
    const applyLabel = escapeHtml(formData.applyLabel.trim() || applyNowLabel);
    const companyWebsiteUrl = isValidHttpUrl(formData.companyWebsiteUrl)
        ? escapeHtml(formData.companyWebsiteUrl)
        : '';
    const recruiterWhatsapp = normalizeWhatsAppUrl(formData.recruiterWhatsapp);
    const recruiterEmail = formData.recruiterEmail.trim();
    const recruiterEmailUrl = isValidEmail(recruiterEmail)
        ? `mailto:${encodeURIComponent(recruiterEmail)}`
        : '';
    const hasContact = Boolean(recruiterWhatsapp || recruiterEmailUrl);
    const coverImage = isValidHttpUrl(formData.coverImageUrl)
        ? `<div class="cover-media"><img class="cover-image" src="${escapeHtml(formData.coverImageUrl)}" alt="${title}" loading="lazy" /></div>`
        : '';
    const tags = formData.tags
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 30);
    const tagsHtml = tags.map((tag) => `<span class="tag-item">${escapeHtml(tag)}</span>`).join('');
    const tagsSection = tags.length
        ? `<section class="tags">
        <p class="tags-title">${escapeHtml(tagsTitle)}</p>
        <div class="tags-list">${tagsHtml}</div>
      </section>`
        : '';

    return `<!doctype html>
<html lang="${lang}" data-theme="${mode}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title}</title>
<style>
:root{
  --bg:${light.background};--surface:${light.surface};--text:${light.text};--muted:${light.mutedText};
  --primary:${light.primary};--primaryText:${light.primaryText};--border:${light.border};--chip:${light.chip};--shadow:${light.shadow};
}
html[data-theme="dark"]{
  --bg:${dark.background};--surface:${dark.surface};--text:${dark.text};--muted:${dark.mutedText};
  --primary:${dark.primary};--primaryText:${dark.primaryText};--border:${dark.border};--chip:${dark.chip};--shadow:${dark.shadow};
}
@media (prefers-color-scheme: dark){
  html[data-theme="auto"]{
    --bg:${dark.background};--surface:${dark.surface};--text:${dark.text};--muted:${dark.mutedText};
    --primary:${dark.primary};--primaryText:${dark.primaryText};--border:${dark.border};--chip:${dark.chip};--shadow:${dark.shadow};
  }
}
*{box-sizing:border-box}
body{
  margin:0;min-height:100vh;background:var(--bg);color:var(--text);
  font-family:Inter,Segoe UI,Arial,sans-serif;
}
.page{
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  padding:clamp(12px,2vw,28px);position:relative;overflow:hidden;
}
.bg{
  position:absolute;inset:0;pointer-events:none;z-index:0;opacity:.92;
}
.card{
  width:min(100%, ${Math.max(template.layout.containerMaxWidth, 980)}px);
  background:var(--surface);border:1px solid var(--border);
  border-radius:clamp(18px,2vw,28px);
  box-shadow:var(--shadow);
  padding:clamp(16px,2.1vw,34px);
  position:relative;z-index:2;
  animation:fadeIn .45s ease;
}
.head{
  display:flex;justify-content:space-between;align-items:flex-start;gap:12px;
}
.company{
  margin:0;color:var(--muted);font-size:clamp(.98rem,1.1vw,1.08rem);
}
.title{
  margin:8px 0 0;font-size:clamp(1.6rem,2.8vw,2.4rem);line-height:1.14;
}
.company-site{
  margin-top:10px;display:inline-flex;align-items:center;gap:6px;text-decoration:none;color:var(--primary);
  font-weight:600;font-size:clamp(.92rem,1vw,1.02rem);
}
.theme-toggle{
  border:1px solid var(--border);background:var(--surface);color:var(--text);
  width:40px;height:40px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;
  cursor:pointer;
}
.hero{
  margin-top:clamp(16px,2vw,24px);display:flex;flex-direction:column;gap:clamp(14px,1.8vw,22px);align-items:stretch;
}
.cover-media{
  width:min(100%, clamp(320px, 60vw, 760px));
  min-height:clamp(220px,30vh,380px);
  max-height:clamp(260px,36vh,440px);
  margin:0 auto;
  display:flex;align-items:center;justify-content:center;
  border:1px solid var(--border);border-radius:${imageRadius};background:color-mix(in srgb,var(--chip) 64%, transparent 36%);overflow:hidden;
}
.cover-image{
  width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;object-position:center;display:block;
}
.desc{
  margin:0;color:var(--text);line-height:1.55;font-size:clamp(1rem,1.2vw,1.18rem);white-space:pre-wrap;
}
.desc strong{font-weight:800}
.desc em{font-style:italic}
.meta{
  margin-top:clamp(14px,2vw,20px);display:flex;flex-wrap:wrap;gap:10px;
}
.chip{
  background:var(--chip);border:1px solid var(--border);border-radius:999px;padding:8px 12px;color:var(--muted);font-weight:600;
}
.apply{
  margin-top:clamp(18px,2.2vw,26px);display:flex;justify-content:center;
}
.apply-link{
  display:inline-flex;align-items:center;justify-content:center;text-decoration:none;
  background:var(--primary);color:var(--primaryText);font-weight:700;
  border-radius:14px;min-height:54px;padding:10px 22px;min-width:min(100%,420px);
  transition:transform .18s ease,opacity .18s ease,box-shadow .18s ease,border-color .18s ease;
  border:1px solid transparent;font-size:clamp(1rem,1.2vw,1.18rem);
}
.contact{
  margin-top:clamp(14px,2vw,22px);
}
.contact-title{
  margin:0 0 10px;color:var(--muted);font-weight:700;
}
.contact-actions{
  display:flex;flex-wrap:wrap;gap:10px;
}
.contact-link{
  display:inline-flex;align-items:center;justify-content:center;text-decoration:none;
  background:var(--chip);border:1px solid var(--border);color:var(--text);
  border-radius:999px;padding:8px 12px;font-weight:600;
}
.tags{
  margin-top:clamp(18px,2.2vw,26px);
}
.tags-title{
  margin:0 0 10px;color:var(--muted);font-weight:700;
}
.tags-list{
  display:flex;flex-wrap:wrap;gap:10px;
}
.tag-item{
  background:var(--chip);border:1px solid var(--border);padding:8px 12px;border-radius:999px;
}
.hover-lift .apply-link:hover{transform:translateY(-2px);opacity:.94;box-shadow:0 8px 22px rgba(0,0,0,.24)}
.hover-glow .apply-link:hover{box-shadow:0 0 0 2px color-mix(in srgb,var(--primary) 42%, transparent 58%),0 0 24px color-mix(in srgb,var(--primary) 42%, transparent 58%)}
.hover-outline .apply-link:hover{background:transparent;color:var(--text);border-color:var(--primary)}
.hover-pulse .apply-link:hover{animation:pulse .85s ease}
.bg-aurora{background:radial-gradient(55% 45% at 20% 20%, color-mix(in srgb,var(--primary) 26%, transparent 74%), transparent 70%),radial-gradient(45% 35% at 80% 20%, color-mix(in srgb,var(--chip) 55%, transparent 45%), transparent 75%),radial-gradient(60% 50% at 50% 100%, color-mix(in srgb,var(--primary) 20%, transparent 80%), transparent 70%);animation:bgDrift 16s ease-in-out infinite alternate}
.bg-mesh{background:linear-gradient(120deg, color-mix(in srgb,var(--primary) 14%, transparent 86%), transparent 45%),linear-gradient(300deg, color-mix(in srgb,var(--chip) 34%, transparent 66%), transparent 40%);background-size:180% 180%;animation:bgShift 14s ease-in-out infinite}
.bg-grid{background-image:linear-gradient(color-mix(in srgb,var(--border) 45%, transparent 55%) 1px, transparent 1px),linear-gradient(90deg, color-mix(in srgb,var(--border) 45%, transparent 55%) 1px, transparent 1px);background-size:28px 28px;mask-image:radial-gradient(circle at center, #000 52%, transparent 100%);animation:gridMove 24s linear infinite}
.bg-stars{background:radial-gradient(2px 2px at 12% 18%, color-mix(in srgb,var(--text) 65%, transparent 35%), transparent 60%),radial-gradient(1.5px 1.5px at 64% 30%, color-mix(in srgb,var(--text) 55%, transparent 45%), transparent 60%),radial-gradient(1.8px 1.8px at 80% 80%, color-mix(in srgb,var(--text) 45%, transparent 55%), transparent 60%),radial-gradient(1.2px 1.2px at 22% 72%, color-mix(in srgb,var(--text) 55%, transparent 45%), transparent 60%);animation:twinkle 3.8s ease-in-out infinite alternate}
.bg-waves{background:radial-gradient(80% 35% at 50% 120%, color-mix(in srgb,var(--primary) 22%, transparent 78%), transparent 70%),radial-gradient(75% 34% at 50% -20%, color-mix(in srgb,var(--chip) 42%, transparent 58%), transparent 70%);animation:waveFlow 12s ease-in-out infinite alternate}
.bg-spotlight{background:radial-gradient(42% 42% at 22% 18%, color-mix(in srgb,var(--primary) 25%, transparent 75%), transparent 72%),radial-gradient(38% 38% at 78% 82%, color-mix(in srgb,var(--chip) 50%, transparent 50%), transparent 72%);animation:spotlightMove 14s ease-in-out infinite alternate}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes bgDrift{0%{transform:translate3d(0,0,0) scale(1)}100%{transform:translate3d(0,-10px,0) scale(1.04)}}
@keyframes bgShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes gridMove{from{background-position:0 0,0 0}to{background-position:0 28px,28px 0}}
@keyframes twinkle{from{opacity:.42}to{opacity:.95}}
@keyframes waveFlow{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-8px) scale(1.04)}}
@keyframes spotlightMove{0%{transform:translateX(-6px)}100%{transform:translateX(8px)}}
@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.02)}100%{transform:scale(1)}}
${buildRichTextFontsCss()}
</style>
</head>
<body>
  <main class="page hover-${hoverEffect}">
    <div class="bg bg-${bgEffect}"></div>
    <article class="card">
      <header class="head">
        <div>
          <p class="company">${company}</p>
          <h1 class="title">${title}</h1>
          ${companyWebsiteUrl ? `<a class="company-site" href="${companyWebsiteUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(companyWebsiteLabel)}</a>` : ''}
        </div>
        ${mode === 'auto' ? `
        <button class="theme-toggle" type="button" id="theme-toggle-btn" aria-label="${escapeHtml(toggleThemeTitle)}" title="${escapeHtml(toggleThemeTitle)}">
          <span id="theme-toggle-icon"></span>
        </button>` : ''}
      </header>
      <section class="hero">
        ${coverImage}
        <div>
          <p class="desc">${description}</p>
          <div class="meta">
            <span class="chip">${escapeHtml((localeTexts.workModelTitle || 'Work model') + ': ' + workModel)}</span>
            ${contractModel ? `<span class="chip">${escapeHtml(contractTitle + ': ' + contractModel)}</span>` : ''}
            ${workSchedule ? `<span class="chip">${escapeHtml(scheduleTitle + ': ' + workSchedule)}</span>` : ''}
            ${salaryDisplay ? `<span class="chip">${escapeHtml(salaryTitle + ': ' + salaryDisplay)}</span>` : ''}
          </div>
        </div>
      </section>
      <section class="apply">
        ${applyUrl ? `<a class="apply-link" href="${applyUrl}" target="_blank" rel="noopener noreferrer">${applyLabel}</a>` : ''}
      </section>
      ${hasContact ? `<section class="contact">
        <p class="contact-title">${escapeHtml(contactTitle)}</p>
        <div class="contact-actions">
          ${recruiterWhatsapp ? `<a class="contact-link" href="${escapeHtml(recruiterWhatsapp)}" target="_blank" rel="noopener noreferrer">${escapeHtml(recruiterWhatsappLabel)}</a>` : ''}
          ${recruiterEmailUrl ? `<a class="contact-link" href="${escapeHtml(recruiterEmailUrl)}">${escapeHtml(recruiterEmailLabel)}</a>` : ''}
        </div>
      </section>` : ''}
      ${tagsSection}
    </article>
  </main>
  <script>
    (function(){
      var root=document.documentElement;
      var isAuto=${mode === 'auto' ? 'true' : 'false'};
      if(!isAuto){ return; }
      var toggleBtn=document.getElementById('theme-toggle-btn');
      var toggleIcon=document.getElementById('theme-toggle-icon');
      if(!toggleBtn || !toggleIcon){ return; }
      var prefersDark=window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      var currentMode=prefersDark ? 'dark' : 'light';
      root.setAttribute('data-theme', currentMode);
      function renderToggle(){
        if(currentMode === 'dark'){
          toggleBtn.setAttribute('aria-label','${escapeHtml(switchToLight)}');
          toggleBtn.setAttribute('title','${escapeHtml(switchToLight)}');
          toggleIcon.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3c0 .17-.01.34-.01.51A7.5 7.5 0 0 0 20.49 12c.17 0 .34 0 .51-.01Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          return;
        }
        toggleBtn.setAttribute('aria-label','${escapeHtml(switchToDark)}');
        toggleBtn.setAttribute('title','${escapeHtml(switchToDark)}');
        toggleIcon.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      }
      toggleBtn.addEventListener('click', function(){
        currentMode = currentMode === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', currentMode);
        renderToggle();
      });
      renderToggle();
    })();
  </script>
</body>
</html>`;
}

