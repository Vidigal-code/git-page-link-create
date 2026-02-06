import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/shared/lib/i18n';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 30px;
  }
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 16px;
  ${({ theme }) => theme.animations.enableGlow && `
    text-shadow: 0 0 20px ${theme.colors.primary};
  `}

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.large};
    margin-bottom: 12px;
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.medium};
    padding: 0 10px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 340px));
  gap: 30px;
  margin-bottom: 30px;
  justify-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 320px));
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 20px;
    justify-content: center;
  }
`;

const FeatureCard = styled(Card)`
  text-align: center;
  width: 100%;
  max-width: 340px;

  @media (max-width: 768px) {
    padding: 20px;
    max-width: 100%;
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 12px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 12px;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.medium};
    margin-bottom: 8px;
  }
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.5;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  padding-bottom: 10px;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.medium};
    margin-bottom: 15px;
    padding-bottom: 8px;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 12px 0;
  color: ${({ theme }) => theme.colors.text};
  
  &:before {
    content: '▸ ';
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    padding: 10px 0;
    font-size: 14px;
  }
`;

const CTASection = styled.div`
  text-align: center;
  margin-top: 40px;

  @media (max-width: 768px) {
    margin-top: 30px;
  }
`;

export default function Home() {
  const { t } = useI18n();

  return (
    <>
      <Head>
        <title>{t('common.appName')} - {t('home.title')}</title>
        <meta name="description" content={t('home.whatIsDescription')} />
        <meta property="og:title" content={`${t('common.appName')} - ${t('home.title')}`} />
        <meta property="og:description" content={t('home.whatIsDescription')} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('common.appName')} - ${t('home.title')}`} />
        <meta name="twitter:description" content={t('home.whatIsDescription')} />
      </Head>

      <HomeContainer>
        <Hero>
          <Title>{t('home.title')}</Title>
          <Subtitle>{t('home.subtitle')}</Subtitle>
        </Hero>

        <Grid>
          <FeatureCard>
            <FeatureIcon>📄</FeatureIcon>
            <FeatureTitle>{t('home.html')}</FeatureTitle>
            <FeatureDescription>{t('home.htmlDesc')}</FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📝</FeatureIcon>
            <FeatureTitle>{t('home.markdown')}</FeatureTitle>
            <FeatureDescription>{t('home.markdownDesc')}</FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>{t('home.csv')}</FeatureTitle>
            <FeatureDescription>{t('home.csvDesc')}</FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🔳</FeatureIcon>
            <FeatureTitle>{t('home.qrTitle')}</FeatureTitle>
            <FeatureDescription>{t('home.qrDescription')}</FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🖼️</FeatureIcon>
            <FeatureTitle>{t('home.image')}</FeatureTitle>
            <FeatureDescription>{t('home.imageDesc')}</FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📎</FeatureIcon>
            <FeatureTitle>{t('home.pdf')}</FeatureTitle>
            <FeatureDescription>{t('home.pdfDesc')}</FeatureDescription>
          </FeatureCard>
        </Grid>

        <Section>
          <Card>
            <SectionTitle>{t('home.whatIs')}</SectionTitle>
            <p>{t('home.whatIsDescription')}</p>
          </Card>
        </Section>

        <Section>
          <Card>
            <SectionTitle>{t('home.howWorks')}</SectionTitle>
            <p>{t('home.howWorksDescription')}</p>
          </Card>
        </Section>

        <Section>
          <Card>
            <SectionTitle>{t('home.qrHowWorksTitle')}</SectionTitle>
            <p>{t('home.qrHowWorksDescription')}</p>
            <List>
              <ListItem>{t('home.qrFeatureGenerate')}</ListItem>
              <ListItem>{t('home.qrFeatureCustomize')}</ListItem>
              <ListItem>{t('home.qrFeatureExport')}</ListItem>
              <ListItem>{t('home.qrFeatureRenderLink')}</ListItem>
            </List>
          </Card>
        </Section>

        <Section>
          <Card>
            <SectionTitle>{t('home.limits')}</SectionTitle>
            <p>{t('home.limitsDescription')}</p>
            <List>
              <ListItem>{t('home.htmlLimit')}</ListItem>
              <ListItem>{t('home.markdownLimit')}</ListItem>
              <ListItem>{t('home.csvLimit')}</ListItem>
            </List>
            <p style={{ marginTop: '16px', fontStyle: 'italic' }}>{t('home.limitsNote')}</p>
          </Card>
        </Section>

        <Section>
          <Card>
            <SectionTitle>{t('home.useCases')}</SectionTitle>
            <List>
              <ListItem>{t('home.portfolio')}</ListItem>
              <ListItem>{t('home.showcase')}</ListItem>
              <ListItem>{t('home.sharing')}</ListItem>
            </List>
          </Card>
        </Section>

        <CTASection>
          <Link href="/create" passHref legacyBehavior>
            <Button as="a">{t('home.getStarted')}</Button>
          </Link>
        </CTASection>
      </HomeContainer>
    </>
  );
}
