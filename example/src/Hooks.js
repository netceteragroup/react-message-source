import React from 'react';
import { useMessageSource } from 'react-message-source';

export default function Hooks() {
  const { getMessage } = useMessageSource();
  return <span>Translation with a hook: {getMessage('hello.world')}</span>;
}
