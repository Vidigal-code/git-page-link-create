import React, { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input, TextArea } from '@/shared/ui/Input';
import { useI18n } from '@/shared/lib/i18n';
import { getMaxUrlLength } from '@/shared/lib/theme';
import {
    ChatLinkMessage,
    ChatLinkPayload,
    buildChatLinkUrl,
    createEmptyChatPayload,
    encodeChatPayload,
    formatMessageTimestamp,
    tryReadChatPayloadFromUrl,
} from '@/shared/lib/chat-link';
import {
    Bubble,
    BubbleHeader,
    BubbleMeta,
    BubbleName,
    BubbleText,
    ChatShell,
    Composer,
    EmptyState,
    FieldGrid,
    IntroText,
    LinkBox,
    MessageRow,
    Messages,
    PageContainer,
    Quote,
    QuoteName,
    QuoteText,
    ReplyBar,
    ReplyText,
    SmallNote,
    TopBar,
    TopBarLeft,
} from '@/shared/styles/pages/chat-link.styles';

type ReplyTarget = { id: string } | null;

function newId(): string {
    // Short, URL-friendly, stable enough for a link-based transcript
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function isNonEmpty(value: string): boolean {
    return value.trim().length > 0;
}

export default function ChatLinkPage() {
    const { t, locale } = useI18n();

    const [payload, setPayload] = useState<ChatLinkPayload>(createEmptyChatPayload());
    const [name, setName] = useState('Kauan Vidigal');
    const [message, setMessage] = useState('');
    const [replyTo, setReplyTo] = useState<ReplyTarget>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [isHydratedFromUrl, setIsHydratedFromUrl] = useState(false);

    const messagesRef = useRef<HTMLDivElement | null>(null);

    const shareLink = useMemo(() => {
        if (typeof window === 'undefined') return '';
        const compressed = encodeChatPayload(payload);
        return buildChatLinkUrl(window.location.origin, compressed);
    }, [payload]);

    const replyTargetMessage = useMemo(() => {
        if (!replyTo) return null;
        return payload.messages.find((m) => m.id === replyTo.id) ?? null;
    }, [replyTo, payload.messages]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const read = tryReadChatPayloadFromUrl(window.location.href);
        if (read) {
            setPayload(read.payload);
        }
        // Important in dev (React StrictMode): avoid overwriting the incoming URL
        // before we have a chance to read/decode it.
        setIsHydratedFromUrl(true);
    }, []);

    useEffect(() => {
        // Keep transcript in the URL (no server/db)
        if (typeof window === 'undefined') return;
        if (!isHydratedFromUrl) return;
        setError('');

        try {
            const compressed = encodeChatPayload(payload);
            const url = buildChatLinkUrl(window.location.origin, compressed);
            if (url.length > getMaxUrlLength()) {
                setError(t('chatLink.urlTooLong'));
                return;
            }
            window.history.replaceState({}, '', url);
        } catch {
            setError(t('chatLink.invalidData'));
        }
    }, [payload, t, isHydratedFromUrl]);

    useEffect(() => {
        // Auto-scroll to bottom on new messages
        const el = messagesRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [payload.messages.length]);

    const handleSend = () => {
        setCopied(false);
        setError('');

        if (!isNonEmpty(name) || !isNonEmpty(message)) {
            setError(t('chatLink.validationError'));
            return;
        }

        const now = new Date();
        const next: ChatLinkMessage = {
            id: newId(),
            name: name.trim(),
            text: message.trim(),
            sentAtEpochMs: now.getTime(),
            tzOffsetMinutes: now.getTimezoneOffset(),
            replyToId: replyTo?.id ?? undefined,
        };

        // Never allow a message that would exceed URL limits (otherwise the context can't be shared).
        if (typeof window !== 'undefined') {
            const nextPayload: ChatLinkPayload = { v: 1, messages: [...payload.messages, next] };
            const compressed = encodeChatPayload(nextPayload);
            const nextUrl = buildChatLinkUrl(window.location.origin, compressed);
            if (nextUrl.length > getMaxUrlLength()) {
                setError(t('chatLink.urlTooLong'));
                return;
            }
        }

        setPayload((prev) => ({ v: 1, messages: [...prev.messages, next] }));
        setMessage('');
        setReplyTo(null);
    };

    const handleCopy = async () => {
        if (!shareLink) return;
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        } catch {
            // ignore
        }
    };

    const handleOpenLink = () => {
        if (!shareLink) return;
        window.open(shareLink, '_blank', 'noopener,noreferrer');
    };

    const handleClear = () => {
        setPayload(createEmptyChatPayload());
        setReplyTo(null);
        setMessage('');
        setError('');
        setCopied(false);
    };

    const isMine = (m: ChatLinkMessage) => m.name.trim().toLowerCase() === name.trim().toLowerCase();

    return (
        <>
            <Head>
                <title>{t('chatLink.title')} - {t('common.appName')}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <PageContainer>
                <Card title={t('chatLink.title')}>
                    <IntroText>{t('chatLink.description')}</IntroText>
                </Card>

                <Card title={t('chatLink.shareTitle')}>
                    <TopBar>
                        <TopBarLeft>
                            <Button onClick={handleCopy} variant="secondary">
                                {copied ? t('chatLink.copied') : t('chatLink.copyLink')}
                            </Button>
                            <Button onClick={handleOpenLink} variant="secondary">
                                {t('chatLink.openLink')}
                            </Button>
                            <Button onClick={handleClear} variant="secondary" style={{ borderColor: '#d32f2f', color: '#d32f2f' }}>
                                {t('chatLink.clear')}
                            </Button>
                            {error && <SmallNote>{error}</SmallNote>}
                        </TopBarLeft>
                        <SmallNote>{t('chatLink.shareHint')}</SmallNote>
                    </TopBar>
                    <div style={{ marginTop: '12px' }}>
                        <LinkBox>{shareLink}</LinkBox>
                    </div>
                </Card>

                <Card title={t('chatLink.chatTitle')}>
                    <ChatShell>
                        <Messages ref={messagesRef}>
                            {payload.messages.length === 0 ? (
                                <EmptyState>{t('chatLink.empty')}</EmptyState>
                            ) : (
                                payload.messages.map((m) => {
                                    const mine = isMine(m);
                                    const replied = m.replyToId
                                        ? payload.messages.find((x) => x.id === m.replyToId) ?? null
                                        : null;
                                    return (
                                        <MessageRow key={m.id} $mine={mine}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: mine ? 'flex-end' : 'flex-start' }}>
                                                <Bubble $mine={mine}>
                                                    {replied && (
                                                        <Quote>
                                                            <QuoteName>{replied.name}</QuoteName>
                                                            <QuoteText>{replied.text}</QuoteText>
                                                        </Quote>
                                                    )}
                                                    <BubbleHeader>
                                                        <BubbleName>{m.name}</BubbleName>
                                                        <BubbleMeta>{formatMessageTimestamp(m, locale)}</BubbleMeta>
                                                    </BubbleHeader>
                                                    <BubbleText>{m.text}</BubbleText>
                                                </Bubble>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <Button
                                                        onClick={() => setReplyTo({ id: m.id })}
                                                        variant="secondary"
                                                        style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                                                    >
                                                        {t('chatLink.reply')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </MessageRow>
                                    );
                                })
                            )}
                        </Messages>

                        <Composer>
                            {replyTargetMessage && (
                                <ReplyBar>
                                    <ReplyText>
                                        {t('chatLink.replyingTo')} <strong>{replyTargetMessage.name}</strong>: {replyTargetMessage.text}
                                    </ReplyText>
                                    <Button onClick={() => setReplyTo(null)} variant="secondary" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
                                        {t('chatLink.cancelReply')}
                                    </Button>
                                </ReplyBar>
                            )}

                            <FieldGrid>
                                <Input
                                    label={t('chatLink.nameLabel')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('chatLink.namePlaceholder')}
                                />
                                <TextArea
                                    label={t('chatLink.messageLabel')}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={t('chatLink.messagePlaceholder')}
                                    rows={3}
                                />
                                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <Button onClick={handleSend} disabled={!isNonEmpty(name) || !isNonEmpty(message)}>
                                        {t('chatLink.send')}
                                    </Button>
                                </div>
                            </FieldGrid>
                        </Composer>
                    </ChatShell>
                </Card>
            </PageContainer>
        </>
    );
}


