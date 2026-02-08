import React from 'react';

import { StyledReadOnlyTextarea } from './ReadOnlyTextarea.styles';

export type ReadOnlyTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function ReadOnlyTextarea(props: ReadOnlyTextareaProps) {
  return <StyledReadOnlyTextarea {...props} />;
}


