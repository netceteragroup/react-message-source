import * as React from 'react';
import * as RTL from '@testing-library/react';
import { FetchingProvider } from './FetchingProvider';
import { useMessageSource } from './useMessageSource';

const noop = () => {};

describe('FetchingProvider', () => {
  type SpyProps = {
    onMount?: Function,
  };

  function Spy({ onMount = noop }: SpyProps) {
    const { getMessage } = useMessageSource();

    // Run onMount only once, when component is mounted initially.
    React.useEffect(() => {
      onMount();
    }, []);

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

  it('fetches text resources and inits an empty translation map if result is undefined and transform is noop', async () => {
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(undefined),
      }),
    );

    function TestComponent() {
      return (
        <FetchingProvider url="http://any.uri/texts?lang=en">
          <Spy />
        </FetchingProvider>
      );
    }

    const { getByText } = RTL.render(<TestComponent />);
    const spyNode = await RTL.waitForElement(() => getByText('hello.world'));

    expect(spyNode).toBeDefined();
    expect(spyNode.innerHTML).toBe('hello.world');
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
          url={props.url}
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

    const fetchNewLanguage = async () => {
      RTL.act(() => {
        rerender(<TestComponent url="http://any.uri/texts?lang=de" />);
      });

      return await RTL.waitForElement(() => getByText('Hello world'));
    };

    await fetchNewLanguage();

    // @ts-ignore
    expect(global.fetch).toHaveBeenCalledTimes(2);
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

  it('invokes defaultOnFetchingError lifecycle on network failure when onFetchingResult is noop', async () => {
    const faultyFetch = jest.fn(() => Promise.reject(new Error('Failure')));
    // @ts-ignore
    global.fetch = faultyFetch;

    function TestComponent() {
      return (
        <FetchingProvider url="http://your.website.uri/texts?lang=en">
          <Spy />
        </FetchingProvider>
      );
    }

    const { getByText } = RTL.render(<TestComponent />);
    const spyNode = await RTL.waitForElement(() => getByText('hello.world'));

    expect(spyNode).toBeDefined();
    expect(spyNode.innerHTML).toBe('hello.world');
    // @ts-ignore
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('mounts children only once', async () => {
    let timesChildrenAreMounted = 0;
    const increaseChildrenMountedNumber = () => {
      timesChildrenAreMounted += 1;
    };

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
          <Spy onMount={increaseChildrenMountedNumber} />
        </FetchingProvider>
      );
    }

    const { getByText } = RTL.render(<TestComponent />);
    const spyNode = await RTL.waitForElement(() => getByText('Hello world'));

    expect(spyNode).toBeDefined();
    expect(spyNode.innerHTML).toBe('Hello world');
    // @ts-ignore
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(timesChildrenAreMounted).toBe(1);
  });
});
