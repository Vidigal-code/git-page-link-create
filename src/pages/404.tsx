import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styled from 'styled-components';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/shared/lib/i18n';
import { BASE_PATH, withBasePath } from '@/shared/lib/basePath';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

function getRecoveryTargetFromWindowLocation(): string | null {
  if (typeof window === 'undefined') return null;

  const normalizedBase = BASE_PATH.startsWith('/') ? BASE_PATH : `/${BASE_PATH}`;
  const cleanBase = normalizedBase.endsWith('/') ? normalizedBase.slice(0, -1) : normalizedBase;
  let path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search || '');
  const z = searchParams.get('z'); // silent/instant flag for shared links (z=1 or z=0)

  if (cleanBase && path.startsWith(cleanBase)) {
    path = path.slice(cleanBase.length);
  }

  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  const isRenderAll = path.startsWith('/render-all/') || path.startsWith('/ra/');
  const isRender = path.startsWith('/render/') || path.startsWith('/r/');
  const isShortUrl = path.startsWith('/shorturl/');
  const isShortUrlCompact = path.startsWith('/s/');
  const prefix = isRenderAll ? (path.startsWith('/ra/') ? '/ra/' : '/render-all/') : isRender ? (path.startsWith('/r/') ? '/r/' : '/render/') : '';

  if (!prefix && !isShortUrl && !isShortUrlCompact) return null;

  const slug = (
    isShortUrlCompact
      ? path.slice('/s/'.length)
      : isShortUrl
        ? path.slice('/shorturl/'.length)
        : path.slice(prefix.length)
  ).replace(/\/$/, '');
  if (!slug) return null;

  if (isShortUrl || isShortUrlCompact) {
    // Never put the code in the query string (can hit URI length limits on large payloads).
    // Keep `z` in query (small) and put the code in the hash (not sent to server).
    const zQuery = z === '1' || z === '0' ? `?z=${z}` : '';
    return withBasePath(`/shorturl/${zQuery}#c=${slug}`);
  }

  // Prefer shortest alias targets
  const renderSuffix = z === '1' || z === '0' ? `&z=${z}` : '';
  return withBasePath(`/${isRenderAll ? 'ra/' : 'r/'}?d=${slug}${renderSuffix}`);
}

export default function Custom404() {
    const { t } = useI18n();

  const [recoveryTarget] = useState<string | null>(() => getRecoveryTargetFromWindowLocation());
  const isRecovering = Boolean(recoveryTarget);
  const isSilent = typeof window !== 'undefined' && new URLSearchParams(window.location.search || '').get('z') === '1';

  useEffect(() => {
    if (!recoveryTarget || typeof window === 'undefined') return;
    // Replace immediately to avoid showing the 404 UI for recoverable deep-links
    window.location.replace(recoveryTarget);
  }, [recoveryTarget]);

  if (isRecovering) {
    // Silent mode: don't show any UI while we replace the URL.
    if (isSilent) return null;
    return (
      <Container>
        <Head>
          <title>Redirecting... - {t('common.appName')}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Title>{t('shorturlDecoder.redirectingTitle')}</Title>
        <Description>{t('shorturlDecoder.description')}</Description>
      </Container>
    );
  }

    return (
        <Container>
            <Head>
                <title>{t('notFound.title')} - {t('common.appName')}</title>
            </Head>
            <Title>404</Title>
            <Description>{t('notFound.description')}</Description>
            <ButtonGroup>
                <Button onClick={() => window.history.back()} variant="secondary">
                    {t('notFound.goBack')}
                </Button>
                <Link href="/" passHref legacyBehavior>
                    <Button as="a">{t('notFound.backHome')}</Button>
                </Link>
            </ButtonGroup>
        </Container>
    );
}
