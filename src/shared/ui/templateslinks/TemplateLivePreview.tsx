import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Card } from '@/shared/ui/Card';

interface TemplateLivePreviewProps {
    title: string;
    html: string;
}

const Frame = styled.iframe`
  width: 100%;
  min-height: 560px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 14px;
  background: #fff;

  @media (max-width: 900px) {
    min-height: 480px;
  }
`;

export const TemplateLivePreview: React.FC<TemplateLivePreviewProps> = ({ title, html }) => {
    const srcDoc = useMemo(() => html, [html]);

    return (
        <Card title={title}>
            <Frame srcDoc={srcDoc} title={title} />
        </Card>
    );
};

