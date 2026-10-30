# Página de links e perfil

/create-links recebe profileName, profileBio, bioFonts, avatarUrl, websiteUrl/websiteLabel, mode e uma lista de links sociais com id/platform/url. O editor permite escolher template e visualizar o resultado antes da geração.

loadTemplatesLinks carrega modelos; buildTemplateLinksHtml monta o HTML; generateHtmlRenderAllLink cria um link autocontido para o renderizador. O estado de formulário e saída permanece no cliente. Não existe perfil salvo em banco ou painel de analytics.

Confira URLs de cada rede, imagem remota, texto alternativo e visualização móvel. Alterar o formulário exige distribuir o novo link; quem tem o snapshot anterior continua com a versão anterior.

## Código e navegação

- [src/pages/create-links.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/create-links.tsx)
- [src/features/render-all/lib/generateHtmlRenderAllLink.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/features/render-all/lib/generateHtmlRenderAllLink.ts)

- [Project guide](?menu=pt&lang=pt&id=9)
- [Source reference](?menu=pt&lang=pt&id=10)
