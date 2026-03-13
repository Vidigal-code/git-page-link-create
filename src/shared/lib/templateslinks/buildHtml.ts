import { LinksTemplate, SocialLinkInput, TemplateLinksFormData, TemplateMode } from './types';
import { getSocialPlatformLabel, isValidHttpUrl, normalizeSocialLink } from './socialPlatforms';

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function resolveMode(mode: TemplateMode): 'light' | 'dark' | 'auto' {
    if (mode === 'light' || mode === 'dark') return mode;
    return 'auto';
}

function getAvatarRadius(shape: LinksTemplate['layout']['avatarShape']): string {
    if (shape === 'circle') return '50%';
    if (shape === 'square') return '14px';
    return '22px';
}

function getLinksClass(style: LinksTemplate['layout']['style']): string {
    return style === 'grid' ? 'links links-grid' : 'links';
}

function getWrapperClass(style: LinksTemplate['layout']['style']): string {
    return `wrap style-${style}`;
}

function createSocialLinkItem(link: SocialLinkInput): string {
    const normalized = normalizeSocialLink(link);
    if (!isValidHttpUrl(normalized.url)) return '';

    const label = escapeHtml(getSocialPlatformLabel(normalized.platform, normalized.customLabel));
    const url = escapeHtml(normalized.url);
    return `<a class="social-link" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

interface BuildHtmlLocaleTexts {
    defaultWebsiteLabel?: string;
    emptyLinksText?: string;
    toggleTitle?: string;
    switchToLight?: string;
    switchToDark?: string;
}

export function buildTemplateLinksHtml(
    template: LinksTemplate,
    formData: TemplateLinksFormData,
    localeTexts: BuildHtmlLocaleTexts = {},
): string {
    const mode = resolveMode(formData.mode);
    const light = template.modes.light;
    const dark = template.modes.dark;
    const avatarRadius = getAvatarRadius(template.layout.avatarShape);
    const linksClass = getLinksClass(template.layout.style);
    const wrapperClass = getWrapperClass(template.layout.style);
    const backgroundEffect = template.effects?.backgroundEffect || 'aurora';
    const hoverEffect = template.effects?.hoverEffect || 'lift';
    const responsiveMaxWidth = Math.max(template.layout.containerMaxWidth, 980);
    const htmlLang = formData.locale || 'en';
    const defaultWebsiteLabel = localeTexts.defaultWebsiteLabel || 'Website';
    const emptyLinksText = localeTexts.emptyLinksText || 'No social links added.';
    const toggleTitle = localeTexts.toggleTitle || 'Toggle color theme';
    const switchToLight = localeTexts.switchToLight || 'Switch to light mode';
    const switchToDark = localeTexts.switchToDark || 'Switch to dark mode';
    const name = escapeHtml(formData.profileName || 'Meu Link');
    const bio = escapeHtml(formData.profileBio || '');
    const websiteLink = formData.websiteUrl
        ? normalizeSocialLink({ id: 'website', platform: 'website', url: formData.websiteUrl })
        : null;
    const linksHtml = formData.links
        .map(createSocialLinkItem)
        .filter(Boolean)
        .join('');
    const websiteHtml = websiteLink && isValidHttpUrl(websiteLink.url)
        ? `<a class="website-link" href="${escapeHtml(websiteLink.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(formData.websiteLabel?.trim() || defaultWebsiteLabel)}</a>`
        : '';
    const avatarHtml = formData.avatarUrl && isValidHttpUrl(formData.avatarUrl)
        ? `<img class="avatar" src="${escapeHtml(formData.avatarUrl)}" alt="${name}" loading="lazy" />`
        : '';

    return `<!doctype html>
<html lang="${escapeHtml(htmlLang)}" data-theme="${mode}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${name}</title>
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
  margin:0;padding:0;min-height:100vh;background:var(--bg);color:var(--text);
  font-family:Inter,Segoe UI,Arial,sans-serif;display:flex;justify-content:center;align-items:center;
}
.wrap{
  width:100%;min-height:100vh;padding:20px 14px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;
}
.bg-animated{
  position:absolute;inset:0;pointer-events:none;z-index:0;opacity:.95;
}
.content-shell{
  width:min(100%, ${responsiveMaxWidth}px);max-width:${responsiveMaxWidth}px;background:var(--surface);border:1px solid var(--border);
  border-radius:clamp(18px, 2.2vw, 28px);box-shadow:var(--shadow);padding:clamp(18px, 2.2vw, 34px);display:flex;flex-direction:column;align-items:center;text-align:center;
  animation:fadeInUp .45s ease-out;position:relative;z-index:2;
}
.avatar{
  width:clamp(82px, 9vw, 156px);height:clamp(82px, 9vw, 156px);border-radius:${avatarRadius};object-fit:cover;border:3px solid var(--chip);
  animation:avatarFloat 4.8s ease-in-out infinite;
}
.header{display:flex;align-items:center;justify-content:center;gap:clamp(12px, 1.8vw, 20px);flex-direction:column;width:100%;margin-bottom:clamp(16px, 2.2vw, 30px)}
.header-top{width:100%;display:flex;justify-content:flex-end}
.title{margin:0 0 clamp(10px, 1.4vw, 16px);font-size:clamp(1.65rem, 2.8vw, 2.4rem);line-height:1.15}
.bio{margin:0;color:var(--muted);font-size:clamp(1rem, 1.35vw, 1.24rem);line-height:1.45;max-width:82ch}
.website-link{
  display:inline-flex;max-width:100%;overflow-wrap:anywhere;word-break:break-word;color:var(--primary);
  text-decoration:none;font-size:clamp(0.95rem, 1.2vw, 1.08rem);padding:clamp(8px, 1.2vw, 12px) clamp(12px, 1.8vw, 18px);background:var(--chip);border-radius:999px;
  margin-bottom:clamp(14px, 2.2vw, 26px);
}
.links{display:flex;flex-direction:column;gap:clamp(10px, 1.4vw, 16px);width:100%;margin-top:clamp(8px, 1.6vw, 14px)}
.links-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(10px, 1.3vw, 14px)}
.social-link{
  text-decoration:none;display:flex;align-items:center;justify-content:center;text-align:center;
  min-height:clamp(46px, 6vh, 68px);padding:clamp(10px, 1.2vw, 14px);border-radius:clamp(12px, 1.6vw, 18px);background:var(--primary);color:var(--primaryText);font-weight:700;border:1px solid transparent;
  font-size:clamp(1rem, 1.15vw, 1.2rem);
  transition:transform .18s ease, opacity .18s ease, box-shadow .18s ease;
}
.hover-lift .social-link:hover{opacity:.92;transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.22)}
.hover-glow .social-link:hover{opacity:.95;transform:translateY(-1px);box-shadow:0 0 0 2px color-mix(in srgb,var(--primary) 40%, transparent 60%),0 0 24px color-mix(in srgb,var(--primary) 45%, transparent 55%)}
.hover-outline .social-link:hover{opacity:.95;background:transparent;color:var(--text);border-color:var(--primary)}
.hover-pulse .social-link:hover{animation:pulseSoft .8s ease}
.empty{
  background:var(--chip);border:1px dashed var(--border);border-radius:12px;padding:14px;color:var(--muted);text-align:center;
}
.theme-toggle{
  border:1px solid var(--border);background:var(--surface);color:var(--text);border-radius:999px;
  width:40px;height:40px;cursor:pointer;font-weight:700;font-size:.9rem;display:inline-flex;align-items:center;justify-content:center;
  transition:all .2s ease;
}
.theme-toggle:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(0,0,0,.2)}
.theme-icon{display:inline-flex;align-items:center;justify-content:center}
.style-glass .content-shell{backdrop-filter:blur(10px)}
.style-minimal .content-shell{border-radius:16px}
.style-grid .social-link{min-height:48px}
.style-stacked .social-link{border-radius:14px}
.style-glass .social-link{background:linear-gradient(135deg,var(--primary),color-mix(in srgb,var(--primary) 74%, #fff 26%))}
.style-minimal .social-link{box-shadow:none}
.style-grid .social-link{font-size:.95rem}
.style-grid .content-shell{position:relative;overflow:hidden}
.style-grid .content-shell:before{
  content:"";position:absolute;inset:auto -30% -70% -30%;height:220px;
  background:radial-gradient(circle at center, color-mix(in srgb,var(--primary) 28%, transparent 72%), transparent 70%);
  pointer-events:none;
}
.bg-aurora{
  background:
    radial-gradient(55% 45% at 20% 20%, color-mix(in srgb,var(--primary) 26%, transparent 74%), transparent 70%),
    radial-gradient(45% 35% at 80% 20%, color-mix(in srgb,var(--chip) 55%, transparent 45%), transparent 75%),
    radial-gradient(60% 50% at 50% 100%, color-mix(in srgb,var(--primary) 20%, transparent 80%), transparent 70%);
  animation:bgDrift 16s ease-in-out infinite alternate;
}
.bg-mesh{
  background:
    linear-gradient(120deg, color-mix(in srgb,var(--primary) 14%, transparent 86%), transparent 45%),
    linear-gradient(300deg, color-mix(in srgb,var(--chip) 34%, transparent 66%), transparent 40%);
  background-size:180% 180%;
  animation:bgShift 14s ease-in-out infinite;
}
.bg-grid{
  background-image:
    linear-gradient(color-mix(in srgb,var(--border) 45%, transparent 55%) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb,var(--border) 45%, transparent 55%) 1px, transparent 1px);
  background-size:28px 28px;
  mask-image:radial-gradient(circle at center, #000 52%, transparent 100%);
  animation:gridMove 24s linear infinite;
}
.bg-stars{
  background:
    radial-gradient(2px 2px at 12% 18%, color-mix(in srgb,var(--text) 65%, transparent 35%), transparent 60%),
    radial-gradient(1.5px 1.5px at 64% 30%, color-mix(in srgb,var(--text) 55%, transparent 45%), transparent 60%),
    radial-gradient(1.8px 1.8px at 80% 80%, color-mix(in srgb,var(--text) 45%, transparent 55%), transparent 60%),
    radial-gradient(1.2px 1.2px at 22% 72%, color-mix(in srgb,var(--text) 55%, transparent 45%), transparent 60%);
  animation:twinkle 3.8s ease-in-out infinite alternate;
}
.bg-waves{
  background:
    radial-gradient(80% 35% at 50% 120%, color-mix(in srgb,var(--primary) 22%, transparent 78%), transparent 70%),
    radial-gradient(75% 34% at 50% -20%, color-mix(in srgb,var(--chip) 42%, transparent 58%), transparent 70%);
  animation:waveFlow 12s ease-in-out infinite alternate;
}
.bg-spotlight{
  background:
    radial-gradient(42% 42% at 22% 18%, color-mix(in srgb,var(--primary) 25%, transparent 75%), transparent 72%),
    radial-gradient(38% 38% at 78% 82%, color-mix(in srgb,var(--chip) 50%, transparent 50%), transparent 72%);
  animation:spotlightMove 14s ease-in-out infinite alternate;
}
@keyframes fadeInUp{
  from{opacity:0;transform:translateY(8px)}
  to{opacity:1;transform:translateY(0)}
}
@keyframes bgDrift{
  0%{transform:translate3d(0,0,0) scale(1)}
  100%{transform:translate3d(0,-10px,0) scale(1.04)}
}
@keyframes bgShift{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@keyframes gridMove{
  from{background-position:0 0,0 0}
  to{background-position:0 28px,28px 0}
}
@keyframes twinkle{
  from{opacity:.42}
  to{opacity:.95}
}
@keyframes waveFlow{
  0%{transform:translateY(0) scale(1)}
  100%{transform:translateY(-8px) scale(1.04)}
}
@keyframes spotlightMove{
  0%{transform:translateX(-6px)}
  100%{transform:translateX(8px)}
}
@keyframes pulseSoft{
  0%{transform:scale(1)}
  50%{transform:scale(1.02)}
  100%{transform:scale(1)}
}
@keyframes avatarFloat{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-4px)}
}
@media (max-width:640px){
  .wrap{padding:12px 8px}
  .content-shell{padding:18px;border-radius:18px}
  .header{align-items:center}
  .links-grid{grid-template-columns:1fr}
}
@media (min-width:1600px){
  .wrap{padding:28px}
  .content-shell{width:min(96vw, 1180px)}
}
</style>
</head>
<body>
  <main class="${wrapperClass} hover-${hoverEffect}">
    <div class="bg-animated bg-${backgroundEffect}"></div>
    <section class="content-shell">
    <section class="header">
      ${mode === 'auto' ? `
      <div class="header-top">
        <button class="theme-toggle" type="button" id="theme-toggle-btn" aria-label="${escapeHtml(toggleTitle)}" title="${escapeHtml(toggleTitle)}">
          <span class="theme-icon" id="theme-toggle-icon"></span>
        </button>
      </div>` : ''}
      ${avatarHtml}
      <div>
        <h1 class="title">${name}</h1>
        ${bio ? `<p class="bio">${bio}</p>` : ''}
      </div>
    </section>
    ${websiteHtml}
    <section class="${linksClass}">
      ${linksHtml || `<div class="empty">${escapeHtml(emptyLinksText)}</div>`}
    </section>
    </section>
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

