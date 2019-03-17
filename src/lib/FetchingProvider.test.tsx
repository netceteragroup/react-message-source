import * as React from 'react';
import * as RTL from 'react-testing-library';
import { FetchingProvider } from './FetchingProvider';
import { useMessageSource } from './useMessageSource';

describe('FetchingProvider', () => {
  function Spy() {
    const { getMessage } = useMessageSource();
    return <span>{getMessage('hello.world')}</span>;
  }

  beforeEach(() => {
    // mock impl of fetch() API
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            'hello.world': 'Hello world',
          }),
      }),
    );
  });

  it('fetches text resources and invokes all lifecycles', async () => {
    const transform = jest.fn(x => x);
    const onFetchingStart = jest.fn();
    const onFetchingEnd = jest.fn();

    function TestComponent() {
      return (
        <FetchingProvider
          url="http://any.uri/texts?lang=en"
          transform={transform}
          onFetchingStart={onFetchingStart}
          onFetchingEnd={onFetchingEnd}
        >
          <Spy />
        </FetchingProvider>
      );
    }

    const { getByText } = RTL.render(<TestComponent />);
    const spyNode = await RTL.waitForElement(() => getByText('Hello world'));

    expect(spyNode).toBeDefined();
    expect(spyNode.innerHTML).toBe('Hello world');
    expect(transform).toHaveBeenCalled();
    expect(onFetchingStart).toHaveBeenCalled();
    expect(onFetchingEnd).toHaveBeenCalled();
    // @ts-ignore
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('fetches text resources when url prop changes', async () => {
    const transform = jest.fn(x => x);
    const onFetchingStart = jest.fn();
    const onFetchingEnd = jest.fn();
    function TestComponent(props: { url: string }) {
      return (
        <FetchingProvider
          url={props.url} // eslint-disable-line react/prop-types
          transform={transform}
          onFetchingStart={onFetchingStart}
          onFetchingEnd={onFetchingEnd}
        >
          <Spy />
        </FetchingProvider>
      );
    }

    const { getByText, rerender } = RTL.render(<TestComponent url="http://any.uri/texts?lang=en" />);
    await RTL.waitForElement(() => getByText('Hello world'));

    RTL.act(() => {
      rerender(<TestComponent url="http://any.uri/texts?lang=de" />);
    });

    await RTL.wait(
      () =>
        new Promise(resolve => {
          // simulate network request
          setTimeout(() => resolve(), 300);
        }),
    );

    // @ts-ignore
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(transform).toHaveBeenCalledTimes(2);
    expect(onFetchingStart).toHaveBeenCalledTimes(2);
    expect(onFetchingEnd).toHaveBeenCalledTimes(2);
  });

  it('invokes onFetchingError lifecycle on network failure', async () => {
    const onFetchingError = jest.fn();
    const faultyFetch = jest.fn(() => Promise.reject(new Error('Failure')));
    // @ts-ignore
    global.fetch = faultyFetch;

    RTL.render(<FetchingProvider url="http://any.uri/texts" onFetchingError={onFetchingError} children={null} />);
    await RTL.wait(); // until fetch() rejects

    expect(faultyFetch).toHaveBeenCalledTimes(1);
    expect(onFetchingError).toHaveBeenCalledTimes(1);
  });
});
