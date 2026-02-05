import { useEffect } from 'react';
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

export default function Custom404() {
    const { t } = useI18n();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const normalizedBase = BASE_PATH.startsWith('/') ? BASE_PATH : `/${BASE_PATH}`;
    const cleanBase = normalizedBase.endsWith('/') ? normalizedBase.slice(0, -1) : normalizedBase;
    let path = window.location.pathname;

    if (cleanBase && path.startsWith(cleanBase)) {
      path = path.slice(cleanBase.length);
    }

    if (!path.startsWith('/')) {
      path = `/${path}`;
    }

    const isRenderAll = path.startsWith('/render-all/');
    const isRender = path.startsWith('/render/');
    const prefix = isRenderAll ? '/render-all/' : isRender ? '/render/' : '';

    if (!prefix) return;

    const slug = path.slice(prefix.length).replace(/\/$/, '');
    if (!slug) return;

    const target = withBasePath(`${isRenderAll ? 'render-all' : 'render'}?data=${slug}`);
    window.location.replace(target);
  }, []);

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
