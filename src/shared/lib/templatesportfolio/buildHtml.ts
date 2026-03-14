import { PortfolioTemplate, PortfolioTemplateFormData } from './types';

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

function getImageRadius(shape: PortfolioTemplate['layout']['imageShape']): string {
    if (shape === 'circle') return '50%';
    if (shape === 'square') return '12px';
    return '20px';
}

function paginate<T>(items: T[], pageSize: number): T[][] {
    if (pageSize <= 0) return [items];
    const pages: T[][] = [];
    for (let index = 0; index < items.length; index += pageSize) {
        pages.push(items.slice(index, index + pageSize));
    }
    return pages;
}

interface BuildPortfolioLocaleTexts {
    sectionAbout?: string;
    sectionEducation?: string;
    sectionSkills?: string;
    sectionExperience?: string;
    sectionContact?: string;
    currentLabel?: string;
    emptySkills?: string;
    footerDefault?: string;
    toggleTitle?: string;
    switchToLight?: string;
    switchToDark?: string;
    previousLabel?: string;
    nextLabel?: string;
    pageLabel?: string;
    experienceFilterLabel?: string;
    experienceFilterPlaceholder?: string;
    skillsFilterLabel?: string;
    skillsFilterPlaceholder?: string;
    educationFilterLabel?: string;
    educationFilterPlaceholder?: string;
}

export function buildPortfolioTemplateHtml(
    template: PortfolioTemplate,
    formData: PortfolioTemplateFormData,
    localeTexts: BuildPortfolioLocaleTexts = {},
): string {
    const light = template.modes.light;
    const dark = template.modes.dark;
    const mode = formData.mode;
    const bgEffect = template.effects?.backgroundEffect || 'mesh';
    const hoverEffect = template.effects?.hoverEffect || 'lift';
    const imageRadius = getImageRadius(template.layout.imageShape);
    const lang = formData.locale || 'en';

    const title = escapeHtml(formData.heroName.trim() || 'Portfolio');
    const about = escapeHtml(formData.heroDescription.trim() || '');
    const footer = escapeHtml(formData.footerText.trim() || localeTexts.footerDefault || 'Powered by portfolio builder');
    const sectionAbout = escapeHtml(localeTexts.sectionAbout || 'About');
    const sectionEducation = escapeHtml(localeTexts.sectionEducation || 'Education & Certificates');
    const sectionSkills = escapeHtml(localeTexts.sectionSkills || 'Skills');
    const sectionExperience = escapeHtml(localeTexts.sectionExperience || 'Experience');
    const sectionContact = escapeHtml(localeTexts.sectionContact || 'Contact');
    const currentLabel = escapeHtml(localeTexts.currentLabel || 'Current');
    const emptySkills = escapeHtml(localeTexts.emptySkills || 'No skills added');
    const toggleTitle = escapeHtml(localeTexts.toggleTitle || 'Toggle color theme');
    const switchToLight = escapeHtml(localeTexts.switchToLight || 'Switch to light mode');
    const switchToDark = escapeHtml(localeTexts.switchToDark || 'Switch to dark mode');
    const previousLabel = escapeHtml(localeTexts.previousLabel || 'Previous');
    const nextLabel = escapeHtml(localeTexts.nextLabel || 'Next');
    const pageLabel = escapeHtml(localeTexts.pageLabel || 'Page');
    const experienceFilterLabel = escapeHtml(localeTexts.experienceFilterLabel || 'Filter experiences');
    const experienceFilterPlaceholder = escapeHtml(localeTexts.experienceFilterPlaceholder || 'Search experience');
    const skillsFilterLabel = escapeHtml(localeTexts.skillsFilterLabel || 'Filter skills');
    const skillsFilterPlaceholder = escapeHtml(localeTexts.skillsFilterPlaceholder || 'Search skills');
    const educationFilterLabel = escapeHtml(localeTexts.educationFilterLabel || 'Filter certifications');
    const educationFilterPlaceholder = escapeHtml(localeTexts.educationFilterPlaceholder || 'Search certifications');

    const imageHtml = isValidHttpUrl(formData.heroImageUrl)
        ? `<div class="hero-media"><img class="hero-image" src="${escapeHtml(formData.heroImageUrl)}" alt="${title}" loading="lazy" /></div>`
        : '';

    const socialHtml = formData.socialLinks
        .map((item) => ({
            label: item.label.trim(),
            url: item.url.trim(),
        }))
        .filter((item) => item.label && isValidHttpUrl(item.url))
        .map((item) => `<a class="social-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)}</a>`)
        .join('');

    const educationItems = formData.educationItems
        .map((item) => ({
            title: item.title.trim(),
            institution: item.institution.trim(),
            period: item.period.trim(),
            description: item.description.trim(),
            imageUrl: item.imageUrl.trim(),
        }))
        .filter((item) => item.title || item.institution || item.period || item.description || item.imageUrl);
    const educationPages = paginate(educationItems, 1);
    const hasEducation = educationItems.length > 0;
    const educationHtml = educationPages
        .map((pageItems, pageIndex) => `
          <div class="page-item" data-page="${pageIndex + 1}">
            ${pageItems.map((item) => {
                const searchSource = `${item.title} ${item.institution} ${item.period} ${item.description}`.toLowerCase();
                return `
              <article class="item-card">
                <div data-search="${escapeHtml(searchSource)}"></div>
                ${item.title ? `<h3>${escapeHtml(item.title)}</h3>` : ''}
                ${item.institution ? `<p class="item-meta">${escapeHtml(item.institution)}</p>` : ''}
                ${item.period ? `<p class="item-period">${escapeHtml(item.period)}</p>` : ''}
                ${isValidHttpUrl(item.imageUrl) ? `<div class="item-image-wrap"><img class="item-image" src="${escapeHtml(item.imageUrl)}" alt="${item.title ? escapeHtml(item.title) : 'Certificate'}" loading="lazy" /></div>` : ''}
                ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
              </article>`;
            }).join('')}
          </div>`)
        .join('');

    const experienceItems = formData.experienceItems
        .map((item) => ({
            role: item.role.trim(),
            company: item.company.trim(),
            period: item.period.trim(),
            description: item.description.trim(),
            current: item.current,
        }))
        .filter((item) => item.role || item.company || item.period || item.description);
    const experiencePages = paginate(experienceItems, 1);
    const hasExperience = experienceItems.length > 0;
    const experienceHtml = experiencePages
        .map((pageItems, pageIndex) => {
            const item = pageItems[0];
            const searchSource = `${item.role} ${item.company} ${item.period} ${item.description}`.toLowerCase();
            return `
          <div class="page-item" data-page="${pageIndex + 1}" data-search="${escapeHtml(searchSource)}">
            <article class="item-card">
              ${item.role ? `<h3>${escapeHtml(item.role)}</h3>` : ''}
              ${item.company ? `<p class="item-meta">${escapeHtml(item.company)}</p>` : ''}
              ${(item.period || item.current) ? `<p class="item-period">${escapeHtml(item.period || '')}${item.current ? ` • ${currentLabel}` : ''}</p>` : ''}
              ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
            </article>
          </div>`;
        })
        .join('');

    const skills = formData.skills
        .map((skill) => skill.trim())
        .filter(Boolean);
    const skillsPages = paginate(skills, 12);
    const hasSkills = skills.length > 0;
    const skillsHtml = skillsPages
        .map((pageItems, pageIndex) => {
            const searchSource = pageItems.join(' ').toLowerCase();
            return `
          <div class="page-item" data-page="${pageIndex + 1}" data-search="${escapeHtml(searchSource)}">
            <div class="chips">
              ${pageItems.map((skill) => `<span class="chip">${escapeHtml(skill)}</span>`).join('')}
            </div>
          </div>`;
        })
        .join('');

    const contactEmail = formData.contact.email.trim();
    const contactPhone = formData.contact.phone.trim();
    const contactLocation = formData.contact.location.trim();
    const contactWebsite = formData.contact.website.trim();
    const contactWebsiteLabel = formData.contact.websiteLabel.trim();
    const websiteDisplayText = contactWebsiteLabel || contactWebsite;
    const contactHtml = [
        contactEmail ? `<p><strong>E-mail:</strong> ${escapeHtml(contactEmail)}</p>` : '',
        contactPhone ? `<p><strong>Phone:</strong> ${escapeHtml(contactPhone)}</p>` : '',
        contactLocation ? `<p><strong>Location:</strong> ${escapeHtml(contactLocation)}</p>` : '',
        isValidHttpUrl(contactWebsite) ? `<p><strong>Website:</strong> <a href="${escapeHtml(contactWebsite)}" target="_blank" rel="noopener noreferrer">${escapeHtml(websiteDisplayText)}</a></p>` : '',
    ].filter(Boolean).join('');
    const hasContact = Boolean(contactHtml);
    const hasAbout = Boolean(about || socialHtml);

    const hasEducationPagination = educationPages.length > 1;
    const hasSkillsPagination = skillsPages.length > 1;
    const hasExperiencePagination = experiencePages.length > 1;

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
body{margin:0;min-height:100vh;background:var(--bg);color:var(--text);font-family:Inter,Segoe UI,Arial,sans-serif}
.page{min-height:100vh;padding:clamp(12px,2vw,28px);display:flex;justify-content:center;align-items:center;position:relative;overflow:hidden}
.bg{position:absolute;inset:0;pointer-events:none;z-index:0;opacity:.9}
.shell{
  width:min(100%, ${Math.max(template.layout.containerMaxWidth, 1160)}px);background:var(--surface);border:1px solid var(--border);border-radius:24px;
  padding:clamp(16px,2.2vw,32px);box-shadow:var(--shadow);position:relative;z-index:1;text-align:center
}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}
.theme-toggle{border:1px solid var(--border);background:var(--surface);color:var(--text);width:40px;height:40px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
.hero{margin-top:18px;display:flex;flex-direction:column;gap:20px;align-items:center;justify-content:center}
.hero-media{width:min(100%,420px);aspect-ratio:1/1;margin:0 auto;border:1px solid var(--border);border-radius:${imageRadius};background:var(--chip);overflow:hidden;display:flex;align-items:center;justify-content:center}
.hero-image{width:100%;height:100%;object-fit:cover}
h1{margin:0;font-size:clamp(1.8rem,3vw,2.6rem)}
.about{margin:10px auto 0;color:var(--muted);line-height:1.6;white-space:pre-wrap;max-width:78ch}
.social{margin-top:14px;display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.social-link{display:inline-flex;padding:8px 12px;border-radius:999px;background:var(--primary);color:var(--primaryText);text-decoration:none;font-weight:700}
.sections{margin-top:20px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.sections{display:flex;flex-direction:column}
.section{border:1px solid var(--border);border-radius:16px;padding:14px;background:color-mix(in srgb,var(--surface) 85%, var(--chip) 15%)}
.section h2{margin:0 0 10px;font-size:1.05rem}
.items{display:flex;flex-direction:column;gap:10px}
.item-card{border:1px solid var(--border);border-radius:12px;padding:10px;background:var(--surface)}
.item-card h3{margin:0 0 6px;font-size:1rem}
.item-card p{margin:0;color:var(--muted);line-height:1.5}
.item-image-wrap{margin:8px 0;display:flex;justify-content:center}
.item-image{width:min(100%,320px);max-height:180px;object-fit:cover;border-radius:10px;border:1px solid var(--border)}
.item-meta{font-weight:700;color:var(--text)!important}
.item-period{font-size:.92rem;margin-bottom:4px!important}
.chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.chip{background:var(--chip);border:1px solid var(--border);border-radius:999px;padding:6px 10px;font-weight:600}
.pager-body{display:flex;flex-direction:column;gap:10px}
.page-item{display:none}
.page-empty{margin:0;color:var(--muted)}
.pager-controls{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:10px}
.pager-button{
  border:1px solid var(--border);background:var(--surface);color:var(--text);
  border-radius:10px;padding:8px 12px;min-width:100px;cursor:pointer;font-weight:700;
}
.pager-button:disabled{opacity:.45;cursor:not-allowed}
.page-indicator-wrap{color:var(--muted);font-weight:700}
.filter-row{display:grid;gap:6px;margin-bottom:8px}
.filter-input{
  width:100%;padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);
}
.footer{margin-top:18px;padding-top:14px;border-top:1px solid var(--border);text-align:center;color:var(--muted)}
.hover-lift .social-link:hover{transform:translateY(-2px)}
.hover-glow .social-link:hover{box-shadow:0 0 0 2px color-mix(in srgb,var(--primary) 42%, transparent 58%),0 0 24px color-mix(in srgb,var(--primary) 42%, transparent 58%)}
.hover-outline .social-link:hover{background:transparent;color:var(--text);border:1px solid var(--primary)}
.hover-pulse .social-link:hover{animation:pulse .85s ease}
.bg-aurora{background:radial-gradient(55% 45% at 20% 20%, color-mix(in srgb,var(--primary) 26%, transparent 74%), transparent 70%),radial-gradient(45% 35% at 80% 20%, color-mix(in srgb,var(--chip) 55%, transparent 45%), transparent 75%),radial-gradient(60% 50% at 50% 100%, color-mix(in srgb,var(--primary) 20%, transparent 80%), transparent 70%);animation:bgDrift 16s ease-in-out infinite alternate}
.bg-mesh{background:linear-gradient(120deg, color-mix(in srgb,var(--primary) 14%, transparent 86%), transparent 45%),linear-gradient(300deg, color-mix(in srgb,var(--chip) 34%, transparent 66%), transparent 40%);background-size:180% 180%;animation:bgShift 14s ease-in-out infinite}
.bg-grid{background-image:linear-gradient(color-mix(in srgb,var(--border) 45%, transparent 55%) 1px, transparent 1px),linear-gradient(90deg, color-mix(in srgb,var(--border) 45%, transparent 55%) 1px, transparent 1px);background-size:28px 28px;mask-image:radial-gradient(circle at center, #000 52%, transparent 100%);animation:gridMove 24s linear infinite}
.bg-stars{background:radial-gradient(2px 2px at 12% 18%, color-mix(in srgb,var(--text) 65%, transparent 35%), transparent 60%),radial-gradient(1.5px 1.5px at 64% 30%, color-mix(in srgb,var(--text) 55%, transparent 45%), transparent 60%),radial-gradient(1.8px 1.8px at 80% 80%, color-mix(in srgb,var(--text) 45%, transparent 55%), transparent 60%),radial-gradient(1.2px 1.2px at 22% 72%, color-mix(in srgb,var(--text) 55%, transparent 45%), transparent 60%);animation:twinkle 3.8s ease-in-out infinite alternate}
.bg-waves{background:radial-gradient(80% 35% at 50% 120%, color-mix(in srgb,var(--primary) 22%, transparent 78%), transparent 70%),radial-gradient(75% 34% at 50% -20%, color-mix(in srgb,var(--chip) 42%, transparent 58%), transparent 70%);animation:waveFlow 12s ease-in-out infinite alternate}
.bg-spotlight{background:radial-gradient(42% 42% at 22% 18%, color-mix(in srgb,var(--primary) 25%, transparent 75%), transparent 72%),radial-gradient(38% 38% at 78% 82%, color-mix(in srgb,var(--chip) 50%, transparent 50%), transparent 72%);animation:spotlightMove 14s ease-in-out infinite alternate}
@keyframes bgDrift{0%{transform:translate3d(0,0,0) scale(1)}100%{transform:translate3d(0,-10px,0) scale(1.04)}}
@keyframes bgShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes gridMove{from{background-position:0 0,0 0}to{background-position:0 28px,28px 0}}
@keyframes twinkle{from{opacity:.42}to{opacity:.95}}
@keyframes waveFlow{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-8px) scale(1.04)}}
@keyframes spotlightMove{0%{transform:translateX(-6px)}100%{transform:translateX(8px)}}
@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.02)}100%{transform:scale(1)}}
@media (max-width:980px){
  .shell{width:100%}
}
</style>
</head>
<body>
  <main class="page hover-${hoverEffect}">
    <div class="bg bg-${bgEffect}"></div>
    <section class="shell">
      <header class="head">
        <h1>${title}</h1>
        ${mode === 'auto' ? `<button class="theme-toggle" id="theme-toggle-btn" aria-label="${toggleTitle}" title="${toggleTitle}" type="button"><span id="theme-toggle-icon"></span></button>` : ''}
      </header>
      <section class="hero">
        ${imageHtml}
        <div>
          ${hasAbout ? `<h2>${sectionAbout}</h2>` : ''}
          ${about ? `<p class="about">${about}</p>` : ''}
          ${socialHtml ? `<div class="social">${socialHtml}</div>` : ''}
        </div>
      </section>
      <section class="sections">
        ${hasEducation ? `<article class="section pager-section" data-section="education">
          <h2>${sectionEducation}</h2>
          ${hasEducationPagination ? `<div class="filter-row">
            <label for="education-search">${educationFilterLabel}</label>
            <input id="education-search" class="filter-input section-search" type="search" placeholder="${educationFilterPlaceholder}" />
          </div>` : ''}
          <div class="pager-body">
            ${educationHtml}
          </div>
          ${hasEducationPagination ? `<div class="pager-controls">
            <button type="button" class="pager-button" data-prev>${previousLabel}</button>
            <span class="page-indicator-wrap">${pageLabel}: <span class="page-indicator"></span></span>
            <button type="button" class="pager-button" data-next>${nextLabel}</button>
          </div>` : ''}
        </article>` : ''}
        ${hasSkills ? `<article class="section pager-section" data-section="skills">
          <h2>${sectionSkills}</h2>
          ${hasSkillsPagination ? `<div class="filter-row">
            <label for="skills-search">${skillsFilterLabel}</label>
            <input id="skills-search" class="filter-input section-search" type="search" placeholder="${skillsFilterPlaceholder}" />
          </div>` : ''}
          <div class="pager-body">
            ${skillsHtml}
          </div>
          ${hasSkillsPagination ? `<div class="pager-controls">
            <button type="button" class="pager-button" data-prev>${previousLabel}</button>
            <span class="page-indicator-wrap">${pageLabel}: <span class="page-indicator"></span></span>
            <button type="button" class="pager-button" data-next>${nextLabel}</button>
          </div>` : ''}
        </article>` : ''}
        ${hasExperience ? `<article class="section pager-section" data-section="experience">
          <h2>${sectionExperience}</h2>
          ${hasExperiencePagination ? `<div class="filter-row">
            <label for="experience-search">${experienceFilterLabel}</label>
            <input id="experience-search" class="filter-input section-search" type="search" placeholder="${experienceFilterPlaceholder}" />
          </div>` : ''}
          <div class="pager-body">
            ${experienceHtml}
          </div>
          ${hasExperiencePagination ? `<div class="pager-controls">
            <button type="button" class="pager-button" data-prev>${previousLabel}</button>
            <span class="page-indicator-wrap">${pageLabel}: <span class="page-indicator"></span></span>
            <button type="button" class="pager-button" data-next>${nextLabel}</button>
          </div>` : ''}
        </article>` : ''}
        ${hasContact ? `<article class="section">
          <h2>${sectionContact}</h2>
          ${contactHtml}
        </article>` : ''}
      </section>
      <footer class="footer">${footer}</footer>
    </section>
  </main>
  <script>
    (function(){
      var sections = Array.prototype.slice.call(document.querySelectorAll('.pager-section'));
      sections.forEach(function(section){
        var pages = Array.prototype.slice.call(section.querySelectorAll('.page-item'));
        var prevBtn = section.querySelector('[data-prev]');
        var nextBtn = section.querySelector('[data-next]');
        var indicator = section.querySelector('.page-indicator');
        var empty = section.querySelector('.page-empty');
        var searchInput = section.querySelector('.section-search');
        var filtered = pages.slice();
        var page = 1;

        function update(){
          var total = filtered.length;
          pages.forEach(function(item){ item.style.display = 'none'; });
          if(total === 0){
            if(empty){ empty.style.display = 'block'; }
            if(indicator){ indicator.textContent = '0/0'; }
            if(prevBtn){ prevBtn.disabled = true; }
            if(nextBtn){ nextBtn.disabled = true; }
            return;
          }
          if(page > total){ page = total; }
          if(page < 1){ page = 1; }
          if(empty){ empty.style.display = 'none'; }
          filtered[page - 1].style.display = 'block';
          if(indicator){ indicator.textContent = page + '/' + total; }
          if(prevBtn){ prevBtn.disabled = page <= 1; }
          if(nextBtn){ nextBtn.disabled = page >= total; }
        }

        if(prevBtn){
          prevBtn.addEventListener('click', function(){
            page -= 1;
            update();
          });
        }
        if(nextBtn){
          nextBtn.addEventListener('click', function(){
            page += 1;
            update();
          });
        }
        if(searchInput){
          searchInput.addEventListener('input', function(){
            var query = String(searchInput.value || '').toLowerCase().trim();
            if(!query){
              filtered = pages.slice();
              page = 1;
              update();
              return;
            }
            filtered = pages.filter(function(item){
              var pageSearch = String(item.getAttribute('data-search') || '');
              if(pageSearch.indexOf(query) !== -1){ return true; }
              var nested = Array.prototype.slice.call(item.querySelectorAll('[data-search]'));
              return nested.some(function(nestedNode){
                return String(nestedNode.getAttribute('data-search') || '').indexOf(query) !== -1;
              });
            });
            page = 1;
            update();
          });
        }
        update();
      });

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
          toggleBtn.setAttribute('aria-label','${switchToLight}');
          toggleBtn.setAttribute('title','${switchToLight}');
          toggleIcon.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3c0 .17-.01.34-.01.51A7.5 7.5 0 0 0 20.49 12c.17 0 .34 0 .51-.01Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          return;
        }
        toggleBtn.setAttribute('aria-label','${switchToDark}');
        toggleBtn.setAttribute('title','${switchToDark}');
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

