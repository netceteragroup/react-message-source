import React from 'react';
import TestRenderer from 'react-test-renderer';
import { useMessageSource } from './useMessageSource';
import { Provider as MessageSourceProvider } from './MessageSourceContext';

describe('useMessageSource', () => {
  const translations = {
    'hello.world': 'Hello World',
    'greeting.normal': 'Hi',
    'greeting.named': 'Hello {name}',
  };

  it('retrieves the correct translated value with named parameters', () => {
    function Nested() {
      const { getMessageWithNamedParams } = useMessageSource();
      return getMessageWithNamedParams('greeting.named', {
        name: 'John Doe',
      });
    }

    const renderer = TestRenderer.create(
      <MessageSourceProvider value={translations}>
        <Nested />
      </MessageSourceProvider>,
    );

    const { root } = renderer;
    const nestedComponentInstance = root.findByType(Nested);

    expect(nestedComponentInstance.children[0]).toBe('Hello John Doe');
  });

  it('retrieves the correct translated value with prefix', () => {
    function Nested() {
      const { getMessage } = useMessageSource('hello');
      return getMessage('world');
    }

    const renderer = TestRenderer.create(
      <MessageSourceProvider value={translations}>
        <Nested />
      </MessageSourceProvider>,
    );

    const { root } = renderer;
    const nestedComponentInstance = root.findByType(Nested);

    expect(nestedComponentInstance.children[0]).toBe('Hello World');
  });

  it('retrieves the correct translated value without prefix', () => {
    function Nested() {
      const { getMessage } = useMessageSource();
      return getMessage('hello.world');
    }

    const renderer = TestRenderer.create(
      <MessageSourceProvider value={translations}>
        <Nested />
      </MessageSourceProvider>,
    );

    const { root } = renderer;
    const nestedComponentInstance = root.findByType(Nested);

    expect(nestedComponentInstance.children[0]).toBe('Hello World');
  });
});
