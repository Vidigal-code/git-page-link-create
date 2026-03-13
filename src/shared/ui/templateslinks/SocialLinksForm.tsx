import React from 'react';
import styled from 'styled-components';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Select } from '@/shared/ui/Select';
import { SOCIAL_PLATFORMS, SocialLinkInput } from '@/shared/lib/templateslinks';
import { useI18n } from '@/shared/lib/i18n';

interface SocialLinksFormProps {
    title: string;
    addLabel: string;
    removeLabel: string;
    customLabelText: string;
    links: SocialLinkInput[];
    onAddLink: () => void;
    onRemoveLink: (id: string) => void;
    onChangeLink: (id: string, field: 'platform' | 'url' | 'customLabel', value: string) => void;
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Row = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 10px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const SocialLinksForm: React.FC<SocialLinksFormProps> = ({
    title,
    addLabel,
    removeLabel,
    customLabelText,
    links,
    onAddLink,
    onRemoveLink,
    onChangeLink,
}) => {
    const { t } = useI18n();
    const options = SOCIAL_PLATFORMS.map((platform) => ({
        value: platform.key,
        label: t(`createLinks.platform.${platform.key}.label`),
    }));

    const placeholderByKey = (key: SocialLinkInput['platform']) => {
        return t(`createLinks.platform.${key}.placeholder`);
    };

    return (
        <Card title={title}>
            <List>
                {links.map((item) => {
                    return (
                        <Row key={item.id}>
                            <Select
                                value={item.platform}
                                options={options}
                                onChange={(event) => onChangeLink(item.id, 'platform', event.target.value)}
                            />
                            {item.platform === 'custom' && (
                                <Input
                                    label={customLabelText}
                                    value={item.customLabel || ''}
                                    onChange={(event) => onChangeLink(item.id, 'customLabel', event.target.value)}
                                    placeholder={t('createLinks.customLabelPlaceholder')}
                                />
                            )}
                            <Input
                                value={item.url}
                                onChange={(event) => onChangeLink(item.id, 'url', event.target.value)}
                                placeholder={placeholderByKey(item.platform) || t('createLinks.socialUrlPlaceholderDefault')}
                            />
                            <Actions>
                                <Button type="button" variant="secondary" onClick={() => onRemoveLink(item.id)}>
                                    {removeLabel}
                                </Button>
                            </Actions>
                        </Row>
                    );
                })}
                <Button type="button" onClick={onAddLink}>
                    {addLabel}
                </Button>
            </List>
        </Card>
    );
};

