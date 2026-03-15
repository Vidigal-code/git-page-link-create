# Chat Link Function

The `/chat-link/` feature stores chat transcripts inside URL hash.

## What it enables

- Share chat context without backend storage
- Keep message history in the link itself
- Reply to previous messages while preserving timeline

## Flow

1. Open `/chat-link/`
2. Send messages
3. App compresses transcript into URL hash
4. Share link
5. Other users open link and continue conversation

## Notes

- Large transcripts are limited by browser URL size
- App warns before exceeding safe limits
