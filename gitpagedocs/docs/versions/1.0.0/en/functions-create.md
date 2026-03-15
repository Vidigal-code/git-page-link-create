# Create Function

The `/create` page is the main function hub of the app.

## What it does

- Accepts text input for HTML, Markdown, CSV, and TXT
- Accepts file upload for XLS/XLSX, DOCX/PPTX, image, PDF, video, and audio
- Compresses payloads before generating links
- Creates links for compact renderer aliases (`/r` and `/ra`)
- Supports source URL mode for large files

## Main user flow

1. Select content type
2. Paste text or upload file
3. Choose tool mode (normal, fullscreen, media, office, recovery, QR)
4. Generate link
5. Copy/open/share link

## Safety behavior

- Prevents generation when URL length exceeds configured limits
- Displays errors for invalid format or unsupported file type
- Uses browser-side operations only (no backend upload)
