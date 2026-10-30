# Conversa compartilhada por link

A página /chat-link mantém um transcript local de mensagens. Não envia mensagens ao WhatsApp nem possui servidor de chat em tempo real. Cada edição produz outro link com um snapshot; cópias já compartilhadas não recebem atualizações automaticamente.

O usuário informa nome/texto e pode responder a uma mensagem existente. O modelo ChatLinkPayload usa v:1 e messages; cada mensagem contém id, name, text, sentAtEpochMs, tzOffsetMinutes e replyToId opcional. encodeChatPayload serializa JSON e aplica gzip/Base64URL. buildChatLinkUrl produz /chat-link/#d=chat-<payload>, respeitando o basePath.

Ao abrir o link, tryReadChatPayloadFromUrl valida o prefixo e tenta decodificar. decodeChatPayload exige versão 1 e array, normaliza campos e descarta entradas sem ID/nome/texto ou timestamp finito. Payload inválido resulta em recuperação nula. O horário exibido preserva o fuso do autor. A página verifica limite de URL antes de acrescentar mensagens.

O transcript é legível para quem recebe o link, não tem identidade verificada e não é criptografado. IDs e nomes servem à apresentação; não provam autoria. Antes de compartilhar, confira respostas, horários e tamanho da URL.

## Código e navegação

- [src/pages/chat-link.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/chat-link.tsx)
- [src/shared/lib/chat-link.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/shared/lib/chat-link.ts)
- [src/shared/lib/compression.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/shared/lib/compression.ts)

- [Project guide](?menu=pt&lang=pt&id=9)
- [Source reference](?menu=pt&lang=pt&id=10)
