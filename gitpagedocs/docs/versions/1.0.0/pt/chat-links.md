# Criador de Links para Chat (Chat Links)

A vertente em `chat-link.tsx` soluciona um dos maiores atritos em comunicação empresarial ou de funis B2C modernos: direcionar as pessoas do navegador comum para canais de conversa restritos (como WhatsApp, Telegram ou Messenger) com apenas um clique e preenchimento de mensagens padrão.

## Casos de Uso
1. **Páginas de Captura de Lead (Landing Pages):** Configurando o clique único no botão CTA (Call-to-Action) para invocar o Link de Chat já com a mensagem: "Olá, tenho interesse na sua Promoção Black Friday".
2. **Suporte Técnico Integrado:** Colado em tickets internos, o usuário acessa e diretamente envia os Logs para o número atrelado na conta Business.
3. **Conversões Rápidas:** Diferente de informar os números manualmente e gerar fricções, isto unifica em um QrCode visual todo o sistema de envio.

## Especificação de Plataformas
Módulos inclusos conseguem detectar os esquemas `app://` baseados no dispositivo móvel do usuário se o site for navegado via Android ou iOS (exemplo: `whatsapp://send?phone=X&text=Y`), criando as strings encodadas sem falharem ou quebrarem com acentuações ou limites. Na versão Web de Desk, a engine mapeia o redirecionamento fallback tradicional (ex: `web.whatsapp...` ou `t.me`).
