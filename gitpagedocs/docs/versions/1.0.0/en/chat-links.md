# Link-based conversation

/chat-link maintains a local message transcript. It does not send WhatsApp messages or run a real-time chat server. Each edit produces another link containing a snapshot; previously shared copies do not update automatically.

Users enter name/text and can reply to an existing message. ChatLinkPayload uses v:1 and messages; each message has id, name, text, sentAtEpochMs, tzOffsetMinutes and optional replyToId. encodeChatPayload serializes JSON and applies gzip/Base64URL. buildChatLinkUrl produces /chat-link/#d=chat-<payload> with basePath support.

Opening the link invokes tryReadChatPayloadFromUrl. decodeChatPayload requires version 1 and an array, normalizes fields and drops entries without ID/name/text or a finite timestamp. Invalid payloads return null during recovery. Display preserves the author's wall time. The page checks URL length before appending messages.

Recipients can read the transcript; identity is unverified and content is not encrypted. IDs/names are presentation data, not authorship proof. Check replies, timestamps and URL length before sharing.

## Code and navigation

- [src/pages/chat-link.tsx](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/pages/chat-link.tsx)
- [src/shared/lib/chat-link.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/shared/lib/chat-link.ts)
- [src/shared/lib/compression.ts](https://github.com/Vidigal-code/git-page-link-create/blob/809f77e8fe2bd6c78a223db28a4c5e42973a0d91/src/shared/lib/compression.ts)

- [Project guide](?menu=en&lang=en&id=9)
- [Source reference](?menu=en&lang=en&id=10)
