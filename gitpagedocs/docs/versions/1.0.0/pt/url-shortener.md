# Encurtador de URLs (URL Shortener)

Nossa plataforma implementa a funcionalidade de Encurtar Links visando fornecer URLs atrativas e rápidas aliadas a recursos empresariais (exibição contínua via redirecionador).

## Criação Base (`/shorturl`)
Ao acessar a base da ferramenta de Link Shortener, os usuários podem colar qualquer link extenso em uma interface simplificada, que interage com a nossa API nativa contida do repositório em `create/shorturl` para transladar a requisição de salvamento de estado do dado.

**1. Geração Automática vs Manual**
A ferramenta criará um Slug alfanumérico curto automaticamente (Ex: `/s/XkM8rW`). Porém, o usuário autenticado pode customizar a sub-linha final caso deseje um link nominal específico (Ex: `/s/PromocaoTech`).

**2. Integração com QR Code**
O projeto está configurado para emitir automaticamente `qrcodes` utilizando módulos de parser (como o pacote `qrcode`). Para cada link diminuído, o SVG ou a representação visual em imagem será passível de cópia para impressões, outdoors ou anexos digitais.

## Como o Redirecionamento Funciona (`/s/[slug]`)
Na arquitetura do `GitPageLinkCreate` o diretório estático aninhado sobre a página root intercepta as chamadas que se enquadrem sob o prefixo configurado. Ele decodifica a instrução base no servidor e gera o HTTP _302 Found_ repassando o cliente a nova plataforma ou link extenso, validando analítica de uso no contorno.
