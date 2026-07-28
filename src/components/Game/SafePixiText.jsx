import React from 'react';
import { Text as PixiText } from '@pixi/react';

const SafePixiText = React.forwardRef(function SafePixiText(props, ref) {
  const { text, children, ...rest } = props;

  const resolvedText = (() => {
    if (typeof text === 'string' || typeof text === 'number' || typeof text === 'boolean') {
      return String(text ?? '');
    }

    if (typeof children === 'string' || typeof children === 'number' || typeof children === 'boolean') {
      return String(children ?? '');
    }

    return '';
  })();

  return <PixiText {...rest} ref={ref} text={resolvedText} />;
});

export const Text = SafePixiText;
export default SafePixiText;
