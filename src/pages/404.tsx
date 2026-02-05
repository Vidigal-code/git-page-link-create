import Link from 'next/link';
import Head from 'next/head';
import styled from 'styled-components';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/shared/lib/i18n';

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
