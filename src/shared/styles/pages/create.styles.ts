import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const SplitView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

export const EditorColumn = styled.div<{ $showPreview: boolean }>`
  flex: 1;
  width: 100%;
  transition: all 0.3s ease;

  @media (min-width: 1024px) {
    width: ${({ $showPreview }) => $showPreview ? '50%' : '100%'};
    max-width: ${({ $showPreview }) => $showPreview ? '50%' : '800px'};
    margin: ${({ $showPreview }) => $showPreview ? '0' : '0 auto'};
  }
`;

export const PreviewColumn = styled.div`
  flex: 1;
  width: 100%;

  @media (min-width: 1024px) {
    width: 50%;
    position: sticky;
    top: 20px;
  }
`;

export const FormSection = styled.div`
  margin-bottom: 24px;
`;

export const FileInput = styled.input`
  display: none;
`;

export const FileInputLabel = styled.label`
  display: inline-block;
  padding: 12px 24px;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.transitionDuration};
  margin-top: 12px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ResultSection = styled.div`
  margin-top: 32px;
`;

export const LinkDisplay = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  padding: 16px;
  margin: 16px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.primary};
  font-family: monospace;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  cursor: pointer;
`;

export const StyledCheckbox = styled.input`
  appearance: none;
  -webkit-appearance: none;
  margin-right: 12px;
  width: ${({ theme }) => theme.components.checkbox?.width || '20px'};
  height: ${({ theme }) => theme.components.checkbox?.height || '20px'};
  cursor: pointer;
  background-color: transparent;
  border-radius: ${({ theme }) => theme.components.checkbox?.borderRadius || '4px'};
  border: 1px solid ${({ theme }) => theme.components.checkbox?.borderColor || theme.colors.primary};
  display: grid;
  place-content: center;

  &::before {
    content: "";
    width: 12px;
    height: 12px;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em ${({ theme }) => theme.components.checkbox?.checkMarkColor || 'white'};
    transform-origin: center;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  &:checked {
    background-color: ${({ theme }) => theme.components.checkbox?.accentColor || theme.colors.primary};
    border-color: ${({ theme }) => theme.components.checkbox?.accentColor || theme.colors.primary};
  }

  &:checked::before {
    transform: scale(1);
  }

  &:hover {
    border-color: ${({ theme }) => theme.components.checkbox?.hoverBorderColor || theme.colors.primary};
  }
`;

export const CheckboxLabel = styled.label`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  user-select: none;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 24px;
  align-items: center;
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  padding: 12px;
  margin-top: 16px;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: 4px;
`;

export const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.success};
  padding: 12px;
  margin-top: 16px;
  border: 1px solid ${({ theme }) => theme.colors.success};
  border-radius: 4px;
`;

export const PreviewFrame = styled.iframe`
  width: 100%;
  height: 600px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  background: white;
`;

export const PreviewContent = styled.div`
  width: 100%;
  min-height: 400px;
  max-height: 800px;
  overflow: auto;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.cardBackground};
`;

export const MarkdownPreview = styled(PreviewContent)`
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.primary};
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }

  code {
    background-color: ${({ theme }) => theme.colors.background};
    padding: 2px 6px;
    border-radius: 3px;
    font-family: monospace;
  }

  pre {
    background-color: ${({ theme }) => theme.colors.background};
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
  }

  img {
    max-width: 100%;
  }
`;

export const TablePreview = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    text-align: left;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }

  th {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }

  tr:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

export const QrSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const QrOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
`;

export const QrPreview = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border: 2px dashed ${({ theme }) => theme.colors.cardBorder || theme.colors.primary};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.cardBackground};
  min-height: 220px;
`;

export const QrImage = styled.img`
  width: 220px;
  height: 220px;
  object-fit: contain;
`;

export const QrPlaceholder = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

export const ErrorPageContainer = styled.div`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
`;

export const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xlarge};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 16px;
`;

export const ErrorDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
`;

export const ErrorHint = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  margin-bottom: 24px;
`;