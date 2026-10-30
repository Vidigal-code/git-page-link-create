# Conversación compartida por enlace

/chat-link mantiene un transcript local. No envía mensajes a WhatsApp ni tiene servidor de chat en tiempo real. Cada edición genera otro enlace con un snapshot; copias compartidas no se actualizan automáticamente.

El usuario introduce nombre/texto y puede responder a un mensaje. ChatLinkPayload usa v:1 y messages; cada mensaje contiene id, name, text, sentAtEpochMs, tzOffsetMinutes y replyToId opcional. encodeChatPayload serializa JSON y aplica gzip/Base64URL. buildChatLinkUrl genera /chat-link/#d=chat-<payload> respetando basePath.

Al abrir se ejecuta tryReadChatPayloadFromUrl. decodeChatPayload exige versión 1 y array, normaliza campos y descarta entradas sin ID/nombre/texto o timestamp finito. Un payload inválido devuelve null al recuperar. La hora conserva el huso del autor. La página comprueba longitud URL antes de añadir mensajes.

El receptor puede leer el transcript; identidad no verificada y contenido no cifrado. IDs/nombres no prueban autoría. Compruebe respuestas, horarios y longitud antes de compartir.

## Código y navegación

- [src/pages/chat-link.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/chat-link.tsx)
- [src/shared/lib/chat-link.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/shared/lib/chat-link.ts)
- [src/shared/lib/compression.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/shared/lib/compression.ts)

- [Project guide](?menu=es&lang=es&id=9)
- [Source reference](?menu=es&lang=es&id=10)
