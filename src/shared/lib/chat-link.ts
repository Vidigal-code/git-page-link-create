import { compress, decompress } from '@/shared/lib/compression';
import { withBasePath } from '@/shared/lib/basePath';
import { parseRecoveryHash } from '@/shared/lib/recovery';

export type ChatLinkMessage = {
    id: string;
    name: string;
    text: string;
    sentAtEpochMs: number;
    tzOffsetMinutes: number;
    replyToId?: string;
};

export type ChatLinkPayload = {
    v: 1;
    messages: ChatLinkMessage[];
};

const CHAT_TYPE_PREFIX = 'chat';

export function createEmptyChatPayload(): ChatLinkPayload {
    return { v: 1, messages: [] };
}

export function encodeChatPayload(payload: ChatLinkPayload): string {
    return compress(JSON.stringify(payload));
}

export function decodeChatPayload(compressed: string): ChatLinkPayload {
    const json = decompress(compressed);
    const parsed = JSON.parse(json) as unknown;

    if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid payload');
    }

    const v = (parsed as { v?: unknown }).v;
    const messages = (parsed as { messages?: unknown }).messages;

    if (v !== 1 || !Array.isArray(messages)) {
        throw new Error('Invalid payload');
    }

    // Best-effort validation/sanitization (keep link robust across versions)
    const safeMessages: ChatLinkMessage[] = messages
        .filter((m) => m && typeof m === 'object')
        .map((m) => {
            const obj = m as Record<string, unknown>;
            return {
                id: String(obj.id ?? ''),
                name: String(obj.name ?? ''),
                text: String(obj.text ?? ''),
                sentAtEpochMs: Number(obj.sentAtEpochMs ?? 0),
                tzOffsetMinutes: Number(obj.tzOffsetMinutes ?? 0),
                replyToId: obj.replyToId != null ? String(obj.replyToId) : undefined,
            };
        })
        .filter((m) => Boolean(m.id && m.name && m.text && Number.isFinite(m.sentAtEpochMs)));

    return { v: 1, messages: safeMessages };
}

export function buildChatLinkUrl(origin: string, compressedPayload: string): string {
    // NOTE: app is exported with `trailingSlash: true` (GitHub Pages friendly)
    const path = withBasePath('/chat-link/');
    return `${origin}${path}#d=${CHAT_TYPE_PREFIX}-${compressedPayload}`;
}

export function tryReadChatPayloadFromUrl(url: string): { payload: ChatLinkPayload; compressed: string } | null {
    const parsed = parseRecoveryHash(url);
    if (!parsed || parsed.type !== CHAT_TYPE_PREFIX) return null;
    if (!parsed.isCompressed || typeof parsed.data !== 'string') return null;

    try {
        const payload = decodeChatPayload(parsed.data);
        return { payload, compressed: parsed.data };
    } catch {
        return null;
    }
}

export function formatMessageTimestamp(
    message: Pick<ChatLinkMessage, 'sentAtEpochMs' | 'tzOffsetMinutes'>,
    locale: string
): string {
    // Preserve the sender's wall-time by neutralizing timezone differences.
    // sentAtEpochMs is absolute; senderLocal = epochMs - offsetMinutes.
    const senderWallTime = new Date(message.sentAtEpochMs - message.tzOffsetMinutes * 60_000);
    return new Intl.DateTimeFormat(locale, {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'UTC',
    }).format(senderWallTime);
}


